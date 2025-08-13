-- MySQL schema for Medication Reminder App
-- Use this to recreate your database schema in PlanetScale or other MySQL hosting services

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    otp VARCHAR(10),
    otp_expiry DATETIME,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medications table
CREATE TABLE IF NOT EXISTS medications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(255) NOT NULL,
    frequency VARCHAR(255),
    side_effects TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    medication_id INT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('single', 'recurring')),
    remind_at DATETIME,
    weekday VARCHAR(50),
    time TIME,
    taken BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_medications_user_id ON medications(user_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_medication_id ON reminders(medication_id);

/*
DEPLOYMENT INSTRUCTIONS:

1. PlanetScale:
   - Create a new database in PlanetScale
   - Use their console to execute this schema
   - Or use their CLI tool: pscale shell your-db-name main < schema.mysql.sql

2. Railway:
   - Create a new MySQL database
   - Connect to it using their provided credentials
   - Execute this schema file

3. AWS RDS:
   - Create a MySQL instance
   - Connect using MySQL client: mysql -h [endpoint] -u [username] -p [dbname] < schema.mysql.sql

4. Any MySQL hosting:
   - Use any MySQL client to connect to your database
   - Execute this schema file

NOTES:
- Some providers may not support CHECK constraints (like PlanetScale)
- If you get errors about CHECK constraints, remove them and handle the validation in your application code
- Make sure your database credentials are stored securely as environment variables
- The ON UPDATE CURRENT_TIMESTAMP may not be supported in all MySQL versions
*/
