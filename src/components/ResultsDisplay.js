import React, { useState } from 'react';

export default function ResultsDisplay({ calculation }) {
  const [expandedSections, setExpandedSections] = useState({
    capacity: true,
    airSide: true,
    fluidSide: true,
    performance: true
  });

  if (!calculation || !calculation.parsed) {
    return (
      <div style={{
        backgroundColor: '#ecf0f1',
        padding: '2rem',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#7f8c8d'
      }}>
        <p>Run a calculation to see results here</p>
      </div>
    );
  }

  const { parsed } = calculation;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const ResultSection = ({ title, section, data }) => (
    <div style={{ marginBottom: '1.5rem', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
      <div
        onClick={() => toggleSection(section)}
        style={{
          backgroundColor: '#34495e',
          color: 'white',
          padding: '1rem',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span style={{ fontSize: '1.2rem' }}>
          {expandedSections[section] ? '▼' : '▶'}
        </span>
      </div>

      {expandedSections[section] && (
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {Object.entries(data).map(([key, value]) => (
              <div key={key} style={{
                backgroundColor: 'white',
                padding: '0.75rem',
                borderRadius: '4px',
                borderLeft: '3px solid #3498db'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#7f8c8d', textTransform: 'uppercase' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  marginTop: '0.25rem'
                }}>
                  {typeof value === 'number' ? value.toFixed(2) : value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Calculation Results</h2>

      {/* Status */}
      <div style={{
        backgroundColor: '#d5f4e6',
        border: '1px solid #27ae60',
        borderRadius: '4px',
        padding: '1rem',
        marginBottom: '1.5rem',
        color: '#27ae60'
      }}>
        <strong>✓ Calculation completed successfully</strong>
        <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Timestamp: {new Date(calculation.timestamp).toLocaleString()}
        </div>
      </div>

      {/* Error Code Check */}
      {parsed.additional.errorCode !== 0 && (
        <div style={{
          backgroundColor: '#fdeaea',
          border: '1px solid #e74c3c',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1.5rem',
          color: '#c0392b'
        }}>
          <strong>⚠ Warning Code: {parsed.additional.errorCode}</strong>
          <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Check documentation for this warning code
          </div>
        </div>
      )}

      {/* Capacity */}
      <ResultSection
        title="Coil Capacity"
        section="capacity"
        data={{
          'kW': parsed.capacity.kW,
          'kcal/h': parsed.capacity.kcalh,
          'Capacity Reserve %': parsed.pressureDrops.capacityReservePercent
        }}
      />

      {/* Air Side */}
      <ResultSection
        title="Air Side Performance"
        section="airSide"
        data={{
          'Outlet Temperature (°C)': parsed.airOutlet.temperature,
          'Outlet Humidity (%)': parsed.airOutlet.relativeHumidity,
          'Absolute Humidity (g/kg)': parsed.airOutlet.absoluteHumidity,
          'Pressure Drop (Pa)': parsed.pressureDrops.airSidePa,
          'Gas Velocity (m/s)': parsed.dimensions.gasVelocityMs
        }}
      />

      {/* Fluid Side */}
      <ResultSection
        title="Fluid Side Performance"
        section="fluidSide"
        data={{
          'Outlet Temperature (°C)': parsed.fluidOutlet.temperature,
          'Volume Flow (dm³/h)': parsed.fluidOutlet.volumeDm3h,
          'Mass Flow (kg/h)': parsed.fluidOutlet.weightKgh,
          'Pressure Drop (kPa)': parsed.pressureDrops.fluidSideKpa,
          'Velocity (m/s)': parsed.fluidProperties.velocityMs
        }}
      />

      {/* Coil Design */}
      <ResultSection
        title="Coil Design"
        section="performance"
        data={{
          'Overall Height (mm)': parsed.design.overallHeightMm,
          'Overall Length (mm)': parsed.design.overallLengthMm,
          'Finned Length (mm)': parsed.design.finnedLengthMm,
          'Fin Pitch (mm)': parsed.design.finPitchMm,
          'Tube Thickness (mm)': parsed.design.tubeThicknessMm,
          'Number of Tubes': parsed.design.tubesNumber,
          'Number of Rows': parsed.additional.numberOfRows,
          'Number of Circuits': parsed.additional.numberOfCircuits,
          'Total Surface Area (m²)': parsed.refrigerantProperties.totalExchangeSurfaceM2,
          'Coil Weight (kg)': parsed.additional.coilWeightKg
        }}
      />

      {/* Raw Output Data */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }}>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#2c3e50' }}>
            Raw Output Data (100 parameters)
          </summary>
          <pre style={{
            marginTop: '1rem',
            backgroundColor: '#fff',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '0.85rem',
            maxHeight: '300px'
          }}>
            {JSON.stringify(calculation.outputs, null, 2)}
          </pre>
        </details>
      </div>

      {/* Export Button */}
      <button
        onClick={() => {
          const dataStr = JSON.stringify(calculation, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `coil-calculation-${new Date().toISOString().split('T')[0]}.json`;
          link.click();
        }}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }}
      >
        Export Results as JSON
      </button>
    </div>
  );
}
