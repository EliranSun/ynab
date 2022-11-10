import { useRef, useContext } from "react";
import CategorySelection from "./../CategorySelection/CategorySelection";
import { Expense } from "../../models";
import { ExpensesContext } from "../../context";

const isExistingExpense = (newExpense, expenses) => {
	const expenseFound = expenses.find((expense) => {
		return (
			expense.name === newExpense.name &&
			expense.timestamp === newExpense.timestamp &&
			newExpense.amount === expense.amount
		);
	});

	return expenseFound;
};

const PasteExpensesList = () => {
	const textAreaRef = useRef(null);
	const { expensesArray: expenses, setExpenses } = useContext(ExpensesContext);

	return (
		<div>
			<textarea ref={textAreaRef} />
			<button
				onClick={() => {
					if (!textAreaRef.current) {
						return;
					}

					const rows = textAreaRef.current.value.split("\n");
					const newExpenses = rows
						.map((row) => {
							const cells = row.split("\t");

							const name = cells[0];
							const amount = cells[4];
							const dateParts = cells[1]?.split("/");
							const year = dateParts && `20${dateParts[2]}`;
							const month = dateParts && Number(dateParts[1]) - 1;
							const day = dateParts && dateParts[0];
							const timestamp = new Date(Date.UTC(year, month, day)).getTime();
							const parsedAmount =
								amount &&
								parseFloat(amount.replace(",", "").replace("₪", "").trim());

							if (!name || !parsedAmount || !timestamp) {
								return {};
							}

							return new Expense({
								name: name,
								timestamp: timestamp,
								amount: parsedAmount,
								note: cells[5],
							});
						})
						.filter((row) => {
							if (isExistingExpense(row, expenses)) {
								return false;
							}

							return row.name && row.amount && row.timestamp;
						});

					if (newExpenses.length === 0) {
						console.info("No new expenses found in this paste");
						return;
					} else {
						console.info(
							"Found new expenses in this paste",
							newExpenses.length
						);
					}

					setExpenses([...expenses, ...newExpenses]);
				}}
			>
				Parse
			</button>
			<hr />
			<CategorySelection expenses={expenses} />
		</div>
	);
};

export default PasteExpensesList;
