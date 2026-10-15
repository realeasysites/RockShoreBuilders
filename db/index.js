const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const file = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'rsb.db');
fs.mkdirSync(path.dirname(file), { recursive: true });

const db = new Database(file);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS leads (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL,
  email        TEXT,
  town         TEXT,
  project_type TEXT NOT NULL,
  timeline     TEXT,
  contact_pref TEXT,
  message      TEXT,
  status       TEXT NOT NULL DEFAULT 'new',
  notes        TEXT DEFAULT '',
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
`);

const STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost', 'archived'];

module.exports = {
  db,
  STATUSES,
  insertLead: db.prepare(`INSERT INTO leads (name, phone, email, town, project_type, timeline, contact_pref, message)
    VALUES (@name, @phone, @email, @town, @project_type, @timeline, @contact_pref, @message)`),
  allLeads: db.prepare(`SELECT * FROM leads ORDER BY datetime(created_at) DESC, id DESC`),
  leadsByStatus: db.prepare(`SELECT * FROM leads WHERE status = ? ORDER BY datetime(created_at) DESC, id DESC`),
  updateLead: db.prepare(`UPDATE leads SET status = COALESCE(@status, status), notes = COALESCE(@notes, notes), updated_at = datetime('now') WHERE id = @id`),
  getLead: db.prepare(`SELECT * FROM leads WHERE id = ?`)
};
