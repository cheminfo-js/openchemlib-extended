'use strict';


const OCLE = require('../..');


describe('getHosesCodeForAtom test propane', () => {
  it.only('minSphereSize:0, maxSphereSize:3', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    let results = molecule.getHoseCodesForAtom(0, {
      minSphereSize: 0,
      maxSphereSize: 3
    });
    expect(results).toHaveLength(4);
    expect(results).toMatchSnapshot();
  });

  it('minSphereSize:1, maxSphereSize:2', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    let results = molecule.getHoseCodesForAtom(0, {
      minSphereSize: 1,
      maxSphereSize: 2
    });
    expect(results).toHaveLength(2);
  });
});
