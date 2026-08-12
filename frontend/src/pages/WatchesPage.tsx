import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchesApi } from '../api/watches';
import WatchCard from '../components/WatchCard';
import WatchForm from '../components/WatchForm';
import type { Watch } from '../types';
import { Plus, Search, X } from 'lucide-react';

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
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: '#e5e5e5',
    fontSize: 14,
    outline: 'none',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
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
    maxWidth: 720,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#e5e5e5', marginBottom: 24 },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#555' },
};

export default function WatchesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['watches', search],
    queryFn: () => watchesApi.getAll({ search: search || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: (d: Partial<Watch>) => watchesApi.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watches'] });
      setShowForm(false);
    },
  });

  const watches = data?.data ?? [];

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>My Watches ({watches.length})</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>
          <Plus size={16} />
          Add Watch
        </button>
      </div>

      <div style={styles.searchBar}>
        <Search size={16} color="#666" />
        <input
          style={styles.searchInput}
          placeholder="Search by model, reference or serial…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isLoading ? (
        <p style={{ color: '#666' }}>Loading…</p>
      ) : watches.length === 0 ? (
        <div style={styles.empty}>
          <p>No watches found. Add your first timepiece!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {watches.map((w) => (
            <WatchCard key={w.id} watch={w} />
          ))}
        </div>
      )}

      {showForm && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>Add New Watch</h2>
            <WatchForm
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
