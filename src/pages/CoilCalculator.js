import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import InputForm from '../components/InputForm';
import ResultsDisplay from '../components/ResultsDisplay';

export default function CoilCalculator() {
  const [calculation, setCalculation] = useState(null);

  return (
    <div>
      <Navigation />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 2rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <InputForm 
              onCalculation={setCalculation}
            />
          </div>
          <div>
            <ResultsDisplay calculation={calculation} />
          </div>
        </div>
      </div>
    </div>
  );
}
