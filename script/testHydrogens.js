var OCLE=require('..');

var molecule=OCLE.Molecule.fromSmiles('CC');

molecule.addImplicitHydrogens();
molecule.ensureHelperArrays(OCLE.Molecule.cHelperNeighbours);

for (var j=0; j<molecule.getAllAtoms(); j++) {
    console.log(j, molecule.getAllConnAtoms(j));
}

