'use strict';


var OCLE = require('../..');
var testSVG='<svg id="ocl" xmlns="http://www.w3.org/2000/svg" version="1.1" width="300px" height="200px" viewBox="0 0 300 200">\r	<style> #ocl {pointer-events:none; }  #ocl .event  { pointer-events:all;}  </style>\r	<line x1="150" y1="94" x2="170" y2="106" style="stroke:rgb(0,0,0);stroke-width:1"/>\r	<line x1="129" y1="106" x2="150" y2="94" style="stroke:rgb(0,0,0);stroke-width:1"/>\r	<line id="ocl:Bond:1-0" class="event" x1="150" y1="94" x2="170" y2="106" stroke-width="8" stroke-opacity="0"/>\r	<line id="ocl:Bond:2-1" class="event" x1="129" y1="106" x2="150" y2="94" stroke-width="8" stroke-opacity="0"/>\r	<circle id="ocl:Atom:0" class="event" cx="170" cy="106" r="8" fill-opacity="0"/>\r	<circle id="ocl:Atom:1" class="event" cx="150" cy="94" r="8" fill-opacity="0"/>\r	<circle id="ocl:Atom:2" class="event" cx="129" cy="106" r="8" fill-opacity="0"/>\r</svg>';

describe('toDiastereotopicSVG on propane', function () {
    var molecule=OCLE.Molecule.fromSmiles('CCC');
    var svg=molecule.toDiastereotopicSVG({svg: testSVG});

    it('check that is contains the diastereotopicID', function () {
        svg.indexOf('data-atomid="eM@HzA~ddxUP"').should.equal(619);
    });
});
