'use strict';

var MolCollection = require('../..').MolCollection;
var fs = require('fs');
var Molecule = require('openchemlib').Molecule;

var sdf = fs.readFileSync(__dirname + '/../data/data.sdf', 'ascii');
var csv = fs.readFileSync(__dirname + '/../data/data.csv', 'ascii');

describe('MolCollection', function () {
    describe('parseSDF', function () {
        it('should parse all molecules', function () {
            return MolCollection.parseSDF(sdf).then(function (collection) {
                collection.length.should.equal(20);
                collection.data.length.should.equal(20);
                collection.molecules.length.should.equal(20);
            });
        });

        it('should call step for each molecule', function () {
            var called = 0;
            function onStep(current, total) {
                current.should.equal(++called);
                total.should.equal(20);
            }
            return MolCollection.parseSDF(sdf, {onStep}).then(function () {
                called.should.equal(20);
            });
        });

        it('should compute properties', function () {
            return MolCollection.parseSDF(sdf, {computeProperties: true}).then(function (collection) {
                collection.data[0].should.have.property('properties');
                collection.data[0].properties.should.have.properties(['formula', 'logP', 'polarSurfaceArea']);
            });
        });
    });

    describe('parseCSV', function () {
        it('should parse all molecules', function () {
            return MolCollection.parseCSV(csv).then(function (collection) {
                collection.length.should.equal(4);
            });
        });

        it('should call step for each molecule', function () {
            var called = 0;
            function onStep(current, total) {
                current.should.equal(++called);
                total.should.equal(4);
            }
            return MolCollection.parseCSV(csv, {onStep}).then(function () {
                called.should.equal(4);
            });
        });
    });

    describe('search', function () {
        var collection;
        before(function () {
            return MolCollection.parseCSV(csv).then(function (col) {
                collection = col;
            });
        });

        it('subStructure with SMILES', function () {
            var result = collection.search('CC', {format: 'smiles'});
            result.length.should.equal(3);
            result = collection.search('CCC', {format: 'smiles'});
            result.length.should.equal(2);
            result = collection.search('CCCO', {format: 'smiles'});
            result.length.should.equal(0);
        });
    });
});
