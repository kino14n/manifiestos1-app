import React, { useState } from 'react';
import { fetchDocs } from './api';

export default function BuscarDocumentos() {
  const [input, setInput]     = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    const codesToSearch = input
      .split('\\n')
      .map(c => c.trim())
      .filter(Boolean);

    const all = await fetchDocs();
    const filtered = all.filter(doc =>
      codesToSearch.some(code => doc.codes.includes(code))
    );
    setResults(filtered);
  };

  const handleClear = () => {
    setInput('');
    setResults([]);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Buscar Documentos</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <label htmlFor="searchCodes" className="block mb-1">
          Códigos a buscar (uno por línea)
        </label>
        <textarea
          id="searchCodes"
          name="searchCodes"
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
          className="w-full border rounded p-2 mb-3"
          placeholder="Pega aquí los códigos a buscar, uno por línea"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Limpiar
        </button>
      </form>
      <div>
        <h3 className="text-lg font-semibold mb-2">Resultados</h3>
        {results.length === 0
          ? <p className="text-gray-600">No hay documentos que mostrar.</p>
          : (
            <ul className="space-y-2">
              {results.map(doc => (
                <li key={doc.id} className="border p-3 rounded">
                  <p><strong>{doc.name}</strong> — {doc.date}</p>
                  <p>Códigos: {doc.codes.join(', ')}</p>
                  {doc.file && (
                    <a
                      href={\`/data/\${doc.file}\`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Ver archivo
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </div>
  );
}
