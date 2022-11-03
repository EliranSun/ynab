import { useState } from "react";
import { Transaction, TransactionList } from "./components";

const CategorySelectionViewModes = {
	SLIDES: "SLIDES",
	LIST: "LIST",
};

const CategorySelection = ({
	aggregatedExpenses = [],
	totalExpensesCount = 0,
}) => {
	const [viewMode, setViewMode] = useState(CategorySelectionViewModes.SLIDES);
	const firstUncategorizedTransactionIndex = aggregatedExpenses.findIndex(
		(expense) => !expense.categoryId
	);
	const [transactionIndex, setTransactionIndex] = useState(
		firstUncategorizedTransactionIndex === -1
			? 0
			: firstUncategorizedTransactionIndex
	);

	if (!aggregatedExpenses.length) {
		return (
			<div className="category-selection">
				<p>Nothing parsed yet, paste/upload file above</p>
			</div>
		);
	}

	// TODO: show only unhandled expense
	// TODO: on row click - highlight row
	return (
		<div className="category-selection">
			<h1>Organize (Transactions Category Selection)</h1>
			<h4>Grouped Expenses count: {aggregatedExpenses.length}</h4>
			<h4>Total Expenses count: {totalExpensesCount}</h4>
			<div>
				<fieldset>
					<legend>Categories Selection View</legend>
					<div>
						<input
							id="slides"
							type="radio"
							name="category-selection-view"
							onClick={() => setViewMode(CategorySelectionViewModes.SLIDES)}
							checked
						/>
						<label htmlFor="slides">
							Slides (good for choosing category for transaction batches)
						</label>
					</div>
					<div>
						<input
							type="radio"
							id="list"
							name="category-selection-view"
							onClick={() => setViewMode(CategorySelectionViewModes.LIST)}
						/>
						<label htmlFor="list">
							List (good for changing specific transactions)
						</label>
					</div>
				</fieldset>
			</div>
			<button
				disabled={transactionIndex === 0}
				onClick={() => {
					console.info(aggregatedExpenses[transactionIndex - 1]);
					setTransactionIndex(transactionIndex - 1);
				}}
			>
				Previous Transaction
			</button>
			<span>
				{" "}
				{transactionIndex + 1} / {aggregatedExpenses.length}{" "}
			</span>
			<button
				onClick={() => {
					console.info(aggregatedExpenses[transactionIndex + 1]);
					setTransactionIndex(transactionIndex + 1);
				}}
				disabled={transactionIndex === aggregatedExpenses.length + 1}
			>
				Next Transaction
			</button>
			<table border={1}>
				<thead>
					<tr>
						<th width="100">Name</th>
						<th width="100">Total</th>
						<th width="100">Last Transaction</th>
						<th>Category</th>
					</tr>
				</thead>
				<tbody>
					{viewMode === CategorySelectionViewModes.SLIDES ? (
						<Transaction
							onSelect={() => setTransactionIndex(transactionIndex + 1)}
							transaction={aggregatedExpenses[transactionIndex]}
						/>
					) : (
						<TransactionList transactions={aggregatedExpenses} />
					)}
				</tbody>
			</table>
		</div>
	);
};

CategorySelection.whyDidYouRender = true;
export default CategorySelection;
