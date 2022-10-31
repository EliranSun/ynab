import { useMemo, useState, useRef } from "react";
import { Expense } from "../../models";
import CategorySelection from "./../CategorySelection/CategorySelection";
import {
	aggregateTransactionsByName,
	getExpenses,
	setExpenses,
} from "../../utils";

const isNewExpense = (name, timestamp, expenses) => {
	return expenses.find((expense) => {
		return expense.name !== name || expense.timestamp !== timestamp;
	});
};

const PasteExpensesList = () => {
	const textAreaRef = useRef(null);
	const [parsedExpenses, setParsedExpenses] = useState(getExpenses());
	const aggregatedExpenses = useMemo(
		() => aggregateTransactionsByName(parsedExpenses),
		[parsedExpenses]
	);

	return (
		<div>
			<textarea ref={textAreaRef} />
			<button
				onClick={() => {
					if (!textAreaRef.current) {
						return;
					}

					const rows = textAreaRef.current.value.split("\n");
					const expenses = rows.map((row) => {
						const cells = row.split("\t");
						return {
							name: cells[0],
							date: cells[1],
							creditCardNumber: cells[2],
							amount: cells[4],
							note: cells[5],
						};
					});

					const newExpenses = expenses
						.map((transaction) => {
							let name = transaction.name;
							if (!name || !transaction.amount || !transaction.date) {
								return {};
							}

							const dateParts = transaction.date.split("/");
							const year = `20${dateParts[2]}`;
							const month = Number(dateParts[1]) - 1;
							const day = dateParts[0];
							const date = new Date(Date.UTC(year, month, day)).getTime();

							const parsedAmount = parseFloat(
								transaction.amount.replace(",", "").replace("₪", "").trim()
							);

							return new Expense({
								name,
								timestamp: date,
								amount: parsedAmount,
							});
						})
						.filter((expense) => {
							return isNewExpense(expense.name, expense.timestamp, expenses);
						});

					setParsedExpenses(newExpenses);
					setExpenses(newExpenses);
				}}
			>
				Parse
			</button>
			<hr />
			<CategorySelection expenses={aggregatedExpenses} />
		</div>
	);
};

export default PasteExpensesList;
