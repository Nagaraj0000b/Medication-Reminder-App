# 💊 Medication Reminder App

A full‑stack application to help users schedule, view, and manage their medications and time‑based reminders with an authenticated dashboard experience.

> This README consolidates and streamlines the information that was previously split between the existing root / client / docs READMEs and removes placeholders.

---

## 📌 Key Features (Current)

- User authentication (OTP-based signup & login + JWT session handling; 1‑hour token expiry)
- Protected routes (only authenticated users access dashboard & medication/reminder data)
- Responsive landing & informational pages (features, about, contact)
- Dashboard with:
  - Dynamic greeting & real‑time clock
  - Date selector (past, present, upcoming days)
  - Medication list filtered to the selected date
  - Search bar for quick filtering
  - Create / Edit / Delete medication entries
  - Floating action button to add new medication
- RESTful API for medications and reminders (CRUD)
- MySQL schema & sample data (docs/database.sql)
- Tailwind CSS styling and modular React components

---

## 🛠 Tech Stack

| Layer      | Technologies |
|------------|--------------|
| Frontend   | React (Vite), Tailwind CSS |
| Backend    | Node.js, Express.js |
| Auth       | OTP (email flow), JWT |
| Database   | MySQL |
| Tooling    | npm, dotenv, ESLint |
| Docs       | SQL schema + progress notes (docs/) |

---

## 🗂 Project Structure

```
Medication-Reminder-App/
├── client/                     # React frontend
│   ├── public/
│   └── src/
│       ├── assets/             # Static assets
│       ├── components/         # Reusable UI components
│       ├── pages/              # Page-level components (Landing, Login, Signup, Dashboard, etc.)
│       ├── App.jsx             # App routing / layout
│       ├── main.jsx            # Frontend entry point
│       └── index.css           # Tailwind/global styles
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                     # Express backend
│   ├── index.js                # App bootstrap & route wiring
│   ├── db.js                   # MySQL connection
│   ├── example.rest            # REST client sample requests
│   └── package.json
│
├── docs/
│   ├── README.md               # Extended documentation
│   ├── database.sql            # Schema & seed data
│   └── PROGRESS.md             # Development notes
│
├── LICENSE
└── README.md                   # (This file)
```

---

## ⚙️ Prerequisites

- Node.js ≥ 16
- npm
- MySQL running locally (or accessible remotely)
- (Optional) REST client extension (VS Code REST Client / Postman) for manually exercising endpoints

---

## 🚀 Setup & Installation

### 1. Clone

```bash
git clone https://github.com/Nagaraj0000b/Medication-Reminder-App.git
cd Medication-Reminder-App
```

### 2. Database

1. Create a database (example: `medication_reminder`)
2. Run the SQL script:

```bash
mysql -u <user> -p medication_reminder < docs/database.sql
```

### 3. Backend

```bash
cd server
cp .env.example .env   # if you supply an example file; otherwise create .env
# In .env define:
# DB_HOST=localhost
# DB_USER=your_user
# DB_PASSWORD=your_password
# DB_NAME=medication_reminder
# JWT_SECRET=your_jwt_secret
# OTP_SENDER=...
npm install
npm start
```

Backend default URL: http://localhost:8000

### 4. Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Frontend default URL: http://localhost:5173 (Vite output may show an alternate port if occupied)

---

## 🔐 Authentication Flow (Summary)

1. User initiates signup → OTP sent via configured channel (email).
2. User verifies OTP → account created → JWT issued (1‑hour validity).
3. Authenticated requests include `Authorization: Bearer <token>`.
4. Token expiry triggers re-authentication.

---

## 📡 Core API Endpoints

Base URL: `http://localhost:8000`

| Group        | Method | Endpoint              | Description                              | Auth |
|--------------|--------|-----------------------|------------------------------------------|------|
| Medications  | GET    | /medications          | List all user medications                | JWT  |
| Medications  | GET    | /medications/:id      | Get medication by ID                     | JWT  |
| Medications  | POST   | /medications          | Create medication                        | JWT  |
| Medications  | PUT    | /medications/:id      | Update medication                        | JWT  |
| Medications  | DELETE | /medications/:id      | Delete medication                        | JWT  |
| Reminders    | GET    | /reminders            | List reminders                           | JWT  |
| Reminders    | GET    | /reminders/:id        | Get reminder by ID                       | JWT  |
| Reminders    | POST   | /reminders            | Create reminder                          | JWT  |
| Reminders    | PUT    | /reminders/:id        | Update (e.g., mark taken)                | JWT  |
| Reminders    | DELETE | /reminders/:id        | Delete reminder                          | JWT  |

(Refer to `server/example.rest` for sample request bodies.)

---

## 🧱 Architecture Notes

- Separation of concerns: frontend (React) handles presentation; backend (Express) handles business logic & persistence.
- Stateless auth via JWT; protected routes enforce token verification.
- MySQL chosen for structured relational data (users, medications, reminders).
- Modular React organization: pages (routing-level), components (reusable UI primitives).
- Tailwind CSS for utility-first styling enabling rapid iteration.



## 📄 License

MIT License (see LICENSE file).

---

## 🤝 Contribution

1. Fork & create feature branch
2. Commit changes with clear messages
3. Open a pull request referencing any related issue

---

## 🙋 Support / Questions

Open an issue in the repository with a clear description.

---