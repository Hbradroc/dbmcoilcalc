<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const DLLWrapper = require('../dll-wrapper');
const validators = require('../utils/validators');

// Initialize DLL wrapper
let dllWrapper = null;

try {
  dllWrapper = new DLLWrapper();
  dllWrapper.initialize();
} catch (error) {
  console.error('Failed to initialize DLL:', error.message);
}

/**
 * POST /api/calculate
 * Perform coil calculation
 */
router.post('/calculate', async (req, res) => {
  try {
    const { inputs, calculationMode = 'standard', pricePath } = req.body;

    if (!inputs || !Array.isArray(inputs)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input: "inputs" array required'
      });
    }

    // Validate inputs
    const validationErrors = validators.validateInputArray(inputs);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation errors',
        errors: validationErrors
      });
    }

    if (!dllWrapper) {
      return res.status(500).json({
        success: false,
        error: 'DLL not initialized. Check server logs.'
      });
    }

    // Perform calculation
    const result = dllWrapper.performCalculation(inputs, pricePath);

    if (!result.success) {
      // Parse error code
      const errorCode = Math.floor(inputs[100] || result.data?.[24] || 0);
      const errorMessage = getErrorMessage(errorCode);

      return res.status(400).json({
        success: false,
        error: 'Calculation failed',
        errorCode: errorCode,
        errorMessage: errorMessage,
        details: result.error
      });
    }

    // Parse output
    const parsedResults = validators.parseOutputArray(result.data);

    return res.json({
      success: true,
      calculation: {
        inputs: inputs,
        outputs: result.data,
        parsed: parsedResults,
        mode: calculationMode,
        timestamp: result.timestamp
      }
    });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

/**
 * POST /api/validate
 * Validate input parameters
 */
router.post('/validate', (req, res) => {
  try {
    const { inputs } = req.body;

    const errors = validators.validateInputArray(inputs);

    return res.json({
      valid: errors.length === 0,
      errors: errors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/materials
 * Get available materials
 */
router.get('/materials', (req, res) => {
  res.json({
    tubeMaterials: {
      'CU': 0,
      'CuSn': 1,
      'Inox304': 2,
      'Inox316': 3,
      'Fe': 4,
      'CuNi9010': 5
    },
    finMaterials: {
      'AL': 1,
      'ALPR': 2,
      'CU': 3,
      'CUSN': 4,
      'ALMG2.5': 9
    },
    frameMaterials: {
      'Al': ['2mm', '3mm'],
      'FeZn': ['1.5mm', '2.0mm', '2.5mm', '3mm', '4mm'],
      'Inox304': ['1.5mm', '2mm', '2.5mm', '3mm', '4mm'],
      'Inox316': ['1.5mm', '2.0mm', '2.5mm', '3mm', '4mm'],
      'Fe': ['1.5mm', '2.0mm', '2.5mm', '3mm', '4mm'],
      'Cu': ['2mm', '3mm']
    },
    headerMaterials: {
      'Steel': 6,
      'Copper': 1
    }
  });
});

/**
 * GET /api/coil-types
 * Get available coil types
 */
router.get('/coil-types', (req, res) => {
  res.json({
    coilTypes: {
      'P60': { value: 1, status: 'deprecated' },
      'P3012': { value: 2, status: 'active' },
      'P40': { value: 94, status: 'active' },
      'P25': { value: 113, status: 'active' }
    },
    calculationTypes: {
      'Monophase': 1,
      'Direct Expansion': 2,
      'Condenser': 3
    },
    fluidTypes: {
      'Water': 1,
      'ESSOTHERM500': 2,
      'R134a': 4,
      'R22': 5,
      'Steam': 9,
      'Therminol66': 11,
      'R407c': 12,
      'R404a': 13,
      'R410a': 16,
      'SeaWater': 10,
      'R407F': 72,
      'R448A': 78,
      'R449A': 79,
      'R32': 82,
      'R1234ze': 83,
      'R454b': 85,
      'R123yf': 86,
      'R515b': 87
    },
    toleranceModes: {
      'Standard': 0,
      'Reduced': 1,
      'Certified': 2,
      'Compatibility': 3
    }
  });
});

/**
 * GET /api/fin-pitches/:coilType
 * Get available fin pitches for a coil type
 */
router.get('/fin-pitches/:coilType', (req, res) => {
  const finPitches = {
    'P60': [2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 10.0, 12.0],
    'P3012': [2.0, 2.5, 3.0, 4.0, 5.0, 6.0],
    'P40': [2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 10.0, 12.0],
    'P25': [2.0, 2.5, 3.0, 4.0, 5.0, 6.0]
  };

  const pitches = finPitches[req.params.coilType] || [];
  res.json({
    coilType: req.params.coilType,
    availablePitches: pitches,
    autoSelectAvailable: true
  });
});

/**
 * GET /api/default-values
 * Get default parameter values
 */
router.get('/default-values', (req, res) => {
  res.json(validators.getDefaultValues());
});

/**
 * GET /api/error-codes
 * Get error code reference
 */
router.get('/error-codes', (req, res) => {
  res.json({
    errorCodes: {
      '-99': 'Unknown error',
      '130': 'Maximum number of connected rows exceeded (steam coil)',
      '131': 'Steam velocity too high',
      '150': 'License expired',
      '151': 'Unable to load standard coils',
      '10100': 'Fin pitch not allowed',
      '10200': 'Wrong circuits number or wrong max liquid side pressure drop',
      '10300': 'Calculation type not specified',
      '10305': 'Invalid gas or liquid temperatures',
      '10306': 'Wrong liquid temperature. Minimum temperature difference is 1°C',
      '10400': 'Wrong liquid type',
      '10500': 'Wrong user specified liquid properties',
      '10600': 'Liquid outlet temp and liquid volume not specified',
      '10700': 'Incorrect tubes number or coil height',
      '10800': 'Incorrect inlet air condition',
      '10900': 'Incorrect gas side volume or weight',
      '11000': 'Wrong coil type',
      '11100': 'Invalid temperature or pressure for evaporator or condenser',
      '11200': 'Invalid inlet refrigerant conditions',
      '11300': 'Condenser or evaporator module not found',
      '11310': 'Evaporating temperature is too low (minimum -20°C)',
      '11320': 'Minimum fins pitch is 3.0',
      '11330': 'ETAM available only for CuSn tubes and fins',
      '40000': 'Number of circuit not valid',
      '41000': 'Temperature difference must be at least 3°C',
      '41110': 'It is suggested to use ARI calculation mode',
      '41150': 'Results cannot be guaranteed in this working condition',
      '41160': 'Results need DBM check'
    }
  });
});

/**
 * Helper function to get error message
 */
function getErrorMessage(errorCode) {
  const messages = {
    '-99': 'Unknown error',
    '130': 'Maximum number of connected rows exceeded (steam coil)',
    '131': 'Steam velocity too high - please contact DBM',
    '150': 'License expired',
    '151': 'Unable to load standard coils. Ensure DLL is properly installed.',
    '10100': 'Fin pitch not allowed for this configuration',
    '10200': 'Wrong circuits number or max liquid side pressure drop is incorrect',
    '10300': 'Calculation type must be specified',
    '10305': 'Invalid gas or liquid temperatures',
    '10306': 'Temperature difference between fluid must be at least 1°C',
    '10400': 'Invalid fluid type',
    '10500': 'Invalid user-specified fluid properties',
    '10600': 'Fluid outlet temperature and volume must both be specified',
    '10700': 'Incorrect tubes number or coil height',
    '10800': 'Incorrect inlet air condition',
    '10900': 'Incorrect air volume or weight',
    '11000': 'Invalid coil type',
    '11100': 'Invalid temperature or pressure for this coil type',
    '11200': 'Invalid inlet refrigerant conditions',
    '11300': 'Required calculation module not found',
    '11310': 'Evaporating temperature too low (minimum -20°C)',
    '11320': 'Minimum fin pitch is 3.0 mm for this configuration',
    '11330': 'Electro-tinned fins only available for CuSn tubes and fins',
    '40000': 'Circuit configuration not valid for these parameters',
    '41000': 'Temperature difference must be at least 3°C for reliable results',
    '41110': 'ARI calculation mode is recommended for this application',
    '41150': 'Results cannot be guaranteed in these working conditions',
    '41160': 'Results require DBM verification'
  };

  return messages[errorCode.toString()] || 'Calculation failed';
}

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const DLLWrapper = require('../dll-wrapper');
const validators = require('../utils/validators');

// Initialize DLL wrapper
let dllWrapper = null;

try {
  dllWrapper = new DLLWrapper();
  dllWrapper.initialize();
} catch (error) {
  console.error('Failed to initialize DLL:', error.message);
}

/**
 * POST /api/calculate
 * Perform coil calculation
 */
router.post('/calculate', async (req, res) => {
  try {
    const { inputs, calculationMode = 'standard', pricePath } = req.body;

    if (!inputs || !Array.isArray(inputs)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input: "inputs" array required'
      });
    }

    // Validate inputs
    const validationErrors = validators.validateInputArray(inputs);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation errors',
        errors: validationErrors
      });
    }

    if (!dllWrapper) {
      return res.status(500).json({
        success: false,
        error: 'DLL not initialized. Check server logs.'
      });
    }

    // Perform calculation
    const result = dllWrapper.performCalculation(inputs, pricePath);

    if (!result.success) {
      // Parse error code
      const errorCode = Math.floor(inputs[100] || result.data?.[24] || 0);
      const errorMessage = getErrorMessage(errorCode);

      return res.status(400).json({
        success: false,
        error: 'Calculation failed',
        errorCode: errorCode,
        errorMessage: errorMessage,
        details: result.error
      });
    }

    // Parse output
    const parsedResults = validators.parseOutputArray(result.data);

    return res.json({
      success: true,
      calculation: {
        inputs: inputs,
        outputs: result.data,
        parsed: parsedResults,
        mode: calculationMode,
        timestamp: result.timestamp
      }
    });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

/**
 * POST /api/validate
 * Validate input parameters
 */
router.post('/validate', (req, res) => {
  try {
    const { inputs } = req.body;

    const errors = validators.validateInputArray(inputs);

    return res.json({
      valid: errors.length === 0,
      errors: errors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/materials
 * Get available materials
 */
router.get('/materials', (req, res) => {
  res.json({
    tubeMaterials: {
      'CU': 0,
      'CuSn': 1,
      'Inox304': 2,
      'Inox316': 3,
      'Fe': 4,
      'CuNi9010': 5
    },
    finMaterials: {
      'AL': 1,
      'ALPR': 2,
      'CU': 3,
      'CUSN': 4,
      'ALMG2.5': 9
    },
    frameMaterials: {
      'Al': ['2mm', '3mm'],
      'FeZn': ['1.5mm', '2.0mm', '2.5mm', '3mm', '4mm'],
      'Inox304': ['1.5mm', '2mm', '2.5mm', '3mm', '4mm'],
      'Inox316': ['1.5mm', '2.0mm', '2.5mm', '3mm', '4mm'],
      'Fe': ['1.5mm', '2.0mm', '2.5mm', '3mm', '4mm'],
      'Cu': ['2mm', '3mm']
    },
    headerMaterials: {
      'Steel': 6,
      'Copper': 1
    }
  });
});

/**
 * GET /api/coil-types
 * Get available coil types
 */
router.get('/coil-types', (req, res) => {
  res.json({
    coilTypes: {
      'P60': { value: 1, status: 'deprecated' },
      'P3012': { value: 2, status: 'active' },
      'P40': { value: 94, status: 'active' },
      'P25': { value: 113, status: 'active' }
    },
    calculationTypes: {
      'Monophase': 1,
      'Direct Expansion': 2,
      'Condenser': 3
    },
    fluidTypes: {
      'Water': 1,
      'ESSOTHERM500': 2,
      'R134a': 4,
      'R22': 5,
      'Steam': 9,
      'Therminol66': 11,
      'R407c': 12,
      'R404a': 13,
      'R410a': 16,
      'SeaWater': 10,
      'R407F': 72,
      'R448A': 78,
      'R449A': 79,
      'R32': 82,
      'R1234ze': 83,
      'R454b': 85,
      'R123yf': 86,
      'R515b': 87
    },
    toleranceModes: {
      'Standard': 0,
      'Reduced': 1,
      'Certified': 2,
      'Compatibility': 3
    }
  });
});

/**
 * GET /api/fin-pitches/:coilType
 * Get available fin pitches for a coil type
 */
router.get('/fin-pitches/:coilType', (req, res) => {
  const finPitches = {
    'P60': [2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 10.0, 12.0],
    'P3012': [2.0, 2.5, 3.0, 4.0, 5.0, 6.0],
    'P40': [2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 10.0, 12.0],
    'P25': [2.0, 2.5, 3.0, 4.0, 5.0, 6.0]
  };

  const pitches = finPitches[req.params.coilType] || [];
  res.json({
    coilType: req.params.coilType,
    availablePitches: pitches,
    autoSelectAvailable: true
  });
});

/**
 * GET /api/default-values
 * Get default parameter values
 */
router.get('/default-values', (req, res) => {
  res.json(validators.getDefaultValues());
});

/**
 * GET /api/error-codes
 * Get error code reference
 */
router.get('/error-codes', (req, res) => {
  res.json({
    errorCodes: {
      '-99': 'Unknown error',
      '130': 'Maximum number of connected rows exceeded (steam coil)',
      '131': 'Steam velocity too high',
      '150': 'License expired',
      '151': 'Unable to load standard coils',
      '10100': 'Fin pitch not allowed',
      '10200': 'Wrong circuits number or wrong max liquid side pressure drop',
      '10300': 'Calculation type not specified',
      '10305': 'Invalid gas or liquid temperatures',
      '10306': 'Wrong liquid temperature. Minimum temperature difference is 1°C',
      '10400': 'Wrong liquid type',
      '10500': 'Wrong user specified liquid properties',
      '10600': 'Liquid outlet temp and liquid volume not specified',
      '10700': 'Incorrect tubes number or coil height',
      '10800': 'Incorrect inlet air condition',
      '10900': 'Incorrect gas side volume or weight',
      '11000': 'Wrong coil type',
      '11100': 'Invalid temperature or pressure for evaporator or condenser',
      '11200': 'Invalid inlet refrigerant conditions',
      '11300': 'Condenser or evaporator module not found',
      '11310': 'Evaporating temperature is too low (minimum -20°C)',
      '11320': 'Minimum fins pitch is 3.0',
      '11330': 'ETAM available only for CuSn tubes and fins',
      '40000': 'Number of circuit not valid',
      '41000': 'Temperature difference must be at least 3°C',
      '41110': 'It is suggested to use ARI calculation mode',
      '41150': 'Results cannot be guaranteed in this working condition',
      '41160': 'Results need DBM check'
    }
  });
});

/**
 * Helper function to get error message
 */
function getErrorMessage(errorCode) {
  const messages = {
    '-99': 'Unknown error',
    '130': 'Maximum number of connected rows exceeded (steam coil)',
    '131': 'Steam velocity too high - please contact DBM',
    '150': 'License expired',
    '151': 'Unable to load standard coils. Ensure DLL is properly installed.',
    '10100': 'Fin pitch not allowed for this configuration',
    '10200': 'Wrong circuits number or max liquid side pressure drop is incorrect',
    '10300': 'Calculation type must be specified',
    '10305': 'Invalid gas or liquid temperatures',
    '10306': 'Temperature difference between fluid must be at least 1°C',
    '10400': 'Invalid fluid type',
    '10500': 'Invalid user-specified fluid properties',
    '10600': 'Fluid outlet temperature and volume must both be specified',
    '10700': 'Incorrect tubes number or coil height',
    '10800': 'Incorrect inlet air condition',
    '10900': 'Incorrect air volume or weight',
    '11000': 'Invalid coil type',
    '11100': 'Invalid temperature or pressure for this coil type',
    '11200': 'Invalid inlet refrigerant conditions',
    '11300': 'Required calculation module not found',
    '11310': 'Evaporating temperature too low (minimum -20°C)',
    '11320': 'Minimum fin pitch is 3.0 mm for this configuration',
    '11330': 'Electro-tinned fins only available for CuSn tubes and fins',
    '40000': 'Circuit configuration not valid for these parameters',
    '41000': 'Temperature difference must be at least 3°C for reliable results',
    '41110': 'ARI calculation mode is recommended for this application',
    '41150': 'Results cannot be guaranteed in these working conditions',
    '41160': 'Results require DBM verification'
  };

  return messages[errorCode.toString()] || 'Calculation failed';
}

module.exports = router;
>>>>>>> bfc12cde6c003c10313d7bb9d6a3cc210d063bf4
