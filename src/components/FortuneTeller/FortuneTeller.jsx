import "chartjs-adapter-date-fns";
import { useState, useRef, useEffect, useMemo, useContext } from "react";
import { orderBy } from "lodash";
import { Chart, registerables } from "chart.js";
import { BudgetContext, ExpensesContext } from "../../context";
import { Categories } from "../../constants";
import { deleteExpense } from "../../utils";
import classNames from "classnames";

const ONE_DAY_MS = 1000 * 60 * 60 * 24;
const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30;
let singleton = null;
const IncomeIds = ["81", "82", "83"];

let chart;

const createNewChart = ({
    data = [],
    startDate,
    budget = {},
    projectionData = {},
}) => {
    if (singleton) {
        console.info("returning singleton", singleton);
        return singleton;
    }
    
    Chart.register(...registerables);
    
    const ctx = document.getElementById("myChart").getContext("2d");
    
    let myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: data.map((expense) => {
                return new Date(expense.date).toLocaleString("en-gb", {
                    day: "numeric",
                    month: "short",
                });
            }),
            // labels: data.map((expense) => expense.name),
            datasets: [
                {
                    label: "Income + Expenses",
                    data: data,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                },
                {
                    label: "Budget",
                    data: budget,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                    ],
                },
                {
                    label: "Projection",
                    data: projectionData,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                    ],
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    min: startDate,
                    type: "time",
                    time: {
                        unit: "month",
                    },
                    bounds: "ticks",
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: (context) => {
                            return context[0]?.raw?.name;
                        },
                        label: (context) => {
                            let label = "";
                            const date = new Date(context.raw.date).toLocaleDateString(
                                "en-GB",
                                {
                                    month: "short",
                                    year: "numeric",
                                    day: "numeric",
                                }
                            );
                            const amount = new Intl.NumberFormat("he-IL", {
                                style: "currency",
                                currency: "ILS",
                            }).format(context?.raw?.amount);
                            
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat("he-IL", {
                                    style: "currency",
                                    currency: "ILS",
                                }).format(context.parsed.y);
                            }
                            return `Date: ${date} | Expense Amount: ${amount} | Total: ${label}`;
                        },
                    },
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: "x",
                    },
                    zoom: {
                        mode: "x",
                        wheel: {
                            enabled: true,
                        },
                    },
                },
            },
        },
    });
    
    singleton = myChart;
    return myChart;
};

const calcExpenses = (expenses = [], initAmount = 0, initDate = new Date()) => {
    let tempAmount = initAmount;
    const data = [];
    const recurringExpenses = expenses.filter((expense) => expense.isRecurring);
    const monthsCountSinceInitDate = Math.floor(
        (new Date().getTime() - initDate.getTime()) / ONE_MONTH_MS
    );
    for (const expense of recurringExpenses) {
        for (let i = 0; i < monthsCountSinceInitDate; i++) {
            tempAmount = expense.isIncome
                ? tempAmount + expense.amount
                : tempAmount - expense.amount;
            data.push({
                x: expense.timestamp,
                y: tempAmount,
                date: expense.timestamp + i * ONE_MONTH_MS,
                id: `${expense.id}${i}`,
                name: expense.name,
                amount: expense.amount,
                isIncome: expense.isIncome,
                categoryId: expense.categoryId,
                balance: tempAmount,
            })
        }
    }
    console.log({ data: data.length });
    
    for (let i = 0; i < expenses.length; i++) {
        const expense = expenses[i];
        
        if (expense.timestamp < initDate.getTime()) {
            continue;
        }
        
        tempAmount = expense.isIncome
            ? tempAmount + expense.amount
            : tempAmount - expense.amount;
        
        const x = expense.timestamp;
        const y = tempAmount;
        const date = expense.timestamp;
        
        data.push({
            x,
            y,
            date,
            id: expense.id,
            name: expense.name,
            amount: expense.amount,
            isIncome: expense.isIncome,
            categoryId: expense.categoryId,
            balance: tempAmount,
        });
    }
    
    console.log({ data: data.length });
    return data;
};

const calcProjection = (projectionData, lookAhead = 3, initBalance) => {
    // this calculates the projection of what if you keep pattern of current month
    let data = [];
    const thisMonthAndYearExpenses = projectionData.filter((data) => {
        const date = new Date(data.date);
        const currentDate = new Date().getTime() - ONE_MONTH_MS * 0; // TODO: dynamic and through UI
        return (
            date.getMonth() === new Date(currentDate).getMonth() &&
            date.getFullYear() === new Date(currentDate).getFullYear()
        );
    });
    const lookaheadArray = new Array(lookAhead)
        .fill(null)
        .map((_, index) => {
            return thisMonthAndYearExpenses.map((expense) => {
                const date = new Date(expense.date);
                const newDate = new Date(date.getTime() + ONE_MONTH_MS * (1 + index)); // TODO: dynamic and through UI
                
                return {
                    ...expense,
                    date: newDate,
                };
            });
        })
        .flat();
    
    if (lookaheadArray.length === 0) return data;
    
    // let date = new Date(lookaheadArray[0].date);
    let tempAmount = initBalance;
    
    for (const expense of lookaheadArray) {
        const { amount, isIncome, categoryId, date } = expense;
        
        // Bi-monthly categories: 36,
        if (
            [36, 33, 34].includes(categoryId) &&
            new Date(date).getMonth() % 2 === 0
        ) {
            // the category is bi-monthly and the month is even
            console.log("bi-monthly", expense.name, expense.amount);
            continue;
        }
        
        tempAmount = isIncome ? tempAmount + amount : tempAmount - amount;
        data.push({
            y: tempAmount,
            x: date.getTime(),
            date: date,
            amount,
        });
        
        // date = new Date(date.getTime() + ONE_DAY_MS);
    }
    
    return data;
};

const calcBudget = (budget, initAmount = 0, lookAhead = 3) => {
    let data = [];
    let tempAmount = initAmount;
    let date = new Date("11.01.2022");
    const budgetEntries = Object.entries(budget["11.2022"] || {});
    const lookaheadBudgetEntries = new Array(lookAhead)
        .fill(null)
        .map(() => {
            return [...budgetEntries];
        })
        .flat();
    for (const [categoryId, amount] of lookaheadBudgetEntries) {
        tempAmount = IncomeIds.includes(String(categoryId))
            ? tempAmount + amount
            : tempAmount - amount;
        
        const category = Categories.filter((category) => {
            const subcategory = category.subCategories.filter((sub) => {
                return String(sub.id) === String(categoryId);
            })[0];
            return subcategory;
        })[0];
        
        const name = category && category?.name;
        
        data.push({
            name,
            amount: amount,
            date,
            y: tempAmount,
            x: date.getTime(),
        });
        
        date = new Date(date.getTime() + ONE_DAY_MS);
    }
    
    return data;
};


// TODO: support date for this, so it will be your grounding point
// ...Or go back until the opening of the bank account
// -1282.03 // From around 16/09/2022
const FortuneTeller = ({
    initialAmount = 0,
    lookaheadInMonths = 3,
    startDate = new Date(new Date().getTime() - ONE_MONTH_MS * 10),
}) => {
    const canvasRef = useRef(null);
    const [selectedExpenseId, setSelectedExpenseId] = useState(null);
    const [isTransactionsPopoverOpen, setIsTransactionsPopoverOpen] = useState(false);
    const [isTransactionsPopoverFullView, setIsTransactionsPopoverFullView] = useState(false);
    const { expensesArray: expenses } = useContext(ExpensesContext);
    const { budget } = useContext(BudgetContext);
    const expensesData = useMemo(
        () =>
            calcExpenses(
                orderBy(expenses, ["timestamp"], ["asc"]),
                initialAmount,
                startDate
            ),
        [expenses, initialAmount]
    );
    
    const budgetData = useMemo(() => {
        return calcBudget(budget, initialAmount, lookaheadInMonths);
    }, [budget]);
    
    // const projectionData = useMemo(() => {
    // 	return calcProjection(expensesData, initialAmount, lookaheadInMonths);
    // }, [expensesData]);
    
    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        
        const projectionData = calcProjection(
            expensesData,
            4,
            expensesData[expensesData.length - 1]?.balance
        );
        const data = expensesData.filter((expense) => {
            if (expense.isRecurring) {
                console.log({ expense });
                return true;
            }
            return expense.date >= startDate.getTime();
        });
        
        chart = createNewChart({
            startDate,
            data,
            budget: budgetData,
            projectionData,
        });
        
        return () => {
            chart && chart.destroy();
            singleton = null;
        };
    }, [
        canvasRef,
        expensesData,
        budgetData,
        // startDate,
        initialAmount,
        lookaheadInMonths,
    ]);
    
    return (
        <div className="h-screen">
            <button
                onClick={() => setIsTransactionsPopoverOpen(!isTransactionsPopoverOpen)}
                className="text-3xl border border-black rounded fixed right-10 bottom-10">
                {isTransactionsPopoverOpen ? '➖' : '➕'}
            </button>
            <button
                onClick={() => setIsTransactionsPopoverFullView(!isTransactionsPopoverFullView)}
                className="text-3xl border border-black rounded fixed right-10 bottom-20">
                ↕️
            </button>
            {isTransactionsPopoverOpen &&
                <div
                    className={classNames("fixed bottom-10 right-20 z-10 w-fit resize-x shadow-xl rounded-2xl p-4 bg-white", {
                        "h-96": !isTransactionsPopoverFullView,
                        "h-5/6": isTransactionsPopoverFullView,
                    })}>
                    <div className="overflow-auto h-full">
                        <table cellPadding={10}>
                            <tbody>
                            {expensesData.map((expense, index) => {
                                return (
                                    <tr
                                        id={expense.id}
                                        key={expense.id}
                                        onClick={() => {
                                            setSelectedExpenseId(expense.id);
                                        }}
                                        className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                                        style={{
                                            color: expense.isIncome ? "olive" : "tomato",
                                            backgroundColor:
                                                expense.id === selectedExpenseId ? "black" : "auto",
                                        }}
                                    >
                                        <td>{new Date(expense.date).toLocaleDateString("en-GB")}</td>
                                        <td>{expense.name}</td>
                                        <td>{expense.amount}</td>
                                        <td>{expense.balance.toFixed(2)}</td>
                                        <td
                                            style={{
                                                cursor: "pointer",
                                                opacity: expense.id === selectedExpenseId ? 1 : 0.5,
                                            }}
                                            onClick={() => {
                                                if (expense.id !== selectedExpenseId) {
                                                    return;
                                                }
                                                if (!window.confirm("Are you sure?")) {
                                                    return;
                                                }
                                                
                                                deleteExpense(expense.id);
                                            }}
                                        >
                                            ❌
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>}
            <div
                className="h-5/6 w-full"
                onClick={(event) => {
                    chart
                        .getElementsAtEventForMode(
                            event,
                            "nearest",
                            { intersect: true },
                            true
                        )
                        .forEach((element) => {
                            console.log(element.index, expensesData[element.index]);
                            setSelectedExpenseId(expensesData[element.index].id);
                            // scroll to the expense
                            document
                                .getElementById(expensesData[element.index].id)
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
