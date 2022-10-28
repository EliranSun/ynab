import "./App.css";
import { PasteList, CategorySelection, BudgetView } from "./components";
import { CategoriesContextProvider, ExpensesContextProvider } from "./context";

function App() {
  return (
    <ExpensesContextProvider>
      <CategoriesContextProvider>
        <PasteList />
        <CategorySelection />
        <hr />
        <BudgetView />
      </CategoriesContextProvider>
    </ExpensesContextProvider>
  );
}

export default App;
