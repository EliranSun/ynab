const TransactionAmount = ({ amount }) => {
	return (
		<span className="category-selection__item__name">{amount?.toFixed(2)}</span>
	);
};

export default TransactionAmount;
