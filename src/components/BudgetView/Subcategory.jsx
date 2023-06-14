import { Title } from "../atoms";
import { useContext, useMemo } from "react";
import { noop, orderBy } from "lodash";
import { ExpensesContext } from "../../context";
import { isSameMonth } from "date-fns";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("he-IL", {
        style: "currency",
        currency: "ILS",
        currencyDisplay: 'symbol',
        notation: 'compact',
        // notation: 'standard',
    }).format(amount);
};

const Subcategory = ({
    icon,
    name,
    id,
    onSubcategoryClick = noop,
    isSameDate = noop,
    isPreviousMonth = noop,
    isSelected = false,
    currentTimestamp
}) => {
    const { expensesArray: expenses, expensesPerMonthPerCategory } = useContext(ExpensesContext);
    
    const expensesInCategory = expenses.filter((expense) => {
        // TODO: same type instead of casting
        return (
            String(expense.categoryId) === String(id)
        );
    });
    const thisMonthExpenses = useMemo(() => expensesInCategory.filter(
        (expense) => {
            const date = new Date(currentTimestamp);
            const expenseDate = new Date(expense.timestamp);
            
            if (expense.isRecurring) {
                return (
                    expenseDate.getFullYear() === date.getFullYear()
                );
            }
            
            return isSameMonth(expenseDate, date);
        }
    ), [currentTimestamp, expensesInCategory]);
    
    const thisMonthAmount = useMemo(() => {
        const amount = thisMonthExpenses.reduce((acc, expense) => {
            return acc + expense.amount;
        }, 0);
        
        return formatCurrency(amount);
    }, [thisMonthExpenses]);
    
    const totalInPreviousMonth = useMemo(() => {
        const amount = expenses.reduce(
            (total, expense) => {
                if (id === expense.categoryId && isPreviousMonth(expense.timestamp)) {
                    return total + expense.amount;
                }
                return total;
            }, 0);
        
        return formatCurrency(amount);
    }, [expenses, id, thisMonthExpenses]);
    
    const getAverageAmount = (id) => {
        if (!expensesPerMonthPerCategory[id]) return 0;
        
        const total = Object.values(expensesPerMonthPerCategory[id]).reduce((acc, curr) => acc + curr, 0);
        const count = Object.values(expensesPerMonthPerCategory[id]).length;
        
        return formatCurrency(total / count);
    };
    
    const averageAmount = getAverageAmount(String(id));
    
    const expensesInCategoryThisDate = useMemo(() => {
        return orderBy(
            expensesInCategory
                .filter((expense) => isSameDate(expense.timestamp))
                .map((expense) => {
                    return (
                        <li>■ {expense.name.slice(0, 15)} {expense.amount}</li>
                    );
                }),
            "amount",
            "desc"
        );
    }, [expensesInCategory, currentTimestamp]);
    
    if (thisMonthAmount === formatCurrency(0)) {
        return null;
    }
    
    const test = thisMonthExpenses.find((expense) => expense.name === 'מפייבוקס שלי');
    if (test) {
        console.log(test);
    }
    
    return (
        <div className="relative">
            <div className="bg-gray-300 p-4" onClick={() => onSubcategoryClick(id)}>
                <Title type={Title.Types.H3}>
                    {icon} {thisMonthAmount}
                </Title>
                <div className="text-xs">
                    <div>Previous month: {totalInPreviousMonth}</div>
                    <div>Average: {averageAmount}</div>
                </div>
                {/*<div>Budget: 0</div>*/}
            </div>
            {isSelected && expensesInCategoryThisDate.length > 0 &&
                <ul
                    onClick={() => onSubcategoryClick(null)}
                    className="absolute z-10 top-0 left-full bg-white p-4 w-60 drop-shadow-2xl">
                    <button>✖️</button>
                    {expensesInCategoryThisDate}
                </ul>}
        </div>
    );
};

export default Subcategory;