import { useContext, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { CategoriesContext } from "../../context";

const BIT = 'העברה ב BIT בנה"פ';
const BIT_INCOME = "bit העברת כסף";
const BANK = "העב' לאחר-נייד";
const PAYBOX = "PAYBOX";

const isThirdPartyTransaction = (name) => {
	return [BIT, BIT_INCOME, BANK, PAYBOX].includes(name);
};

const PasteList = () => {
	const textAreaRef = useRef(null);
	const { setItems } = useContext(CategoriesContext);

	return (
		<div className="copy-paste-list">
			<textarea ref={textAreaRef} />
			<button
				onClick={() => {
					if (!textAreaRef.current) return;

					const rows = textAreaRef.current.value.split("\n");
					const items = rows.map((row) => {
						const cells = row.split("\t");
						return {
							name: cells[0],
							date: cells[1],
							creditCardNumber: cells[2],
							amount: cells[4],
							note: cells[5],
						};
					});

					const newItems = items.map((item) => {
						let name = item.name;
						if (!name || !item.amount || !item.date) {
							return {};
						}

						const dateParts = item.date.split("/");
						const year = `20${dateParts[2]}`;
						const month = Number(dateParts[1]) - 1;
						const day = dateParts[0];
						const date = new Date(Date.UTC(year, month, day)).getTime();

						const parsedAmount = parseFloat(
							item.amount.replace(",", "").replace("₪", "").trim()
						);

						if (isThirdPartyTransaction(name)) {
							name = `${name} (${uuidv4()})`;
						}

						return {
							name,
							id: uuidv4(),
							timestamp: date,
							amount: parsedAmount,
						};
					});

					setItems(newItems);
					localStorage.setItem("lastPaste", JSON.stringify(newItems));
				}}
			>
				Parse
			</button>
		</div>
	);
};

export default PasteList;
