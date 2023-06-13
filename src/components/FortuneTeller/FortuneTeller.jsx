import "chartjs-adapter-date-fns";
import { useContext, useMemo, useRef, useState } from "react";
import { orderBy } from "lodash";
import { BudgetContext, ExpensesContext } from "../../context";
import TransactionsSection from "./TransactionsSection";
import { calcExpenses, chart, ONE_MONTH_MS, useChart } from "./utils";

const FortuneTeller = ({
    initialAmount = 0,
    lookaheadInMonths = 3,
    startDate = new Date(new Date().getTime() - ONE_MONTH_MS * 10),
}) => {
    const canvasRef = useRef(null);
    const [balance, setBalance] = useState(initialAmount);
    const { expensesArray: expenses } = useContext(ExpensesContext);
    const [selectedExpenseId, setSelectedExpenseId] = useState(null);
    const { budget } = useContext(BudgetContext);
    const expensesData = useMemo(
        () =>
            calcExpenses(
                orderBy(expenses, ["timestamp"], ["asc"]),
                balance,
                startDate
            ),
        [expenses, balance, startDate]
    );

    useChart({
        expensesData,
        budget,
        balance,
        lookaheadInMonths,
        startDate,
        canvasRef,
        initialAmount
    })

    return (
        <div className="h-screen">
            <div className="text-4xl my-4">
                <label htmlFor="balance">Current Balance (graph is calculated backwards):</label>
                <input
                    name="balance"
                    type="number"
                    placeholder="Current balance"
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value))}
                    className="border-b border-black ml-4"/>

            </div>
            <TransactionsSection
                selectedExpenseId={selectedExpenseId}
                setSelectedExpenseId={setSelectedExpenseId}
                data={expensesData}/>
            <div
                className="h-3/5 w-full"
                onClick={(event) => {
                    chart
                        .getElementsAtEventForMode(
                            event,
                            "nearest",
                            { intersect: true },
                            true
                        )
                        .forEach(({ element }) => {
                            const expenseId = element['$context']?.raw?.id;
                            console.log(expenseId);
                            setSelectedExpenseId(expenseId);
                            document
                                .getElementById(expenseId)
                                .scrollIntoView();
                        });
                }}
            >
                <canvas id="myChart" ref={canvasRef}></canvas>
            </div>
        </div>
    );
};

export default FortuneTeller;
