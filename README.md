# DBM GEO.COIL Calculator Web Application

A comprehensive web application for performing HVAC coil calculations using the DBM GEO.COIL DLL. This application supports calculations for heating, cooling, direct expansion, and condensing coils.

## Features

- **Coil Type Selection**: Support for all DBM coil types (P60, P40, P3012, P25)
- **Calculation Types**: Monophase, Direct Expansion, and Condenser coils
- **Material Selection**: Multiple tube and fin materials with custom properties
- **Real-time Validation**: Input validation with helpful error messages
- **Results Display**: Comprehensive output including capacity, pressure drops, and performance data
- **Calculation Modes**: Standard, Reduced, and Certified tolerance modes
- **Export Results**: Save calculations in multiple formats

## Project Structure

```
.
├── backend/
│   ├── server.js              # Express.js server
│   ├── dll-wrapper.js         # DLL interface wrapper
│   ├── routes/
│   │   └── calculations.js    # Calculation API endpoints
│   └── utils/
│       └── validators.js      # Input validation utilities
├── src/
│   ├── App.js                 # Main React component
│   ├── index.js               # React entry point
│   ├── components/
│   │   ├── InputForm.js       # Input form component
│   │   ├── ResultsDisplay.js  # Results display component
│   │   └── Navigation.js      # Navigation component
│   ├── pages/
│   │   ├── CoilCalculator.js  # Main calculator page
│   │   ├── Documentation.js   # Documentation page
│   │   └── Settings.js        # Settings page
│   └── styles/
│       └── App.css            # Application styles
├── public/
│   └── index.html             # HTML template
└── package.json               # Project dependencies
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Windows OS (for DLL interface)
- Visual C++ 2017 Runtime (for DLL dependencies)

### Setup

1. Clone or download the project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory:
   ```
   REACT_APP_API_URL=http://localhost:5000
   PORT=5000
   DLL_PATH=path/to/calcdll.dll
   ```

5. Ensure DLL files are in the backend directory or specify the path

## Usage

### Development Mode

```bash
npm run dev
```

This will start both the React development server and Express backend simultaneously.

### Production Build

```bash
npm run build
npm start
```

## Calculation Inputs

### Basic Parameters
- **Coil Type**: P60, P40, P3012, P25
- **Calculation Type**: 1 (Monophase), 2 (Direct Expansion), 3 (Condenser)
- **Air Inlet Temperature**: °C
- **Air Inlet Humidity**: % RH or g/kg
- **Air Volume**: Standard/Normal/Actual conditions

### Coil Geometry
- **Number of Rows**: 1-25
- **Number of Tubes**: per row configuration
- **Fin Pitch**: 2.0 to 12.0 mm (auto-selection available)
- **Coil Length/Width**: mm
- **Coil Height**: mm
- **Number of Circuits**: 1-6 (auto-selection available)

### Fluid Properties
- **Fluid Type**: Water, Glycol mixtures, Refrigerants (R410a, R407c, etc.)
- **Inlet Temperature**: °C
- **Outlet Temperature**: °C
- **Volume Flow Rate**: dm³/h or dm³/s
- **Max Allowed Pressure Drop**: kPa

### Material Properties
- **Tube Material**: Cu, CuSn, Inox304, Inox316, Fe, CuNi9010
- **Tube Thickness**: mm (varies by type)
- **Fin Material**: Al, Cu, CuSn, AlPr, AlMg2.5
- **Fin Thickness**: mm
- **Frame Material**: Various steel and aluminum options

## Calculation Results

### Performance Data
- **Capacity**: kW and kcal/h
- **Air Outlet Temperature**: °C
- **Humidity**: Outlet RH and absolute humidity
- **Capacity Reserve**: %

### Pressure Drops
- **Air Side**: Pa (dry and wet conditions)
- **Fluid Side**: kPa
- **Pressure Drop Ratio**: for direct expansion coils

### Physical Properties
- **Coil Dimensions**: Height, Depth, Width, Length
- **Coil Weight**: kg
- **Number of Circuits**: Actual configuration
- **Fin Pitch**: Selected mm
- **Tube Thickness**: Selected mm

### For Direct Expansion Coils
- **Subcooling**: °C
- **Superheating**: °C
- **Vapor Fraction**: %
- **Capillars Pressure Drop**: Bar
- **Distributor Details**: Type and dimensions

## Error Codes

The application provides detailed error codes and messages following DBM DLL documentation:

- **10xxx series**: Input validation errors
- **11xxx series**: Configuration and material errors
- **20xx-70xx series**: Calculation engine errors
- **41xxx series**: Warning codes (non-critical issues)

## API Endpoints

### POST /api/calculate
Performs a coil calculation based on input parameters

**Request Body**: Array of 100 input parameters as defined in DLL documentation

**Response**: Array of 100 result parameters

Example:
```json
{
  "inputs": [1, 32, 50, 0, 0, 2000, ...],
  "calculationMode": "standard"
}
```

### GET /api/materials
Returns available materials for tubes and fins

### GET /api/coil-types
Returns available coil geometry types

### POST /api/validate
Validates input parameters before calculation

## Tolerances

The application supports three tolerance modes:

1. **Standard Tolerance** (Default)
   - Capacity: ±15%
   - Air Pressure Drop: ±15% or ±10 Pa
   - Water Pressure Drop: ±15% or ±5 kPa

2. **Reduced Tolerance**
   - Capacity: ±10%
   - Air Pressure Drop: ±10% or ±10 Pa
   - Water Pressure Drop: ±10% or ±5 kPa

3. **Certified Performance**
   - Capacity: ±5%
   - Air Pressure Drop: ±5% or ±10 Pa
   - Water Pressure Drop: ±5% or ±5 kPa

## Important Notes

- **Data Validation**: Minimal validation is performed by the DLL. Ensure input consistency before calculation.
- **Temperature Limits**: Working temperatures should respect PED classification limits
- **Material Compatibility**: Some materials are not available for all geometries
- **Steam Coils**: Require specific configuration (P40 or P60 only, Inox tubes recommended)
- **Direct Expansion**: Must be selected considering application parameters (e.g., capillars pressure drop)

## Troubleshooting

### DLL Not Found
- Verify DLL path in `.env` file
- Ensure all DLL dependencies are in the same directory
- Check Visual C++ 2017 Runtime is installed

### Calculation Errors
- Check input parameters against validation rules
- Verify temperature differences are at least 3°C
- Ensure fluid outlet temperature is specified

### Port Already in Use
Change the PORT in `.env` file or kill the process using port 5000

## License

This application uses the DBM GEO.COIL DLL. Refer to the DLL documentation for licensing terms and restrictions.

## Support

For issues related to calculations or DLL functionality, refer to the DBM GEO.COIL DLL documentation (version 2.1.4.19 or later).

## Documentation References

- [DBM GEO.COIL DLL Documentation](Documentation in `/docs` folder)
- [VB-VBA Usage Examples](Backend API follows same parameter structure)
- [C++ Implementation Notes](Node.js FFI wrapper implements C++ interface)
