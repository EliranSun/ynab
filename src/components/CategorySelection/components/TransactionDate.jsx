const TransactionDate = ({ timestamp }) => {
	return (
		<span className="category-selection__item__name">
			{new Date(timestamp).toLocaleDateString("en-gb", {
				year: "numeric",
				month: "short",
				day: "numeric",
			})}
		</span>
	);
};

export default TransactionDate;
