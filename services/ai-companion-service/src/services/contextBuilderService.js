const NodeCache = require('node-cache');
const { sequelize } = require('../config/database');
const logger = require('../config/logger');

const cache = new NodeCache({ stdTTL: 60, checkperiod: 30 });

async function buildUserContext(userId) {
  const cacheKey = `context_${userId}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug(`Using cached health context for user ${userId}`);
    return cached;
  }

  logger.debug(`Building fresh health context for user ${userId}`);

  try {
    const [consultations] = await sequelize.query(
      `SELECT doctor_name, doctor_specialty, consultation_date, diagnosis, diagnosis_simplified, status
       FROM consultations WHERE user_id = :userId ORDER BY consultation_date DESC LIMIT 5`,
      { replacements: { userId }, type: sequelize.QueryTypes.SELECT ? undefined : undefined, raw: true }
    );

    const [medications] = await sequelize.query(
      `SELECT medicine_name, generic_name, dosage, frequency, purpose, purpose_simplified, is_active, side_effect_warnings
       FROM prescriptions WHERE user_id = :userId AND is_active = true ORDER BY start_date DESC`,
      { replacements: { userId }, raw: true }
    );

    const [symptoms] = await sequelize.query(
      `SELECT symptom_name, severity, onset_date, is_ongoing, body_location, triggers
       FROM symptoms WHERE user_id = :userId AND is_ongoing = true ORDER BY onset_date DESC LIMIT 10`,
      { replacements: { userId }, raw: true }
    );

    const [labReports] = await sequelize.query(
      `SELECT report_name, report_type, report_date, flagged_values, overall_interpretation_simplified
       FROM lab_reports WHERE user_id = :userId ORDER BY report_date DESC LIMIT 3`,
      { replacements: { userId }, raw: true }
    );

    const [userInfo] = await sequelize.query(
      `SELECT first_name, last_name, date_of_birth, gender, blood_group, known_allergies, chronic_conditions
       FROM users WHERE id = :userId`,
      { replacements: { userId }, raw: true }
    );

    const context = {
      user: Array.isArray(userInfo) ? userInfo[0] : userInfo,
      recentConsultations: Array.isArray(consultations) ? consultations : [],
      activeMedications: Array.isArray(medications) ? medications : [],
      ongoingSymptoms: Array.isArray(symptoms) ? symptoms : [],
      recentLabReports: Array.isArray(labReports) ? labReports : [],
    };

    cache.set(cacheKey, context);
    return context;
  } catch (error) {
    logger.error('Error building user context:', { message: error.message });
    return { user: {}, recentConsultations: [], activeMedications: [], ongoingSymptoms: [], recentLabReports: [] };
  }
}

function invalidateCache(userId) {
  cache.del(`context_${userId}`);
}

module.exports = { buildUserContext, invalidateCache };
