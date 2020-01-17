'use strict';

const fs = require('fs');

const RXN = require('../..').RXN;

describe('RXN', () => {
  let text = fs
    .readFileSync(`${__dirname}/../../../data/reaction.rxn`)
    .toString();

  let rxn = new RXN(text);

  it('should parse the reaction', () => {
    let newrxn = rxn.toRXN().replace('Openchemlib', 'JME Molecular Editor');
    expect(newrxn).toBe(text);
  });

  it('should allow to add product', () => {
    rxn.addProduct(
      'C1CCC1\nJME 2015-05-03 Thu Dec 17 14:46:42 GMT+100 2015\n \n  4  4  0  0  0  0  0  0  0  0999 V2000\n    1.4000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4000    1.4000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    1.4000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  4  1  1  0  0  0  0\nM  END\n',
    );
    expect(rxn.products).toHaveLength(4);
  });

  it('should deal with empty reaction', () => {
    let rxn = new RXN('');
    expect(rxn.products).toHaveLength(0);
    expect(rxn.reagents).toHaveLength(0);
  });
});
