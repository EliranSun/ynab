import { useState, useContext, useEffect } from "react";
import { orderBy } from "lodash";
import { ExpensesContext } from "./../../context";
import { Categories } from "../../constants";
import { getBudget, setBudget as storeBudget } from "../../utils";
import { FutureInsight } from "../FutureInsight";

const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30;

const BudgetView = () => {
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [budget, setBudget] = useState(getBudget());
  const [date, setDate] = useState(
    new Date(new Date().getTime() - ONE_MONTH_MS)
  );
  const { expenses } = useContext(ExpensesContext);
  const categoriesWithAmounts = Categories.map((category) => {
    let expensesInCategorySum = 0;
    category.subCategories.forEach((subcategory) => {
      const expensesInCategory = expenses.filter((expense) => {
        // TODO: same type instead of casting
        return String(expense.categoryId) === String(subcategory.id);
      });

      const thisMonthExpenses = expensesInCategory.filter((expense) => {
        const expenseDate = new Date(expense.timestamp);
        if (expense.isRecurring) {
          return expenseDate.getFullYear() === date.getFullYear();
        }

        return (
          expenseDate.getMonth() === date.getMonth() &&
          expenseDate.getFullYear() === date.getFullYear()
        );
      });
      const thisMonthAmount = thisMonthExpenses.reduce((acc, expense) => {
        return acc + expense.amount;
      }, 0);

      expensesInCategorySum += thisMonthAmount;
    });

    return {
      ...category,
      totalAmount: expensesInCategorySum,
    };
  });
  const totalExpenses = Object.values(categoriesWithAmounts)
    .reduce((acc, curr) => {
      if (curr.isIncome) return acc;
      return acc + curr.totalAmount;
    }, 0)
    .toFixed(2);
  const totalIncome = Object.values(categoriesWithAmounts)
    .reduce((acc, curr) => {
      if (!curr.isIncome) return acc;
      return acc + curr.totalAmount;
    }, 0)
    .toFixed(2);
  const bottomLine = (totalIncome - totalExpenses).toFixed(2);

  const budgetExpenses = Object.values(budget).reduce((acc, curr) => {
    if (curr.isIncome) return acc;
    return acc + Number(curr.amount);
  }, 0);

  const budgetIncome = Object.values(budget).reduce((acc, curr) => {
    if (!curr.isIncome) return acc;
    return acc + Number(curr.amount);
  }, 0);

  const budgetBottomLine = budgetIncome - budgetExpenses;

  useEffect(() => {
    storeBudget(budget);
  }, [budget]);

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
      <FutureInsight budget={budget} />
      <div>
        <input type="number" placeholder="Started the month with" />
      </div>
      <table>
        <tr>
          <td>
            <h1>Total Expenses this month</h1>
          </td>
          <td>{totalExpenses}</td>
          <td>
            <h1>Budget for Expenses this month</h1>
          </td>
          <td>{budgetExpenses}</td>
        </tr>
        <tr>
          <td>
            <h1>Total Income this month</h1>
          </td>
          <td>{totalIncome}</td>
          <td>
            <h1>Expected Income this month</h1>
          </td>
          <td>{budgetIncome}</td>
        </tr>
        <tr>
          <td>
            <h1 style={{ color: bottomLine < 0 ? "tomato" : "olive" }}>
              Bottom Line
            </h1>
          </td>
          <td>{bottomLine}</td>
          <td>
            <h1>Expected Bottom Line</h1>
          </td>
          <td>{budgetBottomLine}</td>
        </tr>
      </table>
      <table>
        <thead>
          <tr>
            {/* TODO: category model? will make things simpler here, but did complicated you last time */}
            {categoriesWithAmounts.map((category) => (
              <td>
                <h2>{category.name}</h2>
                <h3>Total: {category.totalAmount} NIS</h3>
                <h3>
                  Budget:{" "}
                  {category.subCategories.reduce((acc, curr) => {
                    if (!budget[curr.id]?.amount) return acc;
                    return acc + Number(budget[curr.id]?.amount);
                  }, 0)}{" "}
                  NIS
                </h3>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {Categories.map((category) => {
            return (
              <>
                <td>
                  {category.subCategories.map((subcategory) => {
                    const expensesInCategory = expenses.filter((expense) => {
                      // TODO: same type instead of casting
                      return (
                        String(expense.categoryId) === String(subcategory.id)
                      );
                    });
                    const thisMonthExpenses = expensesInCategory.filter(
                      (expense) => {
                        const expenseDate = new Date(expense.timestamp);
                        if (expense.isRecurring) {
                          return (
                            expenseDate.getFullYear() === date.getFullYear()
                          );
                        }

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

                    return (
                      <div
                        style={{
                          border:
                            Number(thisMonthAmount) >
                            Number(budget[subcategory.id]?.amount)
                              ? "5px solid red"
                              : "5px solid olive",
                        }}>
                        {hoveredCategoryId === subcategory.id && (
                          <div className="info-box">
                            {orderBy(
                              expensesInCategory.map((expense) => {
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
                          border="1"
                          key={subcategory.id}
                          onClick={() => setHoveredCategoryId(subcategory.id)}>
                          <tr>
                            <td>
                              <h3>
                                {subcategory.icon} {subcategory.name}
                              </h3>
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
                                        [subcategory.id]: {
                                          amount: event.target.value,
                                          isIncome: [81, 82].includes(
                                            subcategory.id
                                          ),
                                        },
                                      };

                                      return newBudget;
                                    });
                                  }}
                                  value={budget[subcategory.id]?.amount}
                                />
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </div>
                    );
                  })}
                </td>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetView;
