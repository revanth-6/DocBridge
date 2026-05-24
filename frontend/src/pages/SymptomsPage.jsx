import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { symptomApi } from '../api/symptomApi';
import { formatDate } from '../utils/formatters';

export default function SymptomsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');

  const fetchData = () => {
    setLoading(true);
    symptomApi.list({ search, page: 1, limit: 20 })
      .then(res => setItems(res.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [search]);

  if (loading) return <LoadingSpinner size="lg" className="min-h-[60vh]" />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Symptoms</h1>
        <Button onClick={() => setShowCreate(true)}>+ Add New</Button>
      </div>

      <div className="relative">
        <input
          type="text" placeholder="Search..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
        />
      </div>

      {items.length === 0 ? (
        <EmptyState icon="📋" title="No symptoms yet" description="Start by adding your first entry." action={<Button onClick={() => setShowCreate(true)}>Add Symptom</Button>} />
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <Card key={item.id} hover>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-400">{item.severity}</div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{item.symptom_name}</p>
                      <p className="text-xs text-slate-500">{item.body_location || 'General'} — Since {formatDate(item.onset_date)}</p>
                    </div>
                  </div>
                </div>
                {item.status && <StatusBadge status={item.status} />}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Symptom">
        <p className="text-slate-400 text-sm">Form coming soon. Use the API directly for now.</p>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => setShowCreate(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}
