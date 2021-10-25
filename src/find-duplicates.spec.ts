import { findDuplicateTransactions } from "./find-duplicates";
import { Transaction } from "./model";

describe("FindDuplicateTransactions::", () => {
  test("Find duplicate transactions - valid data", () => {
    const transactions: Transaction[] = [
      {
        id: 3,
        sourceAccount: 'A',
        targetAccount: 'B',
        amount: 100,
        category: 'eating_out',
        time: '2018-03-02T10:34:30.000Z'
      },
      {
        id: 1,
        sourceAccount: 'A',
        targetAccount: 'B',
        amount: 100,
        category: 'eating_out',
        time: '2018-03-02T10:33:00.000Z'
      },
      {
        id: 6,
        sourceAccount: 'A',
        targetAccount: 'C',
        amount: 250,
        category: 'other',
        time: '2018-03-02T10:33:05.000Z'
      },
      {
        id: 4,
        sourceAccount: 'A',
        targetAccount: 'B',
        amount: 100,
        category: 'eating_out',
        time: '2018-03-02T10:36:00.000Z'
      },
      {
        id: 2,
        sourceAccount: 'A',
        targetAccount: 'B',
        amount: 100,
        category: 'eating_out',
        time: '2018-03-02T10:33:50.000Z'
      },
      {
        id: 5,
        sourceAccount: 'A',
        targetAccount: 'C',
        amount: 250,
        category: 'other',
        time: '2018-03-02T10:33:00.000Z'
      }
    ];

    expect(findDuplicateTransactions(transactions)).toEqual(
      [
        [
          {
            id: 1,
            sourceAccount: "A",
            targetAccount: "B",
            amount: 100,
            category: "eating_out",
            time: "2018-03-02T10:33:00.000Z"
          },
          {
            id: 2,
            sourceAccount: "A",
            targetAccount: "B",
            amount: 100,
            category: "eating_out",
            time: "2018-03-02T10:33:50.000Z"
          },
          {
            id: 3,
            sourceAccount: "A",
            targetAccount: "B",
            amount: 100,
            category: "eating_out",
            time: "2018-03-02T10:34:30.000Z"
          }
        ],
        [
          {
            id: 5,
            sourceAccount: "A",
            targetAccount: "C",
            amount: 250,
            category: "other",
            time: "2018-03-02T10:33:00.000Z"
          },
          {
            id: 6,
            sourceAccount: "A",
            targetAccount: "C",
            amount: 250,
            category: "other",
            time: "2018-03-02T10:33:05.000Z"
          }
        ]
      ]
    );
  });

  test("Find duplicate transactions - empty data", () => {
    const transactions: Transaction[] = [];
    expect(findDuplicateTransactions(transactions)).toEqual([]);
  });

  test("Find duplicate transactions - invalid data at runtime", () => {
    const transactions = null;
    // @ts-ignore // allow to send invalid data during runtime, bypassing compile time checks
    expect(() => findDuplicateTransactions(transactions)).toThrow(
      "Invalid Data"
    );
  });

  test("Find duplicate transactions - illtyped data at runtime", () => {
    const transactions = [null];
    // @ts-ignore // allow to send illtyped data during runtime, bypassing compile time checks
    expect(() => findDuplicateTransactions(transactions)).toThrow(
      "Illtyped Data"
    );
  });
});
