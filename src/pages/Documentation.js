import React from 'react';

export default function Documentation() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>Documentation & Reference</h1>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>Supported Coil Types</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Coil Type</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Description</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd', fontWeight: 'bold' }}>P60</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Large capacity coil</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd', color: '#e74c3c' }}>Deprecated</td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd', fontWeight: 'bold' }}>P3012</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Standard compact coil</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd', color: '#27ae60' }}>Active</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd', fontWeight: 'bold' }}>P40</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>High-performance coil</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd', color: '#27ae60' }}>Active</td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd', fontWeight: 'bold' }}>P25</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Compact microchannel</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd', color: '#27ae60' }}>Active</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Supported Fluids</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ backgroundColor: '#ecf0f1', padding: '1rem', borderRadius: '4px' }}>
            <strong>Heating/Cooling</strong>
            <ul style={{ marginBottom: 0 }}>
              <li>Water</li>
              <li>ESSOTHERM500</li>
              <li>Therminol66</li>
              <li>Sea Water</li>
            </ul>
          </div>
          <div style={{ backgroundColor: '#ecf0f1', padding: '1rem', borderRadius: '4px' }}>
            <strong>Refrigerants</strong>
            <ul style={{ marginBottom: 0 }}>
              <li>R134a</li>
              <li>R22</li>
              <li>R407c</li>
              <li>R404a</li>
              <li>R410a</li>
              <li>R407F</li>
              <li>R32</li>
              <li>R1234ze</li>
              <li>R454b</li>
              <li>R449A</li>
              <li>R448A</li>
              <li>R515b</li>
              <li>R123yf</li>
            </ul>
          </div>
          <div style={{ backgroundColor: '#ecf0f1', padding: '1rem', borderRadius: '4px' }}>
            <strong>Special</strong>
            <ul style={{ marginBottom: 0 }}>
              <li>Steam</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Material Options</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <h3>Tube Materials</h3>
            <ul>
              <li><strong>Cu</strong> - Copper (standard)</li>
              <li><strong>CuSn</strong> - Copper-Tin (enhanced durability)</li>
              <li><strong>Inox304</strong> - Stainless Steel 304</li>
              <li><strong>Inox316</strong> - Stainless Steel 316 (marine grade)</li>
              <li><strong>Fe</strong> - Iron</li>
              <li><strong>CuNi9010</strong> - Copper-Nickel alloy</li>
            </ul>
          </div>
          <div>
            <h3>Fin Materials</h3>
            <ul>
              <li><strong>AL</strong> - Aluminum (standard)</li>
              <li><strong>ALPR</strong> - Aluminum-Prefinished</li>
              <li><strong>CU</strong> - Copper</li>
              <li><strong>CUSN</strong> - Copper-Tin</li>
              <li><strong>ALMG2.5</strong> - Aluminum-Magnesium alloy</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Calculation Modes</h2>
        <div style={{
          backgroundColor: '#e8f8f5',
          border: '1px solid #27ae60',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h3 style={{ marginTop: 0 }}>Standard Tolerance</h3>
          <p>Default calculation mode with standard accuracy requirements</p>
          <ul>
            <li>Capacity tolerance: ±15%</li>
            <li>Air pressure drop: ±15% or ±10 Pa</li>
            <li>Fluid pressure drop: ±15% or ±5 kPa</li>
          </ul>
        </div>
        <div style={{
          backgroundColor: '#e3f2fd',
          border: '1px solid #3498db',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h3 style={{ marginTop: 0 }}>Reduced Tolerance</h3>
          <p>Enhanced accuracy for critical applications</p>
          <ul>
            <li>Capacity tolerance: ±10%</li>
            <li>Air pressure drop: ±10% or ±10 Pa</li>
            <li>Fluid pressure drop: ±10% or ±5 kPa</li>
          </ul>
        </div>
        <div style={{
          backgroundColor: '#fce8e6',
          border: '1px solid #e74c3c',
          borderRadius: '4px',
          padding: '1rem'
        }}>
          <h3 style={{ marginTop: 0 }}>Certified Performance</h3>
          <p>High-precision calculation with DBM certification</p>
          <ul>
            <li>Capacity tolerance: ±5%</li>
            <li>Air pressure drop: ±5% or ±10 Pa</li>
            <li>Fluid pressure drop: ±5% or ±5 kPa</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Input Parameters Overview</h2>
        <p>The calculator requires 100 input parameters organized as follows:</p>
        <ul>
          <li><strong>Positions 0-12:</strong> Coil type and air-side parameters</li>
          <li><strong>Positions 13-43:</strong> Coil geometry specifications</li>
          <li><strong>Positions 44-58:</strong> Fluid properties and flow conditions</li>
          <li><strong>Positions 59-99:</strong> Material properties and special parameters</li>
        </ul>
      </section>

      <section>
        <h2>Output Parameters</h2>
        <p>The calculator returns 100 output parameters including:</p>
        <ul>
          <li><strong>Positions 0-1:</strong> Coil capacity (kW, kcal/h)</li>
          <li><strong>Positions 2-12:</strong> Performance data (temperatures, humidity, pressure drops)</li>
          <li><strong>Positions 13-29:</strong> Coil dimensions and physical properties</li>
          <li><strong>Positions 30-51:</strong> Component-specific data (DX, refrigerant)</li>
          <li><strong>Positions 52-99:</strong> Design details and material specifications</li>
        </ul>
      </section>
    </div>
  );
}
