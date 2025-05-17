import React, { useState } from 'react';
import { searchDocumentsByCodes } from '../utils/storage';

const SearchForm = () => {
  const [codes, setCodes] = useState('');
  const [results, setResults] = useState({ documents: [], missingCodes: [] });
  const [searched, setSearched] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState(new Set());

  const handleSearch = (e) => {
    e.preventDefault();
    const codeList = codes.split('\n').filter(code => code.trim() !== '');
    const searchResults = searchDocumentsByCodes(codeList);
    setResults(searchResults);
    setSearched(true);
    setSelectedDocs(new Set());
  };

  const handleReset = () => {
    setCodes('');
    setResults({ documents: [], missingCodes: [] });
    setSearched(false);
    setSelectedDocs(new Set());
  };

  const toggleSelectDoc = (docId) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocs(newSelected);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Buscar Documentos</h2>
      <form onSubmit={handleSearch}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Códigos a buscar (uno por línea)</label>
          <textarea
            value={codes}
            onChange={(e) => setCodes(e.target.value)}
            className="w-full p-2 border rounded h-40"
            placeholder="Pega aquí los códigos a buscar, uno por línea"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
          >
            Limpiar
          </button>
        </div>
      </form>

      {searched && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Resultados:</h3>
          
          {results.missingCodes.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <h4 className="font-medium text-yellow-800 mb-1">Códigos no encontrados:</h4>
              <div className="flex flex-wrap gap-1">
                {results.missingCodes.map(code => (
                  <span key={code} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}

          {results.documents.length > 0 ? (
            <div className="space-y-4">
              {results.documents.map((doc) => (
                <div key={doc.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedDocs.has(doc.id)}
                        onChange={() => toggleSelectDoc(doc.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-600">{doc.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700 text-sm">
                        Ver
                      </button>
                      <button className="text-blue-500 hover:text-blue-700 text-sm">
                        Imprimir
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Códigos encontrados:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doc.matchedCodes.map((code) => (
                        <span key={code} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No se encontraron documentos que contengan los códigos buscados.</p>
          )}

          {selectedDocs.size > 0 && (
            <div className="mt-4 flex justify-end gap-2">
              <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                Ver seleccionados ({selectedDocs.size})
              </button>
              <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
                Imprimir seleccionados ({selectedDocs.size})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchForm;