import React, { useState, useEffect } from 'react';

export default function App() {
  const [docs, setDocs] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [codes, setCodes] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch('/api/docs')
      .then(r => r.json())
      .then(setDocs)
      .catch(console.error);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    // sube el archivo PDF primero
    let filename = '';
    if (file) {
      const form = new FormData();
      form.append('file', file);
      const resFile = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await resFile.json();
      filename = json.filename;
    }
    // luego guarda los metadatos
    const id = Date.now().toString();
    await fetch('/api/docs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name,
        date,
        codes: codes.split(',').map(c => c.trim()).filter(Boolean),
        filename
      })
    });
    setName(''); setDate(''); setCodes(''); setFile(null);
    const res = await fetch('/api/docs');
    setDocs(await res.json());
  };

  return (
    <div style={{ padding:'1rem', fontFamily:'sans-serif' }}>
      <h1>Manifiestos Compartidos</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom:'1rem' }}>
        <input placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} required />
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} required />
        <input placeholder="Códigos (coma-separados)" value={codes} onChange={e=>setCodes(e.target.value)} required />
        <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files[0])} />
        <button type="submit">Guardar</button>
      </form>
      <ul>
        {docs.map(d => (
          <li key={d.id}>
            <strong>{d.name}</strong> ({d.date}) — Códigos: {d.codes.join(', ')}
            {d.filename && (
              <> — <a href={`/data/${d.filename}`} target="_blank" rel="noopener">Ver PDF</a></>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
