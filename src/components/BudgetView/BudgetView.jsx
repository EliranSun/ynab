import { useState, useMemo, useContext } from "react";
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
	const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
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
									const expensesInCategory = expenses.filter((expense) => {
										// TODO: same type
										return (
											String(expense.categoryId) === String(subcategory.id)
										);
									});
									const thisMonthExpenses = expensesInCategory.filter(
										(expense) => {
											const expenseDate = new Date(expense.timestamp);
											const now = new Date();
											return expenseDate.getMonth() === now.getMonth();
										}
									);
									const thisMonthAmount = thisMonthExpenses.reduce(
										(acc, expense) => {
											return acc + expense.amount;
										},
										0
									);
									const averageAmount = 0;
									const budget = 0;

									return (
										<>
											{hoveredCategoryId === subcategory.id && (
												<div className="info-box">
													{orderBy(
														expensesInCategory.map((expense) => {
															console.debug({ expense });
															return (
																<div>
																	<span>{expense.name.slice(0, 20)}</span>
																	{" | "}
																	<span>{expense.amount}</span>
																</div>
															);
														}),
														"amount",
														"desc"
													)}
												</div>
											)}
											<tbody
												style={
													expensesInCategory.length > 0
														? { backgroundColor: "tomato" }
														: {}
												}
												key={subcategory.id}
												onClick={() => setHoveredCategoryId(subcategory.id)}
											>
												<tr>
													<td>
														<h3>{subcategory.name}</h3>
													</td>
												</tr>
												<tr>
													<td>
														<span>
															Last: <b>{thisMonthAmount?.toFixed(2)}</b>
														</span>
													</td>
												</tr>
												<tr>
													<td>
														<span>
															Average: <b>{averageAmount.toFixed(2)}</b>
														</span>
													</td>
												</tr>
												<tr>
													<td>
														<span>
															Budget: <b>{budget?.toFixed(2)}</b>
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
										</>
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
