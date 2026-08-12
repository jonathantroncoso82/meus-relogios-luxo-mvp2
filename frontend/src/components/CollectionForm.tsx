import { useForm } from 'react-hook-form';
import type { Collection } from '../types';

interface Props {
  defaultValues?: Partial<Collection>;
  onSubmit: (data: Partial<Collection>) => void;
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

export default function CollectionForm({ defaultValues, onSubmit, onCancel, loading }: Props) {
  const { register, handleSubmit } = useForm<Partial<Collection>>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Collection Name *</label>
        <input style={inputStyle} {...register('name', { required: true })} placeholder="e.g. Sports Watches" />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Description</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
          {...register('description')}
          placeholder="Collection description..."
        />
      </div>

      <div style={{ ...fieldStyle, display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="checkbox" id="isPublic" {...register('isPublic')} />
        <label htmlFor="isPublic" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>
          Make this collection public
        </label>
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
          {loading ? 'Saving…' : 'Save Collection'}
        </button>
      </div>
    </form>
  );
}
