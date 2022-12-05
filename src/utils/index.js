import { BIT, BIT_INCOME, BANK, PAYBOX, Categories } from "../constants";

export const isThirdPartyTransaction = (name) => {
	return [BIT, BIT_INCOME, BANK, PAYBOX].includes(name);
};

export const aggregateTransactionsByName = (transactions) => {
	const aggregatedTransactions = [];
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

export const getExpenseCategoryName = (categoryId) => {
	let subcategoryName = "";
	const category = Categories.find((category) => {
		const subcategory = category.subCategories.filter(
			(subcategory) => String(subcategory.id) === String(categoryId)
		)[0]?.name;

		if (subcategory) {
			subcategoryName = subcategory;
			return true;
		}

		return false;
	});

	return {
		...category,
		subcategoryName,
	};
};

export * from "./localStorage";
export * from "./firebase";
