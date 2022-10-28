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

export const ExpensesContextProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(getLastExpenses());
  const [error, setError] = useState(null);

  const handleExpense = ({ name, id, timestamp, amount, categoryId }) => {
    if (!name || !id) {
      setError(`Missing name or id, name: ${name}, id: ${id}`);
      return;
    }

    const expense = expenses.find((expense) => {
      return expense.id === id;
    });

    if (expense) {
      expense.setCategoryId(categoryId);
      setExpenses((prevExpenses) => {
        const newExpenses = prevExpenses
          .filter((expense) => expense.id !== id)
          .concat(expense);

        localStorage.setItem("expenses", JSON.stringify(newExpenses));
        return newExpenses;
      });
      return;
    }

    setExpenses((prevExpenses) => {
      const newExpenses = prevExpenses.concat(
        new Expense({
          name,
          timestamp,
          amount,
          categoryId,
        })
      );

      localStorage.setItem("expenses", JSON.stringify(newExpenses));
      return newExpenses;
    });
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        setExpenses: (expenses) => {
          setError("");

          if (isArray(expenses)) {
            expenses.forEach(handleExpense);
            return;
          }

          handleExpense(expenses);
        },
      }}>
      {children}
      <span className="error">{error}</span>
    </ExpensesContext.Provider>
  );
};
