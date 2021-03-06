import { Sci } from '../source/sci';

type TestParams = {
  sci: string;
  validCoverageN: number | null;
  invalidCoverageN: number | null;
  symbols: string[];
  validSequences: string[];
  invalidSequences: string[];
};

describe('Sci', () => {
  const testParams: TestParams[] = [
    {
      sci: 'O.C',
      validCoverageN: 0,
      invalidCoverageN: 2,
      symbols: ['C', 'O'],
      validSequences: ['O.C'],
      invalidSequences: ['C', 'O', 'C.C', 'C.O', 'O.O'],
    },
    {
      sci: 'O.Z.Z.C',
      validCoverageN: 0,
      invalidCoverageN: 2,
      symbols: ['C', 'O', 'Z'],
      validSequences: ['O.Z.Z.C'],
      invalidSequences: ['C', 'O', 'Z', 'C.C', 'C.O', 'C.Z', 'O.C', 'O.O', 'O.Z', 'Z.C', 'Z.O', 'Z.Z'],
    },
    {
      sci: 'S|M',
      validCoverageN: 0,
      invalidCoverageN: 1,
      symbols: ['M', 'S'],
      validSequences: ['M', 'S'],
      invalidSequences: [],
    },
    {
      sci: 'O.(S|M).C',
      validCoverageN: 0,
      invalidCoverageN: 2,
      symbols: ['C', 'M', 'O', 'S'],
      validSequences: ['O.M.C', 'O.S.C'],
      invalidSequences: [
        'C',
        'M',
        'O',
        'S',
        'C.C',
        'C.M',
        'C.O',
        'C.S',
        'M.C',
        'M.M',
        'M.O',
        'M.S',
        'O.C',
        'O.M',
        'O.O',
        'O.S',
        'S.C',
        'S.M',
        'S.O',
        'S.S',
      ],
    },
    {
      sci: 'Open.Close',
      validCoverageN: 0,
      invalidCoverageN: 2,
      symbols: ['Close', 'Open'],
      validSequences: ['Open.Close'],
      invalidSequences: ['Close', 'Open', 'Close.Close', 'Close.Open', 'Open.Open'],
    },
    {
      sci: 'Select|Move',
      validCoverageN: 0,
      invalidCoverageN: 1,
      symbols: ['Move', 'Select'],
      validSequences: ['Move', 'Select'],
      invalidSequences: [],
    },
    {
      sci: 'Op.(Sel|Mov).Clo',
      validCoverageN: null,
      invalidCoverageN: 1,
      symbols: ['Clo', 'Mov', 'Op', 'Sel'],
      validSequences: ['Op.Mov.Clo', 'Op.Sel.Clo'],
      invalidSequences: ['Clo', 'Mov', 'Op', 'Sel'],
    },
    /**
     * Quantifiers
     */
    {
      sci: 'O.C*',
      validCoverageN: 3,
      invalidCoverageN: 2,
      symbols: ['C', 'O'],
      validSequences: ['O', 'O.C', 'O.C.C', 'O.C.C.C'],
      invalidSequences: ['C', 'C.C', 'C.O', 'O.O'],
    },
    {
      sci: 'O.C+',
      validCoverageN: 3,
      invalidCoverageN: 2,
      symbols: ['C', 'O'],
      validSequences: ['O.C', 'O.C.C', 'O.C.C.C', 'O.C.C.C.C'],
      invalidSequences: ['C', 'O', 'C.C', 'C.O', 'O.O'],
    },

    {
      sci: 'A+',
      validCoverageN: 3,
      invalidCoverageN: 2,
      symbols: ['A'],
      validSequences: ['A', 'A.A', 'A.A.A', 'A.A.A.A'],
      invalidSequences: [],
    },
    {
      sci: 'A.B.C+',
      validCoverageN: 0,
      invalidCoverageN: 1,
      symbols: ['A', 'B', 'C'],
      validSequences: ['A.B.C'],
      invalidSequences: ['A', 'B', 'C'],
    },
    {
      sci: 'A.B.C+',
      validCoverageN: 1,
      invalidCoverageN: 1,
      symbols: ['A', 'B', 'C'],
      validSequences: ['A.B.C', 'A.B.C.C'],
      invalidSequences: ['A', 'B', 'C'],
    },
    {
      sci: 'A.B.C+',
      validCoverageN: 2,
      invalidCoverageN: 2,
      symbols: ['A', 'B', 'C'],
      validSequences: ['A.B.C', 'A.B.C.C', 'A.B.C.C.C'],
      invalidSequences: ['A', 'B', 'C', 'A.A', 'A.B', 'A.C', 'B.A', 'B.B', 'B.C', 'C.A', 'C.B', 'C.C'],
    },
    {
      sci: 'a.b*',
      validCoverageN: 2,
      invalidCoverageN: 2,
      symbols: ['a', 'b'],
      validSequences: ['a', 'a.b', 'a.b.b'],
      invalidSequences: ['b', 'a.a', 'b.a', 'b.b'],
    },
  ];

  for (let tp of testParams) {
    describe(`SCI: ${tp.sci}`, () => {
      const instance = new Sci(tp.sci);
      const validSequences = instance.validSequences(tp.validCoverageN);
      const invalidSequences = instance.invalidSequences(tp.invalidCoverageN);

      describe('interactionSymbols', () => {
        it(`should get symbols [${tp.symbols.join(', ')}]`, () => {
          expect(instance.interactionSymbols).toEqual(tp.symbols);
        });
      });

      describe(`validSequences(${tp.validCoverageN})`, () => {
        it(`should generate [${tp.validSequences.join(', ')}]`, () => {
          expect(validSequences).toEqual(tp.validSequences);
        });

        if (validSequences.toString() !== '') {
          for (let sequence of validSequences) {
            const regex = new RegExp(tp.sci.replace(/\./g, '\\.?'));
            it(`'${sequence}' should match ${regex}`, () => {
              expect(regex.test(sequence)).toBeTruthy();
            });
          }
        }
      });

      describe(`invalidSequences(${tp.invalidCoverageN})`, () => {
        it(`should generate [${tp.invalidSequences.join(', ')}]`, () => {
          expect(invalidSequences).toEqual(tp.invalidSequences);
        });

        if (invalidSequences.toString() !== '') {
          for (let sequence of invalidSequences) {
            const regex = new RegExp('^' + tp.sci.replace(/\./g, '\\.') + '$', 'g');
            it(`'${sequence}' should not match ${regex}`, () => {
              expect(regex.test(sequence)).toBeFalsy();
            });
          }
        }
      });
    });
  }
});
