import { useMemo, useState } from "react";
import { getExpenseCategoryName, updateCategory } from "../../utils";
import { noop } from "lodash";
import { Categories } from "../../constants";
import classNames from "classnames";

const CategoriesDropdownMenu = ({ defaultValueId = null, onCategoryChange = noop }) => {
    return (
        <select onChange={event => {
            onCategoryChange(event.target.value);
        }}>
            {Categories.map((category) => (
                category.subCategories.map((subCategory) => {
                    return (
                        <option
                            key={subCategory.id}
                            selected={String(defaultValueId) === String(subCategory.id)}
                            value={subCategory.id}>
                            {category.name} > {subCategory.name}
                        </option>
                    );
                })
            ))}
        </select>
    );
};

const Expense = ({
    expense,
    onIsIncomeChange = noop,
    onIsRecurringChange = noop,
    onNoteChange = noop,
    onCategoryClick = noop,
    onAmountClick = noop,
    isListView = false,
}) => {
    const [note, setNote] = useState(expense.note);
    const category = useMemo(
        () => getExpenseCategoryName(expense.categoryId),
        [expense]
    );
    
    return (
        <div id={expense.id}
            // className={classNames("border border-black w-1/5", {
            //     "flex flex-row w-screen ": isListView,
            // })}
        >
            <h1>{expense.name}</h1>
            {/*onClick={() => onCategoryClick(category.id)}*/}
            <CategoriesDropdownMenu
                onCategoryChange={async (categoryId) => {
                    const results = await updateCategory(expense.id, categoryId)
                    console.log(results);
                }}
                defaultValueId={category.subcategoryId}/>
            {/*<div*/}
            {/*    onClick={() => onAmountClick(expense.id, expense.amount)}>*/}
            {/*    {expense.amount} NIS*/}
            {/*</div>*/}
            {/*<textarea*/}
            {/*    value={note}*/}
            {/*    onBlur={() => {*/}
            {/*        onNoteChange(expense.id, note);*/}
            {/*    }}*/}
            {/*    onInput={(event) => {*/}
            {/*        setNote(event.target.value);*/}
            {/*    }}*/}
            {/*/>*/}
            {/*<div>*/}
            {/*    <span>*/}
            {/*      {new Date(expense.timestamp).toLocaleString("default", {*/}
            {/*          month: "long",*/}
            {/*          year: "numeric",*/}
            {/*          day: "numeric",*/}
            {/*          weekday: "long",*/}
            {/*      })}*/}
            {/*    </span>*/}
            {/*</div>*/}
            <div>
                <label>Is recurring?</label>
                <input
                    checked={expense.isRecurring}
                    type="checkbox"
                    onChange={() => {
                        onIsRecurringChange(expense.id, !expense.isRecurring);
                    }}
                />
            </div>
            <div>
                <label>Is income?</label>
                <input
                    checked={expense.isIncome}
                    type="checkbox"
                    onChange={() => {
                        onIsIncomeChange(expense.id, !expense.isIncome);
                    }}
                />
            </div>
        </div>
    );
};

export default Expense;