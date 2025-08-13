require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Configure CORS with allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000']; // Default local dev origins

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

const JWT_SECRET = process.env.JWT_SECRET;
const nodemailer = require('nodemailer');

console.log('Environment loaded - JWT_SECRET exists:', !!process.env.JWT_SECRET);

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

async function sendOtpEmail(email, otp) {
  await transporter.sendMail({
    from: process.env.SENDGRID_SENDER,
    to: email,
    subject: "Your Medication Reminder App OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 420px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 24px; background: #f9fafb;">
        <h2 style="color: #14b8a6; text-align: center;">Medication Reminder App</h2>
        <p style="font-size: 17px; color: #222; text-align: center;">
          <b>Your OTP code is:</b>
        </p>
        <p style="font-size: 32px; letter-spacing: 6px; color: #0f766e; text-align: center; font-weight: bold;">
          ${otp}
        </p>
        <p style="font-size: 15px; color: #444; text-align: center;">
          Enter this code in the app to verify your email.<br>
          <b>This code will expire in 10 minutes.</b>
        </p>
        <hr style="margin: 24px 0;">
        <p style="font-size: 13px; color: #888; text-align: center;">
          Didn't request this? Just ignore this email.
        </p>
      </div>
    `
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input.trim();
  }
  return input;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Medication Reminder API is running' });
});

// Authentication routes (keep existing)
app.post('/register', async (req, res) => {
  const name = sanitizeInput(req.body.name);
  const email = sanitizeInput(req.body.email);
  const password = req.body.password;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password required' });
  }
  
  db.query('SELECT * FROM users WHERE email=?', [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (result.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Set OTP expiry to 1 week
  const otpExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    db.query(
      'INSERT INTO users(name, email, password, isVerified, otp, otpExpires) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, false, otp, otpExpires],
      async (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        await sendOtpEmail(email, otp);
        res.status(201).json({ message: 'OTP sent to your email. Please verify.' });
      }
    );
  });
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  db.query(
    'SELECT * FROM users WHERE email = ? AND otp = ? AND otpExpires > NOW()',
    [email, otp],
    (err, results) => {
      if (results.length === 0) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }
      db.query(
        'UPDATE users SET isVerified = ?, otp = NULL, otpExpires = NULL WHERE email = ?',
        [true, email],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Database error", details: err.message });
          res.json({ message: "Email verified successfully!" });
        }
      );
    }
  );
});

app.post("/login", (req, res) => {
  const email = sanitizeInput(req.body.email);
  const password = req.body.password;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and Password required" });
  }
  
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ error: "Database Error", details: err.message });
    if (result.length === 0) return res.status(404).json({ error: "User not found" });
    
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
  // Remove OTP check from login. Allow login only if user exists and password matches.

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      message: "Login Successful",
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  });
});

// Medications endpoints (keep existing)
app.get('/medications', authenticateToken, (req, res) => {
  db.query('SELECT * FROM medications WHERE user_id=?', [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    res.json(result);
  });
});

app.get('/medications/:id', authenticateToken, (req, res) => {
  const medicationId = req.params.id;
  db.query('SELECT * FROM medications WHERE id = ? AND user_id = ?', [medicationId, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'Medication not found' });
    res.json(result[0]);
  });
});

app.post('/medications', authenticateToken, (req, res) => {
  const name = sanitizeInput(req.body.name);
  const dosage = sanitizeInput(req.body.dosage);
  const sideEffects = sanitizeInput(req.body.sideEffects) || null;
  const user_id = req.user.id;
  
  if (!name || !dosage) {
    return res.status(400).json({ error: 'name and dosage are required' });
  }

  db.query(
    'INSERT INTO medications (name, dosage, sideEffects, user_id) VALUES (?, ?, ?, ?)',
    [name, dosage, sideEffects, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      res.json({ id: result.insertId, name, dosage, sideEffects, user_id });
    }
  );
});

app.put('/medications/:id', authenticateToken, (req, res) => {
  const name = sanitizeInput(req.body.name);
  const dosage = sanitizeInput(req.body.dosage);
  const sideEffects = sanitizeInput(req.body.sideEffects) || null;
  
  db.query(
    'UPDATE medications SET name=?, dosage=?, sideEffects=? WHERE id=? AND user_id=?', 
    [name, dosage, sideEffects, req.params.id, req.user.id], 
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Medication not found' });
      res.json({ id: req.params.id, name, dosage, sideEffects });
    }
  );
});

app.delete('/medications/:id', authenticateToken, (req, res) => {
  const medicationId = req.params.id;
  const userId = req.user.id;
  
  console.log(`Deleting medication ${medicationId} for user ${userId}`);
  
  db.query(
    'DELETE FROM reminders WHERE medication_id = ? AND user_id = ?',
    [medicationId, userId],
    (err, reminderResult) => {
      if (err) {
        console.error('Error deleting reminders:', err);
        return res.status(500).json({ error: 'Failed to delete reminders' });
      }
      
      db.query(
        'DELETE FROM medications WHERE id = ? AND user_id = ?',
        [medicationId, userId],
        (err, medicationResult) => {
          if (err) {
            console.error('Error deleting medication:', err);
            return res.status(500).json({ error: 'Failed to delete medication' });
          }
          
          if (medicationResult.affectedRows === 0) {
            return res.status(404).json({ error: 'Medication not found' });
          }
          
          res.json({ 
            message: 'Medication deleted successfully',
            deletedReminders: reminderResult.affectedRows,
            deletedMedications: medicationResult.affectedRows
          });
        }
      );
    }
  );
});

// FIXED: Enhanced medications-with-reminders endpoint
app.get('/medications-with-reminders', authenticateToken, (req, res) => {
  const { date } = req.query;
  
  console.log(`=== REMINDER DEBUG ===`);
  console.log(`Requested date: ${date}`);
  console.log(`User ID: ${req.user.id}`);
  
  // First, get all medications for the user
  const medicationsQuery = `
    SELECT id, name, dosage, sideEffects 
    FROM medications 
    WHERE user_id = ?
    ORDER BY name
  `;
  
  db.query(medicationsQuery, [req.user.id], (err, medications) => {
    if (err) {
      console.error('Error fetching medications:', err);
      return res.status(500).json({ error: 'Failed to fetch medications' });
    }
    
    console.log(`Found ${medications.length} medications`);
    
    if (medications.length === 0) {
      return res.json([]);
    }
    
    // Now get reminders for the specific date
    let remindersQuery = `
      SELECT r.*, m.name as medication_name
      FROM reminders r
      JOIN medications m ON r.medication_id = m.id
      WHERE r.user_id = ? AND m.user_id = ?
    `;
    
    let params = [req.user.id, req.user.id];
    
    if (date) {
      // Try multiple date comparison methods to catch different formats
      remindersQuery += ` AND (
        DATE(r.remind_at) = ? OR 
        r.remind_at LIKE ? OR 
        SUBSTRING(r.remind_at, 1, 10) = ?
      )`;
      params.push(date, `${date}%`, date);
    }
    
    remindersQuery += ` ORDER BY r.remind_at`;
    
    console.log('Reminders query:', remindersQuery);
    console.log('Reminders params:', params);
    
    db.query(remindersQuery, params, (err, reminders) => {
      if (err) {
        console.error('Error fetching reminders:', err);
        return res.status(500).json({ error: 'Failed to fetch reminders' });
      }
      
      console.log(`Found ${reminders.length} reminders:`, reminders);
      
      // Combine medications with their reminders
      const result = medications.map(med => {
        const medReminders = reminders.filter(r => r.medication_id === med.id);
        return {
          id: med.id,
          name: med.name,
          dosage: med.dosage,
          sideEffects: med.sideEffects || '',
          reminders: medReminders
        };
      });
      
      console.log('Final result:', JSON.stringify(result, null, 2));
      console.log(`=== END DEBUG ===`);
      
      res.json(result);
    });
  });
});

// Reminders endpoints (keep existing)
app.get('/reminders', authenticateToken, (req, res) => {
  const query = `
    SELECT r.*, m.name as medication_name 
    FROM reminders r
    LEFT JOIN medications m ON r.medication_id = m.id
    WHERE r.user_id = ?
    ORDER BY r.remind_at ASC
  `;
  
  db.query(query, [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    res.json(result);
  });
});

app.post('/reminders', authenticateToken, (req, res) => {
  const { 
    medication_id, 
    remind_at, 
    frequency_type = 'daily', 
    meal_timing = 'none', 
    taken = false 
  } = req.body;
  
  if (!medication_id || !remind_at) {
    return res.status(400).json({ error: 'medication_id and remind_at are required' });
  }

  const query = `
    INSERT INTO reminders 
    (medication_id, user_id, remind_at, frequency_type, meal_timing, taken) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [medication_id, req.user.id, remind_at, frequency_type, meal_timing, taken],
    (err, result) => {
      if (err) {
        console.error('Error creating reminder:', err);
        return res.status(500).json({ error: 'Failed to create reminder' });
      }
      
      res.json({ 
        message: 'Reminder created successfully', 
        id: result.insertId,
        medication_id,
        remind_at,
        frequency_type,
        meal_timing,
        taken
      });
    }
  );
});

app.put('/reminders/:id', authenticateToken, (req, res) => {
  const { taken } = req.body;
  db.query(
    'UPDATE reminders SET taken=? WHERE id=? AND user_id=?', 
    [taken, req.params.id, req.user.id], 
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Reminder not found' });
      res.json({ id: req.params.id, taken });
    }
  );
});

app.delete('/reminders/:id', authenticateToken, (req, res) => {
  db.query(
    'DELETE FROM reminders WHERE id=? AND user_id=?', 
    [req.params.id, req.user.id], 
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Reminder not found' });
      res.json({ message: 'Reminder deleted successfully', id: req.params.id });
    }
  );
});

// Additional endpoints (keep existing bulk operations)
app.get('/medications/:id/reminders', authenticateToken, (req, res) => {
  const medicationId = req.params.id;
  
  const query = `
    SELECT 
      r.*,
      m.name as medication_name,
      m.dosage
    FROM reminders r
    JOIN medications m ON r.medication_id = m.id
    WHERE r.medication_id = ? AND r.user_id = ? AND m.user_id = ?
    ORDER BY r.remind_at ASC
  `;
  
  db.query(query, [medicationId, req.user.id, req.user.id], (err, result) => {
    if (err) {
      console.error('Error fetching medication reminders:', err);
      return res.status(500).json({ error: 'Failed to fetch reminders', details: err.message });
    }
    
    res.json(result);
  });
});

app.delete('/medications/:id/reminders/clear', authenticateToken, (req, res) => {
  const medicationId = req.params.id;
  const userId = req.user.id;
  
  const verifyQuery = 'SELECT id FROM medications WHERE id = ? AND user_id = ?';
  
  db.query(verifyQuery, [medicationId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    
    const deleteQuery = 'DELETE FROM reminders WHERE medication_id = ? AND user_id = ?';
    
    db.query(deleteQuery, [medicationId, userId], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to clear reminders' });
      }
      
      res.json({ 
        message: 'All reminders cleared successfully',
        cleared_count: deleteResult.affectedRows 
      });
    });
  });
});

app.post('/medications/:id/reminders/bulk', authenticateToken, (req, res) => {
  const medicationId = req.params.id;
  const { reminders } = req.body;
  
  if (!Array.isArray(reminders) || reminders.length === 0) {
    return res.status(400).json({ error: 'Reminders array is required' });
  }
  
  const values = reminders.map(reminder => [
    medicationId,
    req.user.id,
    reminder.remind_at,
    reminder.frequency_type || 'daily',
    reminder.meal_timing || 'none',
    reminder.taken || false
  ]);
  
  const query = `
    INSERT INTO reminders 
    (medication_id, user_id, remind_at, frequency_type, meal_timing, taken) 
    VALUES ?
  `;
  
  db.query(query, [values], (err, result) => {
    if (err) {
      console.error('Error creating bulk reminders:', err);
      return res.status(500).json({ error: 'Failed to create reminders' });
    }
    
    res.json({ 
      message: `Successfully created ${result.affectedRows} reminders`,
      created_count: result.affectedRows
    });
  });
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
