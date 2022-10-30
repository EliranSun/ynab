import { useState, useContext, Fragment } from "react";
import { noop } from "lodash";
import { CategoriesContext, ExpensesContext } from "../../context";

// TODO: move to separate components
const TransactionName = ({ name, count }) => {
  return (
    <span className="category-selection__item__name">
      {name} {count ? `(${count})` : ""}
    </span>
  );
};

const TransactionAmount = ({ amount }) => {
  return (
    <span className="category-selection__item__name">{amount?.toFixed(2)}</span>
  );
};

const SelectTransactionSubcategory = ({
  transaction,
  selectedSubcategoryId,
  onSelect = noop,
}) => {
  const { categories } = useContext(CategoriesContext);
  const { setExpenses, expenses } = useContext(ExpensesContext);
  const { name, id, amount, timestamp } = transaction;

  return (
    <Selection
      selectedCategoryId={
        expenses
          .map((expense) => {
            if (expense.name === name) {
              return expense.id;
            }

            return null;
          })
          .filter(Boolean)[0]
      }
      onSubcategorySelect={(categoryId) => {
        setExpenses({
          id,
          name,
          amount,
          timestamp,
          categoryId,
        });
        onSelect(id);
      }}
      options={
        selectedSubcategoryId
          ? categories.filter(
              (category) =>
                String(category.id) === String(selectedSubcategoryId)
            )
          : categories
      }
    />
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

const Selection = ({
  options = [],
  isCategoryView = false,
  isDisabled = false,
  onCategorySelect = noop,
  onSubcategorySelect = noop,
  selectedCategoryId = "",
}) => {
  const [id, setId] = useState(selectedCategoryId);

  if (isCategoryView) {
    return (
      <select
        disabled={isDisabled}
        value={id}
        onChange={(event) => {
          onCategorySelect(event.target.value);
          setId(event.target.value);
        }}>
        {options.map((option) => {
          return (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          );
        })}
      </select>
    );
  }

  return (
    <select
      value={id}
      disabled={isDisabled}
      onChange={(event) => {
        onSubcategorySelect(event.target.value);
        setId(event.target.value);
      }}>
      <option value="">Select a subcategory</option>
      {options.map((option) => {
        return (
          <Fragment key={option.id}>
            <option value={option.name} disabled>
              ===== {option.name} =====
            </option>
            {option.subCategories.map((sub) => {
              return (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              );
            })}
          </Fragment>
        );
      })}
    </select>
  );
};

const CategorySelection = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const { sortedAggregatedTransactions } = useContext(CategoriesContext);

  if (!Object.keys(sortedAggregatedTransactions).length) {
    return (
      <div className="category-selection">
        <p>Nothing parsed yet, paste/upload file above</p>
      </div>
    );
  }

  // on row click - highlight row
  return (
    <div className="category-selection">
      <table border={1}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Total</th>
            <th>Last Transaction</th>
            <th>Subcategory</th>
          </tr>
        </thead>
        <tbody>
          {sortedAggregatedTransactions.map((transaction) => {
            const { id, name, amount, timestamp, transactionsCount } =
              transaction;
            return (
              <tr key={id}>
                <td>
                  <TransactionName name={name} count={transactionsCount} />
                </td>
                <td>
                  <TransactionAmount amount={amount} />
                </td>
                <td>
                  <TransactionDate timestamp={timestamp} />
                </td>
                <td>
                  <SelectTransactionSubcategory
                    transaction={transaction}
                    selectedSubcategoryId={selectedCategoryId}
                    onSelect={setSelectedCategoryId}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

CategorySelection.whyDidYouRender = true;
export default CategorySelection;
