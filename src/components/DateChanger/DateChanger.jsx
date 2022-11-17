import { useState, useMemo } from "react";

const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30;
const now = new Date();

const isSameDate = (date1, date2) => {
	return (
		date1.getMonth() === date2.getMonth() &&
		date1.getFullYear() === date2.getFullYear()
	);
};

const DateChanger = ({ children }) => {
	const [currentTimestamp, setCurrentTimestamp] = useState(now.getTime());
	const isSame = useMemo(
		() => isSameDate(new Date(currentTimestamp), new Date(now)),
		[currentTimestamp]
	);

	return (
		<div>
			<button
				onClick={() => setCurrentTimestamp(currentTimestamp - ONE_MONTH_MS)}
			>
				Previous month
			</button>
			<button
				disabled={isSame}
				onClick={() => setCurrentTimestamp(currentTimestamp + ONE_MONTH_MS)}
			>
				Next month
			</button>
			{children({
				currentTimestamp,
				previousMonthString: new Date(
					currentTimestamp - ONE_MONTH_MS
				).toLocaleString("en-GB", {
					month: "long",
				}),
				isPreviousMonth: (timestamp) => {
					return isSameDate(
						new Date(timestamp),
						new Date(currentTimestamp - ONE_MONTH_MS)
					);
				},
				isSameDate: (timestamp) =>
					isSameDate(new Date(currentTimestamp), new Date(timestamp)),
			})}
		</div>
	);
};

export default DateChanger;
