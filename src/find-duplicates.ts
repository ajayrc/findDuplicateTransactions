import { TIME_GAP_FOR_DUPLICATE_TRANSACTION } from "./config";
import { Transaction } from "./model";

// find all transactions that have the same `sourceAccount`, `targetAccount`, `category`, `amount`, and the time difference between each consecutive transaction is less than 1 minute.

/**
 * @param transactions List of transactions
 * @returns {Transaction[]} List of duplicate transactions
 */
export function findDuplicateTransactions(
  transactions: Transaction[]
): Transaction[][] | undefined {

  if (!Array.isArray(transactions)) {
    handleError();
  }

  const keyMap: Map<string, Set<Transaction>> = new Map();

  try {
    transactions.forEach((cuurentTransaction: Transaction) => {
      const keyStr = `${cuurentTransaction.sourceAccount}_${cuurentTransaction.targetAccount}_${cuurentTransaction.amount}_${cuurentTransaction.category}`;

      const duplicateTrans: Transaction[] = transactions.filter((trans: Transaction) => { // find duplicate transactions for each
        return (trans.id != cuurentTransaction.id && // dont compare with self
          trans.sourceAccount === cuurentTransaction.sourceAccount &&
          trans.targetAccount === cuurentTransaction.targetAccount &&
          trans.amount === cuurentTransaction.amount &&
          trans.category.toLowerCase() === cuurentTransaction.category.toLowerCase() && // dont do toLowerCase if case comparision is required
          Math.abs(new Date(trans.time).getTime() - new Date(cuurentTransaction.time).getTime()) < TIME_GAP_FOR_DUPLICATE_TRANSACTION
        );
      });

      if (duplicateTrans.length > 0) {
        let keySet: Set<Transaction>;

        if (keyMap.has(keyStr)) {
          keySet = keyMap.get(keyStr)!;
        } else {
          keySet = new Set<Transaction>();
        }

        keyMap.set(keyStr, keySet);// group duplicate transactions having same key

        duplicateTrans.forEach((duplciateTrans: Transaction) => {
          keySet.add(duplciateTrans);// add only unique transactions using Set
        });
      }
    });

    const output: Transaction[][] = Array.from(keyMap.values()).map(setItem => Array.from(setItem).sort((aTransaction: Transaction, bTransaction: Transaction) => aTransaction.id - bTransaction.id)); // get values from Set as an array after sorting

    return output;
  } catch (e: any) {
    handleError(e);
  }
}

/**
 * @param e optional error objecr
 * @throws {Error} custom error
 * @returns {Transaction[]} or send empty data back to consumer
 */
function handleError(e?: Error) {
  // fail silently/ return [] or throw custom error based on contract with the consumer
  if (e) {
    console.error("e:", e); // todo: log error to analytics sytem based on Environment/configs rather at Console.log. Use e.g. Winston
    // see my blog for more: https://ajayrc.medium.com/application-insights-using-azure-and-vuejs-error-handling-and-event-logging-in-front-end-to-40874d76f152    
    throw "Illtyped Data";
  } else {
    throw "Invalid Data";
  }
}
