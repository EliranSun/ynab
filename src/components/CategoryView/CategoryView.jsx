import { useContext, useMemo } from "react";
import { ExpensesContext } from "../../context/";
import { Categories } from "../../constants";
import { DateChanger as DateController } from "../DateChanger";

const compareAmounts = (amountA, amountB) => {
	if (amountA > amountB) {
		return { isBigger: true, character: "📈" };
	}
	if (amountA < amountB) {
		return { isSmaller: true, character: "📉" };
	}
	return { isEquall: true, character: "🟰" };
};

const CategoryView = ({ categoryId = 1 }) => {
	const { expensesArray: expenses } = useContext(ExpensesContext);

	const category = useMemo(() => {
		return Categories.find((category) => {
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
			<DateController>
				{({ isSameDate, isPreviousMonth, previousMonthString }) => (
					<div>
						{category?.subCategories?.map((subcategory) => {
							const totalAmountInSubcategoryThisMonth = expenses.reduce(
								(total, expense) => {
									if (
										subcategory.id === expense.categoryId &&
										isSameDate(expense.timestamp)
									) {
										return total + expense.amount;
									}
									return total;
								},
								0
							);

							const totalInPreviousMonth = expenses.reduce((total, expense) => {
								const isInPreviousMonth = isPreviousMonth(expense.timestamp);
								if (isInPreviousMonth) {
									debugger;
								}
								if (
									subcategory.id === expense.categoryId &&
									isInPreviousMonth
								) {
									return total + expense.amount;
								}
								return total;
							}, 0);

							const comparison = compareAmounts(
								totalAmountInSubcategoryThisMonth,
								totalInPreviousMonth
							);

							return (
								<h3>
									<span>{subcategory.name}</span>:{" "}
									<div>
										<b color={comparison.isBigger ? "tomato" : "green"}>
											{totalAmountInSubcategoryThisMonth} NIS
										</b>{" "}
										{comparison.character}
										<div>
											{totalInPreviousMonth} NIS ({previousMonthString})
										</div>
									</div>
								</h3>
							);
						})}
					</div>
				)}
			</DateController>
		</div>
	);
};

export default CategoryView;
