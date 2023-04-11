import { useState, useContext, useMemo, useEffect } from "react";
import { ExpensesContext } from "../../context/";
import { Categories } from "../../constants";
import { DateChanger as DateController } from "../DateChanger";
import { Button, Title } from "../atoms";
import orderBy from "lodash/orderBy";
import {
    subMonths,
    getYear,
    startOfMonth,
    eachMonthOfInterval,
    differenceInMonths,
    format,
    isSameMonth
} from 'date-fns';
import classNames from "classnames";
import { isUndefined } from "lodash";
import { ErrorBoundary } from "../ErrorBoundary";

const compareAmounts = (amountA, amountB) => {
    if (amountA > amountB) {
        return { isBigger: true, character: "📈" };
    }
    if (amountA < amountB) {
        return { isSmaller: true, character: "📉" };
    }
    return { isEqual: true, character: "🟰" };
};

const Checkbox = ({ value, label, onChange, isChecked }) => {
    return (
        <div className="flex gap-2 border border-black cursor-pointer" onClick={onChange}>
            <input
                type="checkbox"
                value={value}
                checked={isChecked}
            />
            <span>{label}</span>
        </div>
    );
};

const Amount = ({ amount, label, isPositive, isVisible = true, isCurrency = true }) => {
    if (!isVisible || !amount) {
        return null;
    }

    const value = isCurrency ? `${amount.toFixed(2)} NIS ` : `${amount} `;

    return (
        <ErrorBoundary fallback={<div>{amount}</div>}>
            <div className={classNames("", {
                "text-green-500": isUndefined(isPositive) ? false : isPositive,
                "text-red-500": isUndefined(isPositive) ? false : !isPositive,
            })}>
                <span className="font-bold">{value}</span>
                <span>{label}</span>
            </div>
        </ErrorBoundary>
    );
};

const Subcategory = ({ expenses = [], selectedMonths = [], subcategory, expensesInCategory }) => {
    const [isAggregated, setIsAggregated] = useState(false);

    const expensesThisSubcategory = useMemo(() => {
        const filtered = expensesInCategory.filter((expense) => {
            return expense.categoryId === subcategory.id;
        });

        if (isAggregated) {
            const aggregatedByName = filtered.reduce((acc, expense) => {
                const { name, amount } = expense;
                if (acc[name]) {
                    acc[name].amount += amount;
                    acc[name].count += 1;
                } else {
                    acc[name] = {
                        amount,
                        count: 1,
                    };
                }

                return acc;
            }, {});

            return Object.keys(aggregatedByName).map((name) => {
                return {
                    name,
                    amount: aggregatedByName[name].amount,
                    average: aggregatedByName[name].amount / aggregatedByName[name].count,
                    count: aggregatedByName[name].count,
                };
            });
        }

        return filtered;
    }, [expensesInCategory, isAggregated, subcategory.id]);

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
            {expensesThisSubcategory.length}
            <div className="flex">
                <div className="p-4 w-40">
                    <Amount
                        isPositive={comparison.isBigger}
                        amount={totalAmountInSubcategoryThisMonth}/>
                    <Amount
                        isVisible={selectedMonths.length === 1}
                        amount={totalInPreviousMonth}
                        label="last month"/>
                    <Checkbox
                        isChecked={isAggregated}
                        label="Aggregate?"
                        onChange={() => {
                            setIsAggregated(!isAggregated);
                        }}/>
                </div>
                <div className="overflow-x-auto w-full flex">
                    {expensesThisSubcategory.map((expense) => (
                        <div className="w-48 h-40 shrink-0 border border-black p-4">
                            <span className="font-bold">{expense.name}</span>
                            <Amount
                                label={expense.average ? "Total" : ""}
                                amount={expense.amount}/>
                            <Amount
                                amount={expense.average}
                                label="Average"/>
                            <Amount
                                isCurrency={false}
                                amount={expense.count}
                                label="time(s)"/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
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
                        <Checkbox
                            key={value}
                            label={label}
                            isChecked={selectedMonths.includes(value)}
                            onChange={() => {
                                if (selectedMonths.includes(value)) {
                                    setSelectedMonths(selectedMonths.filter((month) => month !== value));
                                } else {
                                    setSelectedMonths([...selectedMonths, value]);
                                }
                            }}/>
                    ))}
                </div>
                <Title type="h3">Total amount for {category.name} in {monthsCount} months</Title>
                <span>{totalAmountInCategory}</span>
                <Title type="h3">Total in each subcategory</Title>
                {category.subCategories.map((subcategory) => (
                    <Subcategory
                        key={subcategory.id}
                        subcategory={subcategory}
                        expenses={expensesInCategory}
                        selectedMonths={selectedMonths}
                        expensesInCategory={expensesInCategory}
                    />
                ))}
            </div>
        );
    }
;

export default CategoryView;
