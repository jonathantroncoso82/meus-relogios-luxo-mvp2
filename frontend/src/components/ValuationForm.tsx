import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { watchesApi } from '../api/watches';
import type { Valuation } from '../types';

interface Props {
  defaultValues?: Partial<Valuation>;
  onSubmit: (data: Partial<Valuation>) => void;
  onCancel: () => void;
  loading?: boolean;
  watchId?: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#111',
  border: '1px solid #333',
  borderRadius: 8,
  padding: '10px 12px',
  color: '#e5e5e5',
  fontSize: 14,
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#888',
  marginBottom: 6,
  fontWeight: 500,
};

const fieldStyle: React.CSSProperties = { marginBottom: 16 };

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

export default function ValuationForm({ defaultValues, onSubmit, onCancel, loading, watchId }: Props) {
  const { register, handleSubmit } = useForm<Partial<Valuation>>({
    defaultValues: { ...defaultValues, watchId: watchId ?? defaultValues?.watchId },
  });

  const { data: watchesData } = useQuery({
    queryKey: ['watches'],
    queryFn: () => watchesApi.getAll(),
    enabled: !watchId,
  });

  const watches = watchesData?.data ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!watchId && (
        <div style={fieldStyle}>
          <label style={labelStyle}>Watch *</label>
          <select style={inputStyle} {...register('watchId', { required: true })}>
            <option value="">Select watch</option>
            {watches.map((w) => (
              <option key={w.id} value={w.id}>
                {w.brand?.name} {w.model} {w.referenceNumber ? `(${w.referenceNumber})` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={gridStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Valuation Date *</label>
          <input style={inputStyle} type="date" {...register('valuationDate', { required: true })} />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Market Value *</label>
          <input
            style={inputStyle}
            type="number"
            step="0.01"
            {...register('marketValue', { required: true, valueAsNumber: true })}
            placeholder="e.g. 15000"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Currency</label>
          <input style={inputStyle} {...register('currency')} placeholder="USD" defaultValue="USD" />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Appraiser</label>
          <input style={inputStyle} {...register('appraiser')} placeholder="Appraiser name or company" />
        </div>

        <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Source</label>
          <input style={inputStyle} {...register('source')} placeholder="e.g. Chrono24, Christie's, Independent Appraisal" />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Notes</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
          {...register('notes')}
          placeholder="Additional notes..."
        />
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            background: 'none',
            border: '1px solid #333',
            borderRadius: 8,
            color: '#888',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 24px',
            background: '#c9a84c',
            border: 'none',
            borderRadius: 8,
            color: '#000',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 14,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Saving…' : 'Save Valuation'}
        </button>
      </div>
    </form>
  );
}
