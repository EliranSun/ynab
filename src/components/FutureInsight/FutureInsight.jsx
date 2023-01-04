import "chartjs-adapter-date-fns";
import { useRef, useEffect, useMemo, useContext } from "react";
import { Chart, registerables } from "chart.js";
import { BudgetContext, ExpensesContext } from "../../context";
import { Categories } from "../../constants";

const ONE_DAY_MS = 1000 * 60 * 60 * 24;
const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30;
let singleton = null;
const IncomeIds = ["81", "82", "83"];

const createNewChart = ({ data = [], startDate, budget = {} }) => {
	if (singleton) {
		console.info("returning singleton", singleton);
		return singleton;
	}

	Chart.register(...registerables);

	const ctx = document.getElementById("myChart").getContext("2d");

	console.debug({ data, budget });

	let myChart = new Chart(ctx, {
		type: "line",
		data: {
			labels: data.map((expense) => {
				return new Date(expense.date).toLocaleString("en-gb", {
					day: "numeric",
					month: "short",
				});
			}),
			// labels: data.map((expense) => expense.name),
			datasets: [
				{
					label: "Income + Expenses",
					data: data,
					backgroundColor: [
						"rgba(255, 99, 132, 0.2)",
						"rgba(54, 162, 235, 0.2)",
						"rgba(255, 206, 86, 0.2)",
						"rgba(75, 192, 192, 0.2)",
						"rgba(153, 102, 255, 0.2)",
						"rgba(255, 159, 64, 0.2)",
					],
					borderColor: [
						"rgba(255, 99, 132, 1)",
						"rgba(54, 162, 235, 1)",
						"rgba(255, 206, 86, 1)",
						"rgba(75, 192, 192, 1)",
						"rgba(153, 102, 255, 1)",
						"rgba(255, 159, 64, 1)",
					],
					borderWidth: 1,
				},
				{
					label: "Budget",
					data: budget,
					backgroundColor: [
						"rgba(255, 99, 132, 0.2)",
						"rgba(54, 162, 235, 0.2)",
						"rgba(255, 206, 86, 0.2)",
						"rgba(75, 192, 192, 0.2)",
						"rgba(153, 102, 255, 0.2)",
						"rgba(255, 159, 64, 0.2)",
					],
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			scales: {
				x: {
					min: startDate,
					type: "time",
					time: {
						unit: "month",
					},
					bounds: "ticks",
				},
			},
			plugins: {
				tooltip: {
					callbacks: {
						title: (context) => {
							return context[0]?.raw?.name;
						},
						label: (context) => {
							let label = "";
							const date = new Date(context.raw.date).toLocaleDateString(
								"en-GB",
								{
									month: "short",
									year: "numeric",
									day: "numeric",
								}
							);
							const amount = new Intl.NumberFormat("he-IL", {
								style: "currency",
								currency: "ILS",
							}).format(context?.raw?.amount);

							if (context.parsed.y !== null) {
								label += new Intl.NumberFormat("he-IL", {
									style: "currency",
									currency: "ILS",
								}).format(context.parsed.y);
							}
							return `Date: ${date} | Expense Amount: ${amount} | Total: ${label}`;
						},
					},
				},
				zoom: {
					pan: {
						enabled: true,
						mode: "x",
					},
					zoom: {
						mode: "x",
						wheel: {
							enabled: true,
						},
					},
				},
			},
		},
	});

	singleton = myChart;
	return myChart;
};

const calcExpenses = (initAmount, expenses) => {
	let tempAmount = initAmount + 0;
	const data = [];

	for (let i = 0; i < expenses.length; i++) {
		const expense = expenses[i];
		tempAmount = expense.isIncome
			? tempAmount + expense.amount
			: tempAmount - expense.amount;
		data.push({
			name: expense.name,
			amount: expense.amount,
			date: expense.timestamp,
			y: tempAmount,
			x: expense.timestamp,
		});
	}

	return data;
};

const calcBudget = (budget, initAmount = 0, lookAhead = 3) => {
	let data = [];
	let tempAmount = initAmount;
	let date = new Date("11.01.2022");
	const budgetEntries = Object.entries(budget["11.2022"]);
	const lookaheadBudgetEntries = new Array(lookAhead)
		.fill(null)
		.map(() => {
			return [...budgetEntries];
		})
		.flat();

	for (const [categoryId, amount] of lookaheadBudgetEntries) {
		tempAmount = IncomeIds.includes(String(categoryId))
			? tempAmount + amount
			: tempAmount - amount;

		const category = Categories.filter((category) => {
			const subcategory = category.subCategories.filter((sub) => {
				return String(sub.id) === String(categoryId);
			})[0];
			return subcategory;
		})[0];

		const name = category && category?.name;

		data.push({
			name,
			amount: amount,
			date,
			y: tempAmount,
			x: date,
		});

		date = new Date(date.getTime() + ONE_DAY_MS);
	}

	return data;
};

const FutureInsight = ({
	initialAmount = 0,
	lookaheadInMonths = 10,
	startDate = new Date(new Date().getTime() - ONE_MONTH_MS * 3),
}) => {
	const canvasRef = useRef(null);
	const { expensesArray: expenses } = useContext(ExpensesContext);
	const { budget } = useContext(BudgetContext);
	const expensesData = useMemo(
		() =>
			calcExpenses(
				initialAmount,
				expenses.sort((a, b) => a.timestamp - b.timestamp)
			),
		[expenses, initialAmount]
	);

	const budgetData = useMemo(() => {
		return calcBudget(budget, initialAmount, lookaheadInMonths);
	}, [budget]);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}

		const chart = createNewChart({
			data: expensesData,
			startDate,
			budget: budgetData,
		});

		return () => {
			chart && chart.destroy();
			singleton = null;
		};
	}, [canvasRef, expensesData]);

	return (
		<div>
			<canvas id="myChart" ref={canvasRef} width="400" height="400"></canvas>
		</div>
	);
};

export default FutureInsight;
