import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsApi } from '../api/collections';
import CollectionForm from '../components/CollectionForm';
import type { Collection } from '../types';
import { Plus, Edit2, Trash2, FolderOpen, Globe } from 'lucide-react';

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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  card: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: 20,
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  name: { fontSize: 16, fontWeight: 700, color: '#e5e5e5' },
  badge: {
    fontSize: 11,
    padding: '3px 8px',
    borderRadius: 20,
    background: 'rgba(201,168,76,0.1)',
    color: '#c9a84c',
    fontWeight: 600,
  },
  desc: { fontSize: 13, color: '#666', marginBottom: 14, lineHeight: 1.5 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  watchCount: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888' },
  cardActions: { display: 'flex', gap: 8 },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4 },
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
    maxWidth: 480,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#e5e5e5', marginBottom: 24 },
};

export default function CollectionsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: () => collectionsApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (d: Partial<Collection>) => collectionsApi.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (d: Partial<Collection>) => collectionsApi.update(editing!.id, d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => collectionsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['collections'] }),
  });

  const collections = data?.data ?? [];

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Collections</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>
          <Plus size={16} /> New Collection
        </button>
      </div>

      {isLoading ? (
        <p style={{ color: '#666' }}>Loading…</p>
      ) : collections.length === 0 ? (
        <p style={{ color: '#555' }}>No collections yet. Create your first one!</p>
      ) : (
        <div style={styles.grid}>
          {collections.map((c) => (
            <div key={c.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.name}>{c.name}</div>
                {c.isPublic && (
                  <span style={styles.badge}>
                    <Globe size={10} style={{ marginRight: 3 }} />
                    Public
                  </span>
                )}
              </div>

              {c.description && <p style={styles.desc}>{c.description}</p>}

              <div style={styles.cardFooter}>
                <div style={styles.watchCount}>
                  <FolderOpen size={14} color="#c9a84c" />
                  {c._count?.watches ?? 0} watches
                </div>
                <div style={styles.cardActions}>
                  <button style={styles.iconBtn} onClick={() => setEditing(c)}>
                    <Edit2 size={14} color="#888" />
                  </button>
                  <button
                    style={styles.iconBtn}
                    onClick={() => {
                      if (window.confirm(`Delete collection "${c.name}"?`)) deleteMutation.mutate(c.id);
                    }}
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
            <h2 style={styles.modalTitle}>{editing ? 'Edit Collection' : 'New Collection'}</h2>
            <CollectionForm
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
