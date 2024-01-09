const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const port = 3000;

function getUniversities(callback) {
  const db = new sqlite3.Database('university_database.db');

  const query = 'SELECT * FROM university';

  db.all(query, (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows);
    }

    db.close();
  });
}

app.get('/universities', (req, res) => {
  getUniversities((err, universities) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ universities });
    }
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
