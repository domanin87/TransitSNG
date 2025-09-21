TransitSNG - Full project archive (frontend + backend + mobile skeleton)

Overview:
- backend/: Node.js + Express + Sequelize + Socket.IO (serves API and can serve frontend dist as static files)
- frontend/: React + Vite (full UI). Use `npm ci` and `npm run build` to produce `frontend/dist`.
- mobile/: Flutter skeleton (lib/main.dart)

Quick local run (development):
1) Backend:
   cd backend
   npm install
   # create .env from .env.example and set DATABASE_URL (optional)
   npm run migrate
   npm start
2) Frontend (optional separate dev):
   cd frontend
   npm install
   npm run dev

Deploy to Render (example):
1) Create a Postgres managed DB in Render and copy DATABASE_URL
2) Create a Web Service for backend (connect to your GitHub repo):
   - Build Command: cd backend && npm ci && npm run migrate
   - Start Command: cd backend && npm start
   - Set env vars: DATABASE_URL, JWT_SECRET, SOCKET_ORIGIN
3) Option A: Serve frontend via backend static (build frontend locally or in CI and commit frontend/dist)
   - or create a separate static site service on Render pointing to frontend/dist after build

Notes & Next steps:
- Replace demo JWT secret in .env with a strong secret.
- For production enable SSL and proper CORS origins.
- Configure payment provider and map provider keys in frontend when integrating.
