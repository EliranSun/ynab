import { useState, useMemo } from "react";
import classNames from "classnames";
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
    PASTE_AND_SELECT_TRANSACTIONS: "Paste & Select",
    BUDGET_VIEW: "Budget View",
    CATEGORY_VIEW: "Category View",
    EXPENSE_VIEW: "Expense View",
    FORTUNE_TELLER: "Fortune Teller",
    EFFICIENT: "Just how efficient are you?",
};

function App() {
    const [categoryId, setCategoryId] = useState(1);
    const [page, setPage] = useState(Pages.PASTE_AND_SELECT_TRANSACTIONS);
    const MenuItems = useMemo(() => [
        {
            name: Pages.PASTE_AND_SELECT_TRANSACTIONS,
            onClick: () => setPage(Pages.PASTE_AND_SELECT_TRANSACTIONS),
        },
        {
            name: Pages.BUDGET_VIEW,
            onClick: () => setPage(Pages.BUDGET_VIEW),
        },
        {
            name: Pages.FORTUNE_TELLER,
            onClick: () => setPage(Pages.FORTUNE_TELLER),
        },
        {
            name: Pages.CATEGORY_VIEW,
            onClick: () => setPage(Pages.CATEGORY_VIEW),
        },
        {
            name: Pages.EXPENSE_VIEW,
            onClick: () => setPage(Pages.EXPENSE_VIEW),
        },
        {
            name: Pages.EFFICIENT,
            onClick: () => setPage(Pages.EFFICIENT),
        },
    ], []);
    
    return (
        <div className="p-4">
            <Login>
                <ErrorBoundary>
                    <nav className="bg-gray-400 p-4">
                        {MenuItems.map((item) => (
                            <span
                                className={classNames("mr-4 cursor-pointer hover:text-white", {
                                    "bg-white": page === item.name,
                                })}
                                onClick={item.onClick}>{item.name}</span>
                        ))}
                    </nav>
                    <div className="layout">
                        <ExpensesContextProvider>
                            {page === Pages.PASTE_AND_SELECT_TRANSACTIONS && <PasteExpensesList/>}
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
        </div>
    );
}

export default App;
