import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { Watch } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0f0f0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 16,
    padding: 40,
    width: '100%',
    maxWidth: 420,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, justifyContent: 'center' },
  logoText: { fontSize: 22, fontWeight: 700, color: '#c9a84c', letterSpacing: 1 },
  title: { fontSize: 24, fontWeight: 700, color: '#e5e5e5', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 32, textAlign: 'center' },
  label: { display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 500 },
  input: {
    width: '100%',
    background: '#111',
    border: '1px solid #333',
    borderRadius: 8,
    padding: '12px 14px',
    color: '#e5e5e5',
    fontSize: 14,
    outline: 'none',
    marginBottom: 16,
  },
  btn: {
    width: '100%',
    padding: '13px',
    background: '#c9a84c',
    border: 'none',
    borderRadius: 8,
    color: '#000',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    marginTop: 8,
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#ef4444',
    fontSize: 13,
    marginBottom: 16,
  },
  link: { color: '#c9a84c', textDecoration: 'none' },
  footer: { textAlign: 'center', marginTop: 24, fontSize: 13, color: '#666' },
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      const res = await authApi.register(data);
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.token);
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <Watch size={28} color="#c9a84c" />
          <span style={styles.logoText}>LuxWatch</span>
        </div>

        <h1 style={styles.title}>Create account</h1>
        <p style={styles.subtitle}>Start managing your collection</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            type="text"
            placeholder="John Doe"
            {...register('name', { required: true })}
          />

          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            {...register('email', { required: true })}
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Min. 8 characters"
            {...register('password', { required: true, minLength: 8 })}
          />

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
