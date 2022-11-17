import "chartjs-adapter-date-fns";
import { useRef, useEffect, useMemo, useContext } from "react";
import { Chart, registerables } from "chart.js";
import { ExpensesContext } from "../../context";

const IncomeIds = [81, 82];
let singleton = null;

const createNewChart = ({ data = [] }) => {
	if (singleton) {
		console.info("returning singleton", singleton);
		return singleton;
	}

	Chart.register(...registerables);

	const ctx = document.getElementById("myChart").getContext("2d");
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
			],
		},
		options: {
			maintainAspectRatio: false,
			// scales: {
			// 	min: data[0].timestamp,
			// 	max: data[data.length - 1].timestamp,
			// 	x: {
			// 		type: "time",
			// 		time: {
			// 			unit: "month",
			// 		},
			// 		//   offset: true,
			// 		//   ticks: {
			// 		//     major: {
			// 		//       enabled: true,
			// 		//     },
			// 		//     fontStyle: (context) => (context.tick.major ? "bold" : undefined),
			// 		//     source: "data",
			// 		//     maxRotation: 0,
			// 		//     autoSkip: true,
			// 		//     autoSkipPadding: 75,
			// 		//     sampleSize: 100,
			// 		//   },
			// 	},
			// 	y: {
			// 		type: "linear",
			// 	},
			// },
			plugins: {
				tooltip: {
					callbacks: {
						title: (context) => {
							console.log({ context });
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
			},
		},
	});

	singleton = myChart;
	return myChart;
};

const calc = (initAmount, expenses) => {
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
	// return expenses
	// 	.sort((a, b) => {
	// 		return a.date - b.date;
	// 	})
	// 	.slice(0, 10)
	// 	.map((expense) => {
	// 		// TODO: recurring expenses
	// 		if (expense.isIncome) {
	// 			// initAmount += expense.amount;
	// 			debugger;

	// 			const data = {
	// 				name: expense.name,
	// 				amount: expense.amount,
	// 				date: expense.timestamp,
	// 				y: tempAmount + expense.amount,
	// 				x: expense.timestamp,
	// 			};

	// 			tempAmount += expense.amount;
	// 			// return data;
	// 			return tempAmount;
	// 		}

	// 		// initAmount -= expense.amount;
	// 		debugger;
	// 		const data = {
	// 			name: expense.name,
	// 			amount: expense.amount,
	// 			date: expense.timestamp,
	// 			y: tempAmount - expense.amount,
	// 			x: expense.timestamp,
	// 		};

	// 		tempAmount -= expense.amount;
	// 		// return data;
	// 		return tempAmount;
	// 	});

	return data;
};

const FutureInsight = ({
	budget = {},
	initialAmount = 0,
	lookaheadInMonths = 10,
}) => {
	const canvasRef = useRef(null);
	const { expensesArray: expenses } = useContext(ExpensesContext);
	const expensesData = useMemo(
		() =>
			calc(
				initialAmount,
				expenses.sort((a, b) => a.timestamp - b.timestamp)
			),
		[expenses, initialAmount]
	);

	console.log({ expensesData });

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}

		const chart = createNewChart({ data: expensesData });

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
