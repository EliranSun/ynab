import { useState, useMemo, createContext } from "react";
import { sortBy } from "lodash";
import { Categories } from "../../constants";
import { aggregateTransactionsByName } from "../../utils";

export const CategoriesContext = createContext({
  categories: [],
  setCategories: () => {},
  transactions: [], // TODO: different context, or a more general name for this context
  sortedTransactionsByDate: [],
  setTransactions: () => {},
});

const getLastTransactions = () => {
  try {
    const transactions = JSON.parse(localStorage.getItem("lastPaste")) || [];
    const sortedAggregatedTransactions = sortBy(
      aggregateTransactionsByName(transactions),
      ({ timestamp }) => timestamp
    ).reverse();

    return { transactions, sortedAggregatedTransactions };
  } catch (error) {
    console.warn(error);
    return { transactions: [], sortedAggregatedTransactions: [] };
  }
};

export const CategoriesContextProvider = ({ children }) => {
  const memoTransactions = useMemo(() => getLastTransactions(), []);
  const [categories, setCategories] = useState(Categories);
  const [transactions, setTransactions] = useState(
    memoTransactions.transactions
  );

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        transactions,
        sortedAggregatedTransactions:
          memoTransactions.sortedAggregatedTransactions,
        setTransactions,
      }}>
      {children}
    </CategoriesContext.Provider>
  );
};
