'use strict';

require('setimmediate');
var OCL = require('openchemlib')

var getGroupedDiastereotopicAtomIDs=require('./extend/getGroupedDiastereotopicAtomIDs');

module.exports = exports = OCL;
exports.DB = require('./db/DB');
exports.RXN = require('./rxn/RXN');


OCL.Molecule.prototype.getGroupedDiastereotopicAtomIDs = getGroupedDiastereotopicAtomIDs;
