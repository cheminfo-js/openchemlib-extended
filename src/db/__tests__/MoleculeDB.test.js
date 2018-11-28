'use strict';

const fs = require('fs');

const MoleculeDB = require('../..').DB;

var sdf = fs.readFileSync(`${__dirname}/../../../data/data.sdf`, 'ascii');
var csv = fs.readFileSync(`${__dirname}/../../../data/data.csv`, 'ascii');

describe('DB', () => {
  describe('parseSDF', () => {
    test('should parse all molecules', async () => {
      let moleculeDB = await MoleculeDB.parseSDF(sdf);
      expect(Object.keys(moleculeDB.db)).toHaveLength(10);
      let db = moleculeDB.getDB();
      expect(db).toHaveLength(10);
      expect(db.filter((entry) => entry.properties)).toHaveLength(10);
    });

    test('should call step for each molecule', () => {
      var called = 0;
      function onStep(current, total) {
        expect(current).toBe(++called);
        expect(total).toBe(20);
      }
      return MoleculeDB.parseSDF(sdf, { onStep: onStep }).then(function () {
        expect(called).toBe(20);
      });
    });

    test('should compute properties', async () => {
      let moleculeDB = await MoleculeDB.parseSDF(sdf, {
        computeProperties: true
      });
      let firstEntry = moleculeDB.getDB()[0];
      expect(firstEntry).toHaveProperty('properties');
      expect(firstEntry.properties.mf).toBeDefined();
      expect(firstEntry.properties.logP).toBeDefined();
      expect(firstEntry.properties.polarSurfaceArea).toBeDefined();
    });
  });

  describe('parseCSV', () => {
    test('should parse all molecules', async () => {
      let moleculeDB = await MoleculeDB.parseCSV(csv);
      expect(moleculeDB.getDB()).toHaveLength(4);
    });

    test('should call step for each molecule', () => {
      var called = 0;
      function onStep(current, total) {
        expect(current).toBe(++called);
        expect(total).toBe(5);
      }
      return MoleculeDB.parseCSV(csv, { onStep: onStep }).then(function () {
        expect(called).toBe(5);
      });
    });
  });

  describe('search', () => {
    var db;
    beforeAll(function () {
      return MoleculeDB.parseCSV(csv).then(function (database) {
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
      expect(result[0].data.name).toBe('Ethane');
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
      expect(result[0].data.name).toBe('Ethane');
      result = db.search('CC', {
        format: 'smiles',
        mode: 'similarity',
        limit: 2
      });
      expect(result).toHaveLength(2);
    });
  });
});
