import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchesApi } from '../api/watches';
import { serviceRecordsApi } from '../api/serviceRecords';
import { valuationsApi } from '../api/valuations';
import WatchForm from '../components/WatchForm';
import ServiceRecordForm from '../components/ServiceRecordForm';
import ValuationForm from '../components/ValuationForm';
import type { Watch, ServiceRecord, Valuation } from '../types';
import { ArrowLeft, Edit2, Trash2, Plus, Wrench, TrendingUp } from 'lucide-react';

const styles: Record<string, React.CSSProperties> = {
  back: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: 14,
    marginBottom: 24,
    padding: 0,
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  brand: { fontSize: 13, color: '#c9a84c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 },
  model: { fontSize: 28, fontWeight: 700, color: '#e5e5e5', marginTop: 4 },
  ref: { fontSize: 14, color: '#666', marginTop: 4 },
  actions: { display: 'flex', gap: 10 },
  editBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '9px 16px',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: 8,
    color: '#e5e5e5',
    cursor: 'pointer',
    fontSize: 13,
  },
  deleteBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '9px 16px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8,
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: 13,
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 },
  section: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: 24,
  },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 600, color: '#e5e5e5' },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    background: 'rgba(201,168,76,0.1)',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: 6,
    color: '#c9a84c',
    cursor: 'pointer',
    fontSize: 12,
  },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 11, color: '#555', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldValue: { fontSize: 14, color: '#e5e5e5' },
  recordCard: {
    background: '#111',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    border: '1px solid #222',
  },
  recordDate: { fontSize: 12, color: '#c9a84c', marginBottom: 4 },
  recordType: { fontSize: 14, fontWeight: 600, color: '#e5e5e5' },
  recordSub: { fontSize: 12, color: '#666', marginTop: 2 },
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
    maxWidth: 680,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#e5e5e5', marginBottom: 24 },
};

type ModalType = 'edit' | 'service' | 'valuation' | null;

export default function WatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<ModalType>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['watch', id],
    queryFn: () => watchesApi.getById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (d: Partial<Watch>) => watchesApi.update(id!, d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watch', id] });
      queryClient.invalidateQueries({ queryKey: ['watches'] });
      setModal(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => watchesApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watches'] });
      navigate('/watches');
    },
  });

  const addServiceMutation = useMutation({
    mutationFn: (d: Partial<ServiceRecord>) => serviceRecordsApi.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watch', id] });
      setModal(null);
    },
  });

  const addValuationMutation = useMutation({
    mutationFn: (d: Partial<Valuation>) => valuationsApi.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watch', id] });
      setModal(null);
    },
  });

  if (isLoading) return <p style={{ color: '#666' }}>Loading…</p>;
  const watch = data?.data;
  if (!watch) return <p style={{ color: '#ef4444' }}>Watch not found.</p>;

  const field = (label: string, value: unknown) =>
    value != null && value !== '' ? (
      <div style={styles.field}>
        <div style={styles.fieldLabel}>{label}</div>
        <div style={styles.fieldValue}>{String(value)}</div>
      </div>
    ) : null;

  return (
    <div>
      <button style={styles.back} onClick={() => navigate('/watches')}>
        <ArrowLeft size={16} /> Back to Watches
      </button>

      <div style={styles.header}>
        <div>
          <div style={styles.brand}>{watch.brand?.name}</div>
          <div style={styles.model}>{watch.model}</div>
          {watch.referenceNumber && <div style={styles.ref}>Ref. {watch.referenceNumber}</div>}
        </div>
        <div style={styles.actions}>
          <button style={styles.editBtn} onClick={() => setModal('edit')}>
            <Edit2 size={14} /> Edit
          </button>
          <button
            style={styles.deleteBtn}
            onClick={() => {
              if (window.confirm('Delete this watch?')) deleteMutation.mutate();
            }}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Watch Details</div>
          <div style={{ marginTop: 16 }}>
            {field('Serial Number', watch.serialNumber)}
            {field('Year Manufactured', watch.yearManufactured)}
            {field('Dial Color', watch.dialColor)}
            {field('Case Material', watch.caseMaterial)}
            {field('Case Diameter', watch.caseDiameterMm ? `${watch.caseDiameterMm} mm` : null)}
            {field('Bracelet Material', watch.braceletMaterial)}
            {field('Water Resistance', watch.waterResistanceM ? `${watch.waterResistanceM} m` : null)}
            {field('Gender', watch.gender)}
            {field('Condition', watch.condition.replace('_', ' '))}
            {field('Collection', watch.collection?.name)}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Acquisition & Value</div>
          <div style={{ marginTop: 16 }}>
            {field('Acquisition Type', watch.acquisitionType)}
            {field('Acquisition Date', watch.acquisitionDate ? new Date(watch.acquisitionDate).toLocaleDateString() : null)}
            {field('Acquisition Price', watch.acquisitionPrice ? `${watch.acquisitionCurrency ?? 'USD'} ${Number(watch.acquisitionPrice).toLocaleString()}` : null)}
            {field('Current Value', watch.currentValue ? `${watch.acquisitionCurrency ?? 'USD'} ${Number(watch.currentValue).toLocaleString()}` : null)}
            {field('For Sale', watch.isForSale ? 'Yes' : 'No')}
            {watch.isForSale && field('Asking Price', watch.askingPrice ? `${watch.acquisitionCurrency ?? 'USD'} ${Number(watch.askingPrice).toLocaleString()}` : null)}
            {field('Notes', watch.notes)}
          </div>
        </div>
      </div>

      <div style={{ ...styles.section, marginBottom: 24 }}>
        <div style={styles.sectionHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Wrench size={16} color="#c9a84c" />
            <span style={styles.sectionTitle}>Service Records</span>
          </div>
          <button style={styles.addBtn} onClick={() => setModal('service')}>
            <Plus size={12} /> Add Record
          </button>
        </div>
        {(watch.serviceRecords ?? []).length === 0 ? (
          <p style={{ color: '#555', fontSize: 13 }}>No service records yet.</p>
        ) : (
          watch.serviceRecords!.map((sr) => (
            <div key={sr.id} style={styles.recordCard}>
              <div style={styles.recordDate}>{new Date(sr.serviceDate).toLocaleDateString()}</div>
              <div style={styles.recordType}>{sr.serviceType}</div>
              {sr.serviceCenter && <div style={styles.recordSub}>{sr.serviceCenter}</div>}
              {sr.cost != null && (
                <div style={styles.recordSub}>
                  Cost: {sr.currency ?? 'USD'} {Number(sr.cost).toLocaleString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={16} color="#c9a84c" />
            <span style={styles.sectionTitle}>Valuations</span>
          </div>
          <button style={styles.addBtn} onClick={() => setModal('valuation')}>
            <Plus size={12} /> Add Valuation
          </button>
        </div>
        {(watch.valuations ?? []).length === 0 ? (
          <p style={{ color: '#555', fontSize: 13 }}>No valuations yet.</p>
        ) : (
          watch.valuations!.map((v) => (
            <div key={v.id} style={styles.recordCard}>
              <div style={styles.recordDate}>{new Date(v.valuationDate).toLocaleDateString()}</div>
              <div style={styles.recordType}>
                {v.currency ?? 'USD'} {Number(v.marketValue).toLocaleString()}
              </div>
              {v.appraiser && <div style={styles.recordSub}>{v.appraiser}</div>}
              {v.source && <div style={styles.recordSub}>Source: {v.source}</div>}
            </div>
          ))
        )}
      </div>

      {modal === 'edit' && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>Edit Watch</h2>
            <WatchForm
              defaultValues={watch}
              onSubmit={(d) => updateMutation.mutate(d)}
              onCancel={() => setModal(null)}
              loading={updateMutation.isPending}
            />
          </div>
        </div>
      )}

      {modal === 'service' && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>Add Service Record</h2>
            <ServiceRecordForm
              watchId={id}
              onSubmit={(d) => addServiceMutation.mutate(d)}
              onCancel={() => setModal(null)}
              loading={addServiceMutation.isPending}
            />
          </div>
        </div>
      )}

      {modal === 'valuation' && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div style={styles.modalBox}>
            <h2 style={styles.modalTitle}>Add Valuation</h2>
            <ValuationForm
              watchId={id}
              onSubmit={(d) => addValuationMutation.mutate(d)}
              onCancel={() => setModal(null)}
              loading={addValuationMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}
