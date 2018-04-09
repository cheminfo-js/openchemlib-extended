'use strict';


const OCLE = require('../..');


describe('cleaveBonds test propane', () => {
  test('min:1, max:2', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    let results = molecule.cleaveBonds({

    });
    console.log(results);

  });


});
