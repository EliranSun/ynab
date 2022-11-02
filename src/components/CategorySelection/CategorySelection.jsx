import { useState, useContext, Fragment } from "react";
import { noop } from "lodash";
import { ExpensesContext } from "../../context";
import { Categories } from "../../constants";

// TODO: move to separate components
const TransactionName = ({ name }) => {
  return <span>{name}</span>;
};

const TransactionAmount = ({ amount }) => {
  return (
    <span className="category-selection__item__name">{amount?.toFixed(2)}</span>
  );
};

const SelectTransactionSubcategory = ({
  transaction,
  categoryId,
  onSelect = noop,
  categories = [],
  isListView = false,
}) => {
  const { changeExpenseCategoryByName } = useContext(ExpensesContext);

  if (isListView) {
    return (
      <select
        value={categoryId}
        onChange={(e) => {
          changeExpenseCategoryByName(transaction, e.target.value);
          onSelect(e.target.value);
        }}>
        {categories.map((category) => (
          <>
            <option value={category.id}>======{category.name}======</option>
            {category.subCategories.map((subcategory) => (
              <option value={subcategory.id}>
                {subcategory.icon} {subcategory.name}
              </option>
            ))}
          </>
        ))}
      </select>
    );
  }

  return (
    <div className="subcategory-select">
      {categories.map((option) => {
        return (
          <div key={option.id} className="subcategory-select-group">
            <div>
              <b>{option.name}</b>
            </div>
            {option.subCategories.map((sub) => {
              return (
                <span
                  key={sub.id}
                  style={
                    String(categoryId) === String(sub.id)
                      ? { backgroundColor: "tomato" }
                      : {}
                  }
                  onClick={() => {
                    changeExpenseCategoryByName(transaction, sub.id);
                    onSelect();
                  }}
                  className="subcategory">
                  <span>{sub.icon}</span>
                  <span>{sub.name}</span>
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const TransactionDate = ({ timestamp }) => {
  return (
    <span className="category-selection__item__name">
      {new Date(timestamp).toLocaleDateString("en-gb", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>
  );
};

const TransactionChildrenView = ({ transaction, isOpen }) => {
  return (
    isOpen &&
    transaction?.transactions?.map((transaction) => (
      <>
        <hr />
        <table>
          <TransactionName name={transaction.name} count={1} /> <br />
          <TransactionAmount amount={transaction.amount} />
          <br />
          <TransactionDate timestamp={transaction.timestamp} /> <br />
        </table>
      </>
    ))
  );
};

const CategorySelectionViewModes = {
  SLIDES: "SLIDES",
  LIST: "LIST",
};
const CategorySelection = ({
  aggregatedExpenses = [],
  totalExpensesCount = 0,
}) => {
  const [aggregatedDetailsVisibleId, setAggregatedDetailsId] = useState(false);
  const [viewMode, setViewMode] = useState(CategorySelectionViewModes.SLIDES);
  const firstUncategorizedTransactionIndex = aggregatedExpenses.findIndex(
    (expense) => !expense.categoryId
  );
  const [transactionIndex, setTransactionIndex] = useState(
    firstUncategorizedTransactionIndex === -1
      ? 0
      : firstUncategorizedTransactionIndex
  );

  if (!aggregatedExpenses.length) {
    return (
      <div className="category-selection">
        <p>Nothing parsed yet, paste/upload file above</p>
      </div>
    );
  }

  const renderOneTransaction = (transaction, isListView) => {
    const {
      id,
      name,
      amount,
      timestamp,
      transactionsCount,
      transactions,
      categoryId,
    } = transaction;
    const isDetailedView = aggregatedDetailsVisibleId === id;
    if (isListView) {
      return (
        <tr key={id}>
          <td
            onClick={() => {
              if (transaction.transactions?.length < 2) {
                return;
              }

              if (isDetailedView) {
                setAggregatedDetailsId(null);
                return;
              }

              setAggregatedDetailsId(id);
            }}>
            <TransactionName
              name={name}
              icon={transaction.icon}
              count={transactionsCount}
            />{" "}
            {transactions?.length > 1 && `(${transactions.length})`}
            <TransactionChildrenView
              transaction={transaction}
              isOpen={isDetailedView}
            />
          </td>
          <td>
            <TransactionAmount amount={amount} />
          </td>
          <td>
            <TransactionDate timestamp={timestamp} />
          </td>
          <td>
            <SelectTransactionSubcategory
              isListView={isListView}
              onSelect={() => setTransactionIndex(transactionIndex + 1)}
              categoryId={categoryId}
              transaction={transaction}
              categories={Categories}
            />
          </td>
          <td>
            <textarea placeholder="Notes" />
          </td>
        </tr>
      );
    }
    return (
      <>
        <tr key={id}>
          <td
            width={100}
            onClick={() => {
              if (transaction.transactions?.length < 2) {
                return;
              }

              if (isDetailedView) {
                setAggregatedDetailsId(null);
                return;
              }

              setAggregatedDetailsId(id);
            }}>
            <TransactionName
              name={name}
              icon={transaction.icon}
              count={transactionsCount}
            />{" "}
            {transactions?.length > 1 && `(${transactions.length})`}
            <TransactionChildrenView
              transaction={transaction}
              isOpen={isDetailedView}
            />
          </td>
          <td width={100}>
            <TransactionAmount amount={amount} />
          </td>
          <td width={100}>
            <TransactionDate timestamp={timestamp} />
          </td>
        </tr>
        <tr>
          <td>
            <SelectTransactionSubcategory
              isListView={isListView}
              onSelect={() => setTransactionIndex(transactionIndex + 1)}
              categoryId={categoryId}
              transaction={transaction}
              categories={Categories}
            />
          </td>
          <td>
            <textarea placeholder="Notes" />
          </td>
        </tr>
      </>
    );
  };

  const renderTransactionList = () => {
    return (
      <div>
        {aggregatedExpenses.map((expense) =>
          renderOneTransaction(expense, true)
        )}
      </div>
    );
  };

  // TODO: show only unhandled expense
  // TODO: on row click - highlight row
  return (
    <div className="category-selection">
      <h1>Organize (Transactions Category Selection)</h1>
      <h4>Grouped Expenses count: {aggregatedExpenses.length}</h4>
      <h4>Total Expenses count: {totalExpensesCount}</h4>
      <div>
        <fieldset>
          <legend>Categories Selection View</legend>
          <div>
            <input
              type="radio"
              id="slides"
              name="category-selection-view"
              onClick={() => setViewMode(CategorySelectionViewModes.SLIDES)}
              checked
            />
            <label htmlFor="slides">
              Slides (good for choosing category for transaction batches)
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="list"
              name="category-selection-view"
              onClick={() => setViewMode(CategorySelectionViewModes.LIST)}
            />
            <label htmlFor="list">
              List (good for changing specific transactions)
            </label>
          </div>
        </fieldset>
      </div>
      <button
        disabled={transactionIndex === 0}
        onClick={() => {
          console.info(aggregatedExpenses[transactionIndex - 1]);
          setTransactionIndex(transactionIndex - 1);
        }}>
        Previous Transaction
      </button>
      <span>
        {" "}
        {transactionIndex + 1} / {aggregatedExpenses.length}{" "}
      </span>
      <button
        onClick={() => {
          console.info(aggregatedExpenses[transactionIndex + 1]);
          setTransactionIndex(transactionIndex + 1);
        }}
        disabled={transactionIndex === aggregatedExpenses.length + 1}>
        Next Transaction
      </button>
      <table border={1}>
        <thead>
          <tr>
            <th width="100">Name</th>
            <th width="100">Total</th>
            <th width="100">Last Transaction</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {viewMode === CategorySelectionViewModes.SLIDES
            ? renderOneTransaction(aggregatedExpenses[transactionIndex])
            : renderTransactionList()}
        </tbody>
      </table>
    </div>
  );
};

CategorySelection.whyDidYouRender = true;
export default CategorySelection;
