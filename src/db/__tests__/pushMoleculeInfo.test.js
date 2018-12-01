'use strict';

const MoleculeDB = require('../..').DB;

describe('DB', () => {
  describe('pushMoleculeInfo', () => {
    test('should add idCode molecule manually', async () => {
      let moleculeDB = new MoleculeDB();
      moleculeDB.pushMoleculeInfo({ idCode: 'gC`@Dij@@' });
      moleculeDB.pushMoleculeInfo({ idCode: 'gC`@Dij@@' });
      let db = moleculeDB.getDB();
      expect(db).toHaveLength(1);
    });

    test('should add smiles molecule manually', async () => {
      let moleculeDB = new MoleculeDB();
      moleculeDB.pushMoleculeInfo({ smiles: 'CCCC' });
      moleculeDB.pushMoleculeInfo({ smiles: 'CCCC' });
      moleculeDB.pushMoleculeInfo({ smiles: 'CCCCC' });
      let db = moleculeDB.getDB();
      expect(db).toHaveLength(2);
      expect(db.filter((entry) => entry.properties)).toHaveLength(2);
      let result = moleculeDB.search('CC', {
        format: 'smiles',
        mode: 'substructure',
        flattenResult: false,
        keepMolecule: false
      });
      expect(result).toHaveLength(2);
      expect(result).toMatchSnapshot();
    });
  });
});
