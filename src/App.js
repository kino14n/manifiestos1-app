import React from 'react';
import Tabs from './components/Tabs';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">DocuTrack</h1>
        <Tabs />
      </div>
    </div>
  );
};

export default App;

// DONE