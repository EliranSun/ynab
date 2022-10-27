import "./App.css";
import {
	SheetUpload,
	PasteList,
	CategorySelection,
	BudgetView,
} from "./components";
import { CategoriesContextProvider, ExpensesContextProvider } from "./context";

function App() {
	return (
		<ExpensesContextProvider>
			<CategoriesContextProvider>
				<BudgetView />
				<SheetUpload />
				<PasteList />
				<CategorySelection />
			</CategoriesContextProvider>
		</ExpensesContextProvider>
	);
}

export default App;
