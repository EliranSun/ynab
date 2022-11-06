import { useState, useContext, useMemo } from "react";
import { orderBy, noop } from "lodash";
import classNames from "classnames";
import { ExpensesContext } from "../../context";
import { Categories } from "../../constants";
import { isExpenseInMonth } from "../../utils";

import styles from "./ExpenseView.module.scss";

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

  return {
    ...category,
    subcategoryName,
  };
};

const SortBy = {
  DATE: "date",
  CATEGORY: "category",
  AMOUNT: "amount",
  NAME: "name",
};

const Expense = ({
  expense,
  onIsIncomeChange = noop,
  onIsRecurringChange = noop,
  onNoteChange = noop,
  onCategoryClick = noop,
  onAmountClick = noop,
  isListView = false,
}) => {
  const category = useMemo(() => getExpenseCategoryName(expense), [expense]);

  return (
    <div
      className={classNames("expense-box", { [styles.isListView]: isListView })}
      key={expense.id}>
      <span className={styles.title}>{expense.name}</span>
      <div
        className={styles.category}
        onClick={() => {
          onCategoryClick(category.id);
        }}>
        <span>
          {category?.name}
          {" > "}
          <b>{category.subcategoryName}</b>
        </span>
      </div>
      <div
        className={styles.amount}
        onClick={() => onAmountClick(expense.id, expense.amount)}>
        {expense.amount} NIS
      </div>
      <span className={styles.note}>
        <textarea
          value={expense.note}
          onInput={(event) => {
            onNoteChange(expense.id, event.target.value);
          }}
        />
      </span>
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
            onIsRecurringChange(expense.id, !expense.isRecurring);
          }}
        />
      </div>
      <div>
        <label>Is income?</label>
        <input
          checked={expense.isIncome}
          type="checkbox"
          onChange={() => {
            onIsIncomeChange(expense.id, !expense.isIncome);
          }}
        />
      </div>
    </div>
  );
};
const ExpenseView = ({ onCategoryClick = noop }) => {
  const {
    expenses,
    setExpenseAsRecurring,
    setExpenseAsIncome,
    setExpenseNote,
  } = useContext(ExpensesContext);
  const [searchValue, setSearchValue] = useState("בריכת גורדון-מוסדות");
  const [sum, setSum] = useState(0);
  const [sort, setSort] = useState(SortBy.AMOUNT);
  const orderedExpenses = useMemo(() => {
    return orderBy(
      expenses.filter(
        (expense) =>
          !expense.isIncome &&
          isExpenseInMonth(expense.timestamp, new Date().getTime())
      ),
      sort,
      "desc"
    );
  }, [expenses, sort]);

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
          .map((expense) => (
            <Expense
              expense={expense}
              onIsRecurringChange={setExpenseAsRecurring}
              onIsIncomeChange={setExpenseAsIncome}
              onCategoryClick={onCategoryClick}
              onNoteChange={setExpenseNote}
            />
          ))}
      </div>
      <div>
        <h2>Expenses By {sort}</h2>
        <h3>
          Subtotal: {Object.values(sum).reduce((acc, curr) => acc + curr, 0)}
        </h3>
        {orderedExpenses.map((expense) => (
          <Expense
            isListView
            expense={expense}
            onNoteChange={setExpenseNote}
            onIsRecurringChange={setExpenseAsRecurring}
            onIsIncomeChange={setExpenseAsIncome}
            onCategoryClick={onCategoryClick}
            onAmountClick={(id, amount) => {
              setSum({
                ...sum,
                [id]: sum[id] ? 0 : amount,
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseView;
