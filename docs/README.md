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
├── client/                     # React frontend (coming soon)
│
├── docs/                       # Documentation & progress
│   ├── README.md
│   ├── .gitkeep
│   └── PROGRESS.md
│
├── server/                     # Node.js + Express backend
│   ├── node_modules/
│   ├── .env
│   ├── .gitkeep
│   ├── db.js
│   ├── example.rest
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── LICENCE
```

## 🚀 Project Progress

### ✅ Completed
- Set up project structure (`client`, `server`, `docs`)
- Initialized Git and connected to GitHub
- Created Node.js + Express backend
- Connected backend to MySQL database
- Built and tested `/users`, `/medications`, and `/reminders` API endpoints
- Implemented error handling and input validation
- Added JWT authentication with 1-hour expiry and logout
- Documented project and tracked progress

### 🔄 In Progress
- Learn and set up React frontend
- Integrate frontend with backend authentication

### 📝 Next Steps
- Add pagination and filtering to API endpoints
- Start frontend development with React
- Write unit tests for backend
- Expand documentation in `docs/`

## 🗒️ Progress Log

| Date       | What I Did                                               |
|------------|----------------------------------------------------------|
| 2025-06-08 | Fixed MySQL connection, SQL syntax, and API errors       |
| 2025-06-08 | Documented project setup and major milestones            |
| 2025-06-09 | Added CRUD for medications and reminders, improved error handling |
| 2025-06-09 | Updated README and API documentation                     |
| 2025-06-10 | Implemented JWT auth, logout, and REST Client testing    |

## 📚 Learning Notes

- Learned how to connect Node.js to MySQL using `mysql2`
- Understood how to handle Express error responses
- Practiced using Git for version control
- Implemented RESTful API design and input validation
- Integrated JWT authentication and token-based logout

## 🏁 How to Run

1. **Clone the repo and navigate to the project folder:**
    ```bash
    git clone https://github.com/Nagaraj0000b/Medication-Reminder-App.git
    cd Medication-Reminder-App
    ```

2. **Set up your MySQL database:**
    - Create a database (e.g., `medication_reminder`)
    - Run the SQL scripts in `/docs` or as provided in the README to create the required tables (`users`, `medications`, `reminders`).

---

## 🛠️ How to Import the Database in MySQL Workbench

1. **Open MySQL Workbench** and connect to your MySQL server.

2. **(Optional) Create the database:**
    ```sql
    CREATE DATABASE IF NOT EXISTS medication_reminder;
    ```
    - You can run this in a new SQL tab.

3. **Go to the menu:**  
   Click **Server > Data Import**.

4. **Choose "Import from Self-Contained File":**
    - Click the "..." button and select your `docs/database.sql` file.

5. **Select the Target Schema:**  
    - Choose `medication_reminder` as the target schema/database.
    - If you don’t see it, create it as in step 2.

6. **Click "Start Import"** at the bottom right.

7. **Wait for the import to finish.**
    - You’ll see a progress log.

8. **Refresh the schema list** (click the refresh icon in the "Schemas" panel) to see your new tables.

**Tip:**  
You can also open `database.sql` in a SQL editor tab, select all, and click the "Execute" (lightning bolt) button to run the script directly.

---

**Your database is now ready for use with the Medication-Reminder-App backend!**

---

3. **Configure your database connection:**
    - Update `server/db.js` with your MySQL credentials.

4. **Install dependencies in the `server` folder:**
    ```bash
    cd server
    npm install
    ```

5. **Start the backend server:**
    ```bash
    npm start
    ```
    The server will run at [http://localhost:8000](http://localhost:8000)

6. **Test the API:**
    - Use Postman, VS Code REST Client, or curl to test endpoints like `/medications` and `/reminders`.

## 📚 API Endpoints

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

### 📝 Example Requests

#### POST `/medications`
```json
{
  "name": "Aspirin",
  "dosage": "100mg",
  "user_id": 1
}
```

#### PUT `/medications/:id`
```json
{
  "name": "Paracetamol",
  "dosage": "500mg"
}
```

#### POST `/reminders`
```json
{
  "medication_id": 1,
  "remind_at": "2025-06-09 08:00:00"
}
```

#### PUT `/reminders/:id`
```json
{
  "taken": true
}
```

## 🛡️ Error Handling

- Returns `404` for invalid paths and not-found resources.
- Returns `400` for missing required fields.
- Returns `500` for server/database errors.

## 📈 What Happened / Retrospective

- **Faced issues with Express body parsing:**  
  Fixed by ensuring correct middleware order and proper request formatting in REST Client.
- **Learned about JWT authentication:**  
  Implemented secure login, token expiry, and logout (with in-memory blacklist for demo).
- **Debugged SQL and MySQL connection errors:**  
  Improved error handling and database setup.
- **Improved project documentation:**  
  Added detailed README, progress tracking, and API docs for easier onboarding and collaboration.
- **Next up:**  
  Start frontend development, connect to backend, and polish user experience.

## 👨‍💻 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📜 License

This project is licensed under the MIT License. See the [LICENCE](./LICENCE) file for details.

---