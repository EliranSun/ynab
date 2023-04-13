import { noop } from "lodash";
import { useContext } from "react";
import { ExpensesContext } from "../../../context";

const SelectTransactionSubcategory = ({
    transaction,
    categoryId,
    onSelect = noop,
    categories = [],
    isListView = false,
}) => {
    const { changeExpenseCategory } = useContext(ExpensesContext);

    if (isListView) {
        return (
            <select
                value={categoryId}
                onChange={(e) => {
                    changeExpenseCategory(transaction.id, e.target.value);
                    onSelect(e.target.value);
                }}
            >
                {categories.map((category) => (
                    <>
                        <option value={category.id}>======{category.name}======</option>
                        {category?.subCategories?.map((subcategory) => (
                            <option value={subcategory.id}>
                                {subcategory.icon} {subcategory.name}
                            </option>
                        ))}
                    </>
                ))}
            </select>
        );
    }

    return (
        <div className="subcategory-select">
            {categories.map((option) => {
                return (
                    <div key={option.id} className="subcategory-select-group p-4">
                        <div>
                            <b>{option.name}</b>
                        </div>
                        <div className="flex flex-wrap">
                            {option.subCategories.map((sub) => {
                                return (
                                    <div
                                        key={sub.id}
                                        style={
                                            String(categoryId) === String(sub.id)
                                                ? { backgroundColor: "tomato" }
                                                : {}
                                        }
                                        onClick={() => {
                                            changeExpenseCategory(transaction.id, sub.id);
                                            onSelect();
                                        }}
                                        className="p-4 border border-red-300 w-28 h-28 shrink-0"
                                    >
                                        <span>{sub.icon}</span>
                                        <span>{sub.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SelectTransactionSubcategory;
