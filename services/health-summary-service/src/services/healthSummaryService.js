const { sequelize } = require('../config/database');
const logger = require('../config/logger');

class HealthSummaryService {
  async getDashboard(userId) {
    try {
      const [[userRow]] = await sequelize.query(
        `SELECT first_name, last_name, blood_group, known_allergies, chronic_conditions, height_cm, weight_kg
         FROM users WHERE id = :userId`,
        { replacements: { userId } }
      );

      const [[consultationStats]] = await sequelize.query(
        `SELECT COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'completed') as completed,
                COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled
         FROM consultations WHERE user_id = :userId`,
        { replacements: { userId } }
      );

      const [activeMeds] = await sequelize.query(
        `SELECT id, medicine_name, dosage, frequency, start_date, end_date, prescribing_doctor
         FROM prescriptions WHERE user_id = :userId AND is_active = true ORDER BY start_date DESC`,
        { replacements: { userId } }
      );

      const [ongoingSymptoms] = await sequelize.query(
        `SELECT id, symptom_name, severity, onset_date, body_location
         FROM symptoms WHERE user_id = :userId AND is_ongoing = true ORDER BY severity DESC`,
        { replacements: { userId } }
      );

      const [upcomingFollowups] = await sequelize.query(
        `SELECT id, title, reminder_date, reminder_type
         FROM followup_reminders WHERE user_id = :userId AND is_active = true AND is_completed = false AND reminder_date >= CURRENT_DATE
         ORDER BY reminder_date ASC LIMIT 5`,
        { replacements: { userId } }
      );

      const [recentLabReports] = await sequelize.query(
        `SELECT id, report_name, report_type, report_date, status, flagged_values
         FROM lab_reports WHERE user_id = :userId ORDER BY report_date DESC LIMIT 3`,
        { replacements: { userId } }
      );

      const [[medReminderCount]] = await sequelize.query(
        `SELECT COUNT(*) as active_reminders FROM medicine_reminders WHERE user_id = :userId AND is_active = true`,
        { replacements: { userId } }
      );

      // Health score calculation (simple heuristic)
      let healthScore = 80;
      if (ongoingSymptoms.length > 3) healthScore -= 10;
      if (ongoingSymptoms.some(s => s.severity >= 7)) healthScore -= 10;
      const flaggedReports = recentLabReports.filter(r => {
        const flagged = r.flagged_values;
        return Array.isArray(flagged) ? flagged.length > 0 : (flagged && flagged !== '[]');
      });
      if (flaggedReports.length > 0) healthScore -= 5;
      if (activeMeds.length === 0 && ongoingSymptoms.length === 0) healthScore = Math.min(healthScore + 5, 100);
      healthScore = Math.max(healthScore, 20);

      return {
        user: userRow || {},
        healthScore,
        consultations: consultationStats || { total: 0, completed: 0, scheduled: 0 },
        activeMedications: activeMeds,
        activeMedicationCount: activeMeds.length,
        ongoingSymptoms,
        ongoingSymptomCount: ongoingSymptoms.length,
        upcomingFollowups,
        recentLabReports,
        activeReminderCount: parseInt(medReminderCount?.active_reminders || 0, 10),
      };
    } catch (error) {
      logger.error('Dashboard aggregation error:', { message: error.message });
      throw error;
    }
  }

  async getTimeline(userId, query = {}) {
    const { page = 1, limit = 20 } = query;
    const offset = (page - 1) * limit;

    try {
      const [events] = await sequelize.query(`
        SELECT * FROM (
          SELECT id, 'consultation' as type, consultation_date as event_date, doctor_name as title,
                 COALESCE(diagnosis_simplified, diagnosis, chief_complaint) as description,
                 status, created_at
          FROM consultations WHERE user_id = :userId

          UNION ALL

          SELECT id, 'prescription' as type, start_date as event_date, medicine_name as title,
                 COALESCE(purpose_simplified, purpose) as description,
                 CASE WHEN is_active THEN 'active' ELSE 'completed' END as status, created_at
          FROM prescriptions WHERE user_id = :userId

          UNION ALL

          SELECT id, 'lab_report' as type, report_date as event_date, report_name as title,
                 COALESCE(overall_interpretation_simplified, overall_interpretation) as description,
                 status, created_at
          FROM lab_reports WHERE user_id = :userId

          UNION ALL

          SELECT id, 'symptom' as type, onset_date as event_date, symptom_name as title,
                 notes as description,
                 CASE WHEN is_ongoing THEN 'ongoing' ELSE 'resolved' END as status, created_at
          FROM symptoms WHERE user_id = :userId
        ) timeline
        ORDER BY event_date DESC, created_at DESC
        LIMIT :limit OFFSET :offset
      `, { replacements: { userId, limit: parseInt(limit, 10), offset } });

      const [[countResult]] = await sequelize.query(`
        SELECT (
          (SELECT COUNT(*) FROM consultations WHERE user_id = :userId) +
          (SELECT COUNT(*) FROM prescriptions WHERE user_id = :userId) +
          (SELECT COUNT(*) FROM lab_reports WHERE user_id = :userId) +
          (SELECT COUNT(*) FROM symptoms WHERE user_id = :userId)
        ) as total
      `, { replacements: { userId } });

      return {
        events: events || [],
        total: parseInt(countResult?.total || 0, 10),
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
    } catch (error) {
      logger.error('Timeline aggregation error:', { message: error.message });
      throw error;
    }
  }
}

module.exports = new HealthSummaryService();
