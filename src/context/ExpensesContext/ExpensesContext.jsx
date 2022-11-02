import { useState, createContext } from "react";
import { noop } from "lodash";
import { getExpenses, setExpenses as setStorageExpenses } from "../../utils";

export const ExpensesContext = createContext({
  expenses: {},
  changeExpenseCategoryByName: noop,
});

export const ExpensesContextProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(getExpenses());
  const [error, setError] = useState(null);

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        changeExpenseCategoryByName: (expense, categoryId) => {
          setExpenses((prevExpenses) => {
            const newExpenses = prevExpenses.map((previousExpense) => {
              if (expense.isThirdParty) {
                if (expense.name === previousExpense.name) {
                  debugger;
                }
                if (expense.id === previousExpense.id) {
                  return {
                    ...previousExpense,
                    categoryId,
                  };
                }

                return previousExpense;
              }

              if (expense.name === previousExpense.name) {
                return {
                  ...previousExpense,
                  categoryId,
                };
              }

              return previousExpense;
            });

            setStorageExpenses(newExpenses);
            return newExpenses;
          });
        },
      }}>
      {children}
      <span className="error">{error}</span>
    </ExpensesContext.Provider>
  );
};
