import { useState, useContext, Fragment, useMemo } from "react";
import { noop, sortBy } from "lodash";
import { CategoriesContext, ExpensesContext } from "../../context";
import { aggregateTransactionsByName } from "../../utils";

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
  // TODO: items is a horrible name for the list of transactions
  const { categories, items } = useContext(CategoriesContext);
  const { setExpenses, expenses } = useContext(ExpensesContext);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const aggregatedTransactions = useMemo(
    () => aggregateTransactionsByName(items),
    [items]
  );
  const sortedTransactionsByDate = useMemo(
    () =>
      sortBy(aggregatedTransactions, ({ timestamp }) => timestamp).reverse(),
    [aggregatedTransactions]
  );

  if (!Object.keys(items).length) {
    return (
      <div className="category-selection">
        <p>Nothing parsed yet, paste/upload file above</p>
      </div>
    );
  }

  return (
    <div className="category-selection">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Total</th>
            <th>Last Transaction</th>
            <th>Category</th>
            <th>Subcategory</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactionsByDate.map(
            ({
              id,
              name,
              amount,
              timestamp,
              transactionsCount,
              categoryId,
            }) => {
              return (
                <tr key={name}>
                  <td>
                    <span className="category-selection__item__name">
                      {name.slice(0, 20)}{" "}
                      {transactionsCount ? `(${transactionsCount})` : ""}
                    </span>
                  </td>
                  <td>
                    <span className="category-selection__item__name">
                      {amount?.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className="category-selection__item__name">
                      {new Date(timestamp).toLocaleDateString("en-gb", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </td>
                  <td>
                    <Selection
                      isDisabled
                      isCategoryView
                      options={categories}
                      selectedCategoryId={selectedCategoryId}
                    />
                  </td>
                  <td>
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
                      }}
                      options={
                        selectedCategoryId
                          ? categories.filter(
                              (category) =>
                                String(category.id) ===
                                String(selectedCategoryId)
                            )
                          : categories
                      }
                    />
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategorySelection;
