export const setExpenses = (expenses) => {
	localStorage.setItem("expenses", JSON.stringify(expenses));
};

export const setCategories = (categories) => {
	localStorage.setItem("categories", JSON.stringify(categories));
};

export const getExpenses = () => {
	const lastParsedExpenses = localStorage.getItem("expenses");
	if (!lastParsedExpenses) {
		return [];
	}

	return JSON.parse(lastParsedExpenses);
};

export const getCategories = () => {
	const lastParsedCategories = localStorage.getItem("categories");
	if (!lastParsedCategories) {
		return [];
	}

	return JSON.parse(lastParsedCategories);
};
