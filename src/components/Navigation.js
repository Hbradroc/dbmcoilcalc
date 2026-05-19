import React from 'react';

export default function Navigation() {
  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>DBM GEO.COIL Calculator</h1>
          <p style={{ margin: '0', fontSize: '0.9rem', opacity: 0.9 }}>Coil Performance Calculation Suite</p>
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          v1.0.0
        </div>
      </div>
    </nav>
  );
}
