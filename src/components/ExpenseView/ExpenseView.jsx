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
  const { expenses } = useContext(ExpensesContext);
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
            return (
              <div className="expense-box">
                <span>{expense.name}</span>
                <div>{expense.amount} NIS</div>
                <div>
                  {new Date(expense.timestamp).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
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
