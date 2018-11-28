'use strict';

const fs = require('fs');

const DB = require('../..').DB;

var sdf = fs.readFileSync(`${__dirname}/../../../data/data.sdf`, 'ascii');
var csv = fs.readFileSync(`${__dirname}/../../../data/data.csv`, 'ascii');

describe('DB', () => {
  describe('parseSDF', () => {
    test('should parse all molecules', () => {
      return DB.parseSDF(sdf).then(function (db) {
        expect(db).toHaveLength(20);
        expect(db.data).toHaveLength(20);
        expect(db.molecules).toHaveLength(20);
      });
    });

    test('should call step for each molecule', () => {
      var called = 0;
      function onStep(current, total) {
        expect(current).toBe(++called);
        expect(total).toBe(20);
      }
      return DB.parseSDF(sdf, { onStep: onStep }).then(function () {
        expect(called).toBe(20);
      });
    });

    test('should compute properties', () => {
      return DB.parseSDF(sdf, { computeProperties: true }).then(function (db) {
        expect(db.data[0]).toHaveProperty('properties');
        expect(db.data[0].properties.formula).toBeDefined();
        expect(db.data[0].properties.logP).toBeDefined();
        expect(db.data[0].properties.polarSurfaceArea).toBeDefined();
      });
    });
  });

  describe('parseCSV', () => {
    test('should parse all molecules', () => {
      return DB.parseCSV(csv).then(function (db) {
        expect(db).toHaveLength(5);
      });
    });

    test('should call step for each molecule', () => {
      var called = 0;
      function onStep(current, total) {
        expect(current).toBe(++called);
        expect(total).toBe(5);
      }
      return DB.parseCSV(csv, { onStep: onStep }).then(function () {
        expect(called).toBe(5);
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
      expect(function () {
        db.search(null);
      }).toThrowError(/toSearch must be a Molecule or string/);
      expect(function () {
        db.search('CCC', { mode: 'abc' });
      }).toThrowError(/unknown search mode: abc/);
    });

    test('exact with SMILES', () => {
      var result = db.search('CC', { format: 'smiles', mode: 'exact' });
      expect(result).toHaveLength(1);
      result = db.search('CCC', { format: 'smiles', mode: 'exact' });
      expect(result).toHaveLength(2);
      result = db.search('CCC', { format: 'smiles', mode: 'exact', limit: 1 });
      expect(result).toHaveLength(1);
      result = db.search('CCCO', { format: 'smiles', mode: 'exact' });
      expect(result).toHaveLength(0);
    });

    test('subStructure with SMILES', () => {
      var result = db.search('CC', { format: 'smiles', mode: 'substructure' });
      expect(result).toHaveLength(4);
      expect(result.data[0].name).toBe('Ethane');
      result = db.search('CCC', { format: 'smiles' });
      expect(result).toHaveLength(3);
      result = db.search('CCC', { format: 'smiles', limit: 1 });
      expect(result).toHaveLength(1);
      result = db.search('CCCO', { format: 'smiles' });
      expect(result).toHaveLength(0);
    });

    test('similarity with SMILES', () => {
      var result = db.search('CC', { format: 'smiles', mode: 'similarity' });
      expect(result).toHaveLength(5);
      expect(result.data[0].name).toBe('Ethane');
      result =
          db.search('CC', { format: 'smiles', mode: 'similarity', limit: 2 });
      expect(result).toHaveLength(2);
    });
  });
});
