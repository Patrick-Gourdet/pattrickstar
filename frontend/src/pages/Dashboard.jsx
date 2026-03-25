import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const VENUE_TYPES = ['Club', 'Bar', 'Lounge', 'Festival', 'Private Residence', 'Corporate', 'Rooftop', 'Warehouse', 'Hotel', 'Other'];
const SERVICE_TYPES = ['DJ Set', 'Club Night', 'Private Event', 'Corporate Event', 'Festival Set', 'MC / Host', 'Live PA', 'Open Format'];
const GENRES = ['Tech House', 'Minimal House', 'Deep House', 'Afro House', 'Progressive House', 'Open Format', 'Commercial', 'Hip Hop / R&B', 'Latin'];

function VenueIcon({ venue }) {
  if (venue.photoPath) return <div className="venue-icon"><img src={venue.photoPath} alt={venue.name} /></div>;
  const icons = { Club: '🏛️', Bar: '🍺', Festival: '🎪', Lounge: '🛋️', Rooftop: '🌆', Warehouse: '🏚️', Corporate: '🏢', Hotel: '🏨' };
  return <div className="venue-icon">{icons[venue.venueType] || '📍'}</div>;
}

function AddVenueModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', address: '', city: '', state: '', capacity: '', venueType: 'Club', soundSystem: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const venue = await api.addVenue({ ...form, capacity: parseInt(form.capacity) || 0 });
      if (photoFile) { try { await api.uploadVenuePhoto(venue.id, photoFile); } catch {} }
      toast.success(`${form.name} added!`);
      onAdded(); onClose();
    } catch (err) { toast.error(err.message || 'Failed to add venue.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(0,245,255,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--cyan)' }}>ADD VENUE</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label className="photo-upload" htmlFor="venue-photo">
            {photoPreview
              ? <img src={photoPreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: 'var(--radius)', objectFit: 'cover', marginBottom: '8px' }} />
              : <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📸</div>
            }
            <div style={{ fontSize: '0.78rem', color: 'var(--grey-light)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {photoPreview ? 'Change Photo' : 'Add Venue Photo'}
            </div>
            <input type="file" id="venue-photo" accept="image/*" onChange={handlePhoto} />
          </label>
          <div className="input-group">
            <label>Venue Name *</label>
            <input type="text" placeholder="The Factory" value={form.name} onChange={set('name')} required />
          </div>
          <div className="form-row">
            <div className="input-group">
              <label>Venue Type</label>
              <select value={form.venueType} onChange={set('venueType')}>
                {VENUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Capacity</label>
              <input type="number" placeholder="500" value={form.capacity} onChange={set('capacity')} min={0} />
            </div>
          </div>
          <div className="input-group">
            <label>Address</label>
            <input type="text" placeholder="123 Main St" value={form.address} onChange={set('address')} />
          </div>
          <div className="form-row">
            <div className="input-group">
              <label>City *</label>
              <input type="text" placeholder="Miami" value={form.city} onChange={set('city')} required />
            </div>
            <div className="input-group">
              <label>State</label>
              <input type="text" placeholder="FL" value={form.state} onChange={set('state')} maxLength={2} />
            </div>
          </div>
          <div className="input-group">
            <label>Sound System</label>
            <input type="text" placeholder="Pioneer CDJ-3000, Allen & Heath Xone 96…" value={form.soundSystem} onChange={set('soundSystem')} />
          </div>
          <div className="input-group">
            <label>Notes</label>
            <textarea placeholder="Load-in details, parking, backline info…" value={form.notes} onChange={set('notes')} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>CANCEL</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
              {loading ? <><span className="spinner" /> SAVING…</> : '★ ADD VENUE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BookingModal({ venues, onClose, onBooked }) {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('22:00');
  const [endTime, setEndTime] = useState('02:00');
  const [serviceType, setServiceType] = useState('DJ Set');
  const [genre, setGenre] = useState('Tech House');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVenue) { toast.error('Please select a venue.'); return; }

    const eventDate = new Date(date);
    const startDT = new Date(date);
    const [sh, sm] = startTime.split(':');
    startDT.setHours(parseInt(sh), parseInt(sm), 0, 0);

    let endDT = new Date(date);
    const [eh, em] = endTime.split(':');
    endDT.setHours(parseInt(eh), parseInt(em), 0, 0);
    // Handle past-midnight end times
    if (endDT <= startDT) endDT.setDate(endDT.getDate() + 1);

    setLoading(true);
    try {
      await api.createBooking({
        venueId: selectedVenue.id, serviceType, genre, notes,
        eventDate: eventDate.toISOString(),
        startTime: startDT.toISOString(),
        endTime: endDT.toISOString(),
        budget: budget ? parseFloat(budget) : null,
      });
      toast.success('BOOKING REQUEST SENT! Pattrick will be in touch.');
      onBooked(); onClose();
    } catch (err) { toast.error(err.message || 'Booking failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '580px', maxHeight: '92vh', overflowY: 'auto', border: '1px solid rgba(255,0,128,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--magenta)' }}>REQUEST SLOT</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Venue selection */}
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grey-light)', marginBottom: '10px' }}>SELECT VENUE</div>
            {venues.length === 0
              ? <div style={{ color: 'var(--grey)', fontSize: '0.85rem', fontStyle: 'italic' }}>Add a venue first before requesting a booking.</div>
              : venues.map(v => (
                <div key={v.id} className={`venue-card ${selectedVenue?.id === v.id ? 'selected' : ''}`} onClick={() => setSelectedVenue(v)}>
                  <VenueIcon venue={v} />
                  <div className="venue-info" style={{ flex: 1 }}>
                    <h3>{v.name}</h3>
                    <p>{v.city}{v.state ? `, ${v.state}` : ''} · {v.venueType}{v.capacity ? ` · Cap: ${v.capacity.toLocaleString()}` : ''}</p>
                  </div>
                  <div style={{ fontSize: '1.2rem', color: selectedVenue?.id === v.id ? 'var(--cyan)' : 'var(--grey)' }}>
                    {selectedVenue?.id === v.id ? '◉' : '◎'}
                  </div>
                </div>
              ))}
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Service Type</label>
              <select value={serviceType} onChange={e => setServiceType(e.target.value)}>
                {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Genre / Vibe</label>
              <select value={genre} onChange={e => setGenre(e.target.value)}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grey-light)', marginBottom: '10px' }}>EVENT DATE</div>
            <Calendar value={date} onChange={setDate} minDate={new Date()} />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Start Time</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>End Time</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
            </div>
          </div>

          <div className="input-group">
            <label>Budget / Offer (optional)</label>
            <input type="number" placeholder="$ 0.00" value={budget} onChange={e => setBudget(e.target.value)} min={0} step={50} />
          </div>

          <div className="input-group">
            <label>Notes for Pattrick</label>
            <textarea placeholder="Event details, crowd type, dress code, special requirements…" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>CANCEL</button>
            <button type="submit" className="btn btn-magenta" style={{ flex: 2, justifyContent: 'center' }} disabled={loading || !venues.length}>
              {loading ? <><span className="spinner" /> SENDING…</> : '★ SEND REQUEST'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState('schedule');
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [calDate, setCalDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [v, b] = await Promise.all([api.getVenues(), api.getMyBookings()]);
      setVenues(v); setBookings(b);
    } catch { toast.error('Failed to load data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking request?')) return;
    try { await api.cancelBooking(id); toast.success('Booking cancelled.'); loadData(); }
    catch { toast.error('Failed to cancel.'); }
  };

  const bookingDates = [...new Set(bookings.map(b => new Date(b.eventDate).toDateString()))];
  const tileClassName = ({ date }) => bookingDates.includes(date.toDateString()) ? 'has-booking' : '';

  const selectedDayBookings = bookings
    .filter(b => new Date(b.eventDate).toDateString() === calDate.toDateString())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const upcoming = bookings
    .filter(b => new Date(b.eventDate) >= startOfToday)
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate) || new Date(a.startTime) - new Date(b.startTime));

  const fmtDate = (d) => new Date(d).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  const fmtTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const fmtCalDate = (d) => new Date(d).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px', color: 'var(--grey)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '12px', color: 'var(--cyan)' }}>⚡</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading your portal…</div>
    </div>
  );

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '2.5rem' }}>CLIENT PORTAL</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setShowAddVenue(true)}>+ ADD VENUE</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowBooking(true)}>★ REQUEST BOOKING</button>
        </div>
      </div>

      <div className="tab-row">
        <button className={`tab ${tab === 'schedule' ? 'active' : ''}`} onClick={() => setTab('schedule')}>SCHEDULE</button>
        <button className={`tab ${tab === 'venues' ? 'active' : ''}`} onClick={() => setTab('venues')}>VENUES ({venues.length})</button>
        <button className={`tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>ALL REQUESTS ({bookings.length})</button>
      </div>

      {tab === 'schedule' && (
        <div className="dashboard-grid">
          <div className="card card-glow-cyan">
            <div className="section-title">CALENDAR</div>
            <Calendar value={calDate} onChange={setCalDate} tileClassName={tileClassName} />
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--grey)' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', background: 'rgba(255,0,128,0.4)', borderRadius: '2px' }} />
              DAYS WITH REQUESTS (ALL STATUSES)
            </div>
          </div>

          <div className="card">
            <div className="section-title">{fmtCalDate(calDate).toUpperCase()}</div>
            {selectedDayBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◈</div>
                <p>NO BOOKINGS THIS DAY</p>
                <button className="btn btn-outline btn-sm" style={{ marginTop: '14px' }} onClick={() => setShowBooking(true)}>REQUEST THIS DATE</button>
              </div>
            ) : selectedDayBookings.map(b => (
              <div key={b.id} className={`booking-card ${b.status.toLowerCase()}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--white)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', letterSpacing: '0.05em' }}>{b.venueName}</div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '5px', flexWrap: 'wrap' }}>
                      <span className="service-tag">{b.serviceType}</span>
                      {b.genre && <span style={{ fontSize: '0.72rem', color: 'var(--grey-light)' }}>· {b.genre}</span>}
                    </div>
                    <div className="booking-time">⏰ {fmtTime(b.startTime)} – {fmtTime(b.endTime)}</div>
                    {b.budget != null && <div className="booking-time">💰 Offer: ${Number(b.budget).toLocaleString()}</div>}
                    {b.notes && <div className="booking-time">📝 {b.notes}</div>}
                  </div>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                </div>
              </div>
            ))}

            <div className="neon-divider" />
            <div className="section-title">UPCOMING</div>
            {upcoming.length === 0
              ? <div className="empty-state"><div className="empty-icon">◈</div><p>NO UPCOMING BOOKINGS</p></div>
              : upcoming.slice(0, 5).map(b => (
                <div key={b.id} className={`booking-card ${b.status.toLowerCase()}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--white)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem' }}>{b.venueName}</div>
                      <div className="booking-time">📅 {fmtDate(b.eventDate)} · {fmtTime(b.startTime)} – {fmtTime(b.endTime)}</div>
                      {b.budget != null && <div className="booking-time">💰 ${Number(b.budget).toLocaleString()}</div>}
                      <span className="service-tag" style={{ marginTop: '4px' }}>{b.serviceType}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.72rem', padding: '4px 10px' }} onClick={() => cancelBooking(b.id)}>CANCEL</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {tab === 'venues' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div className="section-title" style={{ marginBottom: 0 }}>MY VENUES</div>
            <button className="btn btn-outline btn-sm" onClick={() => setShowAddVenue(true)}>+ ADD VENUE</button>
          </div>
          {venues.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📍</div>
              <p>NO VENUES ADDED YET</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: '14px' }} onClick={() => setShowAddVenue(true)}>ADD YOUR FIRST VENUE</button>
            </div>
          ) : venues.map(v => (
            <div key={v.id} className="venue-card" style={{ cursor: 'default' }}>
              <VenueIcon venue={v} />
              <div className="venue-info" style={{ flex: 1 }}>
                <h3>{v.name}</h3>
                <p>{v.venueType} · {v.city}{v.state ? `, ${v.state}` : ''}{v.capacity ? ` · ${v.capacity.toLocaleString()} cap` : ''}</p>
                {v.soundSystem && <p style={{ marginTop: '3px', color: 'var(--grey)' }}>🎛️ {v.soundSystem}</p>}
                {v.notes && <p style={{ marginTop: '3px', color: 'var(--grey)' }}>📝 {v.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="card">
          <div className="section-title">ALL BOOKING REQUESTS</div>
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <p>NO REQUESTS YET</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: '14px' }} onClick={() => setShowBooking(true)}>REQUEST A BOOKING</button>
            </div>
          ) : [...bookings].sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)).map(b => (
            <div key={b.id} className={`booking-card ${b.status.toLowerCase()}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--white)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', letterSpacing: '0.05em' }}>{b.venueName}</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '5px', flexWrap: 'wrap' }}>
                    <span className="service-tag">{b.serviceType}</span>
                    {b.genre && <span style={{ fontSize: '0.72rem', color: 'var(--grey-light)' }}>{b.genre}</span>}
                  </div>
                  <div className="booking-time">📅 {fmtDate(b.eventDate)} · ⏰ {fmtTime(b.startTime)} – {fmtTime(b.endTime)}</div>
                  {b.budget && <div className="booking-time">💰 Offer: ${b.budget.toLocaleString()}</div>}
                  {b.notes && <div className="booking-time">📝 {b.notes}</div>}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                  <button className="btn btn-danger btn-sm" style={{ fontSize: '0.72rem', padding: '5px 12px' }} onClick={() => cancelBooking(b.id)}>CANCEL</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddVenue && <AddVenueModal onClose={() => setShowAddVenue(false)} onAdded={loadData} />}
      {showBooking && <BookingModal venues={venues} onClose={() => setShowBooking(false)} onBooked={loadData} />}
    </div>
  );
}
