import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function InputForm({ onCalculation, onLoading }) {
  const [formData, setFormData] = useState({
    coilType: 2,
    airInletTemp: 7,
    airInletHumidity: 50,
    fluidType: 1,
    fluidInletTemp: 7,
    fluidOutletTemp: 12,
    rows: 2,
    finPitch: 3.0,
    tubes: 10,
    circuits: 2,
    coilLength: 500,
    coilHeight: 250,
    tubeMaterial: 0,
    finMaterial: 1,
    frameMaterial: 'FeZn',
    frameThickness: '2.0mm',
    calculationType: 1,
    volumeFlow: 1000,
    maxPressureDrop: 10
  });

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coilTypes, setCoilTypes] = useState({});
  const [materials, setMaterials] = useState({});

  // Load available options on component mount
  React.useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [typesRes, materialsRes] = await Promise.all([
        axios.get(`${API_URL}/api/coil-types`),
        axios.get(`${API_URL}/api/materials`)
      ]);
      setCoilTypes(typesRes.data);
      setMaterials(materialsRes.data);
    } catch (error) {
      console.error('Failed to load options:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    onLoading?.(true);

    try {
      // Validate inputs
      const validationRes = await axios.post(`${API_URL}/api/validate`, {
        inputs: buildInputArray()
      });

      if (!validationRes.data.valid) {
        setErrors(validationRes.data.errors);
        setLoading(false);
        onLoading?.(false);
        return;
      }

      // Perform calculation
      const calcRes = await axios.post(`${API_URL}/api/calculate`, {
        inputs: buildInputArray(),
        calculationMode: 'standard'
      });

      if (calcRes.data.success) {
        onCalculation?.(calcRes.data.calculation);
      } else {
        setErrors([calcRes.data.error || 'Calculation failed']);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error performing calculation';
      setErrors([errorMsg]);
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  };

  const buildInputArray = () => {
    // Initialize 100-element array with zeros
    const inputs = new Array(100).fill(0);

    // Set values according to DLL documentation
    inputs[0] = formData.coilType; // Coil type
    inputs[1] = formData.airInletTemp; // Air inlet temperature
    inputs[2] = formData.airInletHumidity; // Air inlet humidity
    inputs[5] = formData.volumeFlow; // Air volume Sm3/h
    inputs[14] = formData.rows; // Number of rows
    inputs[26] = formData.fluidInletTemp; // Fluid inlet temperature
    inputs[27] = formData.fluidOutletTemp; // Fluid outlet temperature
    inputs[29] = formData.maxPressureDrop; // Max liquid pressure drop
    inputs[31] = formData.tubes; // Number of tubes
    inputs[32] = formData.circuits; // Number of circuits
    inputs[35] = formData.finPitch; // Fin pitch
    inputs[36] = formData.coilLength; // Coil length
    inputs[37] = formData.coilHeight; // Coil height
    inputs[45] = formData.fluidType; // Fluid type
    inputs[59] = formData.calculationType; // Calculation type

    return inputs;
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#f8f9fa',
      padding: '2rem',
      borderRadius: '8px',
      marginBottom: '2rem'
    }}>
      <h2 style={{ marginTop: 0 }}>Input Parameters</h2>

      {errors.length > 0 && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #f88',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1rem',
          color: '#c00'
        }}>
          <strong>Errors:</strong>
          <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Basic Parameters */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginTop: 0, borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Coil Configuration
          </h3>
        </div>

        <div>
          <label htmlFor="coilType">Coil Type:</label>
          <select
            id="coilType"
            name="coilType"
            value={formData.coilType}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value={1}>P60</option>
            <option value={2}>P3012</option>
            <option value={94}>P40</option>
            <option value={113}>P25</option>
          </select>
        </div>

        <div>
          <label htmlFor="rows">Number of Rows:</label>
          <input
            type="number"
            id="rows"
            name="rows"
            min="1"
            max="25"
            value={formData.rows}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="tubes">Number of Tubes:</label>
          <input
            type="number"
            id="tubes"
            name="tubes"
            min="1"
            value={formData.tubes}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="circuits">Number of Circuits:</label>
          <input
            type="number"
            id="circuits"
            name="circuits"
            min="1"
            max="6"
            value={formData.circuits}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="finPitch">Fin Pitch (mm):</label>
          <input
            type="number"
            id="finPitch"
            name="finPitch"
            min="2.0"
            max="12.0"
            step="0.1"
            value={formData.finPitch}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="coilLength">Coil Length (mm):</label>
          <input
            type="number"
            id="coilLength"
            name="coilLength"
            min="100"
            value={formData.coilLength}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="coilHeight">Coil Height (mm):</label>
          <input
            type="number"
            id="coilHeight"
            name="coilHeight"
            min="50"
            value={formData.coilHeight}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        {/* Air Side Parameters */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginTop: '2rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Air Side
          </h3>
        </div>

        <div>
          <label htmlFor="airInletTemp">Air Inlet Temperature (°C):</label>
          <input
            type="number"
            id="airInletTemp"
            name="airInletTemp"
            step="0.1"
            value={formData.airInletTemp}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="airInletHumidity">Air Inlet Humidity (%):</label>
          <input
            type="number"
            id="airInletHumidity"
            name="airInletHumidity"
            min="0"
            max="100"
            step="0.1"
            value={formData.airInletHumidity}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="volumeFlow">Air Volume Flow (Sm³/h):</label>
          <input
            type="number"
            id="volumeFlow"
            name="volumeFlow"
            min="0"
            value={formData.volumeFlow}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        {/* Fluid Side Parameters */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginTop: '2rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Fluid Side
          </h3>
        </div>

        <div>
          <label htmlFor="fluidType">Fluid Type:</label>
          <select
            id="fluidType"
            name="fluidType"
            value={formData.fluidType}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value={1}>Water</option>
            <option value={12}>R407c</option>
            <option value={13}>R404a</option>
            <option value={16}>R410a</option>
          </select>
        </div>

        <div>
          <label htmlFor="fluidInletTemp">Fluid Inlet Temperature (°C):</label>
          <input
            type="number"
            id="fluidInletTemp"
            name="fluidInletTemp"
            step="0.1"
            value={formData.fluidInletTemp}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="fluidOutletTemp">Fluid Outlet Temperature (°C):</label>
          <input
            type="number"
            id="fluidOutletTemp"
            name="fluidOutletTemp"
            step="0.1"
            value={formData.fluidOutletTemp}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="maxPressureDrop">Max Pressure Drop (kPa):</label>
          <input
            type="number"
            id="maxPressureDrop"
            name="maxPressureDrop"
            min="0"
            step="0.1"
            value={formData.maxPressureDrop}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        {/* Material Selection */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginTop: '2rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Materials
          </h3>
        </div>

        <div>
          <label htmlFor="tubeMaterial">Tube Material:</label>
          <select
            id="tubeMaterial"
            name="tubeMaterial"
            value={formData.tubeMaterial}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value={0}>Cu</option>
            <option value={1}>CuSn</option>
            <option value={2}>Inox304</option>
            <option value={3}>Inox316</option>
            <option value={4}>Fe</option>
            <option value={5}>CuNi9010</option>
          </select>
        </div>

        <div>
          <label htmlFor="finMaterial">Fin Material:</label>
          <select
            id="finMaterial"
            name="finMaterial"
            value={formData.finMaterial}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value={1}>AL</option>
            <option value={2}>ALPR</option>
            <option value={3}>CU</option>
            <option value={4}>CUSN</option>
            <option value={9}>ALMG2.5</option>
          </select>
        </div>

        {/* Calculation Type */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginTop: '2rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Calculation Settings
          </h3>
        </div>

        <div>
          <label htmlFor="calculationType">Calculation Type:</label>
          <select
            id="calculationType"
            name="calculationType"
            value={formData.calculationType}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value={1}>Monophase</option>
            <option value={2}>Direct Expansion</option>
            <option value={3}>Condenser</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: '2rem',
          gridColumn: '1 / -1',
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          backgroundColor: loading ? '#bbb' : '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
    </form>
  );
}
      setMaterials(materialsRes.data);
    } catch (error) {
      console.error('Failed to load options:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    onLoading?.(true);

    try {
      // Validate inputs
      const validationRes = await axios.post(`${API_URL}/api/validate`, {
        inputs: buildInputArray()
      });

      if (!validationRes.data.valid) {
        setErrors(validationRes.data.errors);
        setLoading(false);
        onLoading?.(false);
        return;
      }

      // Perform calculation
      const calcRes = await axios.post(`${API_URL}/api/calculate`, {
        inputs: buildInputArray(),
        calculationMode: 'standard'
      });

      if (calcRes.data.success) {
        onCalculation?.(calcRes.data.calculation);
      } else {
        setErrors([calcRes.data.error || 'Calculation failed']);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Error performing calculation';
      setErrors([errorMsg]);
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  };

  const buildInputArray = () => {
    // Initialize 100-element array with zeros
    const inputs = new Array(100).fill(0);

    // Set values according to DLL documentation
    inputs[0] = formData.coilType; // Coil type
    inputs[1] = formData.airInletTemp; // Air inlet temperature
    inputs[2] = formData.airInletHumidity; // Air inlet humidity
    inputs[5] = formData.volumeFlow; // Air volume Sm3/h
    inputs[14] = formData.rows; // Number of rows
    inputs[26] = formData.fluidInletTemp; // Fluid inlet temperature
    inputs[27] = formData.fluidOutletTemp; // Fluid outlet temperature
    inputs[29] = formData.maxPressureDrop; // Max liquid pressure drop
    inputs[31] = formData.tubes; // Number of tubes
    inputs[32] = formData.circuits; // Number of circuits
    inputs[35] = formData.finPitch; // Fin pitch
    inputs[36] = formData.coilLength; // Coil length
    inputs[37] = formData.coilHeight; // Coil height
    inputs[45] = formData.fluidType; // Fluid type
    inputs[59] = formData.calculationType; // Calculation type

    return inputs;
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#f8f9fa',
      padding: '2rem',
      borderRadius: '8px',
      marginBottom: '2rem'
    }}>
      <h2 style={{ marginTop: 0 }}>Input Parameters</h2>

      {errors.length > 0 && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #f88',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1rem',
          color: '#c00'
        }}>
          <strong>Errors:</strong>
          <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Basic Parameters */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginTop: 0, borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Coil Configuration
          </h3>
        </div>

        <div>
          <label htmlFor="coilType">Coil Type:</label>
          <select
            id="coilType"
            name="coilType"
            value={formData.coilType}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value={1}>P60</option>
            <option value={2}>P3012</option>
            <option value={94}>P40</option>
            <option value={113}>P25</option>
          </select>
        </div>

        <div>
          <label htmlFor="rows">Number of Rows:</label>
          <input
            type="number"
            id="rows"
            name="rows"
            min="1"
            max="25"
            value={formData.rows}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="tubes">Number of Tubes:</label>
          <input
            type="number"
            id="tubes"
            name="tubes"
            min="1"
            value={formData.tubes}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="circuits">Number of Circuits:</label>
          <input
            type="number"
            id="circuits"
            name="circuits"
            min="1"
            max="6"
            value={formData.circuits}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="finPitch">Fin Pitch (mm):</label>
          <input
            type="number"
            id="finPitch"
            name="finPitch"
            min="2.0"
            max="12.0"
            step="0.1"
            value={formData.finPitch}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="coilLength">Coil Length (mm):</label>
          <input
            type="number"
            id="coilLength"
            name="coilLength"
            min="100"
            value={formData.coilLength}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="coilHeight">Coil Height (mm):</label>
          <input
            type="number"
            id="coilHeight"
            name="coilHeight"
            min="50"
            value={formData.coilHeight}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        {/* Air Side Parameters */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginTop: '2rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Air Side
          </h3>
        </div>

        <div>
          <label htmlFor="airInletTemp">Air Inlet Temperature (°C):</label>
          <input
            type="number"
            id="airInletTemp"
            name="airInletTemp"
            step="0.1"
            value={formData.airInletTemp}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="airInletHumidity">Air Inlet Humidity (%):</label>
          <input
            type="number"
            id="airInletHumidity"
            name="airInletHumidity"
            min="0"
            max="100"
            step="0.1"
            value={formData.airInletHumidity}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="volumeFlow">Air Volume Flow (Sm³/h):</label>
          <input
            type="number"
            id="volumeFlow"
            name="volumeFlow"
            min="0"
            value={formData.volumeFlow}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        {/* Fluid Side Parameters */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginTop: '2rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Fluid Side
          </h3>
        </div>

        <div>
          <label htmlFor="fluidType">Fluid Type:</label>
          <select
            id="fluidType"
            name="fluidType"
            value={formData.fluidType}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value={1}>Water</option>
            <option value={12}>R407c</option>
            <option value={13}>R404a</option>
            <option value={16}>R410a</option>
          </select>
        </div>

        <div>
          <label htmlFor="fluidInletTemp">Fluid Inlet Temperature (°C):</label>
          <input
            type="number"
            id="fluidInletTemp"
            name="fluidInletTemp"
            step="0.1"
            value={formData.fluidInletTemp}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="fluidOutletTemp">Fluid Outlet Temperature (°C):</label>
          <input
            type="number"
            id="fluidOutletTemp"
            name="fluidOutletTemp"
            step="0.1"
            value={formData.fluidOutletTemp}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="maxPressureDrop">Max Pressure Drop (kPa):</label>
          <input
            type="number"
            id="maxPressureDrop"
            name="maxPressureDrop"
            min="0"
            step="0.1"
            value={formData.maxPressureDrop}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        {/* Material Selection */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginTop: '2rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Materials
          </h3>
        </div>

        <div>
          <label htmlFor="tubeMaterial">Tube Material:</label>
          <select
            id="tubeMaterial"
            name="tubeMaterial"
            value={formData.tubeMaterial}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value={0}>Cu</option>
            <option value={1}>CuSn</option>
            <option value={2}>Inox304</option>
            <option value={3}>Inox316</option>
            <option value={4}>Fe</option>
            <option value={5}>CuNi9010</option>
          </select>
        </div>

        <div>
          <label htmlFor="finMaterial">Fin Material:</label>
          <select
            id="finMaterial"
            name="finMaterial"
            value={formData.finMaterial}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value={1}>AL</option>
            <option value={2}>ALPR</option>
            <option value={3}>CU</option>
            <option value={4}>CUSN</option>
            <option value={9}>ALMG2.5</option>
          </select>
        </div>

        {/* Calculation Type */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginTop: '2rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Calculation Settings
          </h3>
        </div>

        <div>
          <label htmlFor="calculationType">Calculation Type:</label>
          <select
            id="calculationType"
            name="calculationType"
            value={formData.calculationType}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value={1}>Monophase</option>
            <option value={2}>Direct Expansion</option>
            <option value={3}>Condenser</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: '2rem',
          gridColumn: '1 / -1',
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          backgroundColor: loading ? '#bbb' : '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
    </form>
  );
}
