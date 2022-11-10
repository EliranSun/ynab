import { useState, createContext } from "react";

export const BudgetContext = createContext({
	budget: [],
	setBudget: () => {},
});

export const BudgetContextProvider = ({ children }) => {
	const [budget, setBudget] = useState([]);

	return (
		<BudgetContext.Provider value={{ budget, setBudget }}>
			{children}
		</BudgetContext.Provider>
	);
};
