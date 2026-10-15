const crypto = require('crypto');

const COOKIE = 'rsb_admin';
const MAX_AGE_MS = 1000 * 60 * 60 * 12; // 12 hours
const secret = () => process.env.SESSION_SECRET || 'dev-only-secret-change-me';
const password = () => process.env.ADMIN_PASSWORD || 'change-me-now';

const sign = (v) => crypto.createHmac('sha256', secret()).update(v).digest('hex');
const sha = (v) => crypto.createHash('sha256').update(String(v)).digest();

function checkPassword(input) {
  return crypto.timingSafeEqual(sha(input), sha(password()));
}

function makeToken() {
  const exp = String(Date.now() + MAX_AGE_MS);
  return exp + '.' + sign(exp);
}

function validToken(tok) {
  if (!tok || typeof tok !== 'string') return false;
  const [exp, sig] = tok.split('.');
  if (!exp || !sig || sig.length !== 64) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(sign(exp)))) return false;
  return Number(exp) > Date.now();
}

function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}

function isAuthed(req) { return validToken(parseCookies(req)[COOKIE]); }

function setSession(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE}=${encodeURIComponent(makeToken())}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${MAX_AGE_MS / 1000}${secure}`);
}
function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}

function requireAuth(req, res, next) {
  if (isAuthed(req)) return next();
  if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Not signed in' });
  return res.redirect('/admin/login');
}

module.exports = { checkPassword, isAuthed, setSession, clearSession, requireAuth };
