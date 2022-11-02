import { useState } from "react";
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
  const [page, setPage] = useState(Pages.CATEGORY_SELECTION);

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
        {page === Pages.CATEGORY_VIEW && <CategoryView />}
        {page === Pages.EXPENSE_VIEW && <ExpenseView />}
      </div>
    </ExpensesContextProvider>
  );
}

export default App;
