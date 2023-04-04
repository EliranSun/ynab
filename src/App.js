import { useState } from "react";
import { ExpensesContextProvider, BudgetContextProvider } from "./context";
import {
    PasteExpensesList,
    BudgetView,
    CategoryView,
    ExpenseView,
    Efficient,
    DateChanger,
    FortuneTeller,
    Login,
    ErrorBoundary,
} from "./components";

import "./App.css";

const Pages = {
    CATEGORY_SELECTION: "CATEGORY_SELECTION",
    BUDGET_VIEW: "BUDGET_VIEW",
    CATEGORY_VIEW: "CATEGORY_VIEW",
    EXPENSE_VIEW: "EXPENSE_VIEW",
    EFFICIENT: "EFFICIENT",
    FORTUNE_TELLER: "FORTUNE_TELLER",
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
            onClick: () => setPage(Pages.FORTUNE_TELLER),
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
        <Login>
            <ErrorBoundary>
                <nav className="menu">
                    {MenuItems.map((item) => (
                        <span onClick={item.onClick}>{item.name} ▫ </span>
                    ))}
                </nav>
                <div className="layout">
                    <ExpensesContextProvider>
                        {page === Pages.CATEGORY_SELECTION && <PasteExpensesList/>}
                        {page === Pages.EFFICIENT && <Efficient/>}
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
                            {page === Pages.FORTUNE_TELLER && (
                                <DateChanger>
                                    {({ isPreviousMonth, currentTimestamp, isSameDate }) => (
                                        <FortuneTeller
                                            startDate={new Date("08/30/2022")} // 16/09/2022
                                            initialAmount={
                                                // TODO: support date for this, so it will be your grounding point
                                                // ...Or go back until the opening of the bank account
                                                // -1282.03 // From around 16/09/2022
                                                7099.12
                                            }
                                        />
                                    )}
                                </DateChanger>
                            )}
                        </BudgetContextProvider>
                        {page === Pages.CATEGORY_VIEW && (
                            <CategoryView categoryId={categoryId}/>
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
            </ErrorBoundary>
        </Login>
    );
}

export default App;
