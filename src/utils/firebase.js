import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
	getFirestore,
	doc,
	updateDoc,
	getDocs,
	collection,
	writeBatch,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAB39A1eVvhFbTIqol1yB8sIrbv9Allqpg",
	authDomain: "ynab-47641.firebaseapp.com",
	projectId: "ynab-47641",
	storageBucket: "ynab-47641.appspot.com",
	messagingSenderId: "166507618318",
	appId: "1:166507618318:web:2586479d23433cfc855c5f",
	measurementId: "G-WL97FFD4EH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore();

const EXPENSES_COLLECTION = "expenses";
const BUDGET_COLLECTION = "budget";

export const getExpenses = async () => {
	try {
		const expenses = {};
		const querySnapshot = await getDocs(collection(db, EXPENSES_COLLECTION));
		querySnapshot.forEach((doc) => {
			const expense = doc.data();
			expenses[expense.id] = expense;
		});

		return expenses;
	} catch (error) {
		console.error("Error getting document:", error);
		return [];
	}
};

export const getBudget = async () => {
	try {
		const budget = [];
		const querySnapshot = await getDocs(collection(db, BUDGET_COLLECTION));
		querySnapshot.forEach((doc) => {
			budget.push(doc.data());
		});

		return budget;
	} catch (error) {
		console.error("Error getting document:", error);
		return [];
	}
};

export const updateExpense = async (expenseId, props) => {
	const expensesRef = doc(db, EXPENSES_COLLECTION, expenseId);
	return await updateDoc(expensesRef, props);
};

export const addExpenses = async (expenses) => {
	const batch = writeBatch(db);
	console.info("Adding expenses to DB", expenses);
	expenses.forEach((expense) => {
		const expenseRef = doc(db, EXPENSES_COLLECTION, expense.id);
		batch.set(expenseRef, { ...expense }); // must be a plain object
	});

	await batch.commit();
};
