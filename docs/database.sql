DROP DATABASE IF EXISTS medication_reminder;
CREATE DATABASE medication_reminder;
USE medication_reminder;
-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    isVerified TINYINT(1) DEFAULT 0,
    otp VARCHAR(10),
    otpExpires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medications table
CREATE TABLE medications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    sideEffects TEXT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reminders table
CREATE TABLE reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medication_id INT NOT NULL,
    user_id INT NOT NULL,
    remind_at DATETIME NOT NULL,
    taken TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Add indexes for better performance
CREATE INDEX idx_medications_user_id ON medications(user_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_medication_id ON reminders(medication_id);
CREATE INDEX idx_reminders_remind_at ON reminders(remind_at);
CREATE INDEX idx_users_email ON users(email);
