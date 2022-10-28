const BIT = 'העברה ב BIT בנה"פ';
const BIT_INCOME = "bit העברת כסף";
const BANK = "העב' לאחר-נייד";
const PAYBOX = "PAYBOX";

export const isThirdPartyTransaction = (name) => {
  return [BIT, BIT_INCOME, BANK, PAYBOX].includes(name);
};

export const aggregateTransactionsByName = (transactions) => {
  const aggregatedTransactions = [];
  for (const transaction of transactions) {
    const { name, amount } = transaction;
    if (isThirdPartyTransaction(name)) {
      debugger;
      transaction.updateTransactionsCount &&
        transaction.updateTransactionsCount();
      aggregatedTransactions.push(transaction);
      continue;
    }

    const transactionIndex = aggregatedTransactions.findIndex(
      (aggregatedTransaction) => aggregatedTransaction.name === name
    );

    const hasTransactionName = transactionIndex !== -1;
    if (hasTransactionName) {
      debugger;
      transaction.updateTransactionsCount &&
        transaction.updateTransactionsCount();
      aggregatedTransactions[transactionIndex].amount += amount;
      continue;
    }

    aggregatedTransactions.push(transaction);
  }

  return aggregatedTransactions;
};
