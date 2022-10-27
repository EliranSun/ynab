import { v4 as uuidv4 } from "uuid";

class Category {
	constructor({ name, subcategoriesIds = [], expensesInCategory = [] }) {
		this.id = uuidv4();
		this.name = name;
		this.subcategoriesIds = subcategoriesIds;
		this.expensesInCategory = expensesInCategory;
	}

	addExpenseId(id) {
		this.expensesInCategory.push(id);
	}

	addSubcategoryId(id) {
		this.subcategoriesIds.push(id);
	}

	removeExpenseId(id) {
		this.expensesInCategory = this.expensesInCategory.filter(
			(expenseId) => expenseId !== id
		);
	}

	removeSubcategoryId(id) {
		this.subcategoriesIds = this.subcategoriesIds.filter(
			(subcategoryId) => subcategoryId !== id
		);
	}
}

export default Category;
