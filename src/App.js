import { useState } from "react";
import { BudgetContextProvider, ExpensesContextProvider } from "./context";
import { BudgetView, CategoryView, ErrorBoundary, ExpenseView, FortuneTeller, Login, MainMenu, PageRenderer, PasteExpensesList, } from "./components";
import { Pages } from "./constants";

function App() {
    const [categoryId, setCategoryId] = useState(1);
    const [page, setPage] = useState(Pages.PASTE_AND_SELECT_TRANSACTIONS);
    
    return (
        <Login>
            <ErrorBoundary>
                <MainMenu onMenuItemClick={setPage} currentPage={page}/>
                <ExpensesContextProvider>
                    <BudgetContextProvider>
                        <div className="p-4 pt-16">
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
                                        startDate={new Date("08/01/2022")}
                                        // initialAmount={7099.12}
                                        initialAmount={-11204.03}
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
