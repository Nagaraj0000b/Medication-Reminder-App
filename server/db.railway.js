// Railway MySQL database connection for production
const mysql = require('mysql2/promise');
require('dotenv').config();

// Connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: true
  } : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection function - call this when your server starts
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to Railway MySQL database');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Database query function with error handling
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

module.exports = {
  query,
  testConnection
};

/*
USAGE EXAMPLES:

1. Get all medications for a user:
   const medications = await db.query(
     'SELECT * FROM medications WHERE user_id = ?',
     [userId]
   );

2. Insert a new medication:
   const result = await db.query(
     'INSERT INTO medications (user_id, name, dosage, frequency, side_effects, notes) VALUES (?, ?, ?, ?, ?, ?)',
     [userId, name, dosage, frequency, sideEffects, notes]
   );
   const newMedicationId = result.insertId;

3. Update a medication:
   const result = await db.query(
     'UPDATE medications SET name = ?, dosage = ?, frequency = ?, side_effects = ?, notes = ? WHERE id = ? AND user_id = ?',
     [name, dosage, frequency, sideEffects, notes, medicationId, userId]
   );
   
4. Delete a medication:
   const result = await db.query(
     'DELETE FROM medications WHERE id = ? AND user_id = ?',
     [medicationId, userId]
   );

5. Handling transactions:
   const connection = await pool.getConnection();
   try {
     await connection.beginTransaction();
     
     // Multiple queries...
     await connection.execute('INSERT INTO medications ...', [...]);
     await connection.execute('INSERT INTO reminders ...', [...]);
     
     await connection.commit();
   } catch (error) {
     await connection.rollback();
     throw error;
   } finally {
     connection.release();
   }
*/
