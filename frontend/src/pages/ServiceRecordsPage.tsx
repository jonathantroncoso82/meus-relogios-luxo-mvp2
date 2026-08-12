import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceRecordsApi } from '../api/serviceRecords';
import ServiceRecordForm from '../components/ServiceRecordForm';
import type { ServiceRecord } from '../types';
import { Plus, Trash2, Wrench, Calendar } from 'lucide-react';

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
  watchRef: { fontSize: 12, color: '#c9a84c', fontWeight: 600, marginBottom: 4 },
  serviceType: { fontSize: 15, fontWeight: 600, color: '#e5e5e5', marginBottom: 4 },
  meta: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#666' },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 6,
    color: '#ef4444',
  },
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
    maxWidth: 640,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#e5e5e5', marginBottom: 24 },
};

export default function ServiceRecordsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['service-records'],
    queryFn: () => serviceRecordsApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (d: Partial<ServiceRecord>) => serviceRecordsApi.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-records'] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => serviceRecordsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-records'] }),
  });

  const records = data?.data ?? [];

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Service Records ({records.length})</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Record
        </button>
      </div>

      {isLoading ? (
        <p style={{ color: '#666' }}>Loading…</p>
      ) : records.length === 0 ? (
        <p style={{ color: '#555' }}>No service records yet.</p>
      ) : (
        <div style={styles.list}>
          {records.map((r) => (
            <div key={r.id} style={styles.card}>
              <div style={styles.left}>
                <div style={styles.watchRef}>
                  {r.watch?.brand?.name} {r.watch?.model}
                </div>
                <div style={styles.serviceType}>
                  <Wrench size={13} style={{ marginRight: 6, color: '#c9a84c' }} />
                  {r.serviceType}
                </div>
                <div style={styles.meta}>
                  <span style={styles.metaItem}>
                    <Calendar size={12} />
                    {new Date(r.serviceDate).toLocaleDateString()}
                  </span>
                  {r.serviceCenter && <span style={styles.metaItem}>{r.serviceCenter}</span>}
                  {r.cost != null && (
                    <span style={styles.metaItem}>
                      {r.currency ?? 'USD'} {Number(r.cost).toLocaleString()}
                    </span>
                  )}
                  {r.nextServiceDate && (
                    <span style={styles.metaItem}>
                      Next: {new Date(r.nextServiceDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <button
                style={styles.deleteBtn}
                onClick={() => {
                  if (window.confirm('Delete this service record?')) deleteMutation.mutate(r.id);
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>Add Service Record</h2>
            <ServiceRecordForm
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
