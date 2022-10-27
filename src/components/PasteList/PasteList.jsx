import { useContext, useRef } from "react";
import { CategoriesContext } from "../../context";

const BIT = 'העברה ב BIT בנה"פ';
const BANK = "העב' לאחר-נייד";
const PAYBOX = "PAYBOX";

const isThirdPartyTransaction = (name) => {
	return [BIT, BANK, PAYBOX].includes(name);
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

					const total = {};
					let thirdPartyTransactionCounter = 0;

					items.forEach((item) => {
						let name = item.name;
						if (!name || !item.amount || !item.date) {
							return;
						}

						const dateParts = item.date.split("/");
						const year = `20${dateParts[2]}`;
						const month = Number(dateParts[1]) - 1;
						const yearMonth = `${year}-${month}`;
						const day = dateParts[0];
						const date = new Date(Date.UTC(year, month, day)).getTime();
						const isNewExpense = !total[name];

						const parsedAmount = parseFloat(
							item.amount.replace(",", "").replace("₪", "").trim()
						);

						if (isThirdPartyTransaction(name)) {
							thirdPartyTransactionCounter++;
							name = `${name} (${thirdPartyTransactionCounter})`;
						}

						if (isNewExpense) {
							total[name] = {
								// expendedInDates: [yearMonth],
								totalAmounts: { [yearMonth]: parsedAmount || 0 },
								lastTransactionTimestamp: date,
							};
							return;
						}

						// if (total[name].expendedInDates?.includes(yearMonth)) {
						// }

						total[name] = {
							// expendedInDates: total[name].expendedInDates.includes(yearMonth)
							// 	? total[name].expendedInDates
							// 	: [...total[name].expendedInDates, yearMonth],
							totalAmounts: {
								...total[name].totalAmounts,
								[yearMonth]: total[name].totalAmounts[yearMonth] + parsedAmount,
							},
							lastTransactionTimestamp: Math.max(
								total[name].lastTransactionTimestamp,
								date
							),
						};
					});

					setItems(total);
					localStorage.setItem("lastPaste", JSON.stringify(total));
				}}
			>
				Parse
			</button>
		</div>
	);
};

export default PasteList;
