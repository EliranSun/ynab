import { v4 as uuidv4 } from "uuid";

class Expense {
	constructor({ amount, note, date, categoryId }) {
		this.id = uuidv4();
		this.amount = amount;
		this.note = note;
		this.date = date;
		this.categoryId = categoryId;
	}

	changeCategoryId(id) {
		this.categoryId = id;
	}
}

export default Expense;
