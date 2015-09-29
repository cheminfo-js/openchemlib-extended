'use strict';

var Molecule = require('openchemlib').Molecule;
var parseSDF = require('sdf-parser');
var Papa = require('papaparse');
var extend = require('extend');

var moleculeCreator = require('./moleculeCreator');

var defaultCollectionOptions = {
    length: 0,
    computeProperties: false
};

function MolCollection(options) {
    options = extend({}, defaultCollectionOptions, options);
    this.data = new Array(options.length);
    this.molecules = new Array(options.length);
    this.statistics = null;
    this.length = 0;
    this.computeProperties = !!options.computeProperties;
}

MolCollection.parseSDF = function (sdf, options) {
    if (typeof sdf !== 'string') {
        throw new TypeError('sdf must be a string');
    }
    var parsed = parseSDF(sdf);
    var molecules = parsed.molecules;
    var collection = new MolCollection(options);
    for (var i = 0; i < molecules.length; i++) {
        collection.push(Molecule.fromMolfile(molecules[i].molfile.value), molecules[i]);
    }
    collection.statistics = parsed.statistics;
    return collection;
};

var defaultCSVOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
};

MolCollection.parseCSV = function (csv, options) {
    if (typeof csv !== 'string') {
        throw new TypeError('csv must be a string');
    }
    options = extend({}, defaultCSVOptions, options);
    var parsed = Papa.parse(csv, options);
    var fields = parsed.meta.fields;
    var stats = new Array(fields.length);
    var firstElement = parsed.data[0];
    var datatype, datafield;
    for (var i = 0; i < fields.length; i++) {
        stats[i] = {
            label: fields[i],
            isNumeric: typeof firstElement[fields[i]] === 'number'
        };
        var lowerField = fields[i].toLowerCase();
        if (moleculeCreator.fields.has(lowerField)) {
            datatype = moleculeCreator.fields.get(lowerField);
            datafield = fields[i];
        }
    }
    if (!datatype) {
        throw new Error('this document does not contain any molecule field');
    }
    var collection = new MolCollection(options);
    for (var i = 0; i < parsed.data.length; i++) {
        collection.push(datatype(parsed.data[i][datafield]), parsed.data[i])
    }
    collection.statistics = stats;
    return collection;
};

MolCollection.prototype.push = function (molecule, data) {
    if (data === undefined) data = {};
    this.molecules[this.length] = molecule;
    this.data[this.length++] = data;
    if (this.computeProperties) {
        var molecularFormula = molecule.getMolecularFormula();
        data.molecularFormula = {
            absoluteWeight: molecularFormula.getAbsoluteWeight(),
            relativeWeight: molecularFormula.getRelativeWeight(),
            formula: molecularFormula.getFormula()
        };
        var properties = molecule.getProperties();
        data.properties = {
            acceptorCount: properties.getAcceptorCount(),
            donorCount: properties.getDonorCount(),
            logP: properties.getLogP(),
            logS: properties.getLogS(),
            polarSurfaceArea: properties.getPolarSurfaceArea(),
            rotatableBondCount: properties.getRotatableBondCount(),
            stereoCenterCount: properties.getStereoCenterCount()
        };
    }
};

module.exports = MolCollection;
