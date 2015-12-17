'use strict';

var RXN = require('../..').RXN;
var fs = require('fs');


describe('RXN', function () {
    var text = fs.readFileSync(__dirname+'/../data/reaction.rxn').toString();

    var rxn=new RXN(text);

    it('should parse the reaction', function () {
        var newrxn=rxn.toRXN().replace("Openchemlib","JME Molecular Editor");
        newrxn.should.equal(text);
    });

    it('should allow to add product', function () {
        rxn.addProduct("C1CCC1\nJME 2015-05-03 Thu Dec 17 14:46:42 GMT+100 2015\n \n  4  4  0  0  0  0  0  0  0  0999 V2000\n    1.4000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4000    1.4000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    1.4000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  4  1  1  0  0  0  0\nM  END\n");
        rxn.products.length.should.equal(4);
    });
});
