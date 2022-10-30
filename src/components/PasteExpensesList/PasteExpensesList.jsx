import { useContext, useRef } from "react";
import { noop } from "lodash";
import { ExpensesContext } from "../../context";
import { Expense } from "../../models";

const isNewExpense = (name, timestamp, expenses) => {
  return expenses.find((expense) => {
    return expense.name !== name || expense.timestamp !== timestamp;
  });
};

const PasteExpensesList = ({ onParseExpensesSuccess = noop }) => {
  const textAreaRef = useRef(null);
  const { setExpenses } = useContext(ExpensesContext);

  return (
    <div>
      <textarea ref={textAreaRef} />
      <button
        onClick={() => {
          if (!textAreaRef.current) {
            return;
          }

          const rows = textAreaRef.current.value.split("\n");
          const expenses = rows.map((row) => {
            const cells = row.split("\t");
            return {
              name: cells[0],
              date: cells[1],
              creditCardNumber: cells[2],
              amount: cells[4],
              note: cells[5],
            };
          });

          const newExpenses = expenses
            .map((transaction) => {
              let name = transaction.name;
              if (!name || !transaction.amount || !transaction.date) {
                return {};
              }

              const dateParts = transaction.date.split("/");
              const year = `20${dateParts[2]}`;
              const month = Number(dateParts[1]) - 1;
              const day = dateParts[0];
              const date = new Date(Date.UTC(year, month, day)).getTime();

              const parsedAmount = parseFloat(
                transaction.amount.replace(",", "").replace("₪", "").trim()
              );

              return new Expense({
                name,
                timestamp: date,
                amount: parsedAmount,
              });
            })
            .filter((expense) => {
              return isNewExpense(expense.name, expense.timestamp, expenses);
            });

          onParseExpensesSuccess(newExpenses);
          setExpenses(newExpenses);
        }}>
        Parse
      </button>
    </div>
  );
};

export default PasteExpensesList;
