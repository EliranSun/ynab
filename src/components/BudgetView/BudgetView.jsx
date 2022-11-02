import { useState, useContext } from "react";
import { orderBy } from "lodash";
import { ExpensesContext } from "./../../context";
import { Categories } from "../../constants";
import { getCategories, setCategories } from "../../utils";

const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30;

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
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [date, setDate] = useState(
    new Date(new Date().getTime() - ONE_MONTH_MS)
  );
  const { expenses } = useContext(ExpensesContext);

  return (
    <div>
      <h1>Plan (Budget View)</h1>
      <div>
        <button
          onClick={() => setDate(new Date(date.getTime() - ONE_MONTH_MS))}>
          Previous Month
        </button>
        Showing{" "}
        {date.toLocaleString("default", { month: "long", year: "numeric" })}
        <button
          onClick={() => setDate(new Date(date.getTime() + ONE_MONTH_MS))}
          disabled={date.getMonth() + 1 > new Date().getMonth()}>
          Next Month
        </button>
      </div>
      <table>
        <thead>
          <tr>
            {Categories.map((category) => (
              <td>
                <h2>{category.name}</h2>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {Categories.map((category) => {
            return (
              <td>
                {category.subCategories.map((subcategory) => {
                  const expensesInCategory = expenses.filter((expense) => {
                    // TODO: same type

                    if (expense.name === "בריכת גורדון-מוסדות") {
                      debugger;
                    }
                    return (
                      String(expense.categoryId) === String(subcategory.id)
                    );
                  });
                  const thisMonthExpenses = expensesInCategory.filter(
                    (expense) => {
                      const expenseDate = new Date(expense.timestamp);
                      return (
                        expenseDate.getMonth() === date.getMonth() &&
                        expenseDate.getFullYear() === date.getFullYear()
                      );
                    }
                  );
                  const thisMonthAmount = thisMonthExpenses.reduce(
                    (acc, expense) => {
                      return acc + expense.amount;
                    },
                    0
                  );
                  const averageAmount = 0;
                  const budget = 0;

                  return (
                    <>
                      {hoveredCategoryId === subcategory.id && (
                        <div className="info-box">
                          {orderBy(
                            expensesInCategory.map((expense) => {
                              console.debug({ expense });
                              return (
                                <div>
                                  <span>{expense.name.slice(0, 20)}</span>
                                  {" | "}
                                  <span>{expense.amount}</span>
                                </div>
                              );
                            }),
                            "amount",
                            "desc"
                          )}
                        </div>
                      )}
                      <tbody
                        key={subcategory.id}
                        onClick={() => setHoveredCategoryId(subcategory.id)}>
                        <tr>
                          <td>
                            <h3>{subcategory.name}</h3>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span>
                              Last: <b>{thisMonthAmount?.toFixed(2)}</b>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span>
                              Average: <b>{averageAmount.toFixed(2)}</b>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span>
                              Budget:
                              <input
                                type="number"
                                onChange={(event) => {
                                  setBudget((prevState) => {
                                    const newBudget = {
                                      ...prevState,
                                      [subcategory.id]: event.target.value,
                                    };

                                    return newBudget;
                                  });
                                }}
                                value={budget[subcategory.id] || 0}
                              />
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </>
                  );
                })}
              </td>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetView;
