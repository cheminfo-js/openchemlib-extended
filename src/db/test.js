'use strict';
const fs = require('fs');

const DB = require('./DB');

let csv = fs.readFileSync(`${__dirname}/../../data/data.csv`, 'ascii');

async function load() {
  let db = await DB.parseCSV(csv);
  console.log(db);
}

load();
