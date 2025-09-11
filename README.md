AI Resume Builder

Build, personalize, and download ATS-friendly resumes powered by AI. This project is a full‑stack app with a React/TypeScript frontend and a FastAPI backend, using Appwrite for data storage.

Features
- AI‑assisted resume generation
- Profile setup and persistence (name, email, bio, links, etc.)
- Multi‑step resume creation flow
- Resume listing with search and quick actions
- Detailed resume view with dynamic routing
- One‑click PDF and Word downloads

Tech Stack
- Frontend: React, TypeScript, Redux Toolkit, React Router, Tailwind CSS, lucide‑react, react‑toastify
- Backend: FastAPI, Pydantic, Appwrite SDK, ReportLab (PDF), python‑docx (Word)
- Storage: Appwrite Database/Collections

Monorepo Structure
```
.
├─ backend/           # FastAPI application
├─ frontend/          # React app (Vite)
├─ node_modules/
├─ package.json       # Root scripts (optional)
└─ README.md
```

Prerequisites
- Node.js 18+
- Python 3.10+
- Appwrite project (Database and Collections configured)

Environment Variables
Set these before running locally or deploying.

- Frontend (`frontend/.env`):
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

- Backend (`backend/.env` or config provider):
```
SECRET_KEY=replace-with-strong-secret
ALGORITHM=HS256

APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key

APPWRITE_DATABASE_ID=your-db-id
APPWRITE_USER_COLLECTION_ID=your-user-collection-id
APPWRITE_CV_COLLECTION_ID=your-cv-collection-id
```

Getting Started
1) Install dependencies
```
cd frontend && npm install
```
```
cd ../backend && pip install -r requirements.txt
```

2) Run the backend (FastAPI)
```
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3) Run the frontend (Vite)
```
cd frontend
npm run dev
```

Key Frontend Flows
- Profile setup: `frontend/src/pages/auth/ProfileCreate.tsx`
- Create resume: `frontend/src/pages/service/ResumeCreate.tsx`
- List resumes: `frontend/src/pages/service/Resume.tsx`
- View resume: `frontend/src/pages/service/DisplayResume.tsx`

Important Config
- API base URL is read from `VITE_API_BASE_URL` and used by Redux thunks (for example in `frontend/src/features/serviceSlice.ts`). Ensure it points to your FastAPI server with the `/api/v1` prefix.

Backend API (Selected Endpoints)
- Auth
  - POST `/api/v1/signup`
  - POST `/api/v1/login`
  - POST `/api/v1/logout`
- Profile
  - POST `/api/v1/profile/create`
  - GET  `/api/v1/profile/get`
- Resumes
  - POST `/api/v1/resume/create`
  - GET  `/api/v1/resumes`
  - GET  `/api/v1/resume/get/{id}`
  - GET  `/api/v1/resume/pdf/{id}`
  - GET  `/api/v1/resume/word/{id}`

Contributing
- Use clear, descriptive commit messages.
- Match existing code style (TypeScript types, early returns, minimal nesting).
- Run linters/formatters before pushing.

Troubleshooting
- 401/403 errors: ensure the browser is sending cookies if your backend uses auth cookies and that CORS is configured appropriately.
- 404s on profile/resumes: confirm your Appwrite Database and Collection IDs are set correctly and that documents exist for the authenticated user.
- Download issues: verify ReportLab and python‑docx are installed and the resume text exists for the given id.

License
MIT

