import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { brandsApi } from '../api/brands';
import { collectionsApi } from '../api/collections';
import type { Watch } from '../types';

interface Props {
  defaultValues?: Partial<Watch>;
  onSubmit: (data: Partial<Watch>) => void;
  onCancel: () => void;
  loading?: boolean;
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

export default function WatchForm({ defaultValues, onSubmit, onCancel, loading }: Props) {
  const { register, handleSubmit } = useForm<Partial<Watch>>({ defaultValues });

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsApi.getAll(),
  });

  const { data: collectionsData } = useQuery({
    queryKey: ['collections'],
    queryFn: () => collectionsApi.getAll(),
  });

  const brands = brandsData?.data ?? [];
  const collections = collectionsData?.data ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={gridStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Brand *</label>
          <select style={inputStyle} {...register('brandId', { required: true })}>
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Model *</label>
          <input style={inputStyle} {...register('model', { required: true })} placeholder="e.g. Submariner" />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Reference Number</label>
          <input style={inputStyle} {...register('referenceNumber')} placeholder="e.g. 126610LN" />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Serial Number</label>
          <input style={inputStyle} {...register('serialNumber')} placeholder="e.g. 2024XXXXX" />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Year Manufactured</label>
          <input style={inputStyle} type="number" {...register('yearManufactured', { valueAsNumber: true })} placeholder="e.g. 2022" />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Collection</label>
          <select style={inputStyle} {...register('collectionId')}>
            <option value="">No collection</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Condition</label>
          <select style={inputStyle} {...register('condition')}>
            {['mint', 'excellent', 'very_good', 'good', 'fair', 'poor'].map((c) => (
              <option key={c} value={c}>{c.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Gender</label>
          <select style={inputStyle} {...register('gender')}>
            <option value="unisex">Unisex</option>
            <option value="mens">Men's</option>
            <option value="womens">Women's</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Dial Color</label>
          <input style={inputStyle} {...register('dialColor')} placeholder="e.g. Black" />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Case Material</label>
          <input style={inputStyle} {...register('caseMaterial')} placeholder="e.g. Stainless Steel" />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Case Diameter (mm)</label>
          <input style={inputStyle} type="number" step="0.1" {...register('caseDiameterMm', { valueAsNumber: true })} placeholder="e.g. 41" />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Bracelet Material</label>
          <input style={inputStyle} {...register('braceletMaterial')} placeholder="e.g. Oyster" />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Acquisition Type</label>
          <select style={inputStyle} {...register('acquisitionType')}>
            {['purchased', 'gifted', 'inherited', 'traded', 'other'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Acquisition Date</label>
          <input style={inputStyle} type="date" {...register('acquisitionDate')} />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Acquisition Price</label>
          <input style={inputStyle} type="number" step="0.01" {...register('acquisitionPrice', { valueAsNumber: true })} placeholder="e.g. 12000" />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Current Value</label>
          <input style={inputStyle} type="number" step="0.01" {...register('currentValue', { valueAsNumber: true })} placeholder="e.g. 15000" />
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

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
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
          {loading ? 'Saving…' : 'Save Watch'}
        </button>
      </div>
    </form>
  );
}
