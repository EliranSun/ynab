import { v4 as uuidv4 } from "uuid";

class Expense {
  constructor({ name, amount, note, timestamp, categoryId }) {
    this.id = uuidv4();
    this.name = name;
    this.amount = amount;
    this.note = note;
    this.timestamp = timestamp;
    this.categoryId = categoryId;
  }

  setCategoryId(id) {
    this.categoryId = id;
  }
}

export default Expense;
