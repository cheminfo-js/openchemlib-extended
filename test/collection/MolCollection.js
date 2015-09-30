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
            return MolCollection.parseSDF(sdf, {onStep: onStep}).then(function () {
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
                collection.length.should.equal(5);
            });
        });

        it('should call step for each molecule', function () {
            var called = 0;
            function onStep(current, total) {
                current.should.equal(++called);
                total.should.equal(5);
            }
            return MolCollection.parseCSV(csv, {onStep: onStep}).then(function () {
                called.should.equal(5);
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

        it('invalid arguments', function () {
            (function () {
                collection.search(null);
            }).should.throw(/toSearch must be a Molecule or string/);
            (function () {
                collection.search('CCC', {mode: 'abc'});
            }).should.throw(/unknown search mode: abc/);
        });

        it('exact with SMILES', function () {
            var result = collection.search('CC', {format: 'smiles', mode: 'exact'});
            result.length.should.equal(1);
            result = collection.search('CCC', {format: 'smiles', mode: 'exact'});
            result.length.should.equal(2);
            result = collection.search('CCC', {format: 'smiles', mode: 'exact', limit: 1});
            result.length.should.equal(1);
            result = collection.search('CCCO', {format: 'smiles', mode: 'exact'});
            result.length.should.equal(0);
        });

        it('subStructure with SMILES', function () {
            var result = collection.search('CC', {format: 'smiles', mode: 'substructure'});
            result.length.should.equal(4);
            result.data[0].name.should.equal('Ethane');
            result = collection.search('CCC', {format: 'smiles'});
            result.length.should.equal(3);
            result = collection.search('CCC', {format: 'smiles', limit: 1});
            result.length.should.equal(1);
            result = collection.search('CCCO', {format: 'smiles'});
            result.length.should.equal(0);
        });

        it('similarity with SMILES', function () {
            var result = collection.search('CC', {format: 'smiles', mode: 'similarity'});
            result.length.should.equal(5);
            result.data[0].name.should.equal('Ethane');
            result = collection.search('CC', {format: 'smiles', mode: 'similarity', limit: 2});
            result.length.should.equal(2);
        });
    });
});
