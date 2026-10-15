const nodemailer = require('nodemailer');

let transport = null;
function getTransport() {
  if (transport) return transport;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 465),
    secure: Number(SMTP_PORT || 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  return transport;
}

const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function notifyNewLead(lead) {
  const to = process.env.NOTIFY_EMAIL;
  const t = getTransport();
  const subject = `New quote request: ${lead.project_type} (${lead.name})`;
  const text = [
    `Name: ${lead.name}`, `Phone: ${lead.phone}`, `Email: ${lead.email || '-'}`, `Town: ${lead.town || '-'}`,
    `Project: ${lead.project_type}`, `Timeline: ${lead.timeline || '-'}`, `Best way to reach: ${lead.contact_pref || '-'}`,
    '', lead.message || '(no message)'
  ].join('\n');
  if (!t || !to) {
    console.log('[mailer] SMTP or NOTIFY_EMAIL not set. New lead:\n' + text);
    return;
  }
  await t.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    replyTo: lead.email || undefined,
    subject,
    text,
    html: `<h2 style="margin:0 0 8px">New quote request</h2><table cellpadding="4">
      <tr><td><b>Name</b></td><td>${esc(lead.name)}</td></tr>
      <tr><td><b>Phone</b></td><td>${esc(lead.phone)}</td></tr>
      <tr><td><b>Email</b></td><td>${esc(lead.email) || '-'}</td></tr>
      <tr><td><b>Town</b></td><td>${esc(lead.town) || '-'}</td></tr>
      <tr><td><b>Project</b></td><td>${esc(lead.project_type)}</td></tr>
      <tr><td><b>Timeline</b></td><td>${esc(lead.timeline) || '-'}</td></tr>
      <tr><td><b>Best way to reach</b></td><td>${esc(lead.contact_pref) || '-'}</td></tr></table>
      <p style="white-space:pre-wrap">${esc(lead.message) || '(no message)'}</p>`
  });
}

module.exports = { notifyNewLead };
