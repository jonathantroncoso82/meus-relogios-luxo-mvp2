import { useForm } from 'react-hook-form';
import type { Brand } from '../types';

interface Props {
  defaultValues?: Partial<Brand>;
  onSubmit: (data: Partial<Brand>) => void;
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

export default function BrandForm({ defaultValues, onSubmit, onCancel, loading }: Props) {
  const { register, handleSubmit } = useForm<Partial<Brand>>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Brand Name *</label>
        <input style={inputStyle} {...register('name', { required: true })} placeholder="e.g. Rolex" />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Country</label>
        <input style={inputStyle} {...register('country')} placeholder="e.g. Switzerland" />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Founded Year</label>
        <input style={inputStyle} type="number" {...register('foundedYear', { valueAsNumber: true })} placeholder="e.g. 1905" />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Website</label>
        <input style={inputStyle} {...register('website')} placeholder="https://..." />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Logo URL</label>
        <input style={inputStyle} {...register('logoUrl')} placeholder="https://..." />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Description</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
          {...register('description')}
          placeholder="Brand description..."
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
          {loading ? 'Saving…' : 'Save Brand'}
        </button>
      </div>
    </form>
  );
}
