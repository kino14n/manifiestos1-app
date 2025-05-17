import React, { useState, useRef } from 'react';
import { saveDocument } from '../utils/storage';

const DocumentForm = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [codes, setCodes] = useState('');
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const document = {
      id: Date.now(),
      name,
      date,
      codes: codes.split('\n').filter(code => code.trim() !== ''),
      fileName: file ? file.name : null
    };
    
    saveDocument(document);
    setSuccess(true);
    setName('');
    setDate('');
    setCodes('');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Subir Documento</h2>
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          Documento guardado exitosamente!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre del documento</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha del documento</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Archivo PDF</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Códigos (uno por línea)</label>
          <textarea
            value={codes}
            onChange={(e) => setCodes(e.target.value)}
            className="w-full p-2 border rounded h-40"
            placeholder="Pega aquí los códigos, uno por línea"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Guardar Documento
        </button>
      </form>
    </div>
  );
};

export default DocumentForm;