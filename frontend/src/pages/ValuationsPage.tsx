import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { valuationsApi } from '../api/valuations';
import ValuationForm from '../components/ValuationForm';
import type { Valuation } from '../types';
import { Plus, TrendingUp, Calendar, DollarSign } from 'lucide-react';

const styles: Record<string, React.CSSProperties> = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: '#e5e5e5' },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 18px',
    background: '#c9a84c',
    border: 'none',
    borderRadius: 8,
    color: '#000',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 14,
  },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  left: { flex: 1 },
  watchRef: { fontSize: 12, color: '#c9a84c', fontWeight: 600, marginBottom: 6 },
  value: { fontSize: 22, fontWeight: 700, color: '#e5e5e5', marginBottom: 6 },
  meta: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#666' },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 24,
  },
  modalBox: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#e5e5e5', marginBottom: 24 },
  summaryBar: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    display: 'flex',
    gap: 32,
  },
  summaryItem: {},
  summaryLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  summaryValue: { fontSize: 20, fontWeight: 700, color: '#c9a84c' },
};

export default function ValuationsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['valuations'],
    queryFn: () => valuationsApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (d: Partial<Valuation>) => valuationsApi.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['valuations'] });
      queryClient.invalidateQueries({ queryKey: ['watches'] });
      setShowForm(false);
    },
  });

  const valuations = data?.data ?? [];
  const totalValue = valuations.reduce((sum, v) => sum + Number(v.marketValue), 0);
  const latestByWatch = new Map<string, Valuation>();
  valuations.forEach((v) => {
    const existing = latestByWatch.get(v.watchId);
    if (!existing || new Date(v.valuationDate) > new Date(existing.valuationDate)) {
      latestByWatch.set(v.watchId, v);
    }
  });
  const portfolioValue = Array.from(latestByWatch.values()).reduce(
    (sum, v) => sum + Number(v.marketValue),
    0
  );

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Valuations ({valuations.length})</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Valuation
        </button>
      </div>

      {valuations.length > 0 && (
        <div style={styles.summaryBar}>
          <div style={styles.summaryItem}>
            <div style={styles.summaryLabel}>Portfolio Value (latest per watch)</div>
            <div style={styles.summaryValue}>${portfolioValue.toLocaleString()}</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryLabel}>Total Appraisals</div>
            <div style={styles.summaryValue}>{valuations.length}</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryLabel}>Watches Appraised</div>
            <div style={styles.summaryValue}>{latestByWatch.size}</div>
          </div>
        </div>
      )}

      {isLoading ? (
        <p style={{ color: '#666' }}>Loading…</p>
      ) : valuations.length === 0 ? (
        <p style={{ color: '#555' }}>No valuations yet. Add your first appraisal!</p>
      ) : (
        <div style={styles.list}>
          {valuations.map((v) => (
            <div key={v.id} style={styles.card}>
              <div style={styles.left}>
                <div style={styles.watchRef}>
                  <TrendingUp size={12} style={{ marginRight: 4 }} />
                  {v.watch?.brand?.name} {v.watch?.model}
                </div>
                <div style={styles.value}>
                  <DollarSign size={18} style={{ display: 'inline', verticalAlign: 'middle' }} />
                  {Number(v.marketValue).toLocaleString()} {v.currency ?? 'USD'}
                </div>
                <div style={styles.meta}>
                  <span style={styles.metaItem}>
                    <Calendar size={12} />
                    {new Date(v.valuationDate).toLocaleDateString()}
                  </span>
                  {v.appraiser && <span style={styles.metaItem}>{v.appraiser}</span>}
                  {v.source && <span style={styles.metaItem}>Source: {v.source}</span>}
                </div>
                {v.notes && (
                  <p style={{ fontSize: 12, color: '#555', marginTop: 8 }}>{v.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>Add Valuation</h2>
            <ValuationForm
              onSubmit={(d) => createMutation.mutate(d)}
              onCancel={() => setShowForm(false)}
              loading={createMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}
