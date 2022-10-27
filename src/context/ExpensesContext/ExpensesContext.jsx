import { useState, createContext } from "react";
import { noop, isArray } from "lodash";

export const ExpensesContext = createContext({
	expenses: {},
	setExpenses: noop,
});

let lastExpenses = {};
try {
	lastExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
} catch (error) {
	console.warn(error);
}

export const ExpensesContextProvider = ({ children }) => {
	const [expenses, setExpenses] = useState(lastExpenses || []);
	const [error, setError] = useState(null);

	const handleExpense = ({ name, id, timestamp, totalAmounts }) => {
		if (!name || !id) {
			setError(`Missing name or id, name: ${name}, id: ${id}`);
			return;
		}

		if (expenses.find((expense) => expense.name === name)) {
			setExpenses((prevExpenses) => {
				const newExpenses = prevExpenses
					.filter((expense) => expense.name !== name)
					.concat({ name, id, timestamp, totalAmounts });
				localStorage.setItem("expenses", JSON.stringify(newExpenses));
				return newExpenses;
			});
			return;
		}

		setExpenses((prevExpenses) => {
			const newExpenses = prevExpenses.concat({
				name,
				id,
				timestamp,
				totalAmounts,
			});
			localStorage.setItem("expenses", JSON.stringify(newExpenses));
			return newExpenses;
		});
	};

	return (
		<ExpensesContext.Provider
			value={{
				expenses,
				setExpenses: (expenses) => {
					setError("");

					if (isArray(expenses)) {
						expenses.forEach((expense) => handleExpense(expense));
						return;
					}

					handleExpense(expenses);
				},
			}}
		>
			{children}
			<span className="error">{error}</span>
		</ExpensesContext.Provider>
	);
};
