// Railway MySQL database connection for production
const mysql = require('mysql2/promise');
require('dotenv').config();

// Check for Railway-specific environment variables
// Railway injects these automatically in production
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production';

// Use Railway variables if available, otherwise fall back to .env
const host = isRailway ? 
  (process.env.MYSQL_HOST || process.env.DB_HOST) : 
  (process.env.DB_HOST || 'shuttle.proxy.rlwy.net');

const user = isRailway ? 
  (process.env.MYSQL_USER || process.env.DB_USER) : 
  (process.env.DB_USER || 'root');

const password = isRailway ? 
  (process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD) : 
  process.env.DB_PASSWORD;

const database = isRailway ? 
  (process.env.MYSQL_DATABASE || process.env.DB_DATABASE) : 
  (process.env.DB_DATABASE || 'railway');

const port = isRailway ? 
  (process.env.MYSQL_PORT || process.env.DB_PORT || '3306') : 
  (process.env.DB_PORT || '37133');

// Enable SSL by default for Railway connections
const ssl = process.env.DB_SSL === 'false' ? false : { 
  rejectUnauthorized: true 
};

// Log connection parameters (without password)
console.log('Database connection parameters:');
console.log('- Environment:', isRailway ? 'Railway' : 'Local/Custom');
console.log('- Host:', host);
console.log('- User:', user);
console.log('- Database:', database);
console.log('- Port:', port);
console.log('- SSL:', ssl ? 'enabled' : 'disabled');

// Check if essential config is available
if (!password) {
  console.error('ERROR: Database password not set in environment variables!');
  console.error('Please make sure DB_PASSWORD is set in your .env file.');
  // Don't exit process here, let the connection attempt fail naturally
}

// Connection pool
const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  port: parseInt(port, 10),
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection function - call this when your server starts
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to Railway MySQL database');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('Access denied')) {
      console.error('  → Check your username and password');
    } else if (error.message.includes('ETIMEDOUT')) {
      console.error('  → Connection timed out. Check network/firewall settings');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('  → Host not found. Check your DB_HOST value');
    } else if (error.message.includes('SSL')) {
      console.error('  → SSL error. Try setting DB_SSL=false');
    }
    
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
