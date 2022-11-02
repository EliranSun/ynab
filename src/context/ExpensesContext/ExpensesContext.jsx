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
        changeExpenseCategoryByName: (name, categoryId) => {
          setExpenses((prevExpenses) => {
            const newExpenses = prevExpenses.map((expense) => {
              if (expense.name === name) {
                return {
                  ...expense,
                  categoryId,
                };
              }

              return expense;
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
