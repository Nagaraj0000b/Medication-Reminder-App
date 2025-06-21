

---

# 💊 Medication-Reminder-App

An application to help users manage and remember their medications.

---

## 🛠️ Tech Stack & Frameworks Used


  
  <p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge" alt="Express.js"/>
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white&style=for-the-badge" alt="MySQL"/>
  <img src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=for-the-badge" alt="JWT"/>
  <img src="https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white&style=for-the-badge" alt="npm"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white&style=for-the-badge" alt="ESLint"/>
  <img src="https://img.shields.io/badge/Dotenv-8DD6F9?logo=dotenv&logoColor=black&style=for-the-badge" alt="Dotenv"/>
</p>
  
  
  
  
  
  
  
  


---

## 🗂️ Project Structure

```
Medication-Reminder-App/
│
├── client/                         # React frontend (Vite + Tailwind CSS)
│   ├── public/
│   └── src/
│       ├── assets/                 # Images, logos, static assets
│       ├── components/             # Reusable React components (Navbar, Footer, etc.)
│       ├── pages/                  # Page components (LandingPage, LoginPage, SignUpPage, Dashboard, etc.)
│       ├── App.jsx                 # Main React component with routes
│       ├── main.jsx                # React entry point
│       └── index.css               # Tailwind/global styles
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                         # Node.js + Express backend
│   ├── db.js                       # Database connection setup
│   ├── index.js                    # Main Express app
│   ├── example.rest                # REST Client API examples
│   ├── .env                        # Environment variables (DB credentials, JWT secret)
│   └── package.json
│
├── docs/                           # Documentation & SQL scripts
│   ├── README.md                   # Project and setup documentation
│   ├── database.sql                # MySQL schema and sample data
│   └── PROGRESS.md                 # Progress log and notes
│
├── .gitignore
├── LICENSE
└── README.md                       # Main project README
```


---

## 🚀 Features Implemented (Up to Dashboard)

### ✅ Authentication & User Flow
- OTP-based signup and login (with email verification)
- JWT authentication (1-hour expiry, secure logout)
- Protected routes for dashboard and medication management

### ✅ Landing & Info Pages
- Responsive landing page with hero section, features, about, contact, and call-to-action
- Modern navbar and footer, mobile-friendly navigation

### ✅ Dashboard (Client Main Page)
- **Greeting (left) and live date/time (right)** — always aligned, even on mobile
- **Search bar** for filtering medications and reminders
- **Scrollable date row**: select previous, current, or upcoming days
- **Medication list**: shows only medications with reminders for the selected day
- **Edit/Delete** buttons beside each medication, “View All” beside the heading
- **Add Medication** floating button
- All components styled with Tailwind CSS for a clean, modern look

---

## 🏁 How to Run

1. **Clone the repo and navigate to the project folder:**
    ```bash
    git clone https://github.com/Nagaraj0000b/Medication-Reminder-App.git
    cd Medication-Reminder-App
    ```

2. **Set up your MySQL database:**
    - Create a database (e.g., `medication_reminder`)
    - Run the SQL scripts in `/docs/database.sql` to create required tables (`users`, `medications`, `reminders`).

3. **Configure your database connection:**
    - Update `server/db.js` with your MySQL credentials.

4. **Install backend dependencies:**
    ```bash
    cd server
    npm install
    npm start
    ```
    The server will run at [http://localhost:8000](http://localhost:8000)

5. **Install frontend dependencies:**
    ```bash
    cd ../client
    npm install
    npm run dev
    ```
    The frontend will run at [http://localhost:5173](http://localhost:5173) (or as shown in your terminal).

---

## 📚 API Endpoints

See the full API documentation in `/docs/README.md` or below for main endpoints.

### Medications

| Method | Endpoint                | Description                   |
|--------|-------------------------|-------------------------------|
| GET    | `/medications`          | Get all medications (JWT required) |
| GET    | `/medications/:id`      | Get medication by ID          |
| POST   | `/medications`          | Create new medication         |
| PUT    | `/medications/:id`      | Update medication by ID       |
| DELETE | `/medications/:id`      | Delete medication by ID       |

### Reminders

| Method | Endpoint                | Description                   |
|--------|-------------------------|-------------------------------|
| GET    | `/reminders`            | Get all reminders             |
| GET    | `/reminders/:id`        | Get reminder by ID            |
| POST   | `/reminders`            | Create new reminder           |
| PUT    | `/reminders/:id`        | Update reminder (taken)       |
| DELETE | `/reminders/:id`        | Delete reminder by ID         |

---

## 📝 Next Steps

- Add medication supply alerts and pill image integration
- Enhance dashboard with adherence tracking, refill reminders, and analytics
- Improve accessibility and mobile experience
- Expand documentation and add more unit tests

---

## 👨‍💻 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

**_This README is up-to-date with all work completed through the dashboard stage. For further progress, see `/docs/PROGRESS.md`._**
