import { useState, createContext, useMemo, useEffect } from "react";
import { noop } from "lodash";
import {
	getExpenses,
	setExpenses as setStorageExpenses,
	addTestDoc,
} from "../../utils";

export const ExpensesContext = createContext({
	expenses: {},
	changeExpenseCategoryByName: noop,
});

export const ExpensesContextProvider = ({ children }) => {
	const [expenses, setExpenses] = useState(getExpenses());
	const [error, setError] = useState(null);

	useEffect(() => {
		addTestDoc();
	}, []);

	const memoMonthlyExpenses = useMemo(() => {
		const monthlyExpenses = {};
		expenses.forEach((expense) => {
			const { timestamp } = expense;
			const date = new Date(timestamp);
			const month = date.toLocaleString("default", { month: "long" });
			const year = date.getFullYear();
			const key = `${month}-${year}`;
			if (!monthlyExpenses[key]) {
				monthlyExpenses[key] = [expense];
			} else {
				monthlyExpenses[key].push(expense);
			}
		});

		return monthlyExpenses;
	}, [expenses]);

	const setExpenseAsRecurring = (expenseId, isRecurring) => {
		const newExpenses = expenses.map((expense) => {
			if (expense.id === expenseId) {
				return { ...expense, isRecurring };
			}
			return expense;
		});
		setExpenses(newExpenses);
		setStorageExpenses(newExpenses);
	};

	const setExpenseAsIncome = (expenseId, isIncome) => {
		const newExpenses = expenses.map((expense) => {
			if (expense.id === expenseId) {
				return { ...expense, isIncome };
			}
			return expense;
		});
		setExpenses(newExpenses);
		setStorageExpenses(newExpenses);
	};

	const changeExpenseCategoryByName = (expense, categoryId) => {
		setExpenses((prevExpenses) => {
			const newExpenses = prevExpenses.map((previousExpense) => {
				if (expense.isThirdParty) {
					if (expense.id === previousExpense.id) {
						return {
							...previousExpense,
							categoryId,
						};
					}

					return previousExpense;
				}

				if (expense.name === previousExpense.name) {
					return {
						...previousExpense,
						categoryId,
					};
				}

				return previousExpense;
			});

			setStorageExpenses(newExpenses);
			return newExpenses;
		});
	};

	const setExpenseNote = (expenseId, note) => {
		const newExpenses = expenses.map((expense) => {
			if (expense.id === expenseId) {
				return { ...expense, note };
			}
			return expense;
		});
		setExpenses(newExpenses);
		setStorageExpenses(newExpenses);
	};

	return (
		<ExpensesContext.Provider
			value={{
				expenses,
				monthlyExpenses: memoMonthlyExpenses,
				setExpenseAsRecurring,
				setExpenseAsIncome,
				changeExpenseCategoryByName,
				setExpenseNote,
			}}
		>
			{children}
			<span className="error">{error}</span>
		</ExpensesContext.Provider>
	);
};
