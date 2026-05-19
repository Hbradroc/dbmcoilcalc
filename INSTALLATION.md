<<<<<<< HEAD
# DBM GEO.COIL Calculator - Installation & Setup Guide

## Quick Start

### 1. Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Windows OS** (required for DLL interface)
- **Visual C++ 2017 Runtime** (for DLL dependencies)

### 2. Installation

```bash
# Navigate to project directory
cd "path/to/Coil Web App"

# Install dependencies
npm install
```

### 3. Configuration

Copy `.env.example` to `.env` and update with your system paths:

```bash
# Create .env file
copy .env.example .env
```

Edit `.env`:
```
PORT=5000
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000
DLL_PATH=C:\path\to\calcdll.dll
PRICE_FILE_PATH=C:\path\to\przinfo.dlt
```

### 4. Running the Application

#### Development Mode (Concurrent)
```bash
npm run dev
```
This starts both the React development server (port 3000) and Express backend (port 5000) simultaneously.

#### Backend Only
```bash
npm run server
```

#### Frontend Only
```bash
npm run client
```

#### Production Build
```bash
npm run build
npm start
```

## DLL Setup

### Location and Dependencies
The DLL file (`calcdll.dll`) and its dependencies must be:
1. In the same directory, OR
2. Specified in the `DLL_PATH` environment variable

### Dependencies
Ensure these files are available alongside the DLL:
- `msvcr120.dll` (Visual C++ 2012 Runtime)
- `vcruntime140.dll` (Visual C++ 2015 Runtime)
- Any other DBM DLL dependencies

### Installation of Visual C++ Runtime
Download and install from Microsoft:
- [Visual C++ 2017 Runtime](https://support.microsoft.com/en-us/help/2977003)

## Troubleshooting

### Issue: "DLL not found"
**Solution:**
1. Verify `DLL_PATH` in `.env` file
2. Check that the DLL file exists at that path
3. Ensure all DLL dependencies are in the same directory
4. Run `npm install` again to rebuild ffi-napi

### Issue: "Port 5000 already in use"
**Solution:**
Change the `PORT` value in `.env`:
```
PORT=5001
```

Or kill the process:
```bash
# Windows - Command Prompt
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "React development server won't start"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm package-lock.json
npm install

# Try again
npm run client
```

### Issue: CORS errors in browser console
**Solution:**
Make sure `REACT_APP_API_URL` in `.env` matches your backend port:
```
REACT_APP_API_URL=http://localhost:5000
```

## API Endpoints Reference

### Calculate Coil Performance
**POST** `/api/calculate`
```json
{
  "inputs": [/* array of 100 parameters */],
  "calculationMode": "standard"
}
```

### Validate Input Parameters
**POST** `/api/validate`
```json
{
  "inputs": [/* array of 100 parameters */]
}
```

### Get Available Coil Types
**GET** `/api/coil-types`

### Get Materials
**GET** `/api/materials`

### Get Fin Pitches
**GET** `/api/fin-pitches/:coilType`

### Health Check
**GET** `/health`

## Development

### File Structure
```
backend/
├── server.js                 # Express.js server entry point
├── dll-wrapper.js           # DLL interface using FFI-napi
├── routes/
│   └── calculations.js      # API endpoints
└── utils/
    └── validators.js        # Input validation

src/
├── App.js                   # Main React component
├── index.js                 # React entry point
├── components/
│   ├── Navigation.js        # Header/navigation
│   ├── InputForm.js         # Parameter input form
│   └── ResultsDisplay.js    # Results visualization
├── pages/
│   ├── CoilCalculator.js    # Main calculator page
│   └── Documentation.js     # Documentation page
└── App.css                  # Global styles

public/
└── index.html               # HTML template
```

### Adding New Coil Types
Edit `backend/dll-wrapper.js` `getCoilTypeValue()` method and `backend/routes/calculations.js` coil-types endpoint.

### Adding New Fluids
Edit `backend/dll-wrapper.js` `getFluidTypeValue()` method and `backend/routes/calculations.js` coil-types endpoint.

## Building for Production

```bash
# Build React application
npm run build

# Output will be in 'build/' directory
```

Deploy the `build/` directory to a static hosting service or serve with Express.

## Performance Notes

- Calculations are performed synchronously by the DLL
- A calculation typically completes in 100-500ms
- The timeout is set to 30 seconds by default (adjustable in `.env`)
- For batch calculations, consider implementing queuing

## Testing

Basic health check:
```bash
curl http://localhost:5000/health
```

## Support

For issues related to:
- **DLL Integration:** Check the DBM GEO.COIL DLL documentation
- **Web Framework:** See [Express.js](https://expressjs.com/) and [React](https://reactjs.org/) documentation
- **FFI-napi:** See [FFI-napi GitHub](https://github.com/node-ffi-napi/node-ffi-napi)

## License

This application uses the DBM GEO.COIL DLL. Refer to the DLL documentation for licensing terms.
=======
# DBM GEO.COIL Calculator - Installation & Setup Guide

## Quick Start

### 1. Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Windows OS** (required for DLL interface)
- **Visual C++ 2017 Runtime** (for DLL dependencies)

### 2. Installation

```bash
# Navigate to project directory
cd "path/to/Coil Web App"

# Install dependencies
npm install
```

### 3. Configuration

Copy `.env.example` to `.env` and update with your system paths:

```bash
# Create .env file
copy .env.example .env
```

Edit `.env`:
```
PORT=5000
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000
DLL_PATH=C:\path\to\calcdll.dll
PRICE_FILE_PATH=C:\path\to\przinfo.dlt
```

### 4. Running the Application

#### Development Mode (Concurrent)
```bash
npm run dev
```
This starts both the React development server (port 3000) and Express backend (port 5000) simultaneously.

#### Backend Only
```bash
npm run server
```

#### Frontend Only
```bash
npm run client
```

#### Production Build
```bash
npm run build
npm start
```

## DLL Setup

### Location and Dependencies
The DLL file (`calcdll.dll`) and its dependencies must be:
1. In the same directory, OR
2. Specified in the `DLL_PATH` environment variable

### Dependencies
Ensure these files are available alongside the DLL:
- `msvcr120.dll` (Visual C++ 2012 Runtime)
- `vcruntime140.dll` (Visual C++ 2015 Runtime)
- Any other DBM DLL dependencies

### Installation of Visual C++ Runtime
Download and install from Microsoft:
- [Visual C++ 2017 Runtime](https://support.microsoft.com/en-us/help/2977003)

## Troubleshooting

### Issue: "DLL not found"
**Solution:**
1. Verify `DLL_PATH` in `.env` file
2. Check that the DLL file exists at that path
3. Ensure all DLL dependencies are in the same directory
4. Run `npm install` again to rebuild ffi-napi

### Issue: "Port 5000 already in use"
**Solution:**
Change the `PORT` value in `.env`:
```
PORT=5001
```

Or kill the process:
```bash
# Windows - Command Prompt
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "React development server won't start"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm package-lock.json
npm install

# Try again
npm run client
```

### Issue: CORS errors in browser console
**Solution:**
Make sure `REACT_APP_API_URL` in `.env` matches your backend port:
```
REACT_APP_API_URL=http://localhost:5000
```

## API Endpoints Reference

### Calculate Coil Performance
**POST** `/api/calculate`
```json
{
  "inputs": [/* array of 100 parameters */],
  "calculationMode": "standard"
}
```

### Validate Input Parameters
**POST** `/api/validate`
```json
{
  "inputs": [/* array of 100 parameters */]
}
```

### Get Available Coil Types
**GET** `/api/coil-types`

### Get Materials
**GET** `/api/materials`

### Get Fin Pitches
**GET** `/api/fin-pitches/:coilType`

### Health Check
**GET** `/health`

## Development

### File Structure
```
backend/
├── server.js                 # Express.js server entry point
├── dll-wrapper.js           # DLL interface using FFI-napi
├── routes/
│   └── calculations.js      # API endpoints
└── utils/
    └── validators.js        # Input validation

src/
├── App.js                   # Main React component
├── index.js                 # React entry point
├── components/
│   ├── Navigation.js        # Header/navigation
│   ├── InputForm.js         # Parameter input form
│   └── ResultsDisplay.js    # Results visualization
├── pages/
│   ├── CoilCalculator.js    # Main calculator page
│   └── Documentation.js     # Documentation page
└── App.css                  # Global styles

public/
└── index.html               # HTML template
```

### Adding New Coil Types
Edit `backend/dll-wrapper.js` `getCoilTypeValue()` method and `backend/routes/calculations.js` coil-types endpoint.

### Adding New Fluids
Edit `backend/dll-wrapper.js` `getFluidTypeValue()` method and `backend/routes/calculations.js` coil-types endpoint.

## Building for Production

```bash
# Build React application
npm run build

# Output will be in 'build/' directory
```

Deploy the `build/` directory to a static hosting service or serve with Express.

## Performance Notes

- Calculations are performed synchronously by the DLL
- A calculation typically completes in 100-500ms
- The timeout is set to 30 seconds by default (adjustable in `.env`)
- For batch calculations, consider implementing queuing

## Testing

Basic health check:
```bash
curl http://localhost:5000/health
```

## Support

For issues related to:
- **DLL Integration:** Check the DBM GEO.COIL DLL documentation
- **Web Framework:** See [Express.js](https://expressjs.com/) and [React](https://reactjs.org/) documentation
- **FFI-napi:** See [FFI-napi GitHub](https://github.com/node-ffi-napi/node-ffi-napi)

## License

This application uses the DBM GEO.COIL DLL. Refer to the DLL documentation for licensing terms.
>>>>>>> bfc12cde6c003c10313d7bb9d6a3cc210d063bf4
