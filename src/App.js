import "./App.css";
import { PasteExpensesList, CategorySelection, BudgetView } from "./components";
import { ExpensesContextProvider } from "./context";

function App() {
	return (
		<ExpensesContextProvider>
			<table>
				<tbody>
					<tr>
						<td>
							<PasteExpensesList />
						</td>
						<td>
							<BudgetView />
						</td>
					</tr>
				</tbody>
			</table>
		</ExpensesContextProvider>
	);
}

export default App;
