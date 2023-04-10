import { useContext, useState, useMemo } from "react";
import { noop } from "lodash";
import { useDebounce } from "react-use";
import { ExpensesContext } from "../../context";
import Expense from "./Expense";

const SortBy = {
    DATE: "date",
    CATEGORY: "category",
    AMOUNT: "amount",
    NAME: "name",
};

const SearchInput = ({
    placeholder = "Search through expenses",
    onChange = noop
}) => {
    const [value, setValue] = useState("");
    useDebounce(
        () => {
            onChange(value);
        },
        500,
        [value]
    );
    return (
        <input
            className="w-2/5 text-xl border-b border-black"
            type="text"
            placeholder={placeholder}
            onChange={(event) => {
                setValue(event.target.value);
            }}
        />
    );
}


const ExpenseView = ({ onCategoryClick = noop }) => {
    const {
        expensesArray: expenses = [],
        setExpenseAsRecurring,
        setExpenseAsIncome,
        setExpenseNote,
    } = useContext(ExpensesContext);
    const [searchValue, setSearchValue] = useState("");
    const [sum, setSum] = useState(0);
    const [sort, setSort] = useState(SortBy.AMOUNT);
    const filteredExpenses = useMemo(() => {
        if (searchValue === "") {
            return [];
        }
        return expenses.filter((expense) => {
            return expense.name
                .toLowerCase()
                .includes(searchValue.toLowerCase());
        });
    }, [expenses, searchValue]);
    // const [filteredExpenses, setFilteredExpenses] = useState(expenses);
    console.log("expenses", filteredExpenses.length);
    
    return (
        <div>
            <h1 className="text-3xl my-4">Understand (Expense View)</h1>
            <SearchInput
                placeholder={`Search through ${expenses.length} expenses`}
                onChange={setSearchValue}
            />
            <div className="flex flex-wrap">
                {filteredExpenses.map((expense) => (
                    <Expense
                        key={expense.id}
                        expense={expense}
                        onIsRecurringChange={setExpenseAsRecurring}
                        onIsIncomeChange={setExpenseAsIncome}
                        onCategoryClick={onCategoryClick}
                        onNoteChange={setExpenseNote}
                    />
                ))}
            </div>
            {/*<DateChanger>*/}
            {/*    {({ isSameDate, currentTimestamp, toDate }) => {*/}
            {/*        // TODO: refactor!!*/}
            {/*        const orderedExpenses = orderBy(*/}
            {/*            expenses.filter(*/}
            {/*                (expense) =>*/}
            {/*                    !expense.isIncome &&*/}
            {/*                    isExpenseInMonth(expense.timestamp, currentTimestamp)*/}
            {/*            ),*/}
            {/*            sort,*/}
            {/*            "desc"*/}
            {/*        );*/}
            {/*        */}
            {/*        const renderUnder100Sum = () => {*/}
            {/*            let count = 0;*/}
            {/*            const totalAmount = orderedExpenses*/}
            {/*                .reduce((acc, curr) => {*/}
            {/*                    if (curr.amount < 100 && !curr.isIncome) {*/}
            {/*                        count++;*/}
            {/*                        return acc + curr.amount;*/}
            {/*                    }*/}
            {/*                    return acc;*/}
            {/*                }, 0)*/}
            {/*                .toFixed(2);*/}
            {/*            */}
            {/*            return (*/}
            {/*                <>*/}
            {/*                    <span>{totalAmount} NIS </span>*/}
            {/*                    <span>({count} Items)</span>*/}
            {/*                    <div>TODO: a pie chart here</div>*/}
            {/*                </>*/}
            {/*            );*/}
            {/*        };*/}
            {/*        */}
            {/*        const renderAbove100Sum = () => {*/}
            {/*            let count = 0;*/}
            {/*            const totalAmount = orderedExpenses*/}
            {/*                .reduce((acc, curr) => {*/}
            {/*                    if (curr.amount > 100 && !curr.isIncome) {*/}
            {/*                        count++;*/}
            {/*                        return acc + curr.amount;*/}
            {/*                    }*/}
            {/*                    return acc;*/}
            {/*                }, 0)*/}
            {/*                .toFixed(2);*/}
            {/*            */}
            {/*            return (*/}
            {/*                <>*/}
            {/*                    <span>{totalAmount} NIS </span>*/}
            {/*                    <span>({count} Items)</span>*/}
            {/*                    <div>TODO: a pie chart here</div>*/}
            {/*                </>*/}
            {/*            );*/}
            {/*        };*/}
            {/*        */}
            {/*        const renderBetween = (min = 1000, max = 7500) => {*/}
            {/*            let count = 0;*/}
            {/*            const totalAmount = orderedExpenses*/}
            {/*                .reduce((acc, curr) => {*/}
            {/*                    if (curr.amount < max && curr.amount >= min && !curr.isIncome) {*/}
            {/*                        count++;*/}
            {/*                        return acc + curr.amount;*/}
            {/*                    }*/}
            {/*                    return acc;*/}
            {/*                }, 0)*/}
            {/*                .toFixed(2);*/}
            {/*            */}
            {/*            return (*/}
            {/*                <>*/}
            {/*                    <span>{totalAmount} NIS </span>*/}
            {/*                    <span>({count} Items)</span>*/}
            {/*                    <div>TODO: a pie chart here</div>*/}
            {/*                </>*/}
            {/*            );*/}
            {/*        };*/}
            {/*        */}
            {/*        return (*/}
            {/*            <>*/}
            {/*                <TopOneHundred*/}
            {/*                    expenses={expenses}*/}
            {/*                    isSameDate={isSameDate}*/}
            {/*                    toDate={toDate}*/}
            {/*                />*/}
            {/*                <div>*/}
            {/*                    <h2>*/}
            {/*                        Expenses by {sort} for{" "}*/}
            {/*                        {new Date(currentTimestamp).toLocaleDateString("en-GB", {*/}
            {/*                            month: "long",*/}
            {/*                            year: "numeric",*/}
            {/*                        })}*/}
            {/*                    </h2>*/}
            {/*                    <h3 className="float top right">*/}
            {/*                        Subtotal:{" "}*/}
            {/*                        {Object.values(sum).reduce((acc, curr) => acc + curr, 0)}*/}
            {/*                    </h3>*/}
            {/*                    <h3>*/}
            {/*                        Sum of all expenses above 100: {renderBetween(100, 100000)}*/}
            {/*                    </h3>*/}
            {/*                    <h3>*/}
            {/*                        Sum of all expenses 1,000-10,000: {renderBetween(1000, 10000)}*/}
            {/*                    </h3>*/}
            {/*                    <h3>*/}
            {/*                        Sum of all expenses 100-1,000: {renderBetween(100, 1000)}*/}
            {/*                    </h3>*/}
            {/*                    <h3>Sum of all expenses under 100: {renderBetween(0, 100)}</h3>*/}
            {/*                    {orderedExpenses.map((expense) => (*/}
            {/*                        <Expense*/}
            {/*                            isListView*/}
            {/*                            expense={expense}*/}
            {/*                            onNoteChange={setExpenseNote}*/}
            {/*                            onIsRecurringChange={setExpenseAsRecurring}*/}
            {/*                            onIsIncomeChange={setExpenseAsIncome}*/}
            {/*                            onCategoryClick={onCategoryClick}*/}
            {/*                            onAmountClick={(id, amount) => {*/}
            {/*                                setSum({*/}
            {/*                                    ...sum,*/}
            {/*                                    [id]: sum[id] ? 0 : amount,*/}
            {/*                                });*/}
            {/*                            }}*/}
            {/*                        />*/}
            {/*                    ))}*/}
            {/*                </div>*/}
            {/*            </>*/}
            {/*        );*/}
            {/*    }}*/}
            {/*</DateChanger>*/}
        </div>
    );
};

export default ExpenseView;
