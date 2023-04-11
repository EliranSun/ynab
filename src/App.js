import { useState } from "react";
import { ExpensesContextProvider, BudgetContextProvider } from "./context";
import {
    PasteExpensesList,
    BudgetView,
    CategoryView,
    ExpenseView,
    FortuneTeller,
    Login,
    PageRenderer,
    ErrorBoundary,
} from "./components";
import { Pages } from "./constants";
import { MainMenu } from "./components";

function App() {
    const [categoryId, setCategoryId] = useState(1);
    const [page, setPage] = useState(Pages.PASTE_AND_SELECT_TRANSACTIONS);

    return (
        <Login>
            <ErrorBoundary>
                <MainMenu onMenuItemClick={setPage} currentPage={page}/>
                <ExpensesContextProvider>
                    <BudgetContextProvider>
                        <div className="layout p-4 pt-12">
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
                            <PageRenderer
                                currentPageName={page}
                                pageName={Pages.FORTUNE_TELLER}
                                element={
                                    <FortuneTeller
                                        startDate={new Date("08/30/2022")}
                                        initialAmount={7099.12}
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
