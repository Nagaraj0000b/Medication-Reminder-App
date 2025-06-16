require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 8000;
const db = require("./db");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const cors = require('cors');
app.use(cors());
const JWT_SECRET = process.env.JWT_SECRET
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey', // this is literally the word 'apikey'
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
          Didn’t request this? Just ignore this email.
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

app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) return res.sendStatus(500);
    res.json(result);
  });
});
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
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min from now

    db.query(
      'INSERT INTO users(name, email, password, isVerified, otp, otpExpires) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, false, otp, otpExpires],
      async (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        await sendOtpEmail(email, otp); // Make sure sendOtpEmail is defined as shown earlier!
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


app.post('/login', (req, res) => {
  const email = sanitizeInput(req.body.email);
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and Password required" });
  }
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database Error", details: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ error: "Email not verified. Please verify OTP sent to your email." });
    }

    // Send OTP for login
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    db.query(
      'UPDATE users SET otp = ?, otpExpires = ? WHERE email = ?',
      [otp, otpExpires, email],
      async (err, result2) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        await sendOtpEmail(email, otp);
        res.json({ message: "OTP sent to your email. Please verify." });
      }
    );
  });
});
app.post('/verify-login-otp', (req, res) => {
  const { email, otp } = req.body;
  db.query(
    'SELECT * FROM users WHERE email = ? AND otp = ? AND otpExpires > NOW()',
    [email, otp],
    (err, results) => {
      if (results.length === 0) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }
      const user = results[0];
      db.query(
        'UPDATE users SET otp = NULL, otpExpires = NULL WHERE email = ?',
        [email],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Database error", details: err.message });
          // Generate JWT token
          const token = jwt.sign({
            id: user.id, name: user.name, email: user.email
          }, JWT_SECRET, { expiresIn: '1h' });
          res.json({
            message: "Login Successful",
            userid: user.id,
            name: user.name,
            token: token
          });
        }
      );
    }
  );
});

app.get('/medications', authenticateToken, (req, res) => {
  db.query('SELECT * FROM medications where user_id=?', [req.user.id], (err, result) => {
    if (err) return res.sendStatus(500);
    res.json(result);
  });
});
app.get('/medications/:id', authenticateToken, (req, res) => {
  const medicationId = req.params.id
  db.query('SELECT * FROM medications where id =? AND user_id=?', [medicationId, req.user.id], (err, result) => {
    if (err) return res.sendStatus(500);
    if (result.length === 0) return res.status(404).json({ error: 'Medication not found' });
    res.json(result[0]);
  });
});
app.post('/medications', authenticateToken, (req, res) => {
  const name = sanitizeInput(req.body.name);
  const dosage = sanitizeInput(req.body.dosage);
  const user_id = req.user.id;
  if (!name || !dosage || !user_id) {
    return res.status(400).json({ error: 'name, dosage, and user_id are required' });
  }

  db.query(
    'INSERT INTO medications (name, dosage, user_id) VALUES (?, ?, ?)',
    [name, dosage, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      res.json({ id: result.insertId, name, dosage, user_id });
    }
  );
})
  ;

app.put('/medications/:id', authenticateToken, (req, res) => {
  const name = sanitizeInput(req.body.name);
  const dosage = sanitizeInput(req.body.dosage);
  db.query(
    'update medications set name=?,dosage=? where id=? AND user_id=?', [name, dosage, req.params.id, req.user.id], (err, result) => {

      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Medication not found' });

      res.json({ id: req.params.id, name, dosage })
    }
  )
})
app.delete('/medications/:id', authenticateToken, (req, res) => {
  db.query('delete from medications where id=? AND user_id=?', [req.params.id, req.user.id], (err, result) => {

    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Medication not found' });

    res.json({ id: req.params.id, sucess: true })
  })
})
app.get('/reminders', authenticateToken, (req, res) => {
  db.query('SELECT * from reminders where user_id=?', [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });

    res.json(result);
  })
})
app.get('/reminders/:id', authenticateToken, (req, res) => {
  const medid = req.params.id
  db.query('SELECT * from reminders where id=? AND user_id=?', [medid, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'Reminder not found' });
    res.json(result[0]);
  })
})
app.post('/reminders', authenticateToken, (req, res) => {
  const { medication_id, remind_at } = req.body
  db.query(
    'insert into reminders(medication_id,remind_at,user_id)values(?,?,?)', [medication_id, remind_at, req.user.id], (err, result) => {

      if (err) return res.status(500).json({ error: 'Database error', details: err.message });


      res.json({ id: result.insertId, medication_id, remind_at })
    }
  )
})
app.put('/reminders/:id', authenticateToken, (req, res) => {
  const { taken } = req.body
  db.query(
    'update reminders set taken=? where id=? AND user_id=?', [taken, req.params.id, req.user.id], (err, result) => {

      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Reminder not found' });

      res.json({ id: req.params.id, status: true })

    }
  )
})
app.delete('/reminders/:id', authenticateToken, (req, res) => {

  db.query(
    'delete from reminders where id=? AND user_id=?', [req.params.id, req.user.id], (err, result) => {

      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Reminder not found' });

      res.json({ id: req.params.id, status: true })
    }
  )
})
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
