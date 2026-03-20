import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.login(form);
      login(data);
      toast.success(`WELCOME BACK, ${data.name.split(' ')[0].toUpperCase()}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-sm">
      <div className="auth-card">
        <h1><span>CLIENT</span> PORTAL</h1>
        <p className="subtitle">// sign in to manage your bookings and venues</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="you@venue.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
            {loading ? <><span className="spinner" /> CONNECTING…</> : '⚡ ENTER PORTAL'}
          </button>
        </form>
        <div className="auth-link">Don't have an account? <Link to="/register">Register here</Link></div>
      </div>
    </div>
  );
}
