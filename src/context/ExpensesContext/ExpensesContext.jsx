import { useState, createContext, useMemo, useEffect } from "react";
import { noop } from "lodash";
import {
	getExpenses,
	// arrageExpensesByMonth,
	updateExpense,
	addExpenses,
} from "../../utils";

export const ExpensesContext = createContext({
	expenses: {},
	changeExpenseCategoryByName: noop,
});

export const ExpensesContextProvider = ({ children }) => {
	const [expenses, setExpenses] = useState({});
	const expensesArray = useMemo(() => Object.values(expenses), [expenses]);

	useEffect(() => {
		(async () => {
			const expenses = await getExpenses();
			setExpenses(expenses);
		})();
	}, []);

	const setExpenseAsRecurring = (expenseId, isRecurring) => {
		updateExpense(expenseId, { isRecurring });
		setExpenses({
			...expenses,
			[expenseId]: {
				...expenses[expenseId],
				isRecurring,
			},
		});
	};

	const setExpenseAsIncome = (expenseId, isIncome) => {
		updateExpense(expenseId, { isIncome });
		setExpenses({
			...expenses,
			[expenseId]: {
				...expenses[expenseId],
				isIncome,
			},
		});
	};

	const setExpenseNote = (expenseId, note) => {
		updateExpense(expenseId, { note });
		setExpenses({
			...expenses,
			[expenseId]: {
				...expenses[expenseId],
				note,
			},
		});
	};

	const changeExpenseCategory = (expenseId, categoryId) => {
		const expense = expenses[expenseId];
		const allExpensesWithTheSameName = expensesArray.filter(
			({ name }) => name === expense.name
		);
		if (!expense.isThirdParty) {
			allExpensesWithTheSameName.forEach((expense) => {
				updateExpense(expense.id, { categoryId });
				setExpenses({
					...expenses,
					[expense.id]: {
						...expenses[expense.id],
						categoryId,
					},
				});
			});

			return;
		}

		updateExpense(expenseId, { categoryId });
		setExpenses({
			...expenses,
			[expenseId]: {
				...expenses[expenseId],
				categoryId,
			},
		});
	};

	return (
		<ExpensesContext.Provider
			value={{
				expenses,
				setExpenseAsRecurring,
				setExpenseAsIncome,
				changeExpenseCategory,
				setExpenseNote,
				expensesArray,
				setExpenses: (newExpenses = []) => {
					const expensesObject = newExpenses.reduce(
						(acc, curr) => (acc[curr.id] = curr),
						{}
					);

					addExpenses(newExpenses);
					setExpenses(expensesObject);
				},
			}}
		>
			{children}
		</ExpensesContext.Provider>
	);
};
