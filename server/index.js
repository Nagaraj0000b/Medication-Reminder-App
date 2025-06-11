require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 8000;
const db = require("./db");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

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
  const email = sanitizeInput(req.body.email)
  const password = req.body.password;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name,email,and password requried  ' })
  }
  db.query('select * from users where email=?', [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message })

    }
    if (result.length > 0) {
      return res.status(409).json({ error: 'User already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    db.query('insert into users(name,email,password)values(?,?,?)', [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message })
      }
      res.status(201).json({ message: 'User registered successfully' })
    })
  })
}
)

app.post('/login', (req, res) => {
  // console.log('BODY:', req.body); 
  const email = sanitizeInput(req.body.email)
  const password = req.body.password
  if (!email || !password) {
    return res.status(500).json({ error: "Email and PAssword requried" })
  }
  db.query('select * from users where email =?', [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database Error", details: err.message })
    }
    if (result.length === 0) {
      return res.status(404).json({
        error: "User not found"
      })
    }
    const user = result[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" })
    }
    const token = jwt.sign({
      id: user.id, name: user.name, email: user.email
    }, JWT_SECRET, { expiresIn: '1h' })
    res.json({
      message: "Login Sucessfull", userid: user.id, name: user.name, token: token
    })
  })
})
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
