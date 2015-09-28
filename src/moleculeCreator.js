'use strict';

var Molecule = require('openchemlib').Molecule;

var fields = new Map();
exports.fields = fields;

fields.set('oclid', oclid);
fields.set('smiles', smiles);
fields.set('molfile', molfile);

function oclid(field, data, molecules) {
    for (var i = 0; i < data.length; i++) {
        molecules[i] = Molecule.fromIDCode(data[i][field])
    }
    return molecules;
}

function smiles(field, data, molecules) {
    for (var i = 0; i < data.length; i++) {
        molecules[i] = Molecule.fromSmiles(data[i][field])
    }
    return molecules;
}

function molfile(field, data, molecules) {
    for (var i = 0; i < data.length; i++) {
        molecules[i] = Molecule.fromMolfile(data[i][field])
    }
    return molecules;
}
