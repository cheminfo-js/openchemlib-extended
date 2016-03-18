'use strict';

var DB = require('../..').DB;
var fs = require('fs');
var Molecule = require('../..').Molecule;

var sdf = fs.readFileSync(__dirname + '/../data/data.sdf', 'ascii');
var csv = fs.readFileSync(__dirname + '/../data/data.csv', 'ascii');

describe('DB', function () {
    describe('parseSDF', function () {
        it('should parse all molecules', function () {
            return DB.parseSDF(sdf).then(function (db) {
                db.length.should.equal(20);
                db.data.length.should.equal(20);
                db.molecules.length.should.equal(20);
            });
        });

        it('should call step for each molecule', function () {
            var called = 0;
            function onStep(current, total) {
                current.should.equal(++called);
                total.should.equal(20);
            }
            return DB.parseSDF(sdf, {onStep: onStep}).then(function () {
                called.should.equal(20);
            });
        });

        it('should compute properties', function () {
            return DB.parseSDF(sdf, {computeProperties: true}).then(function (db) {
                db.data[0].should.have.property('properties');
                db.data[0].properties.should.have.properties(['formula', 'logP', 'polarSurfaceArea']);
            });
        });
    });

    describe('parseCSV', function () {
        it('should parse all molecules', function () {
            return DB.parseCSV(csv).then(function (db) {
                db.length.should.equal(5);
            });
        });

        it('should call step for each molecule', function () {
            var called = 0;
            function onStep(current, total) {
                current.should.equal(++called);
                total.should.equal(5);
            }
            return DB.parseCSV(csv, {onStep: onStep}).then(function () {
                called.should.equal(5);
            });
        });
    });

    describe('search', function () {
        var db;
        before(function () {
            return DB.parseCSV(csv).then(function (database) {
                db = database;
            });
        });

        it('invalid arguments', function () {
            (function () {
                db.search(null);
            }).should.throw(/toSearch must be a Molecule or string/);
            (function () {
                db.search('CCC', {mode: 'abc'});
            }).should.throw(/unknown search mode: abc/);
        });

        it('exact with SMILES', function () {
            var result = db.search('CC', {format: 'smiles', mode: 'exact'});
            result.length.should.equal(1);
            result = db.search('CCC', {format: 'smiles', mode: 'exact'});
            result.length.should.equal(2);
            result = db.search('CCC', {format: 'smiles', mode: 'exact', limit: 1});
            result.length.should.equal(1);
            result = db.search('CCCO', {format: 'smiles', mode: 'exact'});
            result.length.should.equal(0);
        });

        it('subStructure with SMILES', function () {
            var result = db.search('CC', {format: 'smiles', mode: 'substructure'});
            result.length.should.equal(4);
            result.data[0].name.should.equal('Ethane');
            result = db.search('CCC', {format: 'smiles'});
            result.length.should.equal(3);
            result = db.search('CCC', {format: 'smiles', limit: 1});
            result.length.should.equal(1);
            result = db.search('CCCO', {format: 'smiles'});
            result.length.should.equal(0);
        });

        it('similarity with SMILES', function () {
            var result = db.search('CC', {format: 'smiles', mode: 'similarity'});
            result.length.should.equal(5);
            result.data[0].name.should.equal('Ethane');
            result = db.search('CC', {format: 'smiles', mode: 'similarity', limit: 2});
            result.length.should.equal(2);
        });
    });
});
