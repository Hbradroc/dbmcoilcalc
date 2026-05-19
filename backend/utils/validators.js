<<<<<<< HEAD
module.exports = {
  /**
   * Validate input array against DBM DLL requirements
   */
  validateInputArray(inputArray) {
    const errors = [];

    if (!Array.isArray(inputArray) || inputArray.length !== 100) {
      errors.push('Input array must contain exactly 100 elements');
      return errors;
    }

    // Coil type validation (index 0)
    const validCoilTypes = [1, 2, 94, 113];
    if (!validCoilTypes.includes(inputArray[0])) {
      errors.push('Invalid coil type. Must be P60(1), P3012(2), P40(94), or P25(113)');
    }

    // Air inlet temperature (index 1)
    if (inputArray[1] < -50 || inputArray[1] > 50) {
      errors.push('Air inlet temperature must be between -50°C and 50°C');
    }

    // Air inlet humidity (index 2)
    if (inputArray[2] < 0 || inputArray[2] > 100) {
      errors.push('Air inlet humidity must be between 0% and 100%');
    }

    // Air volume (index 5,6,7,8)
    if (inputArray[5] > 0 && inputArray[5] < 100) {
      errors.push('Air volume seems too small. Verify units (Sm3/h)');
    }

    // Number of rows (index 14)
    if (inputArray[14] > 0 && (inputArray[14] < 1 || inputArray[14] > 25)) {
      errors.push('Number of rows must be between 1 and 25');
    }

    // Fluid inlet/outlet temperature (index 26, 27)
    if (inputArray[26] && inputArray[27]) {
      const tempDiff = Math.abs(inputArray[27] - inputArray[26]);
      if (tempDiff < 1) {
        errors.push('Temperature difference between inlet and outlet must be at least 1°C');
      }
    }

    // Type of calculation (index 59)
    const validCalcTypes = [1, 2, 3];
    if (inputArray[59] > 0 && !validCalcTypes.includes(inputArray[59])) {
      errors.push('Invalid calculation type. Must be 1 (Monophase), 2 (Direct Expansion), or 3 (Condenser)');
    }

    // Fluid type (index 45)
    const validFluidTypes = [1, 2, 4, 5, 9, 11, 12, 13, 16, 10, 72, 78, 79, 82, 83, 85, 86, 87];
    if (inputArray[45] > 0 && !validFluidTypes.includes(inputArray[45])) {
      errors.push('Invalid fluid type selected');
    }

    // Evaporating temperature for DX coils (index 56)
    if (inputArray[56] && inputArray[56] < -20) {
      errors.push('Evaporating temperature must be at least -20°C for direct expansion coils');
    }

    return errors;
  },

  /**
   * Validate temperature conditions
   */
  validateTemperatures(tIn, tOut, calcType) {
    const errors = [];

    if (calcType === 2 || calcType === 3) { // DX or Condenser
      if (Math.abs(tOut - tIn) < 3) {
        errors.push('Warning: Temperature difference should be at least 3°C for reliable results');
      }
    }

    return errors;
  },

  /**
   * Validate fluid properties
   */
  validateFluidProperties(fluidType, viscosity, density, specificHeat) {
    const errors = [];

    if (fluidType === 3) { // User-defined fluid
      if (!viscosity || viscosity <= 0) {
        errors.push('Fluid viscosity must be greater than 0 mPa.s');
      }
      if (!density || density <= 0) {
        errors.push('Fluid density must be greater than 0 kg/m³');
      }
      if (!specificHeat || specificHeat <= 0) {
        errors.push('Fluid specific heat must be greater than 0 J/kg°C');
      }
    }

    return errors;
  },

  /**
   * Get default values for optional parameters
   */
  getDefaultValues() {
    return {
      workingPressure: 1.013, // bar (default from docs)
      tubeSideFoulingFactor: 0, // m²°C/W
      gasSideFoulingFactor: 0, // m²°C/W
      glycolPercentage: 0,
      safetyFactorOnSurface: 0,
      safetyFactorOnCapacity: 0,
      fluidType: 1, // Water
      headerMaterial: 1, // Copper
      finPitch: 0, // Auto select
      calculationMode: 0, // Standard tolerance
      ahriVersion: 0 // Standard calculation
    };
  },

  /**
   * Parse output array to readable results
   */
  parseOutputArray(outputData) {
    if (!Array.isArray(outputData) || outputData.length < 85) {
      throw new Error('Invalid output array');
    }

    return {
      // Capacity (indices 0-1)
      capacity: {
        kW: outputData[0],
        kcalh: outputData[1]
      },

      // Air side (indices 2-5)
      airOutlet: {
        temperature: outputData[2],
        relativeHumidity: outputData[3],
        absoluteHumidity: outputData[4]
      },

      // Fluid side (indices 5-10)
      fluidOutlet: {
        temperature: outputData[5],
        volumeDm3h: outputData[6],
        volumeDm3s: outputData[7],
        weightKgh: outputData[8],
        weightKgs: outputData[9]
      },

      // Pressure drops (indices 10-12)
      pressureDrops: {
        airSidePa: outputData[10],
        fluidSideKpa: outputData[11],
        capacityReservePercent: outputData[12]
      },

      // Coil dimensions (indices 13-16)
      dimensions: {
        heightMm: outputData[13],
        depthMm: outputData[14],
        dDimensionMm: outputData[15],
        gasVelocityMs: outputData[16]
      },

      // Fluid properties (indices 17-22)
      fluidProperties: {
        velocityMs: outputData[17],
        densityKgm3: outputData[18],
        viscosityMPas: outputData[19],
        specificHeatJKgC: outputData[20],
        conductivityWmC: outputData[21],
        sensibleHeatRatio: outputData[22]
      },

      // Condensed water and configurations (indices 23-29)
      additional: {
        condensedWaterKgh: outputData[23],
        errorCode: Math.floor(outputData[24]),
        numberOfRows: Math.floor(outputData[25]),
        numberOfCircuits: Math.floor(outputData[26]),
        coilPrice: outputData[27],
        coilWeightKg: outputData[28],
        coilDescription: 'See index 29'
      },

      // Direct Expansion specific (indices 30-33)
      dxSpecific: {
        subcoolingC: outputData[30],
        superheatingC: outputData[31],
        vaporFraction: outputData[32],
        inletConnectionDiameter: outputData[33]
      },

      // Refrigerant properties (indices 45-51)
      refrigerantProperties: {
        condensingTemperatureC: outputData[45],
        condensingPressureBar: outputData[46],
        evaporatingTemperatureC: outputData[47],
        evaporatingPressureBar: outputData[48],
        totalExchangeSurfaceM2: outputData[49],
        freonPressureDropC: outputData[50],
        inletAirRelativeHumidityPercent: outputData[51]
      },

      // Design parameters (indices 52-60)
      design: {
        internalVolumeM3: outputData[52],
        finPitchMm: outputData[53],
        customerCode: outputData[54],
        finnedLengthMm: outputData[55],
        tubesNumber: Math.floor(outputData[56]),
        tubeThicknessMm: outputData[57],
        overallLengthMm: outputData[58],
        overallHeightMm: outputData[59]
      },

      // Additional design (indices 60-71)
      additionalDesign: {
        dropEliminatorPressureDropPa: outputData[60],
        drainTrayPriceEuro: outputData[61],
        dropEliminatorPriceMm: outputData[62],
        numberOfCoils: Math.floor(outputData[64]),
        distanceXManifoldsMm: outputData[65],
        distanceYManifoldsMm: outputData[66],
        numberOfGasCircuit: Math.floor(outputData[67]),
        coilNeedsDrawingConfirmation: outputData[68],
        frameThicknessMm: outputData[69],
        warningCode: Math.floor(outputData[70])
      },

      // Material/certification (indices 71-83)
      materials: {
        finThicknessMm: outputData[71],
        connectionSide: outputData[72],
        airSidePressureDropDryModePa: outputData[73],
        frameLengthOnBendsSideMm: outputData[74],
        capillarsPreasureDropBar: outputData[75],
        frameHeightMm: outputData[76],
        dllVersion: outputData[77],
        pedClass: Math.floor(outputData[78]),
        pedMaxPressure: outputData[79],
        pedMaxTemperature: outputData[80],
        pedMinTemperature: outputData[81],
        liquidReynoldsNumberInlet: outputData[82],
        liquidReynoldsNumberOutlet: outputData[83]
      }
    };
  }
};
=======
module.exports = {
  /**
   * Validate input array against DBM DLL requirements
   */
  validateInputArray(inputArray) {
    const errors = [];

    if (!Array.isArray(inputArray) || inputArray.length !== 100) {
      errors.push('Input array must contain exactly 100 elements');
      return errors;
    }

    // Coil type validation (index 0)
    const validCoilTypes = [1, 2, 94, 113];
    if (!validCoilTypes.includes(inputArray[0])) {
      errors.push('Invalid coil type. Must be P60(1), P3012(2), P40(94), or P25(113)');
    }

    // Air inlet temperature (index 1)
    if (inputArray[1] < -50 || inputArray[1] > 50) {
      errors.push('Air inlet temperature must be between -50°C and 50°C');
    }

    // Air inlet humidity (index 2)
    if (inputArray[2] < 0 || inputArray[2] > 100) {
      errors.push('Air inlet humidity must be between 0% and 100%');
    }

    // Air volume (index 5,6,7,8)
    if (inputArray[5] > 0 && inputArray[5] < 100) {
      errors.push('Air volume seems too small. Verify units (Sm3/h)');
    }

    // Number of rows (index 14)
    if (inputArray[14] > 0 && (inputArray[14] < 1 || inputArray[14] > 25)) {
      errors.push('Number of rows must be between 1 and 25');
    }

    // Fluid inlet/outlet temperature (index 26, 27)
    if (inputArray[26] && inputArray[27]) {
      const tempDiff = Math.abs(inputArray[27] - inputArray[26]);
      if (tempDiff < 1) {
        errors.push('Temperature difference between inlet and outlet must be at least 1°C');
      }
    }

    // Type of calculation (index 59)
    const validCalcTypes = [1, 2, 3];
    if (inputArray[59] > 0 && !validCalcTypes.includes(inputArray[59])) {
      errors.push('Invalid calculation type. Must be 1 (Monophase), 2 (Direct Expansion), or 3 (Condenser)');
    }

    // Fluid type (index 45)
    const validFluidTypes = [1, 2, 4, 5, 9, 11, 12, 13, 16, 10, 72, 78, 79, 82, 83, 85, 86, 87];
    if (inputArray[45] > 0 && !validFluidTypes.includes(inputArray[45])) {
      errors.push('Invalid fluid type selected');
    }

    // Evaporating temperature for DX coils (index 56)
    if (inputArray[56] && inputArray[56] < -20) {
      errors.push('Evaporating temperature must be at least -20°C for direct expansion coils');
    }

    return errors;
  },

  /**
   * Validate temperature conditions
   */
  validateTemperatures(tIn, tOut, calcType) {
    const errors = [];

    if (calcType === 2 || calcType === 3) { // DX or Condenser
      if (Math.abs(tOut - tIn) < 3) {
        errors.push('Warning: Temperature difference should be at least 3°C for reliable results');
      }
    }

    return errors;
  },

  /**
   * Validate fluid properties
   */
  validateFluidProperties(fluidType, viscosity, density, specificHeat) {
    const errors = [];

    if (fluidType === 3) { // User-defined fluid
      if (!viscosity || viscosity <= 0) {
        errors.push('Fluid viscosity must be greater than 0 mPa.s');
      }
      if (!density || density <= 0) {
        errors.push('Fluid density must be greater than 0 kg/m³');
      }
      if (!specificHeat || specificHeat <= 0) {
        errors.push('Fluid specific heat must be greater than 0 J/kg°C');
      }
    }

    return errors;
  },

  /**
   * Get default values for optional parameters
   */
  getDefaultValues() {
    return {
      workingPressure: 1.013, // bar (default from docs)
      tubeSideFoulingFactor: 0, // m²°C/W
      gasSideFoulingFactor: 0, // m²°C/W
      glycolPercentage: 0,
      safetyFactorOnSurface: 0,
      safetyFactorOnCapacity: 0,
      fluidType: 1, // Water
      headerMaterial: 1, // Copper
      finPitch: 0, // Auto select
      calculationMode: 0, // Standard tolerance
      ahriVersion: 0 // Standard calculation
    };
  },

  /**
   * Parse output array to readable results
   */
  parseOutputArray(outputData) {
    if (!Array.isArray(outputData) || outputData.length < 85) {
      throw new Error('Invalid output array');
    }

    return {
      // Capacity (indices 0-1)
      capacity: {
        kW: outputData[0],
        kcalh: outputData[1]
      },

      // Air side (indices 2-5)
      airOutlet: {
        temperature: outputData[2],
        relativeHumidity: outputData[3],
        absoluteHumidity: outputData[4]
      },

      // Fluid side (indices 5-10)
      fluidOutlet: {
        temperature: outputData[5],
        volumeDm3h: outputData[6],
        volumeDm3s: outputData[7],
        weightKgh: outputData[8],
        weightKgs: outputData[9]
      },

      // Pressure drops (indices 10-12)
      pressureDrops: {
        airSidePa: outputData[10],
        fluidSideKpa: outputData[11],
        capacityReservePercent: outputData[12]
      },

      // Coil dimensions (indices 13-16)
      dimensions: {
        heightMm: outputData[13],
        depthMm: outputData[14],
        dDimensionMm: outputData[15],
        gasVelocityMs: outputData[16]
      },

      // Fluid properties (indices 17-22)
      fluidProperties: {
        velocityMs: outputData[17],
        densityKgm3: outputData[18],
        viscosityMPas: outputData[19],
        specificHeatJKgC: outputData[20],
        conductivityWmC: outputData[21],
        sensibleHeatRatio: outputData[22]
      },

      // Condensed water and configurations (indices 23-29)
      additional: {
        condensedWaterKgh: outputData[23],
        errorCode: Math.floor(outputData[24]),
        numberOfRows: Math.floor(outputData[25]),
        numberOfCircuits: Math.floor(outputData[26]),
        coilPrice: outputData[27],
        coilWeightKg: outputData[28],
        coilDescription: 'See index 29'
      },

      // Direct Expansion specific (indices 30-33)
      dxSpecific: {
        subcoolingC: outputData[30],
        superheatingC: outputData[31],
        vaporFraction: outputData[32],
        inletConnectionDiameter: outputData[33]
      },

      // Refrigerant properties (indices 45-51)
      refrigerantProperties: {
        condensingTemperatureC: outputData[45],
        condensingPressureBar: outputData[46],
        evaporatingTemperatureC: outputData[47],
        evaporatingPressureBar: outputData[48],
        totalExchangeSurfaceM2: outputData[49],
        freonPressureDropC: outputData[50],
        inletAirRelativeHumidityPercent: outputData[51]
      },

      // Design parameters (indices 52-60)
      design: {
        internalVolumeM3: outputData[52],
        finPitchMm: outputData[53],
        customerCode: outputData[54],
        finnedLengthMm: outputData[55],
        tubesNumber: Math.floor(outputData[56]),
        tubeThicknessMm: outputData[57],
        overallLengthMm: outputData[58],
        overallHeightMm: outputData[59]
      },

      // Additional design (indices 60-71)
      additionalDesign: {
        dropEliminatorPressureDropPa: outputData[60],
        drainTrayPriceEuro: outputData[61],
        dropEliminatorPriceMm: outputData[62],
        numberOfCoils: Math.floor(outputData[64]),
        distanceXManifoldsMm: outputData[65],
        distanceYManifoldsMm: outputData[66],
        numberOfGasCircuit: Math.floor(outputData[67]),
        coilNeedsDrawingConfirmation: outputData[68],
        frameThicknessMm: outputData[69],
        warningCode: Math.floor(outputData[70])
      },

      // Material/certification (indices 71-83)
      materials: {
        finThicknessMm: outputData[71],
        connectionSide: outputData[72],
        airSidePressureDropDryModePa: outputData[73],
        frameLengthOnBendsSideMm: outputData[74],
        capillarsPreasureDropBar: outputData[75],
        frameHeightMm: outputData[76],
        dllVersion: outputData[77],
        pedClass: Math.floor(outputData[78]),
        pedMaxPressure: outputData[79],
        pedMaxTemperature: outputData[80],
        pedMinTemperature: outputData[81],
        liquidReynoldsNumberInlet: outputData[82],
        liquidReynoldsNumberOutlet: outputData[83]
      }
    };
  }
};
>>>>>>> bfc12cde6c003c10313d7bb9d6a3cc210d063bf4
