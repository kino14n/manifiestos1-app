// Primero definimos getDocuments al inicio del archivo
const getDocuments = () => {
  const stored = localStorage.getItem('documents');
  return stored ? JSON.parse(stored) : [];
};

// Luego el resto de funciones que dependen de getDocuments
export const saveDocument = (document) => {
  const documents = getDocuments();
  const existingIndex = documents.findIndex(doc => doc.id === document.id);
  
  if (existingIndex >= 0) {
    documents[existingIndex] = document;
  } else {
    documents.push(document);
  }
  
  localStorage.setItem('documents', JSON.stringify(documents));
};

export const updateDocumentCodes = (id, newCodes) => {
  const documents = getDocuments();
  const docIndex = documents.findIndex(doc => doc.id === id);
  
  if (docIndex >= 0) {
    documents[docIndex].codes = newCodes;
    localStorage.setItem('documents', JSON.stringify(documents));
    return true;
  }
  
  return false;
};

export const searchDocumentsByCodes = (codes) => {
  const documents = getDocuments();
  const missingCodes = new Set(codes);
  const results = [];
  
  const allCodesInSystem = new Set();
  documents.forEach(doc => {
    doc.codes.forEach(code => allCodesInSystem.add(code));
  });

  const trulyMissingCodes = codes.filter(code => !allCodesInSystem.has(code));
  
  const sortedDocs = [...documents].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const selectedDocs = [];
  const coveredCodes = new Set();
  
  const countNewCodes = (doc) => {
    return doc.codes.filter(code => 
      codes.includes(code) && !coveredCodes.has(code)
    ).length;
  };
  
  while (coveredCodes.size < (codes.length - trulyMissingCodes.length)) {
    let bestDoc = null;
    let maxNewCodes = 0;
    
    for (const doc of sortedDocs) {
      if (selectedDocs.some(d => d.id === doc.id)) continue;
      
      const newCodesCount = countNewCodes(doc);
      if (newCodesCount > maxNewCodes) {
        maxNewCodes = newCodesCount;
        bestDoc = doc;
      }
    }
    
    if (!bestDoc) break;
    
    const matchedCodes = bestDoc.codes.filter(code => 
      codes.includes(code) && !coveredCodes.has(code)
    );
    
    selectedDocs.push({
      ...bestDoc,
      matchedCodes
    });
    
    matchedCodes.forEach(code => coveredCodes.add(code));
  }
  
  return {
    documents: selectedDocs,
    missingCodes: trulyMissingCodes
  };
};

// Exportamos getDocuments al final
export { getDocuments };

// DONE