'use strict';

var MolCollection = require('..').MolCollection;
var fs = require('fs');
var Molecule = require('openchemlib').Molecule;

var sdf = fs.readFileSync(__dirname + '/data/data.sdf', 'ascii');
var csv = fs.readFileSync(__dirname + '/data/data.csv', 'ascii');

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
            return MolCollection.parseSDF(sdf, {step: onStep}).then(function () {
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
        var collection = MolCollection.parseCSV(csv);
        collection.length.should.equal(4);
    });
});
