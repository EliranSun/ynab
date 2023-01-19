import { useState } from "react";
import { ExpensesContextProvider, BudgetContextProvider } from "./context";
import {
	PasteExpensesList,
	BudgetView,
	CategoryView,
	ExpenseView,
	Efficient,
} from "./components";

import "./App.css";
import { DateChanger } from "./components/DateChanger";
import { FutureInsight } from "./components/FutureInsight";

const Pages = {
	CATEGORY_SELECTION: "CATEGORY_SELECTION",
	BUDGET_VIEW: "BUDGET_VIEW",
	CATEGORY_VIEW: "CATEGORY_VIEW",
	EXPENSE_VIEW: "EXPENSE_VIEW",
	EFFICIENT: "EFFICIENT",
	FURTUNE_TELLER: "FURTUNE_TELLER",
};

function App() {
	const [categoryId, setCategoryId] = useState(1);
	const [page, setPage] = useState(Pages.CATEGORY_SELECTION);
	const MenuItems = [
		{
			name: "Transactions",
			onClick: () => setPage(Pages.CATEGORY_SELECTION),
		},
		{
			name: "Budget",
			onClick: () => setPage(Pages.BUDGET_VIEW),
		},
		{
			name: "Fortune Teller",
			onClick: () => setPage(Pages.FURTUNE_TELLER),
		},
		{
			name: "Categories",
			onClick: () => setPage(Pages.CATEGORY_VIEW),
		},
		{
			name: "Expenses",
			onClick: () => setPage(Pages.EXPENSE_VIEW),
		},
		{
			name: "Efficiency",
			onClick: () => setPage(Pages.EFFICIENT),
		},
	];

	return (
		<>
			<nav className="menu">
				{MenuItems.map((item) => (
					<span onClick={item.onClick}>{item.name} ▫ </span>
				))}
			</nav>
			<div className="layout">
				<ExpensesContextProvider>
					{page === Pages.EFFICIENT && <Efficient />}
					{page === Pages.CATEGORY_SELECTION && <PasteExpensesList />}
					<BudgetContextProvider>
						{page === Pages.BUDGET_VIEW && (
							<DateChanger>
								{({ isPreviousMonth, currentTimestamp, isSameDate }) => (
									<BudgetView
										isSameDate={isSameDate}
										isPreviousMonth={isPreviousMonth}
										timestamp={currentTimestamp}
									/>
								)}
							</DateChanger>
						)}
						{page === Pages.FURTUNE_TELLER && (
							<DateChanger>
								{({ isPreviousMonth, currentTimestamp, isSameDate }) => (
									<FutureInsight
										initialAmount={
											// TODO: support date for this, so it will be your grounding point
											// ...Or go back until the openning of the bank account
											-1282.03 // From around 16/09/2022
										}
									/>
								)}
							</DateChanger>
						)}
					</BudgetContextProvider>
					{page === Pages.CATEGORY_VIEW && (
						<CategoryView categoryId={categoryId} />
					)}
					{page === Pages.EXPENSE_VIEW && (
						<ExpenseView
							onCategoryClick={(categoryId) => {
								setCategoryId(categoryId);
								setPage(Pages.CATEGORY_VIEW);
							}}
						/>
					)}
				</ExpensesContextProvider>
			</div>
		</>
	);
}

export default App;
