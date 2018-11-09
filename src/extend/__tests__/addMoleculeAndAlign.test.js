'use strict';
const fs = require('fs');
const join = require('path').join;

const OCLE = require('../..');


test('add a molecule and align in vertically', () => {
  let molfile = fs.readFileSync(join(__dirname, 'ru.mol'), 'utf8');
  let molecule = OCLE.Molecule.fromMolfile(molfile);
  let molecule2 = OCLE.Molecule.fromMolfile(molfile);
  expect(molecule.addMoleculeAndAlign(molecule2).toMolfile()).toMatchSnapshot();
});
