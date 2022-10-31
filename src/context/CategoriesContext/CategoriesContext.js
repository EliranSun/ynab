import { useState, useMemo, createContext } from "react";
import { sortBy } from "lodash";
import { Categories } from "../../constants";
import { aggregateTransactionsByName } from "../../utils";

export const CategoriesContext = createContext({
	categories: [],
	setCategories: () => {},
	transactions: [], // TODO: different context, or a more general name for this context
	sortedTransactionsByDate: [],
	setTransactions: () => {},
});

const getLastTransactions = () => {
	try {
		const transactions = JSON.parse(localStorage.getItem("lastPaste")) || [];
		const sortedAggregatedTransactions = sortBy(
			aggregateTransactionsByName(transactions),
			({ timestamp }) => timestamp
		).reverse();

		return { transactions, sortedAggregatedTransactions };
	} catch (error) {
		console.warn(error);
		return { transactions: [], sortedAggregatedTransactions: [] };
	}
};

export const CategoriesContextProvider = ({ children }) => {
	const memoTransactions = useMemo(() => getLastTransactions(), []);
	const [categories, setCategories] = useState(Categories);
	const [transactions, setTransactions] = useState(
		memoTransactions.transactions
	);

	return (
		<CategoriesContext.Provider
			value={{
				categories,
				updateCategoryExpenseId: (categoryId, expenseId) => {
					const newCategories = categories.map((category) => {
						const shouldRemoveExpense =
							category.id === categoryId &&
							category.expensesIds.includes(expenseId);
						const shouldAddExpense =
							category.id === categoryId &&
							!category.expensesIds.includes(expenseId);
						if (shouldRemoveExpense) {
							return {
								...category,
								expensesIds: category.expensesIds.filter(
									(id) => id !== expenseId
								),
							};
						}

						if (shouldAddExpense) {
							return {
								...category,
								expenses: [...category.expenses, expenseId],
							};
						}

						return category;
					});
					setCategories(newCategories);
				},
				setCategories,
				transactions,
				sortedAggregatedTransactions:
					memoTransactions.sortedAggregatedTransactions,
				setTransactions,
			}}
		>
			{children}
		</CategoriesContext.Provider>
	);
};
