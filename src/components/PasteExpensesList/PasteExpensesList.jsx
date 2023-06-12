import { useState, useRef, useContext } from "react";
import { Expense } from "../../models";
import { ExpensesContext } from "../../context";
import { CategorySelection } from "../CategorySelection";

const isExistingExpense = (newExpense, expenses) => {
    const expenseFound = expenses.find((expense) => {
        return (
            expense.name === newExpense.name &&
            expense.timestamp === newExpense.timestamp &&
            newExpense.amount === expense.amount
        );
    });
    
    return expenseFound;
};

const PasteExpensesList = () => {
    const textAreaRef = useRef(null);
    const { expensesArray: expenses, setExpenses } = useContext(ExpensesContext);
    const [isUncategorizedView, setIsUncategorizedView] = useState(true);
    const [message, setMessage] = useState("");
    
    return (
        <div className="mt-16">
            <CategorySelection
                isUncategorizedView={isUncategorizedView}
                expenses={expenses.filter((expense) =>
                    isUncategorizedView ? !Boolean(expense.categoryId) : true
                )}
            />
            <textarea ref={textAreaRef}/>
            <button
                onClick={() => {
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
                }}
            >
                Parse
            </button>
            <hr/>
            {/* <ExpenseConflictResolver
				prevExpenses={expenses}
				newExpenses={parsedExpenses}
				onResolve={(resolvedExpenses) => {
					setExpenses(resolvedExpenses);
				}}
			/> */}
            <h2>{message}</h2>
            <div>
                <button onClick={() => setIsUncategorizedView(!isUncategorizedView)}>
                    {isUncategorizedView ? "Show All" : "Show Uncategorized"}
                </button>
            </div>
        </div>
    );
};

export default PasteExpensesList;
