const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

// Asegura carpeta data
const DATA_DIR = path.join(__dirname, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

// Inicializa SQLite
const dbFile = path.join(DATA_DIR, 'db.sqlite');
const db = new Database(dbFile);
db.prepare(\`
  CREATE TABLE IF NOT EXISTS docs (
    id TEXT PRIMARY KEY,
    name TEXT,
    date TEXT,
    codes TEXT
  )
\`).run();

// POST /api/docs
app.post('/api/docs', (req, res) => {
  const { id, name, date, codes } = req.body;
  const codesStr = Array.isArray(codes) ? codes.join(',') : codes;
  db.prepare(
    'INSERT OR REPLACE INTO docs (id,name,date,codes) VALUES (?,?,?,?)'
  ).run(id, name, date, codesStr);
  res.sendStatus(201);
});

// GET /api/docs
app.get('/api/docs', (req, res) => {
  const rows = db.prepare('SELECT * FROM docs').all();
  const docs = rows.map(r => ({
    id: r.id,
    name: r.name,
    date: r.date,
    codes: r.codes ? r.codes.split(',').filter(c => c) : []
  }));
  res.json(docs);
});

// Sirve React build
app.use(express.static(path.join(__dirname, '../build')));
app.use((_, res) =>
  res.sendFile(path.join(__dirname, '../build/index.html'))
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () =>
  console.log('🚀 API+UI → http://0.0.0.0:' + PORT)
);
