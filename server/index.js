const express = require('express');
const app = express();
const PORT = 8000;
const db = require("./db");


app.use(express.json());




app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) return res.sendStatus(500);
    res.json(result);
  });
});

app.get('/medications', (req, res) => {
  db.query('SELECT * FROM medications', (err, result) => {
    if (err) return res.sendStatus(500);
    res.json(result);
  });
});
app.get('/medications/:id', (req, res) => {
  const medicationId = req.params.id
  db.query('SELECT * FROM medications where id =?', [medicationId], (err, result) => {
    if (err) return res.sendStatus(500);
    if (result.length === 0) return res.status(404).json({ error: 'Medication not found' });
    res.json(result[0]);
  });
});
app.post('/medications', (req, res) => {
  const { name, dosage, user_id } = req.body;
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
});

app.put('/medications/:id', (req, res) => {
  const { name, dosage } = req.body
  db.query(
    'update medications set name=?,dosage=? where id=?', [name, dosage, req.params.id], (err,result) => {

      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Medication not found' });

      res.json({ id: req.params.id, name, dosage })
    }
  )
})
app.delete('/medications/:id', (req, res) => {
  db.query('delete from medications where id=?', [req.params.id], (err,result) => {

    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Medication not found' });

    res.json({ id: req.params.id, sucess: true })
  })
})
app.get('/reminders', (req, res) => {
  db.query('SELECT * from reminders', (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });

    res.json(result);
  })
})
app.get('/reminders/:id', (req, res) => {
  const medid = req.params.id
  db.query('SELECT * from reminders where id=?', [medid], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'Reminder not found' });
    res.json(result[0]);
  })
})
app.post('/reminders', (req, res) => {
  const { medication_id, remind_at } = req.body
  db.query(
    'insert into reminders(medication_id,remind_at)values(?,?)', [medication_id, remind_at], (err, result) => {

      if (err) return res.status(500).json({ error: 'Database error', details: err.message });


      res.json({ id: result.insertId, medication_id, remind_at })
    }
  )
})
app.put('/reminders/:id', (req, res) => {
  const { taken } = req.body
  db.query(
    'update reminders set taken=? where id=?', [taken, req.params.id], (err, result) => {

      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Reminder not found' });

      res.json({ id: req.params.id, status: true })

    }
  )
})
app.delete('/reminders/:id', (req, res) => {

  db.query(
    'delete from reminders where id=?', [req.params.id], (err, result) => {

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
