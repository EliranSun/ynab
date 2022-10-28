import { useState, useContext } from "react";
import { orderBy } from "lodash";
import { ExpensesContext, CategoriesContext } from "./../../context";

const getLastBudget = () => {
  try {
    const lastBudget = localStorage.getItem("budget");
    return lastBudget ? JSON.parse(lastBudget) : {};
  } catch (error) {
    return {};
  }
};

const BudgetView = () => {
  const [budget, setBudget] = useState(getLastBudget());
  const { categories } = useContext(CategoriesContext);
  const { expenses } = useContext(ExpensesContext);

  const handleBudget = ({ id, amount }) => {
    setBudget((prevState) => {
      const newBudget = { ...prevState, [id]: amount };
      localStorage.setItem("budget", JSON.stringify(newBudget));
      return newBudget;
    });
  };

  return (
    <div>
      {categories.map((category) => (
        <table className="flex" key={category.id}>
          <thead>
            <tr>
              <td>
                <h2>{category.name}</h2>
              </td>
            </tr>
          </thead>
          {category.subCategories.map((subcategory) => {
            const categoryExpenses = expenses.filter(
              (expense) => String(expense.categoryId) === String(subcategory.id)
            );
            const lastExpense = orderBy(
              categoryExpenses,
              ["timestamp"],
              ["desc"]
            )[0];
            const totalAmount = categoryExpenses.reduce(
              (total, expense) => total + expense.amount,
              0
            );
            const averageAmount = totalAmount / categoryExpenses.length;

            return (
              <tbody key={subcategory.id}>
                <tr>
                  <td>
                    <h3>{subcategory.name}</h3>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>
                      Last month:{" "}
                      {<b>{lastExpense?.amount?.toFixed(2)}</b> ||
                        "Not enough data"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>
                      Average:{" "}
                      {<b>{averageAmount.toFixed(2)}</b> || "Not enough data"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      type="number"
                      onChange={(event) => {
                        handleBudget({
                          id: subcategory.id,
                          amount: event.target.value,
                        });
                      }}
                      value={budget[subcategory.id] || 0}
                    />
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      ))}
    </div>
  );
};

export default BudgetView;
