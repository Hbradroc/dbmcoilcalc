const ref = require('ref-napi');
const ffi = require('ffi-napi');
const path = require('path');

// Data types
const double = ref.types.double;
const int = ref.types.int;
const bool = ref.types.bool;
const CString = ref.types.CString;

class DLLWrapper {
  constructor(dllPath) {
    this.dllPath = dllPath || process.env.DLL_PATH;
    this.lib = null;
    this.initialized = false;
  }

  /**
   * Initialize the DLL
   */
  initialize() {
    try {
      if (this.initialized) {
        return true;
      }

      if (!this.dllPath) {
        throw new Error('DLL_PATH not configured in environment variables');
      }

      console.log(`Loading DLL from: ${this.dllPath}`);

      // Define FFI interface for calcdll.dll
      this.lib = ffi.Library(this.dllPath, {
        StartJob: [
          bool,
          [ref.refType(double), ref.refType(ref.refType(ref.types.void)), ref.refType(double)]
        ],
        SetPricePath: [ref.types.void, [CString]],
        EndCalculation: [ref.types.void, []]
      });

      this.initialized = true;
      console.log('DLL initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize DLL:', error.message);
      throw error;
    }
  }

  /**
   * Perform coil calculation
   * @param {number[]} inputData - Array of 100 input parameters
   * @param {string} pricePath - Path to price file
   * @returns {Object} Calculation results
   */
  performCalculation(inputData, pricePath = null) {
    if (!this.initialized) {
      this.initialize();
    }

    try {
      if (!Array.isArray(inputData) || inputData.length !== 100) {
        throw new Error('Input data must be an array of exactly 100 numbers');
      }

      // Allocate memory for input and output arrays
      const inputBuffer = Buffer.alloc(100 * 8); // 100 doubles * 8 bytes
      const outputBuffer = Buffer.alloc(100 * 8); // 100 doubles * 8 bytes
      const optionsBuffer = Buffer.alloc(1 * 8); // 1 double * 8 bytes

      // Fill input buffer
      for (let i = 0; i < 100; i++) {
        inputBuffer.writeDoubleLE(parseFloat(inputData[i]) || 0, i * 8);
      }

      // Set price path if provided
      if (pricePath) {
        this.lib.SetPricePath(pricePath);
      }

      // Call DLL function
      const result = this.lib.StartJob(inputBuffer, outputBuffer, optionsBuffer);

      if (!result) {
        // Read error code from output buffer (position 24 contains error code)
        const errorCode = outputBuffer.readDoubleLE(24 * 8);
        throw new Error(`DLL calculation failed with error code: ${errorCode}`);
      }

      // Read output data
      const outputData = [];
      for (let i = 0; i < 100; i++) {
        outputData.push(outputBuffer.readDoubleLE(i * 8));
      }

      // Clean up
      this.lib.EndCalculation();

      return {
        success: true,
        data: outputData,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Calculation error:', error.message);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get coil type constant
   */
  static getCoilTypeValue(type) {
    const types = {
      'P60': 1,
      'P3012': 2,
      'P40': 94,
      'P25': 113
    };
    return types[type] || 1;
  }

  /**
   * Get fluid type constant
   */
  static getFluidTypeValue(fluid) {
    const fluids = {
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
    };
    return fluids[fluid] || 1;
  }

  /**
   * Get fin material constant
   */
  static getFinMaterialValue(material) {
    const materials = {
      'AL': 1,
      'ALPR': 2,
      'CU': 3,
      'CUSN': 4,
      'ALMG2.5': 9
    };
    return materials[material] || 1;
  }

  /**
   * Get tube material constant
   */
  static getTubeMaterialValue(material) {
    const materials = {
      'CU': 0,
      'CUSN': 1,
      'INOX304': 2,
      'INOX316': 3,
      'FE': 4,
      'CUNI9010': 5
    };
    return materials[material] || 0;
  }

  /**
   * Get header material constant
   */
  static getHeaderMaterialValue(material) {
    const materials = {
      'Steel': 6,
      'Copper': 1
    };
    return materials[material] || 1;
  }

  /**
   * Get frame code constant
   */
  static getFrameCodeValue(material, thickness) {
    const frameCodes = {
      'Al': {
        '2mm': 15,
        '3mm': 40
      },
      'FeZn': {
        '1.5mm': 11,
        '2.0mm': 12,
        '2.5mm': 13,
        '3mm': 14,
        '4mm': 43
      },
      'Inox304': {
        '1.5mm': 16,
        '2mm': 17,
        '2.5mm': 18,
        '3mm': 39,
        '4mm': 41
      },
      'Inox316': {
        '1.5mm': 25,
        '2.0mm': 36,
        '2.5mm': 37,
        '3mm': 38,
        '4mm': 42
      },
      'Fe': {
        '1.5mm': 45,
        '2.0mm': 46,
        '2.5mm': 47,
        '3mm': 48,
        '4mm': 49
      },
      'Cu': {
        '2mm': 19,
        '3mm': 44
      }
    };

    return frameCodes[material]?.[thickness] || 15;
  }
}

module.exports = DLLWrapper;
