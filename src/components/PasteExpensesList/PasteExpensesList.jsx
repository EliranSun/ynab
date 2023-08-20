import { useContext, useRef, useState } from "react";
import { Expense } from "../../models";
import { ExpensesContext } from "../../context";
import { CategorySelection } from "../CategorySelection";
import { SheetUpload } from "../SheetUpload";
import { Button, Title } from "../atoms";

const isExistingExpense = (newExpense, expenses) => {
  return expenses.find((expense) => {
    return (
        expense.name === newExpense.name &&
        expense.timestamp === newExpense.timestamp &&
        newExpense.amount === expense.amount
    );
  });
};

const VerticalHr = () => {
  return <div className="border border-gray-400 h-full"/>;
}

const PasteExpensesList = () => {
  const textAreaRef = useRef(null);
  const { expensesArray: expenses, setExpenses } = useContext(ExpensesContext);
  const [message, setMessage] = useState("");
  const [isParseButtonDisabled, setIsParseButtonDisabled] = useState(true);
  
  const setNewExpenses = () => {
    if (!textAreaRef.current) {
      return;
    }
    
    const rows = textAreaRef.current.value.split("\n");
    const newExpenses = rows
        .map((row) => {
          const cells = row.split("\t");
          
          const name = cells[0];
          const amount = cells[4];
          const dateParts = cells[1]?.split("/");
          const year = dateParts && `20${dateParts[2]}`;
          const month = dateParts && Number(dateParts[1]) - 1;
          const day = dateParts && dateParts[0];
          const timestamp = new Date(Date.UTC(year, month, day)).getTime();
          const parsedAmount =
              amount &&
              parseFloat(amount.replace(",", "").replace("₪", "").trim());
          
          if (!name || !parsedAmount || !timestamp) {
            return {};
          }
          
          return new Expense({
            name: name,
            timestamp: timestamp,
            amount: parsedAmount,
            note: cells[5],
          });
        })
        .filter((row) => {
          console.log({ row });
          if (isExistingExpense(row, expenses)) {
            return false;
          }
          
          return row.name && row.amount && row.timestamp;
        });
    
    if (newExpenses.length === 0) {
      setMessage("No new expenses found in this paste");
      return;
    }
    
    // setParsedExpenses(newExpenses);
    // setExpenses([...expenses, ...newExpenses]);
    setExpenses(newExpenses);
  }
  
  return (
      <div>
        <CategorySelection
            expenses={expenses.filter((expense) => {
              return !Boolean(expense.categoryId);
            })}/>
        <div className="my-4 flex gap-4 mx-auto justify-center">
          <div className="w-1/3 text-center">
            <Title type={Title.Types.H2}>Paste expenses</Title>
            <textarea
                ref={textAreaRef}
                role="textbox"
                onChange={event => {
                  setIsParseButtonDisabled(!event.target.value);
                }}
                className="border border-black w-96 h-96"/>
          </div>
          <div className="flex items-center justify-center flex-col">
            <VerticalHr/>
            <b>OR</b>
            <VerticalHr/>
          </div>
          <div className="w-1/3 text-center">
            <Title type={Title.Types.H2}>Upload a sheet</Title>
            <SheetUpload/>
          </div>
        </div>
        <div className="w-full text-center">
          <Button
              isDisabled={isParseButtonDisabled}
              onClick={setNewExpenses}>
            Parse Expenses
          </Button>
        
        </div>
        <h2>{message}</h2>
      </div>
  );
};

export default PasteExpensesList;
