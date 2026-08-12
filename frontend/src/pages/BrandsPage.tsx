import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandsApi } from '../api/brands';
import BrandForm from '../components/BrandForm';
import type { Brand } from '../types';
import { Plus, Edit2, Trash2, Globe, Tag } from 'lucide-react';

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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
  card: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: 20,
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  brandName: { fontSize: 16, fontWeight: 700, color: '#e5e5e5' },
  country: { fontSize: 12, color: '#888', marginTop: 2 },
  watchCount: {
    fontSize: 12,
    color: '#c9a84c',
    background: 'rgba(201,168,76,0.1)',
    padding: '3px 8px',
    borderRadius: 20,
    fontWeight: 600,
  },
  desc: { fontSize: 13, color: '#666', marginBottom: 14, lineHeight: 1.5 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  link: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#555', textDecoration: 'none' },
  cardActions: { display: 'flex', gap: 8 },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#555',
    padding: 4,
    borderRadius: 4,
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
    maxWidth: 520,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#e5e5e5', marginBottom: 24 },
};

export default function BrandsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (d: Partial<Brand>) => brandsApi.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (d: Partial<Brand>) => brandsApi.update(editing!.id, d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => brandsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brands'] }),
  });

  const brands = data?.data ?? [];

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Brands</h1>
        </div>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Brand
        </button>
      </div>

      {isLoading ? (
        <p style={{ color: '#666' }}>Loading…</p>
      ) : (
        <div style={styles.grid}>
          {brands.map((b) => (
            <div key={b.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.brandName}>{b.name}</div>
                  <div style={styles.country}>
                    {b.country}{b.foundedYear ? ` · Est. ${b.foundedYear}` : ''}
                  </div>
                </div>
                <span style={styles.watchCount}>
                  <Tag size={10} style={{ marginRight: 3 }} />
                  {b._count?.watches ?? 0} watches
                </span>
              </div>

              {b.description && (
                <p style={styles.desc}>
                  {b.description.length > 100 ? b.description.slice(0, 100) + '…' : b.description}
                </p>
              )}

              <div style={styles.cardFooter}>
                {b.website ? (
                  <a href={b.website} target="_blank" rel="noreferrer" style={styles.link}>
                    <Globe size={12} /> Website
                  </a>
                ) : <span />}
                <div style={styles.cardActions}>
                  <button style={styles.iconBtn} onClick={() => setEditing(b)} title="Edit">
                    <Edit2 size={14} color="#888" />
                  </button>
                  <button
                    style={styles.iconBtn}
                    onClick={() => {
                      if (window.confirm(`Delete brand "${b.name}"?`)) deleteMutation.mutate(b.id);
                    }}
                    title="Delete"
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editing) && (
        <div
          style={styles.modal}
          onClick={(e) => {
            if (e.target === e.currentTarget) { setShowForm(false); setEditing(null); }
          }}
        >
          <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>{editing ? 'Edit Brand' : 'Add Brand'}</h2>
            <BrandForm
              defaultValues={editing ?? undefined}
              onSubmit={(d) => editing ? updateMutation.mutate(d) : createMutation.mutate(d)}
              onCancel={() => { setShowForm(false); setEditing(null); }}
              loading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}
