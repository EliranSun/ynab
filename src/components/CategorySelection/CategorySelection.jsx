import { useState, useContext, Fragment, useMemo } from "react";
import { noop, sortBy } from "lodash";
import { CategoriesContext, ExpensesContext } from "../../context";

const Selection = ({
	options = [],
	isCategoryView = false,
	isDisabled = false,
	onCategorySelect = noop,
	onSubcategorySelect = noop,
	selectedCategoryId = "",
}) => {
	const [id, setId] = useState(selectedCategoryId);

	if (isCategoryView) {
		return (
			<select
				disabled={isDisabled}
				value={id}
				onChange={(event) => {
					onCategorySelect(event.target.value);
					setId(event.target.value);
				}}
			>
				{options.map((option) => {
					return (
						<option key={option.id} value={option.id}>
							{option.name}
						</option>
					);
				})}
			</select>
		);
	}

	return (
		<select
			value={id}
			disabled={isDisabled}
			onChange={(event) => {
				onSubcategorySelect(event.target.value);
				setId(event.target.value);
			}}
		>
			<option value="">Select a subcategory</option>
			{options.map((option) => {
				return (
					<Fragment key={option.id}>
						<option value={option.name} disabled>
							===== {option.name} =====
						</option>
						{option.subCategories.map((sub) => {
							return (
								<option key={sub.id} value={sub.id}>
									{sub.name}
								</option>
							);
						})}
					</Fragment>
				);
			})}
		</select>
	);
};

const CategorySelection = () => {
	const { categories, items } = useContext(CategoriesContext);
	const { setExpenses, expenses } = useContext(ExpensesContext);
	const [selectedCategoryId, setSelectedCategoryId] = useState("");
	const selectedCategoryName = useMemo(() => {
		return categories[selectedCategoryId]?.name || categories[0]?.name;
	}, [categories, selectedCategoryId]);
	const sortedItems = useMemo(
		() =>
			sortBy(
				Object.entries(items),
				([_itemName, { lastTransactionTimestamp }]) => lastTransactionTimestamp
			).reverse(),
		[items]
	);

	if (!Object.keys(items).length) {
		return (
			<div className="category-selection">
				<p>Nothing parsed yet, paste/upload file above</p>
			</div>
		);
	}

	return (
		<div className="category-selection">
			<h2>Change category for all</h2>
			<Selection
				isDisabled
				options={categories}
				isCategoryView
				selectedCategoryId={selectedCategoryId}
				onCategorySelect={(id) => {
					setSelectedCategoryId(id);
					setExpenses(
						sortedItems.map(
							([itemName, { lastTransactionTimestamp, totalAmounts }]) => ({
								name: itemName,
								id,
								timestamp: lastTransactionTimestamp,
								totalAmounts,
							})
						)
					);
				}}
			/>
			<hr />
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Total</th>
						<th>Last Transaction</th>
						<th>Category</th>
						<th>Subcategory</th>
					</tr>
				</thead>
				<tbody>
					{sortedItems.map(
						([name, { totalAmounts, lastTransactionTimestamp }]) => {
							return (
								<tr key={name}>
									<td>
										<span className="category-selection__item__name">
											{name}
										</span>
									</td>
									<td>
										<span className="category-selection__item__name">
											{totalAmounts?.toFixed(2)}
										</span>
									</td>
									<td>
										<span className="category-selection__item__name">
											{new Date(lastTransactionTimestamp).toLocaleDateString(
												"en-gb",
												{
													year: "numeric",
													month: "short",
													day: "numeric",
												}
											)}
										</span>
									</td>
									<td>
										<Selection
											isDisabled
											isCategoryView
											options={categories}
											selectedCategoryId={selectedCategoryId}
										/>
									</td>
									<td>
										<Selection
											selectedCategoryId={
												expenses
													.map((expense) => {
														if (expense.name === name) {
															return expense.id;
														}

														return null;
													})
													.filter(Boolean)[0]
											}
											onSubcategorySelect={(id) => {
												setExpenses({
													name,
													timestamp: lastTransactionTimestamp,
													totalAmounts,
													id,
												});
											}}
											options={
												selectedCategoryId
													? categories.filter(
															(category) =>
																String(category.id) ===
																String(selectedCategoryId)
													  )
													: categories
											}
										/>
									</td>
								</tr>
							);
						}
					)}
				</tbody>
			</table>
		</div>
	);
};

export default CategorySelection;
