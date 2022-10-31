import { useState, useContext } from "react";
import { orderBy } from "lodash";
import { ExpensesContext } from "./../../context";
import { Categories } from "../../constants";
import { getCategories, setCategories } from "../../utils";

const getLastBudget = () => {
	try {
		const lastBudget = localStorage.getItem("budget");
		return lastBudget ? JSON.parse(lastBudget) : {};
	} catch (error) {
		return {};
	}
};

const BudgetView = () => {
	const [budget, setBudget] = useState(getLastBudget());
	const { expenses } = useContext(ExpensesContext);

	return (
		<div>
			<table>
				<thead>
					<tr>
						{Categories.map((category) => (
							<td>
								<h2>{category.name}</h2>
							</td>
						))}
					</tr>
				</thead>
				<tbody>
					{Categories.map((category) => {
						return (
							<td>
								{category.subCategories.map((subcategory) => {
									const categoryExpenses = expenses.filter(
										(expense) =>
											String(expense.categoryId) === String(subcategory.id)
									);
									const lastExpense = orderBy(
										categoryExpenses,
										["timestamp"],
										["desc"]
									)[0];
									const totalAmount = categoryExpenses.reduce(
										(total, expense) => total + expense.amount,
										0
									);
									const averageAmount = totalAmount / categoryExpenses.length;

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
														{<b>{lastExpense?.amount?.toFixed(2)}</b> ||
															"Not enough data"}
													</span>
												</td>
											</tr>
											<tr>
												<td>
													<span>
														Average:{" "}
														{<b>{averageAmount.toFixed(2)}</b> ||
															"Not enough data"}
													</span>
												</td>
											</tr>
											<tr>
												<td>
													<span>
														Budget:{" "}
														{<b>{subcategory?.badget?.toFixed(2)}</b> ||
															"Not enough data"}
													</span>
												</td>
											</tr>
											<tr>
												<td>
													<input
														type="number"
														onChange={(event) => {
															setBudget((prevState) => {
																const newBudget = {
																	...prevState,
																	[subcategory.id]: event.target.value,
																};

																return newBudget;
															});
														}}
														value={budget[subcategory.id] || 0}
													/>
												</td>
											</tr>
										</tbody>
									);
								})}
							</td>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default BudgetView;
