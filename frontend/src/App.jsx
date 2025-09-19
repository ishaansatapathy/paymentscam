import React, { useState } from 'react';
import SecurityForm from './components/SecurityForm';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          🛡 Payment Scam Detector
        </h1>

        <SecurityForm
          onResult={setResult}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {result && <ResultDisplay result={result} />}
      </div>
    </div>
  );
}

export default App;
