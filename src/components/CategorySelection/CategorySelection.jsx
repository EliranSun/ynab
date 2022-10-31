import { useState, useContext, Fragment } from "react";
import { noop } from "lodash";
import { ExpensesContext } from "../../context";
import { Categories } from "../../constants";

// TODO: move to separate components
const TransactionName = ({ name, count }) => {
	return (
		<span className="category-selection__item__name">{name.slice(0, 20)}</span>
	);
};

const TransactionAmount = ({ amount }) => {
	return (
		<span className="category-selection__item__name">{amount?.toFixed(2)}</span>
	);
};

const SelectTransactionSubcategory = ({
	transaction,
	onSelect = noop,
	categories = [],
}) => {
	const { changeExpenseCategoryByName } = useContext(ExpensesContext);
	const { name, id, categoryId } = transaction;

	return (
		<Selection
			selectedCategoryId={categoryId}
			onSubcategorySelect={(categoryId) => {
				changeExpenseCategoryByName(name, categoryId);
				onSelect(id);
			}}
			options={categories}
		/>
	);
};

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

const Selection = ({
	options = [],
	isCategoryView = false,
	isDisabled = false,
	onCategorySelect = noop,
	onSubcategorySelect = noop,
	selectedCategoryId = "",
}) => {
	const [id, setId] = useState(selectedCategoryId || "");

	if (isCategoryView) {
		return (
			<div className="category-select">
				{options.map((option) => {
					return (
						<span
							key={option.id}
							onClick={() => {
								if (isDisabled) {
									return;
								}
								onCategorySelect(option.id);
								setId(option.id);
							}}
							value={option.id}
							class="category"
						>
							{option.name}
						</span>
					);
				})}
			</div>
		);
	}

	return (
		<div>
			{options.map((option) => {
				return (
					<div key={option.id} className="category-select">
						{option.name.slice(0, 2)}
						{option.subCategories.map((sub) => {
							return (
								<span
									style={id === sub.id ? { backgroundColor: "tomato" } : {}}
									key={sub.id}
									onClick={() => {
										if (isDisabled) {
											return;
										}
										onSubcategorySelect(sub.id);
										setId(sub.id);
									}}
									value={sub.id}
									className="subcategory"
								>
									{sub.name}
								</span>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

const TransactionChildrenView = ({ transaction, isOpen }) => {
	return (
		isOpen &&
		transaction?.transactions?.map((transaction) => (
			<>
				<hr />
				<table>
					<TransactionName name={transaction.name} count={1} /> <br />
					<TransactionAmount amount={transaction.amount} />
					<br />
					<TransactionDate timestamp={transaction.timestamp} /> <br />
				</table>
			</>
		))
	);
};

const CategorySelection = ({ expenses = [] }) => {
	const [aggregatedDetailsVisibleId, setAggregatedDetailsId] = useState(false);

	if (!expenses.length) {
		return (
			<div className="category-selection">
				<p>Nothing parsed yet, paste/upload file above</p>
			</div>
		);
	}

	// on row click - highlight row
	return (
		<div className="category-selection">
			<table border={1}>
				<thead>
					<tr>
						<th>Name</th>
						<th>Total</th>
						<th>Last Transaction</th>
						<th>Category</th>
					</tr>
				</thead>
				<tbody>
					{expenses.map((transaction, index) => {
						const {
							id,
							name,
							amount,
							timestamp,
							transactionsCount,
							transactions,
							categoryId,
						} = transaction;
						const isDetailedView = aggregatedDetailsVisibleId === id;
						const backgroundColor = index % 2 === 0 ? "lightgrey" : "white";

						return (
							<tr style={{ backgroundColor }} key={id}>
								<td
									onClick={() => {
										if (transaction.transactions?.length < 2) {
											return;
										}

										if (isDetailedView) {
											setAggregatedDetailsId(null);
											return;
										}

										setAggregatedDetailsId(id);
									}}
								>
									<TransactionName name={name} count={transactionsCount} />{" "}
									{transactions?.length > 1 && `(${transactions.length})`}
									<TransactionChildrenView
										transaction={transaction}
										isOpen={isDetailedView}
									/>
								</td>
								<td>
									<TransactionAmount amount={amount} />
								</td>
								<td>
									<TransactionDate timestamp={timestamp} />
								</td>
								<td>
									<SelectTransactionSubcategory
										categoryId={categoryId}
										transaction={transaction}
										categories={Categories}
									/>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

CategorySelection.whyDidYouRender = true;
export default CategorySelection;
