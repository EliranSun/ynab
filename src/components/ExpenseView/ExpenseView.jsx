import { useState, useContext, useMemo } from "react";
import { orderBy, noop } from "lodash";
import classNames from "classnames";
import { ExpensesContext } from "../../context";
import { Categories } from "../../constants";
import { isExpenseInMonth } from "../../utils";

import styles from "./ExpenseView.module.scss";
import TopOneHundred from "./TopOneHundred";
import DateChanger from "../DateChanger/DateChanger";
const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30;

const getExpenseCategoryName = (expense) => {
	let subcategoryName = "";
	const category = Categories.find((category) => {
		const subcategory = category.subCategories.filter(
			(subcategory) => String(subcategory.id) === String(expense.categoryId)
		)[0]?.name;

		if (subcategory) {
			subcategoryName = subcategory;
			return true;
		}

		return false;
	});

	return {
		...category,
		subcategoryName,
	};
};

const SortBy = {
	DATE: "date",
	CATEGORY: "category",
	AMOUNT: "amount",
	NAME: "name",
};

const Expense = ({
	expense,
	onIsIncomeChange = noop,
	onIsRecurringChange = noop,
	onNoteChange = noop,
	onCategoryClick = noop,
	onAmountClick = noop,
	isListView = false,
}) => {
	const category = useMemo(() => getExpenseCategoryName(expense), [expense]);

	return (
		<div
			id={expense.id}
			className={classNames("expense-box", { [styles.isListView]: isListView })}
			key={expense.id}
		>
			<span className={styles.title}>{expense.name}</span>
			<div
				className={styles.category}
				onClick={() => {
					onCategoryClick(category.id);
				}}
			>
				<span>
					{category?.name}
					{" > "}
					<b>{category.subcategoryName}</b>
				</span>
			</div>
			<div
				className={styles.amount}
				onClick={() => onAmountClick(expense.id, expense.amount)}
			>
				{expense.amount} NIS
			</div>
			<span className={styles.note}>
				<textarea
					value={expense.note}
					onInput={(event) => {
						onNoteChange(expense.id, event.target.value);
					}}
				/>
			</span>
			<div>
				<span>
					{new Date(expense.timestamp).toLocaleString("default", {
						month: "long",
						year: "numeric",
						day: "numeric",
						weekday: "long",
					})}
				</span>
			</div>
			<div>
				<label>Is recurring?</label>
				<input
					checked={expense.isRecurring}
					type="checkbox"
					onChange={() => {
						onIsRecurringChange(expense.id, !expense.isRecurring);
					}}
				/>
			</div>
			<div>
				<label>Is income?</label>
				<input
					checked={expense.isIncome}
					type="checkbox"
					onChange={() => {
						onIsIncomeChange(expense.id, !expense.isIncome);
					}}
				/>
			</div>
		</div>
	);
};
const ExpenseView = ({ onCategoryClick = noop }) => {
	const {
		expensesArray: expenses,
		setExpenseAsRecurring,
		setExpenseAsIncome,
		setExpenseNote,
	} = useContext(ExpensesContext);
	const [searchValue, setSearchValue] = useState("בריכת גורדון-מוסדות");
	const [sum, setSum] = useState(0);
	const [sort, setSort] = useState(SortBy.AMOUNT);

	return (
		<div>
			<h1>Understand (Expense View)</h1>
			<input
				type="text"
				placeholder="search"
				onChange={(event) => {
					setSearchValue(event.target.value);
				}}
			/>
			<div className="expenses-view-list">
				{expenses
					.filter((expense) => {
						if (searchValue === "") {
							return false;
						}
						return expense.name
							.toLowerCase()
							.includes(searchValue.toLowerCase());
					})
					.map((expense) => (
						<Expense
							expense={expense}
							onIsRecurringChange={setExpenseAsRecurring}
							onIsIncomeChange={setExpenseAsIncome}
							onCategoryClick={onCategoryClick}
							onNoteChange={setExpenseNote}
						/>
					))}
			</div>
			<DateChanger>
				{({ isSameDate, currentTimestamp }) => {
					// TODO: refactor!!
					const orderedExpenses = orderBy(
						expenses.filter(
							(expense) =>
								!expense.isIncome &&
								isExpenseInMonth(expense.timestamp, currentTimestamp)
						),
						sort,
						"desc"
					);

					const renderUnder100Sum = () => {
						let count = 0;
						const totalAmount = orderedExpenses
							.reduce((acc, curr) => {
								if (curr.amount < 100 && !curr.isIncome) {
									count++;
									return acc + curr.amount;
								}
								return acc;
							}, 0)
							.toFixed(2);

						return (
							<>
								<span>{totalAmount} NIS </span>
								<span>({count} Items)</span>
								<div>TODO: a pie chart here</div>
							</>
						);
					};

					const renderAbove100Sum = () => {
						let count = 0;
						const totalAmount = orderedExpenses
							.reduce((acc, curr) => {
								if (curr.amount > 100 && !curr.isIncome) {
									count++;
									return acc + curr.amount;
								}
								return acc;
							}, 0)
							.toFixed(2);

						return (
							<>
								<span>{totalAmount} NIS </span>
								<span>({count} Items)</span>
								<div>TODO: a pie chart here</div>
							</>
						);
					};

					return (
						<>
							<TopOneHundred expenses={expenses} isSameDate={isSameDate} />
							<div>
								<h2>
									Expenses by {sort} for{" "}
									{new Date(currentTimestamp).toLocaleDateString("en-GB", {
										month: "long",
										year: "numeric",
									})}
								</h2>
								<h3 className="float top right">
									Subtotal:{" "}
									{Object.values(sum).reduce((acc, curr) => acc + curr, 0)}
								</h3>
								<h3>
									Sum of all expenses above 100:{" "}
									{renderAbove100Sum(orderedExpenses, sum, setSum)}
								</h3>
								<h3>
									Sum of all expenses under 100:{" "}
									{renderUnder100Sum(orderedExpenses, sum, setSum)}
								</h3>
								{orderedExpenses.map((expense) => (
									<Expense
										isListView
										expense={expense}
										onNoteChange={setExpenseNote}
										onIsRecurringChange={setExpenseAsRecurring}
										onIsIncomeChange={setExpenseAsIncome}
										onCategoryClick={onCategoryClick}
										onAmountClick={(id, amount) => {
											setSum({
												...sum,
												[id]: sum[id] ? 0 : amount,
											});
										}}
									/>
								))}
							</div>
						</>
					);
				}}
			</DateChanger>
		</div>
	);
};

export default ExpenseView;
