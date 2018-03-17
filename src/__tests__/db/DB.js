'use strict';

var DB = require('../..').DB;
var fs = require('fs');

var sdf = fs.readFileSync(__dirname + '/../data/data.sdf', 'ascii');
var csv = fs.readFileSync(__dirname + '/../data/data.csv', 'ascii');

describe('DB', () => {
    describe('parseSDF', () => {
        test('should parse all molecules', () => {
            return DB.parseSDF(sdf).then(function (db) {
                db.length.should.equal(20);
                db.data.length.should.equal(20);
                db.molecules.length.should.equal(20);
            });
        });

        test('should call step for each molecule', () => {
            var called = 0;
            function onStep(current, total) {
                current.should.equal(++called);
                total.should.equal(20);
            }
            return DB.parseSDF(sdf, {onStep: onStep}).then(function () {
                called.should.equal(20);
            });
        });

        test('should compute properties', () => {
            return DB.parseSDF(sdf, {computeProperties: true}).then(function (db) {
                db.data[0].should.have.property('properties');
                db.data[0].properties.should.have.properties(['formula', 'logP', 'polarSurfaceArea']);
            });
        });
    });

    describe('parseCSV', () => {
        test('should parse all molecules', () => {
            return DB.parseCSV(csv).then(function (db) {
                db.length.should.equal(5);
            });
        });

        test('should call step for each molecule', () => {
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

    describe('search', () => {
        var db;
        beforeAll(function () {
            return DB.parseCSV(csv).then(function (database) {
                db = database;
            });
        });

        test('invalid arguments', () => {
            (function () {
                db.search(null);
            }).should.throw(/toSearch must be a Molecule or string/);
            (function () {
                db.search('CCC', {mode: 'abc'});
            }).should.throw(/unknown search mode: abc/);
        });

        test('exact with SMILES', () => {
            var result = db.search('CC', {format: 'smiles', mode: 'exact'});
            result.length.should.equal(1);
            result = db.search('CCC', {format: 'smiles', mode: 'exact'});
            result.length.should.equal(2);
            result = db.search('CCC', {format: 'smiles', mode: 'exact', limit: 1});
            result.length.should.equal(1);
            result = db.search('CCCO', {format: 'smiles', mode: 'exact'});
            result.length.should.equal(0);
        });

        test('subStructure with SMILES', () => {
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

        test('similarity with SMILES', () => {
            var result = db.search('CC', {format: 'smiles', mode: 'similarity'});
            result.length.should.equal(5);
            result.data[0].name.should.equal('Ethane');
            result = db.search('CC', {format: 'smiles', mode: 'similarity', limit: 2});
            result.length.should.equal(2);
        });
    });
});
