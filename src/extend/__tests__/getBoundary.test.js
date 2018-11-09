'use strict';
const fs = require('fs');
const join = require('path').join;

const OCLE = require('../..');


test('get the boundary of a molfile', () => {
  let molfile = fs.readFileSync(join(__dirname, 'ru.mol'), 'utf8');
  let molecule = OCLE.Molecule.fromMolfile(molfile);
  expect(molecule.getBoundary()).toEqual({ depth: 4.956, height: 4.956, maxX: 13.1799, maxY: -0, maxZ: -0, minX: 0, minY: -4.956, minZ: -4.956, width: 13.1799 });
});
