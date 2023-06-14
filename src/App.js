import { useState } from "react";
import { BudgetContextProvider, ExpensesContextProvider } from "./context";
import { BudgetView, CategoryView, ErrorBoundary, ExpenseView, FortuneTeller, Login, MainMenu, PageRenderer, PasteExpensesList, } from "./components";
import { Pages } from "./constants";


// FIXME: null category selection when reaching end of expenses from paste
// TODO: auto recognition of income as income
// TODO: suggest categorization based on previous expenses
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
                                pageName={Pages.FORTUNE_TELLER}
                                element={<FortuneTeller startDate={new Date("08/01/2022")}/>}/>
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
