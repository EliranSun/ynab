import { useContext, useState, useMemo } from "react";
import { noop, orderBy } from "lodash";
import { useDebounce } from "react-use";
import { ExpensesContext } from "../../context";
import Expense from "./Expense";
import { isExpenseInMonth } from "../../utils";
import TopExpensesView from "./TopExpensesView";
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

const BoxAmount = ({ expenses = [], min = 1000, max = 7500 }) => {
    let count = 0;
    const totalAmount = useMemo(() => {
        return expenses
            .reduce((acc, curr) => {
                if (max === -1 && curr.amount >= min && !curr.isIncome) {
                    count++;
                    return acc + curr.amount;
                }
                
                if (min === -1 && curr.amount < max && !curr.isIncome) {
                    count++;
                    return acc + curr.amount;
                }
                
                if (curr.amount < max && curr.amount >= min && !curr.isIncome) {
                    count++;
                    return acc + curr.amount;
                }
                return acc;
            }, 0)
            .toFixed(2);
    }, [expenses, max, min, count]);
    
    // TODO: a pie chart here
    return (
        <div className="bg-gray-200 w-48 h-48 flex flex-col items-center justify-center">
            <span>
                {min === -1 ? "∞" : min} - {max === -1 ? "∞" : max}
            </span>
            <span>{totalAmount} NIS</span>
            <span>({count} Items)</span>
        </div>
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
        <div className="pb-96">
            <h1 className="text-3xl my-4">Track (Expense View)</h1>
            <div className="fixed bottom-10 right-20 bg-white shadow-xl p-2">
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
            <TopExpensesView
                date={formattedDate}
                expenses={expenses}
                isSameDate={isSameDate}
                toDate={toDate}
            />
            <div>
                <h2 className="text-2xl my-4 bg-gray-200">Stats for {formattedDate}</h2>
                <h3>Sums</h3>
                <div className="flex gap-4">
                    <BoxAmount expenses={thisMonthExpenses} min={-1} max={-1}/>
                    <BoxAmount expenses={thisMonthExpenses} min={-1} max={100}/>
                    <BoxAmount expenses={thisMonthExpenses} min={100} max={-1}/>
                    <BoxAmount expenses={thisMonthExpenses} min={100} max={1000}/>
                    <BoxAmount expenses={thisMonthExpenses} min={1000} max={10000}/>
                </div>
            </div>
        </div>
    );
};

export default ExpenseView;
