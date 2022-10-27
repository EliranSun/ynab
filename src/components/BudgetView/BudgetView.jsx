import { useState, useContext } from "react";
import { uniq } from "lodash";
import { ExpensesContext, CategoriesContext } from "./../../context";

const getLastBudget = () => {
	try {
		const lastBudget = localStorage.getItem("budget");
		return lastBudget ? JSON.parse(lastBudget) : {};
	} catch (error) {
		return {};
	}
};

const getLastMonthExpenseById = (expenses = [], id) => {
	return expenses.reduce((total, expense) => {
		const lastMonth = new Date().getMonth();
		const expenseMonth = new Date(expense.timestamp).getMonth();
		const sameId = String(expense.id) === String(id);
		const isLastMonth = lastMonth === expenseMonth;
		const lastYear = new Date().getFullYear();

		if (sameId && isLastMonth) {
			console.debug("last month", expense);
			return total + expense.totalAmounts[`${lastYear}-${lastMonth}`];
		}

		return total;
	}, 0);
};

const getAverageExpenseAmountById = (expenses = [], id) => {
	let totalAmount = 0;
	let totalDates = [];

	expenses.forEach((expense) => {
		const isSameId = String(expense.id) === String(id);
		if (isSameId) {
			totalAmount += Object.values(expense.totalAmounts).reduce(
				(total, amount) => total + amount
			);
			totalDates = uniq(totalDates.concat(Object.keys(expense.totalAmounts)));
		}

		if (String(expense.id) === "11" && isSameId) {
			debugger;
		}
	});

	const averageAmount = totalAmount / totalDates.length;

	return averageAmount;
};

const BudgetView = () => {
	const [budget, setBudget] = useState(getLastBudget());
	const { categories } = useContext(CategoriesContext);
	const { expenses } = useContext(ExpensesContext);

	const handleBudget = ({ id, amount }) => {
		setBudget((prevState) => {
			const newBudget = { ...prevState, [id]: amount };
			localStorage.setItem("budget", JSON.stringify(newBudget));
			return newBudget;
		});
	};

	return (
		<div>
			{categories.map((category) => (
				<table className="flex" key={category.id}>
					<thead>
						<tr>
							<td>
								<h2>{category.name}</h2>
							</td>
						</tr>
					</thead>
					{category.subCategories.map((subcategory) => {
						const lastExpense = getLastMonthExpenseById(
							expenses,
							subcategory.id
						);
						const averageAmount = getAverageExpenseAmountById(
							expenses,
							subcategory.id
						);

						return (
							<tbody key={subcategory.id}>
								<tr>
									<td>
										<h3>{subcategory.name}</h3>
									</td>
								</tr>
								<tr>
									<td>
										<span>
											Last month:{" "}
											{<b>{lastExpense?.toFixed(2)}</b> || "Not enough data"}
										</span>
									</td>
								</tr>
								<tr>
									<td>
										<span>
											Average:{" "}
											{<b>{averageAmount.toFixed(2)}</b> || "Not enough data"}
										</span>
									</td>
								</tr>
								<tr>
									<td>
										<input
											type="number"
											onChange={(event) => {
												handleBudget({
													id: subcategory.id,
													amount: event.target.value,
												});
											}}
											value={budget[subcategory.id] || 0}
										/>
									</td>
								</tr>
							</tbody>
						);
					})}
				</table>
			))}
		</div>
	);
};

export default BudgetView;
