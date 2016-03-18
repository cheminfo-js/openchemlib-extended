'use strict';

require('setimmediate');
var OCL = require('openchemlib')

var getGroupedDiastereotopicIDs=require('./extend/getGroupedDiastereotopicIDs');

module.exports = exports = OCL;
exports.DB = require('./db/DB');
exports.RXN = require('./rxn/RXN');


OCL.Molecule.prototype.getGroupedDiastereotopicIDs = getGroupedDiastereotopicIDs;
