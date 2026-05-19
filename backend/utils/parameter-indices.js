/**
 * Input/Output Parameter Index Reference
 * DBM GEO.COIL DLL Version 2.1.4.19
 * 
 * This document maps all 100 input and output parameters used by the DLL
 */

// INPUT PARAMETERS (100 total)
const INPUT_INDICES = {
  // Coil Selection and Air-Side (0-12)
  coilType: 0,                          // Coil geometry type
  airInletTemp: 1,                      // °C
  airInletHumidity: 2,                  // % RH or g/kg
  barometricPressure: 3,                // mbar
  dewPointTemp: 4,                      // °C
  airVolumeSmh: 5,                      // Sm³/h (standard)
  airVolumeNmh: 6,                      // Nm³/h (normal)
  airVolumeAmh: 7,                      // Am³/h (actual)
  airWeightKgh: 8,                      // kg/h

  // Coil Geometry (13-43)
  numberOfRows: 14,
  numberOfTubes: 31,
  numberOfCircuits: 32,
  finPitch: 35,                         // mm
  coilLength: 36,                       // mm
  coilHeight: 37,                       // mm
  tubeThickness: 57,

  // Fluid Properties (44-58)
  fluidType: 45,
  fluidInletTemp: 26,                   // °C
  fluidOutletTemp: 27,                  // °C
  fluidVolumeFlow: 6,                   // dm³/h
  maxFluidPressureDrop: 29,             // kPa

  // Material and Design (59+)
  calculationType: 59,                  // 1=Monophase, 2=DX, 3=Condenser
  tubeMaterial: 0,                      // Material code
  finMaterial: 1,                       // Material code
  toleranceMode: 0                      // 0=Standard, 1=Reduced, 2=Certified, 3=Compatibility
};

// OUTPUT PARAMETERS (100 total)
const OUTPUT_INDICES = {
  // Capacity (0-1)
  capacityKW: 0,
  capacityKcalh: 1,

  // Air-Side Performance (2-5)
  airOutletTemp: 2,                     // °C
  airOutletRH: 3,                       // %
  airOutletAbsoluteHumidity: 4,         // g/kg

  // Fluid-Side Performance (5-10)
  fluidOutletTemp: 5,                   // °C
  fluidVolumeFlowDm3h: 6,
  fluidVolumeFlowDm3s: 7,
  fluidWeightFlowKgh: 8,
  fluidWeightFlowKgs: 9,

  // Pressure Drops & Performance (10-12)
  airPressureDropPa: 10,                // Pa
  fluidPressureDropKpa: 11,             // kPa
  capacityReservePercent: 12,           // %

  // Coil Dimensions (13-16)
  coilHeightMm: 13,
  coilDepthMm: 14,
  coilDimensionMm: 15,
  gasVelocityMs: 16,

  // Fluid Properties (17-22)
  fluidVelocityMs: 17,
  fluidDensityKgm3: 18,
  fluidViscosityMPas: 19,
  fluidSpecificHeatJKgC: 20,
  fluidConductivityWmC: 21,
  sensibleHeatRatio: 22,

  // Additional (23-29)
  condensedWaterKgh: 23,
  errorCode: 24,
  numberOfRows: 25,
  numberOfCircuits: 26,
  coilPrice: 27,
  coilWeightKg: 28,

  // Direct Expansion Specific (30-33)
  subcoolingC: 30,
  superheatingC: 31,
  vaporFraction: 32,
  inletConnectionDiameter: 33,

  // Refrigerant Properties (45-51)
  condensingTemperatureC: 45,
  condensingPressureBar: 46,
  evaporatingTemperatureC: 47,
  evaporatingPressureBar: 48,
  totalExchangeSurfaceM2: 49,
  refrigerantPressureDropC: 50,
  inletAirRelativeHumidityPercent: 51,

  // Design Details (52-60)
  internalVolumeM3: 52,
  finPitchMm: 53,
  finnedLengthMm: 55,
  tubesNumber: 56,
  tubeThicknessMm: 57,
  overallLengthMm: 58,
  overallHeightMm: 59,

  // Additional Design (60-71)
  dropEliminatorPressureDropPa: 60,
  drainTrayPriceEuro: 61,
  numberOfCoils: 64,
  distanceXManifoldsMm: 65,
  distanceYManifoldsMm: 66,
  numberOfGasCircuits: 67,
  frameThicknessMm: 69,
  warningCode: 70,

  // Material/Certification (71-83)
  finThicknessMm: 71,
  airPressureDropDryModePa: 73,
  frameLengthOnBendsSideMm: 74,
  capillarsPreasureDropBar: 75,
  frameHeightMm: 76,
  dllVersion: 77,
  pedClass: 78,
  pedMaxPressure: 79,
  pedMaxTemperature: 80,
  pedMinTemperature: 81,
  liquidReynoldsNumberInlet: 82,
  liquidReynoldsNumberOutlet: 83
};

module.exports = {
  INPUT_INDICES,
  OUTPUT_INDICES
};
