'use strict';

var Molecule = require('openchemlib').Molecule;

var fields = new Map();
exports.fields = fields;

fields.set('oclid', Molecule.fromIDCode);
fields.set('smiles', Molecule.fromSmiles);
fields.set('molfile', Molecule.fromMolfile);
