import { useState, createContext } from "react";
import { noop } from "lodash";
import { Expense } from "../../models";
import { getExpenses, setExpenses as setStorageExpenses } from "../../utils";

export const ExpensesContext = createContext({
	expenses: {},
	changeExpenseCategoryByName: noop,
});

// const getLastExpenses = () => {
// 	let lastExpenses = {};
// 	try {
// 		lastExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
// 		return lastExpenses.map((expense) => new Expense(expense));
// 	} catch (error) {
// 		console.warn(error);
// 		return [];
// 	}
// };

// const updateExpenses = (expense, id) => (prevExpenses) => {
// 	const newExpenses = prevExpenses
// 		.filter((expense) => expense.id !== id)
// 		.concat(expense);

// 	return newExpenses;
// };

export const ExpensesContextProvider = ({ children }) => {
	const [expenses, setExpenses] = useState(getExpenses());
	const [error, setError] = useState(null);

	return (
		<ExpensesContext.Provider
			value={{
				expenses,
				changeExpenseCategoryByName: (name, categoryId) => {
					setExpenses((prevExpenses) => {
						const newExpenses = prevExpenses.map((expense) => {
							if (expense.name === name) {
								return {
									...expense,
									categoryId,
								};
							}

							return expense;
						});

						setStorageExpenses(newExpenses);
						return newExpenses;
					});
				},
				// setExpenses: (newExpenses = []) => {
				// 	setError("");

				// 	if (!newExpenses.length) {
				// 		return;
				// 	}

				// 	const handledExpenses = newExpenses.map((newExpense) => {
				// 		const { name, id, timestamp } = newExpense;
				// 		if (!name || !id) {
				// 			setError(`Missing name or id, name: ${name}, id: ${id}`);
				// 			throw new Error(`Missing name or id, name: ${name}, id: ${id}`);
				// 		}

				// 		const oldExpense = expenses.find((expense) => {
				// 			return (
				// 				expense.id === id ||
				// 				(expense.name === name && expense.timestamp === timestamp)
				// 			);
				// 		});

				// 		if (oldExpense) {
				// 			console.debug(
				// 				"Switching categories from",
				// 				oldExpense.categoryId,
				// 				"to",
				// 				newExpense.categoryId
				// 			);
				// 			return new Expense({
				// 				...oldExpense,
				// 				...newExpense,
				// 			});
				// 		}

				// 		return new Expense(newExpense);
				// 	});

				// 	setExpenses(updateExpenses(expenses));
				// },
			}}
		>
			{children}
			<span className="error">{error}</span>
		</ExpensesContext.Provider>
	);
};
