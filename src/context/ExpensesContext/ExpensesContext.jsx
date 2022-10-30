import { useState, createContext } from "react";
import { noop, isArray } from "lodash";
import { Expense } from "../../models";

export const ExpensesContext = createContext({
  expenses: {},
  setExpenses: noop,
});

const getLastExpenses = () => {
  let lastExpenses = {};
  try {
    lastExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    return lastExpenses.map((expense) => new Expense(expense));
  } catch (error) {
    console.warn(error);
    return [];
  }
};

const updateExpenses = (expense, id) => (prevExpenses) => {
  const newExpenses = prevExpenses
    .filter((expense) => expense.id !== id)
    .concat(expense);

  localStorage.setItem("expenses", JSON.stringify(newExpenses));
  return newExpenses;
};

export const ExpensesContextProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(getLastExpenses());
  const [error, setError] = useState(null);

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        setExpenses: (expenses) => {
          setError("");

          if (isArray(expenses)) {
            expenses.forEach((newExpense) => {
              const { name, id, timestamp } = newExpense;
              if (!name || !id) {
                setError(`Missing name or id, name: ${name}, id: ${id}`);
                return;
              }

              const isExpenseExists = expenses.find((expense) => {
                return (
                  expense.id === id ||
                  (expense.name === name && expense.timestamp === timestamp)
                );
              });

              if (isExpenseExists) {
                setExpenses(updateExpenses(newExpense, id));
                return;
              }

              setExpenses(updateExpenses(newExpense));
            });

            return;
          }

          setExpenses(updateExpenses(expenses));
        },
      }}>
      {children}
      <span className="error">{error}</span>
    </ExpensesContext.Provider>
  );
};
