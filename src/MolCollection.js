'use strict';

var Molecule = require('openchemlib').Molecule;
var parseSDF = require('sdf-parser');
var Papa = require('papaparse');
var extend = require('extend');

var moleculeCreator = require('./moleculeCreator');

var defaultCollectionOptions = {
    computeProperties: false
};

function MolCollection(molecules, data, stats, options) {
    if (molecules === undefined) molecules = 0;
    if (typeof molecules === 'number') {
        options = data;
        this.data = new Array(molecules);
        this.molecules = new Array(molecules);
        this.statistics = null;
        this.currentIndex = 0;
    } else {
        this.data = molecules;
        this.molecules = data;
        this.statistics = stats;
        this.currentIndex = this.data.length;
    }
    options = extend({}, defaultCollectionOptions, options);
    this.computeProperties = !!options.computeProperties;
}

MolCollection.parseSDF = function (sdf, options) {
    if (typeof sdf !== 'string') {
        throw new TypeError('sdf must be a string');
    }
    var parsed = parseSDF(sdf);
    var molecules = parsed.molecules;
    var collection = new MolCollection(molecules.length, options);
    for (var i = 0; i < molecules.length; i++) {
        collection.add(Molecule.fromMolfile(molecules[i].molfile.value), molecules[i]);
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
    var molecules = datatype(datafield, parsed.data, new Array(parsed.data.length));
    return new MolCollection(molecules, parsed.data, stats);
};

MolCollection.prototype.add = function (molecule, data) {
    if (data === undefined) data = {};
    this.molecules[this.currentIndex] = molecule;
    this.data[this.currentIndex++] = data;
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
