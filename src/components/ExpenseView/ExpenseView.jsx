import { useState, useContext } from "react";
import { ExpensesContext } from "../../context";
import { Categories } from "../../constants";

const getExpenseCategoryName = (expense) => {
  let subcategoryName = "";
  const category = Categories.find((category) => {
    const subcategory = category.subCategories.filter(
      (subcategory) => String(subcategory.id) === String(expense.categoryId)
    )[0]?.name;

    if (subcategory) {
      subcategoryName = subcategory;
      return true;
    }

    return false;
  });

  return `${category?.name} > ${subcategoryName}`;
};

const ExpenseView = () => {
  const { expenses, setExpenseAsRecurring, setExpenseAsIncome } =
    useContext(ExpensesContext);
  const [searchValue, setSearchValue] = useState("בריכת גורדון-מוסדות");

  return (
    <div>
      <h1>Understand (Expense View)</h1>
      <input
        type="text"
        placeholder="search"
        onChange={(event) => {
          setSearchValue(event.target.value);
        }}
      />
      <div className="expenses-view-list">
        {expenses
          .filter((expense) => {
            if (searchValue === "") {
              return false;
            }
            return expense.name
              .toLowerCase()
              .includes(searchValue.toLowerCase());
          })
          .map((expense) => {
            console.info(expense);
            return (
              <div className="expense-box" key={expense.id}>
                <span>{expense.name}</span>
                <div>{expense.amount} NIS</div>
                <div>
                  <span>
                    {new Date(expense.timestamp).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <label>Is recurring?</label>
                  <input
                    checked={expense.isRecurring}
                    type="checkbox"
                    onChange={() => {
                      setExpenseAsRecurring(expense.id, !expense.isRecurring);
                    }}
                  />
                </div>
                <div>
                  <label>Is income?</label>
                  <input
                    checked={expense.isIncome}
                    type="checkbox"
                    onChange={() => {
                      setExpenseAsIncome(expense.id, !expense.isIncome);
                    }}
                  />
                </div>
                <div>{getExpenseCategoryName(expense)}</div>
              </div>
            );
          })}
      </div>
      <div>
        <h2>Top 10 Expenses</h2>
      </div>
    </div>
  );
};

export default ExpenseView;
