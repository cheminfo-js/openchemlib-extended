'use strict';
const fs = require('fs');

var OCL = require('openchemlib');
const DB = require('./DB')(OCL);

console.log(DB.parseCSV);

let csv = fs.readFileSync(`${__dirname}/../../data/data.csv`, 'ascii');

async function load() {
  let db = await DB.parseCSV(csv);
  console.log(db);
}

load();
