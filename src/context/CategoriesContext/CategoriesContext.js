import { useState, createContext } from "react";

export const CategoriesContext = createContext({
	categories: [],
	setCategories: () => {},
	items: [],
	setItems: () => {},
});

let lastItems = {};
try {
	lastItems = JSON.parse(localStorage.getItem("lastPaste"));
} catch (error) {
	console.warn(error);
}

export const CategoriesContextProvider = ({ children }) => {
	const [items, setItems] = useState(lastItems || {});
	const [categories, setCategories] = useState([
		{
			id: 1,
			name: "Eating",
			subCategories: [
				{
					id: 11,
					name: "Wolt/Cibus",
				},
				{
					id: 12,
					name: "Groceries",
				},
				{
					id: 13,
					name: "Restaurants/Cafes",
				},
				{
					id: 14,
					name: "Bars/Pubs",
				},
			],
		},
		{
			id: 2,
			name: "Trasnportation",
			subCategories: [
				{
					id: 21,
					name: "Lime/Bird",
				},
				{
					id: 22,
					name: "Bus/Train/Other",
				},
				{
					id: 23,
					name: "KIA",
				},
			],
		},
		{
			id: 3,
			name: "Household",
			subCategories: [
				{
					id: 31,
					name: "Rent",
				},
				{
					id: 32,
					name: "Va'ad",
				},
				{
					id: 33,
					name: "Electricity",
				},
				{
					id: 34,
					name: "Water",
				},
				{
					id: 36,
					name: "Arnona",
				},
				{
					id: 37,
					name: "Ella",
				},
				{
					id: 38,
					name: "Boni",
				},
			],
		},
		{
			id: 4,
			name: "Self Care",
			subCategories: [
				{
					id: 41,
					name: "Therapist",
				},
				{
					id: 42,
					name: "Gordon",
				},
				{
					id: 43,
					name: "Haircut",
				},
				{
					id: 44,
					name: "Space",
				},
				{
					id: 45,
					name: "Games",
				},
				{
					id: 46,
					name: "Other",
				},
				{
					id: 47,
					name: "Clothes",
				},
			],
		},
		{
			id: 5,
			name: "Going Out/Gifts",
			subCategories: [
				{
					id: 51,
					name: "Friends",
				},
				{
					id: 52,
					name: "Family",
				},
				{
					id: 53,
					name: "Dates",
				},
				{
					id: 54,
					name: "Vacation",
				},
			],
		},
		{
			id: 6,
			name: "Services",
			subCategories: [
				{
					id: 61,
					name: "Internet",
				},
				{
					id: 62,
					name: "Netflix",
				},
				{
					id: 63,
					name: "Phone",
				},
				{
					id: 64,
					name: "Other",
				},
			],
		},

		{
			id: 7,
			name: "Taxes",
			subCategories: [
				{
					id: 71,
					name: "Health",
				},
				{
					id: 72,
					name: "Fees",
				},
			],
		},
	]);

	return (
		<CategoriesContext.Provider
			value={{ categories, setCategories, items, setItems }}
		>
			{children}
		</CategoriesContext.Provider>
	);
};
