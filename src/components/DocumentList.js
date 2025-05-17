import React, { useState } from 'react';
import { getDocuments, updateDocumentCodes } from '../utils/storage';

const DocumentList = () => {
  const [documents, setDocuments] = useState(getDocuments());
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [editingCodes, setEditingCodes] = useState(false);
  const [tempCodes, setTempCodes] = useState('');

  const handleView = (doc) => {
    setSelectedDoc(doc);
    setEditingCodes(false);
  };

  const handleEditCodes = () => {
    setTempCodes(selectedDoc.codes.join('\n'));
    setEditingCodes(true);
  };

  const handleSaveCodes = () => {
    const newCodes = tempCodes.split('\n').filter(code => code.trim() !== '');
    if (updateDocumentCodes(selectedDoc.id, newCodes)) {
      setDocuments(getDocuments());
      setSelectedDoc({ ...selectedDoc, codes: newCodes });
      setEditingCodes(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Consultar Documentos</h2>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Lista de Documentos</h3>
        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-600">{doc.date}</p>
                  {doc.fileName && <p className="text-xs text-gray-500">Archivo: {doc.fileName}</p>}
                </div>
                <button
                  onClick={() => handleView(doc)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay documentos guardados.</p>
        )}
      </div>

      {selectedDoc && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Detalles del Documento</h3>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Imprimir
              </button>
              {selectedDoc.fileName && (
                <a 
                  href="#" 
                  className="text-blue-500 hover:text-blue-700 text-sm"
                  download={selectedDoc.fileName}
                >
                  Descargar PDF
                </a>
              )}
            </div>
          </div>
          
          <div className="mb-2">
            <span className="font-medium">Nombre:</span> {selectedDoc.name}
          </div>
          <div className="mb-2">
            <span className="font-medium">Fecha:</span> {selectedDoc.date}
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">Códigos:</span>
              {!editingCodes ? (
                <button
                  onClick={handleEditCodes}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Editar
                </button>
              ) : (
                <button
                  onClick={handleSaveCodes}
                  className="text-green-500 hover:text-green-700 text-sm"
                >
                  Guardar
                </button>
              )}
            </div>
            
            {editingCodes ? (
              <textarea
                value={tempCodes}
                onChange={(e) => setTempCodes(e.target.value)}
                className="w-full p-2 border rounded h-40"
              />
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedDoc.codes.map((code) => (
                  <span key={code} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {code}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;

// DONE