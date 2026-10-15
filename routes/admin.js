const express = require('express');
const path = require('path');
const { STATUSES, allLeads, leadsByStatus, updateLead, getLead } = require('../db');
const { checkPassword, isAuthed, setSession, clearSession, requireAuth } = require('../lib/auth');

const router = express.Router();
const view = (f) => path.join(__dirname, '..', 'views', f);
const attempts = new Map();

router.get('/login', (req, res) => (isAuthed(req) ? res.redirect('/admin') : res.sendFile(view('login.html'))));

router.post('/login', express.urlencoded({ extended: false }), (req, res) => {
  const now = Date.now();
  const recent = (attempts.get(req.ip) || []).filter((t) => now - t < 15 * 60 * 1000);
  if (recent.length >= 8) return res.status(429).send('Too many attempts. Try again in a few minutes.');
  if (checkPassword(req.body.password || '')) { attempts.delete(req.ip); setSession(res); return res.redirect('/admin'); }
  recent.push(now); attempts.set(req.ip, recent);
  res.redirect('/admin/login?error=1');
});

router.post('/logout', (req, res) => { clearSession(res); res.redirect('/admin/login'); });

router.get('/', requireAuth, (req, res) => res.sendFile(view('admin.html')));

router.get('/api/leads', requireAuth, (req, res) => {
  const s = req.query.status;
  res.json({ statuses: STATUSES, leads: s && STATUSES.includes(s) ? leadsByStatus.all(s) : allLeads.all() });
});

router.patch('/api/leads/:id', requireAuth, express.json({ limit: '20kb' }), (req, res) => {
  const id = Number(req.params.id);
  if (!getLead.get(id)) return res.status(404).json({ error: 'Not found' });
  const status = req.body.status;
  if (status !== undefined && !STATUSES.includes(status)) return res.status(400).json({ error: 'Bad status' });
  const notes = req.body.notes === undefined ? null : String(req.body.notes).slice(0, 4000);
  updateLead.run({ id, status: status === undefined ? null : status, notes });
  res.json(getLead.get(id));
});

router.get('/api/export.csv', requireAuth, (req, res) => {
  const cols = ['id', 'created_at', 'status', 'name', 'phone', 'email', 'town', 'project_type', 'timeline', 'contact_pref', 'message', 'notes'];
  const q = (v) => { let s = String(v == null ? '' : v); if (/^[=+\-@]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
  const rows = [cols.join(',')].concat(allLeads.all().map((l) => cols.map((c) => q(l[c])).join(',')));
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="rock-shore-leads.csv"');
  res.send(rows.join('\n'));
});

module.exports = router;
