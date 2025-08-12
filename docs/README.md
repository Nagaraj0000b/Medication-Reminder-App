# 💊 Medication Reminder App

> Never miss a dose. A full‑stack application to schedule, manage, and review medications and time‑based reminders with authenticated user workflows.

---

## ✨ Overview
Medication Reminder App helps users create and manage medications and their reminders, offering authenticated access, a dashboard with date-based filtering, and a clean responsive UI. Current implementation covers authentication, landing pages, and a functional dashboard (up to reminder & medication management).

---

## 🛠 Tech Stack

| Layer      | Technologies |
|----------- |-------------|
| Frontend   | React (Vite), Tailwind CSS |
| Backend    | Node.js, Express.js |
| Auth       | OTP (email flow), JWT (1‑hour expiry) |
| Database   | MySQL |
| Tooling    | npm, dotenv, ESLint, REST client examples |

---

## 📂 Project Structure
```
Medication-Reminder-App/
├── client/                     # React frontend (Vite + Tailwind)
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/         # Reusable UI (Navbar, Footer, etc.)
│       ├── pages/              # Landing, Login, Signup, Dashboard
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                     # Express backend
│   ├── db.js                   # MySQL connection
│   ├── index.js                # App bootstrap & routing
│   ├── example.rest            # Sample API calls
│   └── package.json
│
├── docs/
│   ├── database.sql            # Schema + sample data
│   ├── PROGRESS.md             # Development log
│   └── README.md               # Extended documentation (legacy)
│
├── LICENSE
└── README.md                   # (This consolidated file)
```

---

## ✅ Implemented Features

### Authentication & User Flow
- OTP-based signup and login (email verification)
- JWT authentication (1‑hour expiry, logout invalidation concept)
- Protected dashboard & data routes

### Landing & Informational Pages
- Responsive hero, features, about, contact, call‑to‑action
- Mobile-friendly navigation (Tailwind utility classes)

### Dashboard
- Live greeting + real‑time date/time display
- Scrollable selectable date row (past / present / upcoming)
- Medication list filtered by selected date
- Search bar for fast filtering
- Add / Edit / Delete medication entries
- Floating action (Add Medication) button
- Consistent responsive layout

---

## 🧾 Database (MySQL)
Key tables (see `docs/database.sql`):
- users
- medications
- reminders

Add migrations or versioning as the schema evolves.

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 16
- npm
- MySQL running locally (or accessible remotely)

### 1. Clone
```bash
git clone https://github.com/Nagaraj0000b/Medication-Reminder-App.git
cd Medication-Reminder-App
```

### 2. Database Setup
```bash
mysql -u <user> -p -e "CREATE DATABASE medication_reminder;"
mysql -u <user> -p medication_reminder < docs/database.sql
```

### 3. Backend Setup
```bash
cd server
npm install
# Create .env with:
# DB_HOST=localhost
# DB_USER=your_user
# DB_PASSWORD=your_password
# DB_NAME=medication_reminder
# JWT_SECRET=your_jwt_secret
# (Add any mail/OTP config variables used)
npm start
```
Backend default: http://localhost:8000

### 4. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```
Frontend default: http://localhost:5173

---

## 🔐 Authentication Flow
1. User requests signup → OTP sent (email).
2. OTP verified → account created → JWT issued.
3. Client stores token (e.g., localStorage) → attaches as `Authorization: Bearer <token>`.
4. Expiry leads to re‑authentication.

---

## 📡 Core API Endpoints (Summary)

| Method | Endpoint              | Purpose                       | Auth |
|--------|-----------------------|-------------------------------|------|
| GET    | /medications          | List user medications         | JWT  |
| GET    | /medications/:id      | Retrieve medication           | JWT  |
| POST   | /medications          | Create medication             | JWT  |
| PUT    | /medications/:id      | Update medication             | JWT  |
| DELETE | /medications/:id      | Delete medication             | JWT  |
| GET    | /reminders            | List reminders                | JWT  |
| GET    | /reminders/:id        | Retrieve reminder             | JWT  |
| POST   | /reminders            | Create reminder               | JWT  |
| PUT    | /reminders/:id        | Update (e.g., mark taken)     | JWT  |
| DELETE | /reminders/:id        | Delete reminder               | JWT  |

Check `server/example.rest` for sample request bodies.

---

## 🧱 Architecture Notes
- Separation of concerns: React UI vs Express API
- Stateless JWT auth guards protected routes
- Tailwind utility design for rapid iteration
- Potential extension: adherence analytics, notification dispatch, supply alerts

---

## 🛣 Roadmap (Planned Enhancements)
- Adherence tracking & compliance metrics
- Refill / low supply alerts
- Enhanced accessibility & mobile refinements
- Additional unit / integration tests
- Analytics or calendar view
- Notification provider integration (e.g., FCM / email scheduling)

---

## 🧪 Testing
(Placeholder) Add a test framework (e.g., Jest + Supertest for backend, React Testing Library for frontend) and document commands here.

---

## 🤝 Contributing
Fork → create branch → implement → open PR referencing issues. Use conventional commit style if adopting CI checks.

---

## 📜 License
MIT License (see LICENSE).

---

**Status:** Feature-complete through initial dashboard stage (see `docs/PROGRESS.md` for historical notes).