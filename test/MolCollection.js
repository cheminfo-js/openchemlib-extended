'use strict';

var MolCollection = require('..').MolCollection;
var fs = require('fs');
var Molecule = require('openchemlib').Molecule;

var sdf = fs.readFileSync(__dirname + '/data/data.sdf', 'ascii');
var csv = fs.readFileSync(__dirname + '/data/data.csv', 'ascii');

describe('MolCollection', function () {
    describe('parseSDF', function () {
        var collection = MolCollection.parseSDF(sdf);
        it('should parse all molecules', function () {
            collection.length.should.equal(20);
            collection.data.length.should.equal(20);
            collection.molecules.length.should.equal(20);
        });

        it('should insert correct objects', function () {
            collection.data[0].should.be.an.Object();
            collection.molecules[0].should.be.instanceOf(Molecule);
        });
    });

    describe('parseSDF and compute properties', function () {
        var collection = MolCollection.parseSDF(sdf, {computeProperties: true});
    });

    describe('parseCSV', function () {
        var collection = MolCollection.parseCSV(csv);
        collection.length.should.equal(4);
    });
});
