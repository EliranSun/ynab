import Transaction from "./Transaction";

const TransactionList = ({ transactions = [] }) => {
	return (
		<div>
			{transactions.map((expense) => (
				<Transaction transaction={expense} />
			))}
		</div>
	);
};

export default TransactionList;
