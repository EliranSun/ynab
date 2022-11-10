import { BIT, BIT_INCOME, BANK, PAYBOX } from "../constants";

export const isThirdPartyTransaction = (name) => {
	return [BIT, BIT_INCOME, BANK, PAYBOX].includes(name);
};

export const aggregateTransactionsByName = (transactions) => {
	const aggregatedTransactions = [];

	debugger;
	for (const transaction of transactions) {
		const { name, amount } = transaction;

		if (isThirdPartyTransaction(name)) {
			aggregatedTransactions.push(transaction);
			continue;
		}

		const transactionIndex = aggregatedTransactions.findIndex(
			(aggregatedTransaction) => aggregatedTransaction.name === name
		);

		const hasTransactionName = transactionIndex !== -1;

		if (hasTransactionName) {
			aggregatedTransactions[transactionIndex].amount += amount;
			aggregatedTransactions[transactionIndex].transactions = [
				...(aggregatedTransactions[transactionIndex].transactions || []),
				transaction,
			];
			continue;
		}

		aggregatedTransactions.push({
			...transaction,
			transactions: [transaction],
		});
	}

	return aggregatedTransactions;
};

export const isExpenseInMonth = (expenseTimestamp, timestamp) => {
	const year = new Date(timestamp).getFullYear();
	const month = new Date(timestamp).getMonth();
	const expenseMonth = new Date(expenseTimestamp).getMonth();
	const expenseYear = new Date(expenseTimestamp).getFullYear();

	return expenseMonth === month && expenseYear === year;
};

// export const arrageExpensesByMonth = (expenses) => {
// 	const monthlyExpenses = {};
// 	expenses.forEach((expense) => {
// 		const { timestamp } = expense;
// 		const date = new Date(timestamp);
// 		const month = date.toLocaleString("default", { month: "long" });
// 		const year = date.getFullYear();
// 		const key = `${month}-${year}`;

// 		if (!monthlyExpenses[key]) {
// 			monthlyExpenses[key] = [expense];
// 		} else {
// 			monthlyExpenses[key].push(expense);
// 		}
// 	});

// 	return monthlyExpenses;
// };

export * from "./localStorage";
export * from "./firebase";
