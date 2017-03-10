// you should start the procedure using: node --inspect --debug-brk script/testGroupedDiastereotopic.js


var OCLE=require('..');

var molecule=OCLE.Molecule.fromSmiles('CCCCOCCCCCc1ccccc1');

molecule.addImplicitHydrogens();

var start=Date.now();

//console.profile('Profiling diastereotopic ID');

for (var i=0; i<10000; i++) {
   // var result = molecule.getGroupedDiastereotopicAtomIDs();
    var result = molecule.getIDCode();
}

//console.profileEnd();

console.log((Date.now()-start)/1000);

