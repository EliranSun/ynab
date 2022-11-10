import { useState, useContext, useMemo } from "react";
import { orderBy, noop } from "lodash";
import classNames from "classnames";
import { ExpensesContext } from "../../context";
import { Categories } from "../../constants";
import { isExpenseInMonth } from "../../utils";

import styles from "./ExpenseView.module.scss";
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
	const [timestamp, setTimestamp] = useState(new Date().getTime());
	const [searchValue, setSearchValue] = useState("בריכת גורדון-מוסדות");
	const [sum, setSum] = useState(0);
	const [sort, setSort] = useState(SortBy.AMOUNT);
	const orderedExpenses = useMemo(() => {
		return orderBy(
			expenses.filter(
				(expense) =>
					!expense.isIncome && isExpenseInMonth(expense.timestamp, timestamp)
			),
			sort,
			"desc"
		);
	}, [expenses, timestamp, sort]);

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
			<div>
				<button
					onClick={() => {
						setTimestamp(timestamp - ONE_MONTH_MS);
					}}
				>
					Prev Month
				</button>
				<button
					onClick={() => {
						setTimestamp(timestamp + ONE_MONTH_MS);
					}}
					disabled={
						new Date(timestamp).getMonth() + 1 > new Date().getMonth() &&
						new Date(timestamp).getFullYear() >= new Date().getFullYear()
					}
				>
					Next Month
				</button>
				<h2>
					Expenses by {sort} for{" "}
					{new Date(timestamp).toLocaleDateString("en-GB", {
						month: "long",
						year: "numeric",
					})}
				</h2>
				<h3 className="float top right">
					Subtotal: {Object.values(sum).reduce((acc, curr) => acc + curr, 0)}
				</h3>
				<h3>
					Sum of all expenses under 100:{" "}
					{orderedExpenses.reduce(
						(acc, curr) => acc + (curr.amount < 100 ? curr.amount : 0),
						0
					)}
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
		</div>
	);
};

export default ExpenseView;
