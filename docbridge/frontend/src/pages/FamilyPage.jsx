import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import { familyApi } from '../api/familyApi';
import { getInitials } from '../utils/formatters';

export default function FamilyPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    familyApi.list()
      .then(res => setMembers(res.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="lg" className="min-h-[60vh]" />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Family Members</h1>
        <Button>+ Add Member</Button>
      </div>
      {members.length === 0 ? (
        <EmptyState icon="👨‍👩‍👧‍👦" title="No family members yet" description="Add family members to track their health too." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(m => (
            <Card key={m.id} hover>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                  {getInitials(m.first_name, m.last_name)}
                </div>
                <div>
                  <p className="font-medium text-slate-200">{m.first_name} {m.last_name}</p>
                  <Badge variant="teal">{m.relationship}</Badge>
                </div>
              </div>
              {m.chronic_conditions && m.chronic_conditions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {m.chronic_conditions.map((c, i) => <Badge key={i} variant="warning">{c}</Badge>)}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
