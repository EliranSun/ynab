import { useRef, useEffect, useMemo, useContext } from "react";
import { Chart, registerables } from "chart.js";
import { ExpensesContext } from "../../context";

const IncomeIds = [81, 82];
let singleton = null;
const createNewChart = ({ labels = [], expenseData = {}, incomeData = {} }) => {
  if (
    labels.length === 0 ||
    (Object.keys(expenseData).length === 0 &&
      Object.keys(incomeData).length === 0)
  ) {
    return;
  }

  if (singleton) {
    console.info("returning singleton", singleton);
    return singleton;
  }

  Chart.register(...registerables);

  const ctx = document.getElementById("myChart").getContext("2d");
  let myChart = new Chart(ctx, {
    type: "line",
    height: "100",
    data: {
      labels,
      datasets: [
        {
          label: "Income + Expenses",
          data: expenseData,
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
          data: incomeData,
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
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  singleton = myChart;
  return myChart;
};

const FutureInsight = ({ budget = {} }) => {
  const canvasRef = useRef(null);
  const { monthlyExpenses } = useContext(ExpensesContext);
  const labels = useMemo(() => Object.keys(monthlyExpenses), [monthlyExpenses]);
  const expensesData = useMemo(() => {
    return Object.values(monthlyExpenses)
      .filter((item) => !IncomeIds.includes(Number(item.categoryId)))
      .map((monthlyExpense) => {
        return monthlyExpense.reduce((acc, expense) => {
          if (IncomeIds.includes(Number(expense.categoryId))) return acc;
          return acc + Number(expense.amount);
        }, 0);
      });
  }, [monthlyExpenses]);
  const incomeData = useMemo(() => {
    return Object.values(monthlyExpenses).map((monthlyExpense) => {
      return monthlyExpense.reduce((acc, expense) => {
        if (!IncomeIds.includes(Number(expense.categoryId))) return acc;
        return acc + Number(expense.amount);
      }, 0);
    });
  }, [monthlyExpenses]);

  console.info("monthlyExpenses", {
    monthlyExpenses,
    labels,
    expensesData,
    incomeData,
  });

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const chart = createNewChart({ expensesData, incomeData, labels });

    return () => {
      chart.destroy();
      singleton = null;
    };
  }, [canvasRef, incomeData, expensesData, labels]);

  return (
    <div>
      <canvas id="myChart" ref={canvasRef} width="400" height="400"></canvas>
    </div>
  );
};

export default FutureInsight;
