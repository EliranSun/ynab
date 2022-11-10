import { useContext, useMemo } from "react";
import { ExpensesContext } from "../../context/";
import { Categories } from "../../constants";

const CategoryView = ({ categoryId = 1 }) => {
	const { expensesArray: expenses } = useContext(ExpensesContext);

	const category = useMemo(() => {
		return Categories.find((category) => {
			console.debug("CategoryView: useMemo", { category, categoryId });
			return String(category.id) === String(categoryId);
		});
	}, [categoryId]);

	const subcategoriesIds = useMemo(() => {
		return category?.subCategories?.map((subcategory) => subcategory.id);
	}, [category]);

	const totalAmountInCategory = useMemo(
		() =>
			expenses.reduce((total, expense) => {
				if (subcategoriesIds?.includes(expense.categoryId)) {
					return total + expense.amount;
				}
				return total;
			}, 0),
		[expenses, categoryId]
	);

	return (
		<div>
			<h1>Understand (Category View)</h1>
			<h2>{category?.name}</h2>
			<h2>Total amount in this category {totalAmountInCategory}</h2>
			<h2>Total in each subcategory</h2>
			<div>
				{category?.subCategories?.map((subcategory) => {
					const totalAmountInSubcategory = expenses.reduce((total, expense) => {
						if (subcategory.id === expense.categoryId) {
							return total + expense.amount;
						}
						return total;
					}, 0);
					return (
						<h3>
							<span>{subcategory.name}</span>:{" "}
							<span>
								<b>{totalAmountInSubcategory} NIS</b>
							</span>
						</h3>
					);
				})}
			</div>
		</div>
	);
};

export default CategoryView;
