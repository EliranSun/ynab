import "chartjs-adapter-date-fns";
import { useRef, useEffect, useMemo, useContext } from "react";
import { Chart, registerables } from "chart.js";
import { ExpensesContext } from "../../context";

const IncomeIds = [81, 82];
let singleton = null;
const createNewChart = ({ data = {} }) => {
	if (Object.keys(data).length === 0) {
		return;
	}

	if (singleton) {
		console.info("returning singleton", singleton);
		return singleton;
	}

	Chart.register(...registerables);

	const ctx = document.getElementById("myChart").getContext("2d");
	let myChart = new Chart(ctx, {
		type: "line",
		height: "100",
		data: {
			labels: data.map(
				(expense) =>
					// new Date(expense.timestamp).toLocaleDateString("en-gb", {
					//   month: "short",
					//   year: "numeric",
					//   day: "numeric",
					// })
					expense.timestamp
			),
			// labels: data.map((expense) => expense.name),
			datasets: [
				{
					label: "Income + Expenses",
					data,
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
			scales: {
				min: data[0].timestamp,
				max: data[data.length - 1].timestamp,
				x: {
					type: "time",
					time: {
						unit: "month",
					},
					//   offset: true,
					//   ticks: {
					//     major: {
					//       enabled: true,
					//     },
					//     fontStyle: (context) => (context.tick.major ? "bold" : undefined),
					//     source: "data",
					//     maxRotation: 0,
					//     autoSkip: true,
					//     autoSkipPadding: 75,
					//     sampleSize: 100,
					//   },
				},
				y: {
					type: "linear",
				},
			},
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

const FutureInsight = ({
	budget = {},
	initialAmount = 0,
	lookaheadInMonths = 10,
}) => {
	const canvasRef = useRef(null);
	const { monthlyExpenses, expenses } = useContext(ExpensesContext);
	const expensesData = useMemo(() => {
		let startingPoint = initialAmount;
		return expenses.map((expense) => {
			// TODO: recurring expenses
			if (expense.isIncome) {
				startingPoint += expense.amount;
				return {
					name: expense.name,
					amount: expense.amount,
					date: expense.timestamp,
					y: startingPoint + expense.amount,
					x: expense.timestamp,
				};
			}

			startingPoint -= expense.amount;
			return {
				name: expense.name,
				amount: expense.amount,
				date: expense.timestamp,
				y: startingPoint - expense.amount,
				x: expense.timestamp,
			};
		});
	}, [monthlyExpenses]);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}

		console.info({ expensesData });
		const chart = createNewChart({ data: expensesData.reverse() });

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
