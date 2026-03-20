import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const ADMIN_SESSION_KEY = 'patrick_admin_session';

function VenueIcon({ venue }) {
  if (venue && venue.photoPath) return (
    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)' }}>
      <img src={venue.photoPath} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
  const icons = { Club: '🏛️', Bar: '🍺', Festival: '🎪', Lounge: '🛋️', Rooftop: '🌆', Warehouse: '🏚️', Corporate: '🏢', Hotel: '🏨' };
  const icon = icons[(venue?.venueType)] || '📍';
  return (
    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--dark3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0, border: '1px solid rgba(255,255,255,0.06)' }}>
      {icon}
    </div>
  );
}

function ClientCard({ client, onSelect, isSelected }) {
  return (
    <div onClick={() => onSelect(client)} style={{ background: isSelected ? 'rgba(0,245,255,0.05)' : 'var(--dark3)', border: isSelected ? '1px solid var(--cyan)' : '1px solid var(--card-border)', borderRadius: 'var(--radius)', padding: '14px', marginBottom: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', letterSpacing: '0.04em', color: 'var(--white)', marginBottom: '3px' }}>{client.name}</div>
          {client.company && <div style={{ fontSize: '0.78rem', color: 'var(--cyan)', marginBottom: '2px' }}>{client.company}</div>}
          <div style={{ fontSize: '0.75rem', color: 'var(--grey)' }}>{client.email}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--cyan)', fontWeight: 700 }}>{client.venues.length} venue{client.venues.length !== 1 ? 's' : ''}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--grey)' }}>{client.totalBookings} booking{client.totalBookings !== 1 ? 's' : ''}</div>
        </div>
      </div>
      {client.venues.length > 0 && (
        <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {client.venues.slice(0, 3).map(v => (
            <span key={v.id} style={{ fontSize: '0.7rem', padding: '2px 7px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px', color: 'var(--grey-light)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em' }}>
              {v.name}
            </span>
          ))}
          {client.venues.length > 3 && <span style={{ fontSize: '0.7rem', color: 'var(--grey)' }}>+{client.venues.length - 3}</span>}
        </div>
      )}
    </div>
  );
}

function ClientDetailPanel({ client, bookings }) {
  const clientBookings = bookings.filter(b => b.clientId === client.id).sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
  const now = new Date();
  const upcoming = clientBookings.filter(b => new Date(b.eventDate) >= now && b.status !== 'Declined');
  const fmtDate = (d) => new Date(d).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const fmtTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      {/* Contact header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.06), rgba(255,0,128,0.04))', border: '1px solid rgba(0,245,255,0.12)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--cyan), var(--magenta))' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--white)', marginBottom: '8px' }}>{client.name}</h2>
            {client.company && <div style={{ color: 'var(--cyan)', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>{client.company}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <a href={`mailto:${client.email}`} style={{ color: 'var(--grey-light)', fontSize: '0.85rem' }}>✉️ {client.email}</a>
              {client.phone && <a href={`tel:${client.phone}`} style={{ color: 'var(--grey-light)', fontSize: '0.85rem' }}>📞 {client.phone}</a>}
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--grey)', fontFamily: "'DM Mono', monospace" }}>
              SINCE {new Date(client.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' }).toUpperCase()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { label: 'Venues', value: client.venues.length, color: 'var(--cyan)' },
              { label: 'Upcoming', value: upcoming.length, color: 'var(--magenta)' },
              { label: 'Total', value: client.totalBookings, color: 'var(--gold)' },
            ].map(s => (
              <div key={s.label} className="stat-chip">
                <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Venues */}
      <div style={{ marginBottom: '24px' }}>
        <div className="section-title">VENUES ({client.venues.length})</div>
        {client.venues.length === 0
          ? <div style={{ color: 'var(--grey)', fontSize: '0.82rem', fontStyle: 'italic' }}>No venues added.</div>
          : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
              {client.venues.map(v => (
                <div key={v.id} style={{ background: 'var(--dark3)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius)', padding: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <VenueIcon venue={v} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--white)', letterSpacing: '0.04em', marginBottom: '3px' }}>{v.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--grey-light)' }}>
                      {v.venueType}
                      {(v.address || v.city || v.state) && (
                        <span> · {[v.address, [v.city, v.state].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}</span>
                      )}
                    </div>
                    {v.capacity > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--grey)' }}>Cap: {v.capacity.toLocaleString()}</div>}
                    {v.soundSystem && <div style={{ fontSize: '0.72rem', color: 'var(--grey)', marginTop: '4px' }}>🎛️ {v.soundSystem}</div>}
                    {v.notes && <div style={{ fontSize: '0.72rem', color: 'var(--grey)', marginTop: '3px' }}>📝 {v.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Upcoming bookings */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div className="section-title">UPCOMING BOOKINGS ({upcoming.length})</div>
          {upcoming.map(b => (
            <div key={b.id} className={`booking-card ${b.status.toLowerCase()}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--white)' }}>{b.venueName}</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <span className="service-tag">{b.serviceType}</span>
                    {b.genre && <span style={{ fontSize: '0.72rem', color: 'var(--grey-light)' }}>{b.genre}</span>}
                  </div>
                  <div className="booking-time">📅 {fmtDate(b.eventDate)} · ⏰ {fmtTime(b.startTime)} – {fmtTime(b.endTime)}</div>
                  {b.budget && <div className="booking-time">💰 Offer: ${b.budget.toLocaleString()}</div>}
                  {b.notes && <div className="booking-time">📝 {b.notes}</div>}
                </div>
                <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full booking history (all statuses, newest event first) */}
      {clientBookings.length > 0 && (
        <div>
          <div className="section-title">BOOKING HISTORY ({clientBookings.length})</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--grey)', marginBottom: '14px' }}>Every request and gig for this client — dates, offers, notes, and status.</p>
          <div style={{ maxHeight: 'min(70vh, 520px)', overflowY: 'auto', paddingRight: '4px' }}>
            {[...clientBookings].sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate) || new Date(b.startTime) - new Date(a.startTime)).map(b => (
              <div key={b.id} className={`booking-card ${b.status.toLowerCase()}`} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--white)' }}>{b.venueName}</div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span className="service-tag">{b.serviceType}</span>
                      {b.genre && <span style={{ fontSize: '0.72rem', color: 'var(--grey-light)' }}>{b.genre}</span>}
                    </div>
                    <div className="booking-time">📅 {fmtDate(b.eventDate)} · ⏰ {fmtTime(b.startTime)} – {fmtTime(b.endTime)}</div>
                    {b.budget != null && <div className="booking-time">💰 Offer: ${Number(b.budget).toLocaleString()}</div>}
                    {b.notes && <div className="booking-time">📝 {b.notes}</div>}
                  </div>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {clientBookings.length === 0 && (
        <div className="empty-state"><div className="empty-icon">◈</div><p>NO BOOKINGS FROM THIS CLIENT</p></div>
      )}
    </div>
  );
}

export default function Admin() {
  const [loginInput, setLoginInput] = useState('');
  const [adminToken, setAdminToken] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [tab, setTab] = useState('schedule');
  const [calDate, setCalDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState('');
  const [requestStatus, setRequestStatus] = useState('all');
  const [requestSearch, setRequestSearch] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!stored) {
      setSessionChecked(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [b, c] = await Promise.all([api.adminGetAll(stored), api.adminGetClients(stored)]);
        if (cancelled) return;
        setBookings(b);
        setClients(c);
        setAdminToken(stored);
        setAuthed(true);
      } catch {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
      } finally {
        if (!cancelled) setSessionChecked(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const t = loginInput.trim();
    if (!t) {
      toast.error('Enter your admin token.');
      return;
    }
    setLoading(true);
    try {
      await api.adminLogin(t);
      const [b, c] = await Promise.all([api.adminGetAll(t), api.adminGetClients(t)]);
      sessionStorage.setItem(ADMIN_SESSION_KEY, t);
      setAdminToken(t);
      setBookings(b);
      setClients(c);
      setAuthed(true);
      setLoginInput('');
      toast.success('Signed in to artist portal.');
    } catch {
      toast.error('Invalid admin token.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminToken(null);
    setAuthed(false);
    setBookings([]);
    setClients([]);
    setSelectedClient(null);
    setTab('schedule');
    toast.success('Signed out.');
  };

  const updateStatus = async (id, status) => {
    if (!adminToken) return;
    try {
      await api.adminUpdateStatus(id, status, adminToken);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      toast.success(`BOOKING ${status.toUpperCase()}`);
    } catch {
      toast.error('Update failed.');
    }
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  const fmtTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const fmtShort = (d) => new Date(d).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  const bookingDates = [...new Set(bookings.map(b => new Date(b.eventDate).toDateString()))];
  const tileClassName = ({ date }) => bookingDates.includes(date.toDateString()) ? 'has-booking' : '';
  const selectedBookings = bookings
    .filter(b => new Date(b.eventDate).toDateString() === calDate.toDateString())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const upcoming = bookings.filter(b => new Date(b.eventDate) >= new Date() && b.status !== 'Declined').sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company && c.company.toLowerCase().includes(search.toLowerCase())) ||
    c.venues.some(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase()))
  );

  const q = requestSearch.trim().toLowerCase();
  const matchesRequestSearch = (b) => {
    if (!q) return true;
    return [b.clientName, b.clientEmail, b.clientPhone, b.clientCompany, b.venueName, b.venueCity, b.serviceType, b.genre, b.notes]
      .some(f => f && String(f).toLowerCase().includes(q));
  };

  const displayRequests = [...bookings]
    .filter(b => requestStatus === 'all' || b.status === requestStatus)
    .filter(matchesRequestSearch)
    .sort((a, b) => {
      const pa = a.status === 'Pending' ? 0 : 1;
      const pb = b.status === 'Pending' ? 0 : 1;
      if (pa !== pb) return pa - pb;
      return new Date(a.eventDate) - new Date(b.eventDate);
    });

  if (!sessionChecked) return (
    <div className="page-sm">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px', color: 'var(--cyan)' }}>⚡</div>
        <p className="subtitle" style={{ margin: 0 }}>Loading artist portal…</p>
      </div>
    </div>
  );

  if (!authed) return (
    <div className="page-sm">
      <div className="auth-card">
        <h1>ARTIST <span>PORTAL</span></h1>
        <p className="subtitle">// patrick star — secure backend access</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--grey-light)', lineHeight: 1.5, marginBottom: '20px' }}>
          Token is sent over HTTPS in the request body, then stored in <strong style={{ color: 'var(--grey-light)' }}>session storage</strong> for this tab only.
          API calls use the <code style={{ color: 'var(--cyan)' }}>X-Admin-Token</code> header — never the URL. Set your secret with{' '}
          <code style={{ color: 'var(--cyan)' }}>PATRICK_ADMIN_TOKEN</code> on the server.
        </p>
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Admin token</label>
            <input type="password" autoComplete="off" placeholder="Your private token" value={loginInput} onChange={e => setLoginInput(e.target.value)} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? <><span className="spinner" /> SIGNING IN…</> : '⚡ SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--white)' }}>ARTIST <span style={{ color: 'var(--cyan)', textShadow: 'var(--cyan-glow)' }}>PORTAL</span></h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--grey)', marginTop: '4px' }}>// patrick star · booking management</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { label: 'Upcoming', value: upcoming.length, color: 'var(--cyan)' },
            { label: 'Confirmed', value: bookings.filter(b => b.status === 'Confirmed').length, color: 'var(--magenta)' },
            { label: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, color: 'var(--gold)' },
            { label: 'Clients', value: clients.length, color: '#AAAAFF' },
          ].map(s => (
            <div key={s.label} className="stat-chip">
              <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ marginLeft: '4px' }}>SIGN OUT</button>
        </div>
      </div>

      <div className="tab-row">
        <button className={`tab ${tab === 'schedule' ? 'active' : ''}`} onClick={() => setTab('schedule')}>SCHEDULE</button>
        <button className={`tab ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>ALL REQUESTS</button>
        <button className={`tab ${tab === 'clients' ? 'active' : ''}`} onClick={() => { setTab('clients'); setSelectedClient(null); }}>CLIENTS ({clients.length})</button>
      </div>

      {/* SCHEDULE */}
      {tab === 'schedule' && (
        <div className="dashboard-grid">
          <div className="card card-glow-cyan">
            <div className="section-title">MY CALENDAR</div>
            <Calendar value={calDate} onChange={setCalDate} tileClassName={tileClassName} />
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--grey)' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', background: 'rgba(255,0,128,0.4)', borderRadius: '2px' }} />
              DAYS WITH BOOKINGS
            </div>
          </div>
          <div className="card">
            <div className="section-title">{fmtDate(calDate).toUpperCase()}</div>
            {selectedBookings.length === 0
              ? <div className="empty-state"><div className="empty-icon">◈</div><p>FREE DAY — NO BOOKINGS</p></div>
              : selectedBookings.map(b => (
                <div key={b.id} className={`booking-card ${b.status.toLowerCase()}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--white)' }}>{b.venueName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--cyan)', marginTop: '2px' }}>{b.clientName}{b.clientCompany ? ` · ${b.clientCompany}` : ''}</div>
                      <div style={{ display: 'flex', gap: '8px', margin: '4px 0', flexWrap: 'wrap' }}>
                        <span className="service-tag">{b.serviceType}</span>
                        {b.genre && <span style={{ fontSize: '0.72rem', color: 'var(--grey-light)' }}>{b.genre}</span>}
                      </div>
                      <div className="booking-time">⏰ {fmtTime(b.startTime)} – {fmtTime(b.endTime)}</div>
                      <div className="booking-time">📞 {b.clientPhone} · ✉️ {b.clientEmail}</div>
                      {b.budget && <div className="booking-time">💰 Offer: ${b.budget.toLocaleString()}</div>}
                      {b.notes && <div className="booking-time">📝 {b.notes}</div>}
                    </div>
                    <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                  </div>
                  {b.status === 'Pending' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => updateStatus(b.id, 'Confirmed')}>✓ CONFIRM</button>
                      <button className="btn btn-danger btn-sm" onClick={() => updateStatus(b.id, 'Declined')}>✕ DECLINE</button>
                    </div>
                  )}
                  {b.status === 'Confirmed' && (
                    <div style={{ marginTop: '10px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => updateStatus(b.id, 'Completed')}>MARK COMPLETED</button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ALL REQUESTS */}
      {tab === 'requests' && (
        <div className="card">
          <div className="section-title">INCOMING &amp; ALL BOOKING REQUESTS</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--grey)', marginBottom: '16px' }}>Pending requests are listed first. Filter by status or search by client, venue, email, or notes.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
            <div className="input-group" style={{ flex: '1 1 220px', marginBottom: 0 }}>
              <input type="search" placeholder="Search requests…" value={requestSearch} onChange={e => setRequestSearch(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['all', 'Pending', 'Confirmed', 'Declined', 'Completed'].map(s => (
                <button
                  key={s}
                  type="button"
                  className={`btn btn-sm ${requestStatus === s ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.72rem', padding: '6px 12px' }}
                  onClick={() => setRequestStatus(s)}
                >
                  {s === 'all' ? 'ALL' : s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          {bookings.length === 0
            ? <div className="empty-state"><div className="empty-icon">◈</div><p>NO BOOKING REQUESTS YET</p></div>
            : displayRequests.length === 0
              ? <div className="empty-state"><div className="empty-icon">◈</div><p>NO MATCHES — TRY ANOTHER FILTER OR SEARCH</p></div>
            : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr><th>CLIENT</th><th>VENUE</th><th>SERVICE</th><th>DATE / TIME</th><th>OFFER</th><th>NOTES</th><th>STATUS</th><th>ACTIONS</th></tr>
                  </thead>
                  <tbody>
                    {displayRequests.map(b => (
                      <tr key={b.id}>
                        <td>
                          <strong>{b.clientName}</strong>
                          {b.clientCompany && <div style={{ fontSize: '0.75rem', color: 'var(--cyan)' }}>{b.clientCompany}</div>}
                          <div style={{ fontSize: '0.75rem' }}>{b.clientEmail}</div>
                          <div style={{ fontSize: '0.75rem' }}>{b.clientPhone}</div>
                        </td>
                        <td><strong>{b.venueName}</strong><div style={{ fontSize: '0.75rem' }}>{b.venueCity}</div></td>
                        <td><span className="service-tag">{b.serviceType}</span>{b.genre && <div style={{ fontSize: '0.72rem', color: 'var(--grey-light)', marginTop: '3px' }}>{b.genre}</div>}</td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                          {fmtShort(b.eventDate)}<br />
                          {fmtTime(b.startTime)} – {fmtTime(b.endTime)}
                        </td>
                        <td style={{ color: 'var(--gold)', fontWeight: 600 }}>{b.budget ? `$${b.budget.toLocaleString()}` : '—'}</td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--grey-light)', maxWidth: '160px' }} title={b.notes || ''}>{b.notes ? (b.notes.length > 80 ? `${b.notes.slice(0, 80)}…` : b.notes) : '—'}</td>
                        <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                        <td>
                          {b.status === 'Pending' && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button className="btn btn-outline btn-sm" style={{ padding: '5px 10px', fontSize: '0.72rem' }} onClick={() => updateStatus(b.id, 'Confirmed')}>✓</button>
                              <button className="btn btn-danger btn-sm" style={{ padding: '5px 10px', fontSize: '0.72rem' }} onClick={() => updateStatus(b.id, 'Declined')}>✕</button>
                            </div>
                          )}
                          {b.status === 'Confirmed' && <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.72rem' }} onClick={() => updateStatus(b.id, 'Completed')}>DONE</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      )}

      {/* CLIENTS */}
      {tab === 'clients' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedClient ? '280px 1fr' : '1fr', gap: '20px' }}>
          <div className="card" style={{ alignSelf: 'start', position: selectedClient ? 'sticky' : 'static', top: '80px', maxHeight: selectedClient ? 'calc(100vh - 100px)' : 'unset', overflowY: selectedClient ? 'auto' : 'unset' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div className="section-title" style={{ marginBottom: 0 }}>CLIENTS</div>
              {selectedClient && <button className="btn btn-ghost btn-sm" onClick={() => setSelectedClient(null)}>✕</button>}
            </div>
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <input type="text" placeholder="Search clients, venues, cities…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {filteredClients.length === 0
              ? <div className="empty-state"><div className="empty-icon">◈</div><p>{search ? 'NO MATCHES' : 'NO CLIENTS YET'}</p></div>
              : filteredClients.map(c => <ClientCard key={c.id} client={c} onSelect={setSelectedClient} isSelected={selectedClient?.id === c.id} />)
            }
          </div>
          {selectedClient && (
            <div className="card">
              <ClientDetailPanel client={clients.find(c => c.id === selectedClient.id) || selectedClient} bookings={bookings} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
