'use strict';

require('setimmediate');
var OCL = require('openchemlib');

module.exports = exports = OCL;
exports.DB = require('./db/DB');
exports.RXN = require('./rxn/RXN');


OCL.Molecule.prototype.getGroupedDiastereotopicAtomIDs = require('./extend/getGroupedDiastereotopicAtomIDs');
OCL.Molecule.prototype.getExtendedDiastereotopicAtomIDs = require('./extend/getExtendedDiastereotopicAtomIDs');
OCL.Molecule.prototype.toVisualizerMolfile = require('./extend/toVisualizerMolfile');
OCL.Molecule.prototype.getGroupedHOSECodes = require('./extend/getGroupedHOSECodes');
OCL.Molecule.prototype.getNumberOfAtoms = require('./extend/getNumberOfAtoms');
OCL.Molecule.prototype.toDiastereotopicSVG = require('./extend/toDiastereotopicSVG');
OCL.Molecule.prototype.getAtomsInfo = require('./extend/getAtomsInfo');
OCL.Molecule.prototype.getAllPaths = require('./extend/getAllPaths');
OCL.Molecule.prototype.getConnectivityMatrix = require('./extend/getConnectivityMatrix');
OCL.Molecule.prototype.getDiastereotopicHoseCodes = require('./extend/getDiastereotopicHoseCodes');
OCL.Molecule.prototype.getMF = require('./extend/getMF');

OCL.Molecule.prototype.getFunctionCodes = require('./extend/getFunctionCodes');
OCL.Molecule.prototype.getFunctions = require('./extend/getFunctions');


