import { useMemo } from "react";
import { getExpenseCategoryName } from "../../utils";

const TopOneHundred = ({ expenses, isSameDate }) => {
	// returns a list of expenses that are above 100 NIS

	return (
		<table style={{ width: "1000px" }}>
			{expenses
				.filter(
					(expense) =>
						expense.amount > 100 &&
						!expense.isIncome &&
						isSameDate(expense.timestamp)
				)
				.sort((a, b) => b.amount - a.amount)
				.map((expense) => {
					const { subcategoryName } = getExpenseCategoryName(
						expense.categoryId
					);
					return (
						<tr>
							<td>{expense.name}</td>
							<td>{expense.amount}</td>
							<td>
								{expense.timestamp &&
									new Date(expense.timestamp).toDateString("en-GB")}
							</td>
							<td>{expense.note}</td>
							<td>{subcategoryName}</td>
						</tr>
					);
				})}
		</table>
	);
};

export default TopOneHundred;
