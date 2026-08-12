import { useQuery } from '@tanstack/react-query';
import { watchesApi } from '../api/watches';
import { brandsApi } from '../api/brands';
import { collectionsApi } from '../api/collections';
import { serviceRecordsApi } from '../api/serviceRecords';
import { useAuthStore } from '../store/authStore';
import { Watch, Tag, FolderOpen, Wrench, DollarSign, TrendingUp } from 'lucide-react';

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 1200, margin: '0 auto' },
  greeting: { fontSize: 26, fontWeight: 700, color: '#e5e5e5', marginBottom: 4 },
  sub: { fontSize: 14, color: '#666', marginBottom: 32 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 },
  statCard: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: 20,
  },
  statIcon: { marginBottom: 12 },
  statValue: { fontSize: 28, fontWeight: 700, color: '#c9a84c', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#666' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: 600, color: '#e5e5e5', marginBottom: 16 },
  recentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 },
  recentCard: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 10,
    padding: 16,
  },
  recentBrand: { fontSize: 11, color: '#c9a84c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 },
  recentModel: { fontSize: 15, fontWeight: 600, color: '#e5e5e5', marginTop: 2 },
  recentValue: { fontSize: 13, color: '#888', marginTop: 6 },
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: watchesData } = useQuery({ queryKey: ['watches'], queryFn: () => watchesApi.getAll() });
  const { data: brandsData } = useQuery({ queryKey: ['brands'], queryFn: () => brandsApi.getAll() });
  const { data: collectionsData } = useQuery({ queryKey: ['collections'], queryFn: () => collectionsApi.getAll() });
  const { data: serviceData } = useQuery({ queryKey: ['service-records'], queryFn: () => serviceRecordsApi.getAll() });

  const watches = watchesData?.data ?? [];
  const brands = brandsData?.data ?? [];
  const collections = collectionsData?.data ?? [];
  const serviceRecords = serviceData?.data ?? [];

  const totalValue = watches.reduce((sum, w) => sum + (Number(w.currentValue) || 0), 0);
  const forSale = watches.filter((w) => w.isForSale).length;
  const recentWatches = [...watches].slice(0, 6);

  const stats = [
    { label: 'Total Watches', value: watches.length, icon: <Watch size={20} color="#c9a84c" /> },
    { label: 'Brands', value: brands.length, icon: <Tag size={20} color="#c9a84c" /> },
    { label: 'Collections', value: collections.length, icon: <FolderOpen size={20} color="#c9a84c" /> },
    { label: 'Service Records', value: serviceRecords.length, icon: <Wrench size={20} color="#c9a84c" /> },
    { label: 'For Sale', value: forSale, icon: <TrendingUp size={20} color="#c9a84c" /> },
    {
      label: 'Portfolio Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: <DollarSign size={20} color="#c9a84c" />,
    },
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.greeting}>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
      <p style={styles.sub}>Here's an overview of your luxury watch collection.</p>

      {/* Stats */}
      <div style={styles.grid}>
        {stats.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Watches */}
      {recentWatches.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Recent Watches</div>
          <div style={styles.recentGrid}>
            {recentWatches.map((w) => (
              <div key={w.id} style={styles.recentCard}>
                <div style={styles.recentBrand}>{w.brand?.name}</div>
                <div style={styles.recentModel}>{w.model}</div>
                <div style={styles.recentValue}>
                  {w.currentValue
                    ? `$${Number(w.currentValue).toLocaleString()}`
                    : w.condition.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {watches.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#1a1a1a',
            borderRadius: 16,
            border: '1px dashed #2a2a2a',
          }}
        >
          <Watch size={48} color="#333" style={{ marginBottom: 16 }} />
          <p style={{ color: '#555', fontSize: 16 }}>Your collection is empty.</p>
          <p style={{ color: '#444', fontSize: 13, marginTop: 8 }}>
            Go to <strong style={{ color: '#c9a84c' }}>Watches</strong> to add your first timepiece.
          </p>
        </div>
      )}
    </div>
  );
}
