'use strict';


const OCLE = require('../..');


describe('cleaveBonds test propane', () => {
  test('default', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    let results = molecule.cleaveBonds({

    });
    expect(results).toMatchSnapshot();

  });

  test('charged', () => {
    var molecule = OCLE.Molecule.fromSmiles('CC[CH2+]');
    let results = molecule.cleaveBonds({

    });
    expect(results[0].fragments[1].mf).toMatch('C2H4(+)');
  });

});
