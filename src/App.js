import "./App.css";
import { PasteList, CategorySelection, BudgetView } from "./components";
import { CategoriesContextProvider, ExpensesContextProvider } from "./context";

function App() {
  return (
    <ExpensesContextProvider>
      <CategoriesContextProvider>
        <PasteList />
        <table>
          <tbody>
            <tr>
              <td>
                <CategorySelection />
              </td>
              <td>
                <BudgetView />
              </td>
            </tr>
          </tbody>
        </table>
      </CategoriesContextProvider>
    </ExpensesContextProvider>
  );
}

export default App;
