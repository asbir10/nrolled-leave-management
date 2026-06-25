# Nrolled Leave Management System

A full-stack leave management system built for the Nrolled IT Team Selection Assignment.

## 🔗 Live Demo
- **Frontend:** https://nrolled-leave.lovable.app
- **Backend API:** https://nrolled-backend.onrender.com/docs

## 🔑 Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nrolled.com | admin123 |
| Employee | alice@nrolled.com | emp123 |
| Employee | bob@nrolled.com | emp123 |

> **Note:** Backend is hosted on Render free tier. If the app takes 30 seconds on first load, it's waking up from sleep. Wait and try again.

## 🛠 Tech Stack
### Frontend
- React + Vite + TypeScript
- Tailwind CSS + Framer Motion
- TanStack Router + TanStack Query
- Shadcn/ui + Recharts + Sonner
- Built and deployed via Lovable

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL (Supabase)
- bcrypt for password hashing
- Deployed on Render

## 🏗 Architecture
React Frontend (Lovable/Netlify)

↓ axios HTTP calls

FastAPI Backend (Render)

↓ SQLAlchemy ORM

PostgreSQL Database (Supabase)

## ⚙️ Local Setup
### Backend
```bash
cd backend
pip install -r requirements.txt
$env:DATABASE_URL="your-supabase-url"
python seed.py
python -m uvicorn main:app --reload
```

### Frontend
Frontend is built with Lovable's proprietary build system.
Live version: https://nrolled-leave.lovable.app

## 🤖 AI Usage
- **Cursor** — Used to scaffold the entire FastAPI backend (models, routes, database config)
- **Lovable** — Used to build the complete React frontend with dark theme, animations, and responsive layout
- Manually fixed: bcrypt version conflict, Supabase IPv4/IPv6 pooler configuration, CORS setup, login request format (query params → JSON body), and TanStack Router routing issues

## ✅ Features
### Employee
- Login and authentication
- Apply for leave with date range and auto day calculation
- View leave balance
- View all personal leave requests with status
- Balance validation (cannot exceed available days)

### Admin
- View all employee leave requests
- Approve or reject pending requests
- Leave balance auto-deducts on approval
- View all employees and their balances
- Overview dashboard with stats and bar chart

## 🚧 Challenges
- bcrypt 5.0 incompatible with passlib — solved by using bcrypt directly
- Render uses IPv4, Supabase direct connection uses IPv6 — solved using Session pooler URL
- Lovable sent login credentials as query params instead of JSON body — fixed manually in api.ts
- TanStack Router routing broke on /admin and /employee — fixed with useEffect-based redirects

## 🔮 Future Improvements
- JWT authentication with refresh tokens
- Cancel/withdraw pending leave requests
- Admin can add and remove employees
- Email notifications on status change
- Leave history and analytics dashboard
- Mobile responsive improvements

## 📁 Project Structure
nrolled-leave-management/

├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── seed.py
│   ├── requirements.txt
│   ├── Procfile
│   └── routes/
│       ├── auth.py
│       ├── leave.py
│       └── users.py
└── frontend/
    |── src/
    ├── lib/api.ts
    ├── contexts/AuthContext.tsx
    ├── components/app/
    └── routes/