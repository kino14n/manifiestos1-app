import React, { useState } from 'react';
import DocumentForm from './DocumentForm';
import SearchForm from './SearchForm';
import DocumentList from './DocumentList';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('search')}
          className={`py-2 px-4 font-medium ${activeTab === 'search' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          Buscar Documentos
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`py-2 px-4 font-medium ${activeTab === 'upload' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          Subir Documento
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`py-2 px-4 font-medium ${activeTab === 'list' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          Consultar Documentos
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'search' && <SearchForm />}
        {activeTab === 'upload' && <DocumentForm />}
        {activeTab === 'list' && <DocumentList />}
      </div>
    </div>
  );
};

export default Tabs;