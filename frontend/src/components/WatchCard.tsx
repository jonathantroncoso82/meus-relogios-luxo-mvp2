import { useNavigate } from 'react-router-dom';
import type { Watch } from '../types';
import { Watch as WatchIcon, DollarSign } from 'lucide-react';

interface Props {
  watch: Watch;
}

const conditionColors: Record<string, string> = {
  mint: '#22c55e',
  excellent: '#84cc16',
  very_good: '#eab308',
  good: '#f97316',
  fair: '#ef4444',
  poor: '#6b7280',
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: 20,
    cursor: 'pointer',
    transition: 'border-color 0.15s, transform 0.15s',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  brand: { fontSize: 12, color: '#c9a84c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 },
  model: { fontSize: 16, fontWeight: 700, color: '#e5e5e5', marginTop: 2 },
  ref: { fontSize: 12, color: '#666', marginTop: 2 },
  badge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 20,
    background: 'rgba(201,168,76,0.15)',
    color: '#c9a84c',
  },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  conditionDot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block', marginRight: 6 },
  conditionText: { fontSize: 12, color: '#888' },
  value: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#c9a84c', fontWeight: 600 },
};

export default function WatchCard({ watch }: Props) {
  const navigate = useNavigate();

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/watches/${watch.id}`)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#c9a84c';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2a2a';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      <div style={styles.header}>
        <div>
          <div style={styles.brand}>{watch.brand?.name ?? '—'}</div>
          <div style={styles.model}>{watch.model}</div>
          {watch.referenceNumber && <div style={styles.ref}>Ref. {watch.referenceNumber}</div>}
        </div>
        <WatchIcon size={20} color="#c9a84c" />
      </div>

      {watch.collection && (
        <span style={styles.badge}>{watch.collection.name}</span>
      )}

      <div style={styles.footer}>
        <div style={styles.conditionText}>
          <span
            style={{
              ...styles.conditionDot,
              background: conditionColors[watch.condition] ?? '#888',
            }}
          />
          {watch.condition.replace('_', ' ')}
        </div>
        {watch.currentValue != null && (
          <div style={styles.value}>
            <DollarSign size={13} />
            {Number(watch.currentValue).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
