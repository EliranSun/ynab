import { useState, useEffect } from "react";
import { ExpensesContextProvider } from "./context";
import {
	PasteExpensesList,
	BudgetView,
	CategoryView,
	ExpenseView,
} from "./components";

import "./App.css";

const Pages = {
	CATEGORY_SELECTION: "CATEGORY_SELECTION",
	BUDGET_VIEW: "BUDGET_VIEW",
	CATEGORY_VIEW: "CATEGORY_VIEW",
	EXPENSE_VIEW: "EXPENSE_VIEW",
};

function App() {
	const [categoryId, setCategoryId] = useState(null);
	const [page, setPage] = useState(Pages.CATEGORY_SELECTION);

	useEffect(() => {
		fetch("https://data.mongodb-api.com/app/data-egchn/endpoint/data/v1", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				"api-key":
					"gQvlLdyZWkUMYM3jK5YfqIiTeN6BQIvUwz9xaHag2lEbQVDxaqMpfoI7IXtRr6sm",
			},
			body: JSON.stringify({
				dataSource: "Cluster0",
				database: "expenses",
				collection: "expenses",
				document: {
					name: "John Sample",
					age: 42,
				},
			}),
		});
	}, []);

	return (
		<ExpensesContextProvider>
			<nav class="menu">
				<span onClick={() => setPage(Pages.CATEGORY_SELECTION)}>
					Transaction Category Selection |{" "}
				</span>
				<span onClick={() => setPage(Pages.BUDGET_VIEW)}>Budget View | </span>
				<span onClick={() => setPage(Pages.CATEGORY_VIEW)}>
					Category View |{" "}
				</span>
				<span onClick={() => setPage(Pages.EXPENSE_VIEW)}>Expense View</span>
			</nav>
			<div className="layout">
				{page === Pages.CATEGORY_SELECTION && <PasteExpensesList />}
				{page === Pages.BUDGET_VIEW && <BudgetView />}
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
			</div>
		</ExpensesContextProvider>
	);
}

export default App;
