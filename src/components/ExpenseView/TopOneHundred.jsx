const TopOneHundred = ({ expenses, isSameDate }) => {
	// returns a list of expenses that are above 100 NIS
	return expenses
		.filter(
			(expense) =>
				expense.amount > 100 &&
				!expense.isIncome &&
				isSameDate(expense.timestamp)
		)
		.sort((a, b) => b.amount - a.amount)
		.map((expense) => {
			return (
				<div>
					<span>{expense.name}</span> | <span>{expense.amount}</span> |{" "}
					<span>
						{expense.timestamp &&
							new Date(expense.timestamp).toDateString("en-GB")}
					</span>{" "}
					| <span>{expense.note}</span>
				</div>
			);
		});
};

export default TopOneHundred;
