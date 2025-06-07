# Medication-Reminder-App

An application to help users manage and remember their medications.

---

## 🚀 Project Progress

### Completed
- [x] Set up project structure (`client`, `server`, `docs`)
- [x] Initialized Git and connected to GitHub
- [x] Created Node.js + Express backend
- [x] Connected backend to MySQL database
- [x] Built and tested `/users`, `/medications`, and `/reminders` API endpoints
- [x] Implemented error handling and input validation

### In Progress
- [ ] Learn and set up React frontend
- [ ] Add user authentication

### Next Steps
- Add pagination and filtering to API endpoints
- Start frontend development with React
- Write unit tests for backend
- Expand documentation in `docs/`

---

## 🗒️ Progress Log

| Date       | What I Did                                               |
|------------|----------------------------------------------------------|
| 2025-06-08 | Fixed MySQL connection, SQL syntax, and API errors       |
| 2025-06-08 | Documented project setup and major milestones            |
| 2025-06-09 | Added CRUD for medications and reminders, improved error handling |
| 2025-06-09 | Updated README and API documentation                     |

---

## 📚 Learning Notes

- Learned how to connect Node.js to MySQL using `mysql2`
- Understood how to handle Express error responses
- Practiced using Git for version control
- Implemented RESTful API design and input validation

---

## 🏁 How to Run

1. Clone the repo and navigate to the project folder:
git clone https://github.com/Nagaraj0000b/Medication-Reminder-App.git
cd Medication-Reminder-App


2. Set up your MySQL database:
- Create a database (e.g., `medication_reminder`)
- Run the SQL scripts in `/docs` or as provided in the README to create the required tables (`users`, `medications`, `reminders`).

3. Configure your database connection:
- Update `server/db.js` with your MySQL credentials.

4. Install dependencies in the `server` folder:
cd server
npm install

5. Start the backend server:
npm start
The server will run at [http://localhost:8000](http://localhost:8000)

6. Test the API:
- Use Postman or curl to test endpoints like `/medications` and `/reminders`.

---

## 📚 API Endpoints

### Medications

| Method | Endpoint                | Description                   |
|--------|-------------------------|-------------------------------|
| GET    | `/medications`          | Get all medications           |
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
#### Example POST /medications:
{
  "name": "Aspirin",
  "dosage": "100mg",
  "user_id": 1
}
#### PUT /medications/:id 
{
  "name": "Paracetamol",
  "dosage": "500mg"
}

#### Example POST /reminders Body

{
"medication_id": 1,
"remind_at": "2025-06-09 08:00:00"
}
#### PUT /reminders/:id 
{
  "taken": true
}


---

## 🛡️ Error Handling

- Returns `404` for invalid paths and not-found resources.
- Returns `400` for missing required fields.
- Returns `500` for server/database errors.

---

## 📈 Next Steps

- Continue backend improvements
- Begin React frontend
- Add authentication and authorization

---

