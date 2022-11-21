import { useState, useContext } from "react";
import { orderBy, noop } from "lodash";
import { ExpensesContext, BudgetContext } from "./../../context";
import { Categories } from "../../constants";
import { FutureInsight } from "../FutureInsight";

const IncomeIds = ["81", "82"];

const BudgetView = ({
	timestamp,
	isPreviousMonth = noop,
	isSameDate = noop,
}) => {
	const { expensesArray: expenses, expensesPerMonthPerCategory } =
		useContext(ExpensesContext);
	const { setBudget, budget } = useContext(BudgetContext);
	const [hoveredCategoryId, setHoveredCategoryId] = useState(null);

	const categoriesWithAmounts = Categories.map((category) => {
		let expensesInCategorySum = 0;
		category.subCategories.forEach((subcategory) => {
			const expensesInCategory = expenses.filter((expense) => {
				// TODO: same type instead of casting
				return String(expense.categoryId) === String(subcategory.id);
			});

			const thisMonthExpenses = expensesInCategory.filter((expense) => {
				const date = new Date(timestamp);
				const expenseDate = new Date(expense.timestamp);
				if (expense.isRecurring) {
					return expenseDate.getFullYear() === date.getFullYear();
				}

				return (
					expenseDate.getMonth() === date.getMonth() &&
					expenseDate.getFullYear() === date.getFullYear()
				);
			});
			const thisMonthAmount = thisMonthExpenses.reduce((acc, expense) => {
				return acc + expense.amount;
			}, 0);

			expensesInCategorySum += thisMonthAmount;
		});

		return {
			...category,
			totalAmount: expensesInCategorySum,
		};
	});
	const totalExpenses = Object.values(categoriesWithAmounts)
		.reduce((acc, curr) => {
			if (curr.isIncome) return acc;
			return acc + curr.totalAmount;
		}, 0)
		.toFixed(2);
	const totalIncome = Object.values(categoriesWithAmounts)
		.reduce((acc, curr) => {
			if (!curr.isIncome) return acc;
			return acc + curr.totalAmount;
		}, 0)
		.toFixed(2);
	const bottomLine = (totalIncome - totalExpenses).toFixed(2);

	const budgetExpenses = Object.entries(budget["11.2022"]).reduce(
		(acc, curr) => {
			const [categoryId, amount] = curr;
			if (!IncomeIds.includes(String(categoryId))) return acc;
			return acc + Number(amount);
		},
		0
	);

	const budgetIncome = Object.entries(budget["11.2022"]).reduce((acc, curr) => {
		const [categoryId, amount] = curr;
		if (IncomeIds.includes(String(categoryId))) return acc;
		return acc + Number(amount);
	}, 0);

	const budgetBottomLine = budgetIncome - budgetExpenses;

	const handleBudgetChange = (value, subcategoryId, date) => {
		setBudget(value, subcategoryId, date);
	};

	const renderCategories = () => {
		/* TODO: category model? will make things simpler here, but did complicated you last time */
		return categoriesWithAmounts.map((category) => (
			<td>
				<h2>{category.name}</h2>
				<h3>Total: {category.totalAmount} NIS</h3>
				<h3>
					Budget:{" "}
					{category.subCategories.reduce((acc, curr) => {
						if (!budget[curr.id]?.amount) return acc;
						return acc + Number(budget[curr.id]?.amount);
					}, 0)}{" "}
					NIS
				</h3>
			</td>
		));
	};

	const getAverageAmount = (id) => {
		if (!expensesPerMonthPerCategory[id]) return 0;

		return (
			Object.values(expensesPerMonthPerCategory[id]).reduce(
				(acc, curr) => acc + curr,
				0
			) / Object.values(expensesPerMonthPerCategory[id]).length
		);
	};

	// TODO: break into smaller components
	// FIXME: income category does not count as income - have to mark it in expense view
	// FIXME: null category selection when reaching end of expenses from paste
	// TODO: auto recognition of income as income
	// TODO: suggest categorization based on previous expenses
	return (
		<div>
			<h1>Plan (Budget View)</h1>
			<FutureInsight
				budget={budget}
				initialAmount={
					// TODO: support date for this, so it will be your grounding point
					// ...Or go back until the openning of the bank account
					-1282.03 // From around 16/09/2022
				}
			/>
			<div>
				<input type="number" placeholder="Started the month with" />
			</div>
			<table>
				<tr>
					<td>
						<h1>Total Expenses this month</h1>
					</td>
					<td>{totalExpenses}</td>
					<td>
						<h1>Budget for Expenses this month</h1>
					</td>
					<td>{budgetExpenses}</td>
				</tr>
				<tr>
					<td>
						<h1>Total Income this month</h1>
					</td>
					<td>{budgetIncome}</td>
					<td>
						<h1>Expected Income this month</h1>
					</td>
					<td>{budgetIncome}</td>
				</tr>
				<tr>
					<td>
						<h1 style={{ color: bottomLine < 0 ? "tomato" : "olive" }}>
							Bottom Line
						</h1>
					</td>
					<td>{bottomLine}</td>
					<td>
						<h1>Expected Bottom Line</h1>
					</td>
					<td>{budgetBottomLine}</td>
				</tr>
			</table>
			<table>
				<thead>
					<tr>{renderCategories()}</tr>
				</thead>
				<tbody>
					{Categories.map((category) => {
						const dateKey = new Date(timestamp).toLocaleString("he-IL", {
							month: "numeric",
							year: "numeric",
						});

						console.debug({ budget, dateKey });
						return (
							<>
								<td>
									{category?.subCategories?.map((subcategory) => {
										const expensesInCategory = expenses.filter((expense) => {
											// TODO: same type instead of casting
											return (
												String(expense.categoryId) === String(subcategory.id)
											);
										});
										const thisMonthExpenses = expensesInCategory.filter(
											(expense) => {
												const date = new Date(timestamp);
												const expenseDate = new Date(expense.timestamp);
												if (expense.isRecurring) {
													return (
														expenseDate.getFullYear() === date.getFullYear()
													);
												}

												return (
													expenseDate.getMonth() === date.getMonth() &&
													expenseDate.getFullYear() === date.getFullYear()
												);
											}
										);
										const thisMonthAmount = thisMonthExpenses.reduce(
											(acc, expense) => {
												return acc + expense.amount;
											},
											0
										);

										const totalInPreviousMonth = expenses.reduce(
											(total, expense) => {
												if (
													subcategory.id === expense.categoryId &&
													isPreviousMonth(expense.timestamp)
												) {
													return total + expense.amount;
												}
												return total;
											},
											0
										);

										const averageAmount = getAverageAmount(
											String(subcategory.id)
										);

										return (
											<div
												style={{
													border:
														Number(thisMonthAmount) >
														Number(budget[subcategory.id]?.amount)
															? "5px solid red"
															: "5px solid olive",
												}}
											>
												{hoveredCategoryId === subcategory.id && (
													<div className="info-box">
														<h3>This month</h3>
														{orderBy(
															expensesInCategory
																.filter((expense) =>
																	isSameDate(expense.timestamp)
																)
																.map((expense) => {
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
													border="1"
													key={subcategory.id}
													onClick={() => setHoveredCategoryId(subcategory.id)}
												>
													<tr>
														<td>
															<h3>
																{subcategory.icon} {subcategory.name}
															</h3>
														</td>
													</tr>
													<tr>
														<td>
															<span>
																Current: <b>{thisMonthAmount?.toFixed(2)}</b>
															</span>
														</td>
													</tr>
													<tr>
														<td>
															<span>
																Previous:{" "}
																<b>{totalInPreviousMonth?.toFixed(2)}</b>
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
																Budget:
																<input
																	type="number"
																	onChange={(event) =>
																		handleBudgetChange(
																			event.target.value,
																			subcategory.id,
																			timestamp
																		)
																	}
																	value={
																		budget[dateKey] &&
																		budget[dateKey][String(subcategory.id)]
																	}
																/>
															</span>
														</td>
													</tr>
												</tbody>
											</div>
										);
									})}
								</td>
							</>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default BudgetView;
