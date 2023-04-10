import { useContext, useState, useMemo } from "react";
import { noop, orderBy } from "lodash";
import { useDebounce } from "react-use";
import { ExpensesContext } from "../../context";
import Expense from "./Expense";
import { DateChanger } from "../DateChanger";
import { isExpenseInMonth } from "../../utils";
import TopOneHundred from "./TopOneHundred";
import { useDate } from "../DateChanger/DateChanger";

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

const renderBetween = (expenses = [], min = 1000, max = 7500) => {
    let count = 0;
    const totalAmount = expenses
        .reduce((acc, curr) => {
            if (curr.amount < max && curr.amount >= min && !curr.isIncome) {
                count++;
                return acc + curr.amount;
            }
            return acc;
        }, 0)
        .toFixed(2);
    
    return (
        <>
            <span>{totalAmount} NIS </span>
            <span>({count} Items)</span>
            <div>TODO: a pie chart here</div>
        </>
    );
};

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
    const [isSearchingAll, setIsSearchingAll] = useState(false);
    const { isSameDate, currentTimestamp, toDate, formattedDate, NextButton, PreviousButton } = useDate();
    const thisMonthExpenses = useMemo(() => orderBy(
        expenses.filter(
            (expense) =>
                !expense.isIncome &&
                isExpenseInMonth(expense.timestamp, currentTimestamp)
        ),
        sort,
        "desc"
    ), [expenses, currentTimestamp, sort]);
    const filteredExpenses = useMemo(() => {
        if (searchValue === "") {
            return isSearchingAll ? [] : thisMonthExpenses;
        }
        
        return (isSearchingAll ? expenses : thisMonthExpenses).filter((expense) => {
            return expense.name
                .toLowerCase()
                .includes(searchValue.toLowerCase());
        });
    }, [searchValue, thisMonthExpenses, isSearchingAll]);
    
    return (
        <div>
            <h1 className="text-3xl my-4">Understand (Expense View)</h1>
            <div className="fixed top-10 right-20 bg-white shadow-xl">
                <PreviousButton/>
                <NextButton/>
            </div>
            <div className="p-4">
                <SearchInput
                    placeholder={
                        isSearchingAll
                            ? `Search through ${expenses.length} expenses`
                            : `Search through ${filteredExpenses.length} expenses in ${formattedDate}`
                    }
                    onChange={setSearchValue}
                />
                <span>
                    <input
                        type="checkbox"
                        id="searchAll"
                        className="mr-2"
                        onClick={() => setIsSearchingAll(!isSearchingAll)}
                    />
                    <label htmlFor="searchAll">Search all expenses?</label>
                </span>
                <div className="flex flex-col h-96 overflow-auto mt-4">
                    {filteredExpenses.map((expense) => (
                        <Expense
                            isListView
                            key={expense.id}
                            expense={expense}
                            onIsRecurringChange={setExpenseAsRecurring}
                            onIsIncomeChange={setExpenseAsIncome}
                            onCategoryClick={onCategoryClick}
                            onNoteChange={setExpenseNote}
                        />
                    ))}
                </div>
            </div>
            <h2 className="text-2xl my-4 bg-gray-200">Top Expenses in {formattedDate}</h2>
            <TopOneHundred
                expenses={expenses}
                isSameDate={isSameDate}
                toDate={toDate}
            />
            <h2 className="text-2xl my-4 bg-gray-200">Stats for {formattedDate}</h2>
            <h3 className="float top right">
                Subtotal:{" "}
                {Object.values(sum).reduce((acc, curr) => acc + curr, 0)}
            </h3>
            <h3>Sum of all expenses above 100: {renderBetween(thisMonthExpenses, 100, 100000)}</h3>
            <h3>Sum of all expenses 1,000-10,000: {renderBetween(thisMonthExpenses, 1000, 10000)}</h3>
            <h3>Sum of all expenses 100-1,000: {renderBetween(thisMonthExpenses, 100, 1000)}</h3>
            <h3>Sum of all expenses under 100: {renderBetween(thisMonthExpenses, 0, 100)}</h3>
        </div>
    );
};

export default ExpenseView;
