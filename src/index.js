'use strict';

require('setimmediate');
var OCL = require('openchemlib')

module.exports = exports = OCL;
exports.DB = require('./db/DB');
exports.RXN = require('./rxn/RXN');


OCL.Molecule.prototype.getGroupedDiastereotopicAtomIDs = require('./extend/getGroupedDiastereotopicAtomIDs');
OCL.Molecule.prototype.toVisualizerMolfile = require('./extend/toVisualizerMolfile');
OCL.Molecule.prototype.getGroupedHOSECodes = require('./extend/getGroupedHOSECodes');
OCL.Molecule.prototype.getNumberOfAtoms = require('./extend/getNumberOfAtoms');

