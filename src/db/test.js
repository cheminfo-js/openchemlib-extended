'use strict';
const fs = require('fs');

var OCL = require('openchemlib');

const DB = require('./MoleculeDB')(OCL);

console.log(DB.parseCSV);

let csv = fs.readFileSync(`${__dirname}/../../data/data.csv`, 'ascii');
let sdf = fs.readFileSync(`${__dirname}/../../data/data.sdf`, 'ascii');

async function load() {
  let db = await DB.parseSDF(sdf);

  let result = db.search('CCCCCCCCCC=O', {
    mode: 'similarity',
    format: 'smiles',
    flattenResult: false,
    keepMolecule: false
  });
  console.log(result);
}

load();
