# Rock Shore Builders, Inc.
Node 20 + Express + SQLite. Lead dashboard at /admin.

## Deploy (GitHub + Render)
1. Push this folder to a new GitHub repo.
2. Render > New > Blueprint (uses render.yaml), or a Web Service: build `npm install`, start `npm start`.
3. Set env vars: ADMIN_PASSWORD, SESSION_SECRET, NOTIFY_EMAIL, plus SMTP_* from .env.example.
4. Keep the persistent disk mounted at /data path used by render.yaml so leads survive deploys.
5. Point the client's own domain at Render.

## Local
cp .env.example .env && npm install && npm start  (http://localhost:3000, admin at /admin)

## Open items before launch
- NOTIFY_EMAIL inbox, admin password, SESSION_SECRET
- Owner name, service-area towns, services confirmation (which trades are subbed)
- Homeowner OK for lakefront photos; original logo file
- They do NOT do foundations or site work. Keep it out of copy.

`preview/` and `scripts/build-preview.py` only build the hosted demo; not needed in production.
