const express = require('express');
const { insertLead } = require('../db');
const { notifyNewLead } = require('../lib/mailer');

const router = express.Router();
const hits = new Map(); // ip -> [timestamps]
const WINDOW = 60 * 60 * 1000, MAX = 6;

function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW);
  list.push(now); hits.set(ip, list);
  return list.length > MAX;
}
const clean = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n);

router.post('/', express.json({ limit: '20kb' }), async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot: pretend success
  if (limited(req.ip)) return res.status(429).json({ error: 'Too many requests, please call us instead' });

  const lead = {
    name: clean(b.name, 120), phone: clean(b.phone, 40), email: clean(b.email, 160), town: clean(b.town, 120),
    project_type: clean(b.project_type, 120), timeline: clean(b.timeline, 80), contact_pref: clean(b.contact_pref, 20),
    message: clean(b.message, 4000)
  };
  if (!lead.name || !lead.phone || !lead.project_type) return res.status(400).json({ error: 'Name, phone and project type are required' });
  if (lead.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) return res.status(400).json({ error: 'That email address does not look right' });

  try {
    insertLead.run(lead);
  } catch (e) {
    console.error('[quote] db error', e);
    return res.status(500).json({ error: 'Could not save your request' });
  }
  res.json({ ok: true });
  notifyNewLead(lead).catch((e) => console.error('[quote] mail error', e.message));
});

module.exports = router;
