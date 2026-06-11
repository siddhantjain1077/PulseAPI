# PulseAPI

PulseAPI is a monitoring and status API with a frontend and backend.

## Repository layout

- `backend/` — Node.js/Express API server
- `frontend/` — Vite + React frontend

## Quick start

1. Install dependencies for backend and frontend:

```bash
cd backend
npm install

# in a separate shell
cd frontend
npm install
```

2. Configure environment variables.

- Create `.env` files locally (do NOT commit these).
- The repo already ignores `.env` and common env variants.

3. Run backend and frontend for development:

```bash
# backend
cd backend
npm run dev

# frontend
cd frontend
npm run dev
```

4. Build for production:

```bash
# backend (if applicable)
cd backend
npm run build

# frontend
cd frontend
npm run build
```

## Notes

- Sensitive files like `.env` and `node_modules` are ignored via `.gitignore`.
- If you accidentally committed secrets, remove them and rotate credentials.

---

If you want, I can also add a `CONTRIBUTING.md`, license, or more detailed run/debug scripts.
