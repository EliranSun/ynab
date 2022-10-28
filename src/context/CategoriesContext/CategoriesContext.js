import { useState, createContext } from "react";
import { Category } from "../../models";

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
// TBD
// const getCategories = () => {
//   try {
//     const categories = JSON.parse(localStorage.getItem("categories"));
//     return categories
//       ? categories.map((category) => {
//           return new Category(category);
//         })
//       : [];
//   } catch (error) {
//     const Wolt = new Category({ name: "Wolt/Cibus" });
//     const Groceries = new Category({ name: "Groceries" });
//     const Resturants = new Category({ name: "Resturants/Cafes" });
//     const Bars = new Category({ name: "Bars/Pubs" });

//     const Eating = new Category({
//       name: "Eating",
//       subcategoriesIds: [Wolt.id, Groceries.id, Resturants.id, Bars.id],
//     });

//     const Lime = new Category({ name: "Lime/Bird" });
//     const Bus = new Category({ name: "Bus/Train/Other" });
//     const Kia = new Category({ name: "KIA" });

//     const Trasnportation = new Category({
//       name: "Trasnportation",
//       subcategoriesIds: [Lime.id, Bus.id, Kia.id],
//     });

//     const Rent = new Category({ name: "Rent" });
//     const Internet = new Category({ name: "Internet" });
//     const Electricity = new Category({ name: "Electricity" });
//     const Water = new Category({ name: "Water" });
//     const Vaad = new Category({ name: "Va'ad" });
//     const Arnona = new Category({ name: "Arnona" });
//     const Ella = new Category({ name: "Ella" });
//     const Boni = new Category({ name: "Boni" });

//     const Household = new Category({
//       name: "Household",
//       subcategoriesIds: [
//         Rent.id,
//         Internet.id,
//         Electricity.id,
//         Water.id,
//         Vaad.id,
//         Arnona.id,
//         Ella.id,
//         Boni.id,
//       ],
//     });

//     const Therapist = new Category({ name: "Therapist" });
//     const Gordon = new Category({ name: "Gordon" });
//     const Barber = new Category({ name: "Barber" });
//     const Space = new Category({ name: "Space" });
//     const SelfCare = new Category({ name: "Self Care" });
//   }
// };

export const CategoriesContextProvider = ({ children }) => {
  const [items, setItems] = useState(lastItems || {});
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Eating",
      expensesIds: [],
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
      expensesIds: [],
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
      expensesIds: [],
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
      expensesIds: [],
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
      expensesIds: [],
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
      expensesIds: [],
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
    {
      id: 8,
      name: "Income",
      isIncome: true,
      expensesIds: [],
      subCategories: [
        {
          id: 81,
          name: "Salary",
        },
        {
          id: 82,
          name: "Other",
        },
      ],
    },
  ]);

  return (
    <CategoriesContext.Provider
      value={{ categories, setCategories, items, setItems }}>
      {children}
    </CategoriesContext.Provider>
  );
};
