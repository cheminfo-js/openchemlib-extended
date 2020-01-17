'use strict';

const staticMethods = {
  DB: require('./db/MoleculeDB'),
  RXN: require('./rxn/RXN'),
};

// These methods don't need to directly access OCL
const moleculePrototypeMethods = {
  getAllPaths: require('./extend/getAllPaths'),
  getFunctions: require('./extend/functions/getFunctions'),
  getGroupedDiastereotopicAtomIDs: require('./extend/diastereotopic/getGroupedDiastereotopicAtomIDs'),
  getMF: require('./extend/getMF'),
  getCouplings: require('./extend/couplings/getCouplings'),
  getNumberOfAtoms: require('./extend/getNumberOfAtoms'),
  toDiastereotopicSVG: require('./extend/diastereotopic/toDiastereotopicSVG'),
  toVisualizerMolfile: require('./extend/toVisualizerMolfile'),
};

// These methods need a direct access to OCL. The must be exported as a function
// that receives OCL and returns the method that will use it.
const moleculePrototypeMethodsNeedOCL = {
  getAtomsInfo: require('./extend/getAtomsInfo'),
  getConnectivityMatrix: require('./extend/getConnectivityMatrix'),
  getDiastereotopicHoseCodes: require('./extend/diastereotopic/getDiastereotopicHoseCodes'),
  getExtendedDiastereotopicAtomIDs: require('./extend/diastereotopic/getExtendedDiastereotopicAtomIDs'),
  getFunctionCodes: require('./extend/functions/getFunctionCodes'),
  getGroupedHOSECodes: require('./extend/getGroupedHOSECodes'),
  getHoseCodesForAtom: require('./extend/getHoseCodesForAtom'),
  cleaveBonds: require('./extend/cleaveBonds'),
  getBoundary: require('./extend/getBoundary'),
  addMoleculeAndAlign: require('./extend/addMoleculeAndAlign'),
};

module.exports = function extend(OCL) {
  let key;
  for (key in staticMethods) {
    OCL[key] = staticMethods[key](OCL);
  }

  const MoleculePrototype = OCL.Molecule.prototype;
  for (key in moleculePrototypeMethods) {
    MoleculePrototype[key] = moleculePrototypeMethods[key];
  }
  for (key in moleculePrototypeMethodsNeedOCL) {
    MoleculePrototype[key] = moleculePrototypeMethodsNeedOCL[key](OCL);
  }
  return OCL;
};
