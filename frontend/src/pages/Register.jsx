import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', company: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await api.register(form);
      toast.success('ACCOUNT CREATED — please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-sm">
      <div className="auth-card">
        <h1><span>CREATE</span> ACCOUNT</h1>
        <p className="subtitle">// register to request bookings and manage venues</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your name" value={form.name} onChange={set('name')} required />
            </div>
            <div className="input-group">
              <label>Company / Promoter</label>
              <input type="text" placeholder="Optional" value={form.company} onChange={set('company')} />
            </div>
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="you@venue.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-row">
            <div className="input-group">
              <label>Phone</label>
              <input type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
            {loading ? <><span className="spinner" /> CREATING…</> : '★ CREATE ACCOUNT'}
          </button>
        </form>
        <div className="auth-link">Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  );
}
