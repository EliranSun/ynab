import { useState, useMemo } from "react";
import classNames from "classnames";
import noop from "lodash/noop";
import { ExpensesContextProvider, BudgetContextProvider } from "./context";
import {
    PasteExpensesList,
    BudgetView,
    CategoryView,
    ExpenseView,
    FortuneTeller,
    Login,
    ErrorBoundary,
} from "./components";
import { Pages } from "./constants";
import { MainMenu } from "./components";

import "./App.css";


const PageRenderer = ({ element, currentPageName, pageName }) => {
    if (currentPageName !== pageName) {
        return null;
    }
    
    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow">
                {element}
            </div>
        </div>
    )
}

function App() {
    const [categoryId, setCategoryId] = useState(1);
    const [page, setPage] = useState(Pages.PASTE_AND_SELECT_TRANSACTIONS);
    
    return (
        <Login>
            <ErrorBoundary>
                <MainMenu onMenuItemClick={setPage} currentPage={page}/>
                <ExpensesContextProvider>
                    <BudgetContextProvider>
                        <div className="layout p-4">
                            <PageRenderer
                                currentPageName={page}
                                pageName={Pages.PASTE_AND_SELECT_TRANSACTIONS}
                                element={<PasteExpensesList/>}/>
                            <PageRenderer
                                currentPageName={page}
                                pageName={Pages.BUDGET_VIEW}
                                element={<BudgetView/>}/>
                            <PageRenderer
                                currentPageName={page}
                                pageName={Pages.FORTUNE_TELLER}
                                element={
                                    <FortuneTeller
                                        startDate={new Date("08/30/2022")}
                                        initialAmount={7099.12}
                                    />
                                }/>
                            <PageRenderer
                                currentPageName={page}
                                pageName={Pages.CATEGORY_VIEW}
                                element={<CategoryView categoryId={categoryId}/>}/>
                            <PageRenderer
                                currentPageName={page}
                                pageName={Pages.EXPENSE_VIEW}
                                element={
                                    <ExpenseView
                                        onCategoryClick={(categoryId) => {
                                            setCategoryId(categoryId);
                                            setPage(Pages.CATEGORY_VIEW);
                                        }}
                                    />
                                }/>
                        </div>
                    </BudgetContextProvider>
                </ExpensesContextProvider>
            </ErrorBoundary>
        </Login>
    );
}

export default App;
