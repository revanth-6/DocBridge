import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { reminderApi } from '../api/reminderApi';
import { formatDate, formatRelativeDate } from '../utils/formatters';

export default function RemindersPage() {
  const [upcoming, setUpcoming] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reminderApi.getUpcoming()
      .then(res => setUpcoming(res.data?.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="lg" className="min-h-[60vh]" />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Reminders</h1>
        <Button>+ Add Reminder</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-white mb-4">💊 Medicine Reminders</h3>
          {(upcoming?.medicineReminders || []).length === 0 ? (
            <p className="text-sm text-slate-500">No active medicine reminders</p>
          ) : (
            <div className="space-y-3">
              {(upcoming?.medicineReminders || []).map((r, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-sm font-medium text-slate-200">{r.medicine_name} {r.dosage}</p>
                  <p className="text-xs text-slate-500">Times: {(r.reminder_times || []).join(', ')}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold text-white mb-4">📅 Follow-up Reminders</h3>
          {(upcoming?.followupReminders || []).length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming follow-ups</p>
          ) : (
            <div className="space-y-3">
              {(upcoming?.followupReminders || []).map((r, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-sm font-medium text-slate-200">{r.title}</p>
                  <p className="text-xs text-teal-400">{formatRelativeDate(r.reminder_date)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
