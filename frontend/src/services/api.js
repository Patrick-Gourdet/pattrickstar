const BASE = '/api';
const h = (auth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) { const t = localStorage.getItem('token'); if (t) headers['Authorization'] = `Bearer ${t}`; }
  return headers;
};
const handle = async (res) => {
  if (!res.ok) { const text = await res.text(); throw new Error(text || `Error ${res.status}`); }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const api = {
  register: (d) => fetch(`${BASE}/auth/register`, { method: 'POST', headers: h(false), body: JSON.stringify(d) }).then(handle),
  login: (d) => fetch(`${BASE}/auth/login`, { method: 'POST', headers: h(false), body: JSON.stringify(d) }).then(handle),

  getVenues: () => fetch(`${BASE}/venues`, { headers: h() }).then(handle),
  addVenue: (d) => fetch(`${BASE}/venues`, { method: 'POST', headers: h(), body: JSON.stringify(d) }).then(handle),
  uploadVenuePhoto: (id, file) => {
    const form = new FormData(); form.append('photo', file);
    return fetch(`${BASE}/venues/${id}/photo`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, body: form }).then(handle);
  },

  getMyBookings: () => fetch(`${BASE}/bookings`, { headers: h() }).then(handle),
  createBooking: (d) => fetch(`${BASE}/bookings`, { method: 'POST', headers: h(), body: JSON.stringify(d) }).then(handle),
  cancelBooking: (id) => fetch(`${BASE}/bookings/${id}`, { method: 'DELETE', headers: h() }).then(handle),

  /** Admin token only in POST body (login) or X-Admin-Token header — never in URL. */
  adminLogin: (token) =>
    fetch(`${BASE}/bookings/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(handle),
  adminGetAll: (t) =>
    fetch(`${BASE}/bookings/admin/all`, { headers: { 'Content-Type': 'application/json', 'X-Admin-Token': t } }).then(handle),
  adminUpdateStatus: (id, status, t) =>
    fetch(`${BASE}/bookings/admin/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': t },
      body: JSON.stringify({ status }),
    }).then(handle),
  adminGetClients: (t) =>
    fetch(`${BASE}/bookings/admin/clients`, { headers: { 'Content-Type': 'application/json', 'X-Admin-Token': t } }).then(handle),
  /** JSON snapshot (clients, venues, bookings) — includes password hashes. */
  adminExportJson: (t) =>
    fetch(`${BASE}/bookings/admin/export-json`, { headers: { 'Content-Type': 'application/json', 'X-Admin-Token': t } }).then(handle),
  /** Raw SQLite file — full DB backup. */
  adminBackupDb: async (t) => {
    const res = await fetch(`${BASE}/bookings/admin/backup-db`, { headers: { 'X-Admin-Token': t } });
    if (!res.ok) { const text = await res.text(); throw new Error(text || `Error ${res.status}`); }
    return res.blob();
  },
};
