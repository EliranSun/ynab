import { useState, useContext, useMemo, useEffect } from "react";
import { ExpensesContext } from "../../context/";
import { Categories } from "../../constants";
import { DateChanger as DateController } from "../DateChanger";
import { Button, Title } from "../atoms";
import orderBy from "lodash/orderBy";
import { subMonths, getYear, startOfMonth, eachMonthOfInterval, differenceInMonths, format, isSameMonth } from 'date-fns';

const compareAmounts = (amountA, amountB) => {
    if (amountA > amountB) {
        return { isBigger: true, character: "📈" };
    }
    if (amountA < amountB) {
        return { isSmaller: true, character: "📉" };
    }
    return { isEqual: true, character: "🟰" };
};

const CategoryView = () => {
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [categoryId, setCategoryId] = useState(Categories[0].id);
    const { expensesArray: expenses = [] } = useContext(ExpensesContext);
    const category = useMemo(() => {
        return Categories.find((category) => {
            return String(category.id) === String(categoryId);
        });
    }, [categoryId]);
    const subcategoriesIds = useMemo(() => {
        return category?.subCategories?.map((subcategory) => subcategory.id);
    }, [category]);
    const expensesInCategory = useMemo(() => {
        return expenses.filter((expense) => {
            if (selectedMonths.length > 0) {
                const expenseDate = new Date(expense.timestamp);
                const inMonths = selectedMonths.some((month) => {
                    const monthDate = new Date(month);
                    return isSameMonth(monthDate, expenseDate);
                });
                
                if (!inMonths) {
                    return false;
                }
            }
            
            return subcategoriesIds.includes(expense.categoryId);
        });
    }, [expenses, selectedMonths, subcategoriesIds]);
    const totalAmountInCategory = useMemo(
        () => {
            const amount = expensesInCategory.reduce((total, expense) => {
                return total + expense.amount;
            }, 0);
            
            return Intl.NumberFormat("he-IL", {
                style: "currency",
                currency: "ILS",
                currencyDisplay: "code",
            }).format(amount);
        },
        [expensesInCategory]
    );
    const monthsCount = useMemo(() => {
        if (selectedMonths.length > 0) {
            return selectedMonths.length;
        }
        
        const expensesByDate = orderBy(expensesInCategory, ["timestamp"], ["asc"]);
        
        if (expensesByDate.length === 0) {
            return 0;
        }
        
        const firstExpense = expensesByDate[0].timestamp;
        const lastExpense = expensesByDate[expensesInCategory.length - 1].timestamp;
        
        return Math.abs(differenceInMonths(new Date(firstExpense), new Date(lastExpense)));
    }, [expensesInCategory, selectedMonths]);
    
    const monthsAndYearsOptions = useMemo(() => {
        const monthsAndYears = [];
        const expensesByDate = orderBy(expensesInCategory, ['timestamp'], ['asc']);
        
        if (expensesByDate.length === 0) {
            return [];
        }
        
        const firstExpense = expensesByDate[0].timestamp;
        const lastExpense = expensesByDate[expensesInCategory.length - 1].timestamp;
        const firstMonthDate = startOfMonth(new Date(firstExpense));
        const lastMonthDate = startOfMonth(new Date(lastExpense));
        
        const monthsInterval = eachMonthOfInterval({ start: firstMonthDate, end: lastMonthDate });
        
        monthsInterval.forEach((monthDate) => {
            const month = format(monthDate, 'MMMM');
            const year = getYear(monthDate);
            monthsAndYears.push({
                value: monthDate,
                label: `${month} ${year}`,
            });
        });
        
        setSelectedMonthIndex(monthsAndYears.length - 1);
        setSelectedMonths([monthsAndYears[monthsAndYears.length - 1].value]);
        return monthsAndYears;
    }, []);
    
    useEffect(() => {
        if (selectedMonthIndex !== null && monthsAndYearsOptions.length > 0) {
            setSelectedMonths([monthsAndYearsOptions[selectedMonthIndex].value]);
        }
    }, [monthsAndYearsOptions, selectedMonthIndex]);
    
    return (
        <div className="pb-96">
            <Title>Understand (Category View)</Title>
            <select onChange={event => {
                setCategoryId(Number(event.target.value));
            }} className="text-3xl mb-8">
                {Categories.map((category) => (
                    <option
                        key={category.id}
                        value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
            <div className="flex gap-4">
                <Button>PREVIOUS</Button>
                <Button onClick={() => {
                    if (selectedMonthIndex >= monthsAndYearsOptions.length - 1) {
                        setSelectedMonthIndex(0);
                        return;
                    }
                    
                    setSelectedMonthIndex(selectedMonthIndex + 1);
                }}>
                    NEXT</Button>
            </div>
            <div className="flex gap-4 flex-wrap w-1/2">
                {monthsAndYearsOptions.map(({ value, label }) => (
                    <div
                        key={value}
                        className="cursor-pointer"
                        onClick={() => {
                            if (selectedMonths.includes(value)) {
                                setSelectedMonths(selectedMonths.filter((month) => month !== value));
                            } else {
                                setSelectedMonths([...selectedMonths, value]);
                            }
                        }}>
                        <input
                            type="checkbox"
                            key={value}
                            value={value}
                            readOnly
                            checked={selectedMonths.includes(value)}
                        />
                        <span>{label}</span>
                    </div>
                ))}
            </div>
            <Title type="h3">Total amount for {category.name} in {monthsCount} months</Title>
            <span>{totalAmountInCategory}</span>
            <Title type="h3">Total in each subcategory</Title>
            {category.subCategories.map((subcategory) => {
                
                const totalAmountInSubcategoryThisMonth = expenses.reduce(
                    (total, expense) => {
                        if (subcategory.id === expense.categoryId) {
                            if (selectedMonths.length > 0) {
                                const expenseDate = new Date(expense.timestamp);
                                const inMonths = selectedMonths.some((month) => {
                                    const monthDate = new Date(month);
                                    return isSameMonth(monthDate, expenseDate);
                                });
                                
                                if (!inMonths) {
                                    return total;
                                }
                            }
                            
                            return total + expense.amount;
                        }
                        return total;
                    },
                    0
                );
                
                const totalInPreviousMonth = expenses.reduce((total, expense) => {
                    if (selectedMonths.length !== 1) {
                        return total;
                    }
                    const lastSelectedMonth = subMonths(new Date(selectedMonths[0]), 1);
                    const isInPreviousMonth = isSameMonth(lastSelectedMonth, new Date(expense.timestamp));
                    
                    if (
                        subcategory.id === expense.categoryId &&
                        isInPreviousMonth
                    ) {
                        return total + expense.amount;
                    }
                    return total;
                }, 0);
                
                const comparison = compareAmounts(
                    totalAmountInSubcategoryThisMonth,
                    totalInPreviousMonth
                );
                
                return (
                    <div>
                        <Title type="h4">{subcategory.name}</Title>
                        <div>
                            <b color={comparison.isBigger ? "tomato" : "green"}>
                                {totalAmountInSubcategoryThisMonth.toFixed(2)} NIS
                            </b>{" "}
                            {selectedMonths.length === 1 && <>
                                {comparison.character}
                                <div>
                                    {totalInPreviousMonth.toFixed(2)} last month
                                </div>
                            </>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CategoryView;
