import { useContext, useRef } from "react";
import { CategoriesContext } from "../../context";
import { Expense } from "../../models";

const PasteList = () => {
  const textAreaRef = useRef(null);
  const { setTransactions } = useContext(CategoriesContext);

  return (
    <div className="copy-paste-list">
      <textarea ref={textAreaRef} />
      <button
        onClick={() => {
          if (!textAreaRef.current) return;

          const rows = textAreaRef.current.value.split("\n");
          const transactions = rows.map((row) => {
            const cells = row.split("\t");
            return {
              name: cells[0],
              date: cells[1],
              creditCardNumber: cells[2],
              amount: cells[4],
              note: cells[5],
            };
          });

          const newTransactions = transactions.map((transaction) => {
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

            // if (isThirdPartyTransaction(name)) {
            //   name = `${name} (${uuidv4()})`;
            // }

            return new Expense({
              name,
              timestamp: date,
              amount: parsedAmount,
            });
          });

          setTransactions(newTransactions);
          localStorage.setItem("lastPaste", JSON.stringify(newTransactions));
        }}>
        Parse
      </button>
    </div>
  );
};

export default PasteList;
