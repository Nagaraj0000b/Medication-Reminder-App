-- Medication-Reminder-App Database Schema
-- Save this file as docs/database.sql

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS medication_reminder;
USE medication_reminder;

-- 2. Users Table
-- Stores registered users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Medications Table
-- Stores medications for each user
CREATE TABLE IF NOT EXISTS medications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Reminders Table
-- Stores reminders for medications
CREATE TABLE IF NOT EXISTS reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medication_id INT NOT NULL,
    remind_at DATETIME NOT NULL,
    taken BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
);

-- 5. (Optional) Insert a sample user (replace password with a bcrypt hash if needed)
-- INSERT INTO users (name, email, password) VALUES ('Test User', 'test@example.com', '$2b$10$examplehash');

-- 6. (Optional) Insert a sample medication and reminder
-- INSERT INTO medications (name, dosage, user_id) VALUES ('Aspirin', '100mg', 1);
-- INSERT INTO reminders (medication_id, remind_at) VALUES (1, '2025-06-09 08:00:00');
