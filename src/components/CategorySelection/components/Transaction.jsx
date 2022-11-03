import { useState } from "react";
import { noop } from "lodash";
import TransactionName from "./TransactionName";
import TransactionAmount from "./TransactionAmount";
import TransactionDate from "./TransactionDate";
import TransactionChildrenView from "./TransactionChildrenView";
import SelectTransactionSubcategory from "./SelectTransactionSubcategory";
import { Categories } from "../../../constants";

const Transaction = ({ transaction, onSelect = noop, isListView = false }) => {
	const {
		id,
		name,
		amount,
		timestamp,
		transactionsCount,
		transactions,
		categoryId,
	} = transaction;

	const [aggregatedDetailsVisibleId, setAggregatedDetailsId] = useState(false);
	const isDetailedView = aggregatedDetailsVisibleId === id;

	if (isListView) {
		return (
			<tr key={id}>
				<td
					onClick={() => {
						if (transaction.transactions?.length < 2) {
							return;
						}

						if (isDetailedView) {
							setAggregatedDetailsId(null);
							return;
						}

						setAggregatedDetailsId(id);
					}}
				>
					<TransactionName
						name={name}
						icon={transaction.icon}
						count={transactionsCount}
					/>{" "}
					{transactions?.length > 1 && `(${transactions.length})`}
					<TransactionChildrenView
						transaction={transaction}
						isOpen={isDetailedView}
					/>
				</td>
				<td>
					<TransactionAmount amount={amount} />
				</td>
				<td>
					<TransactionDate timestamp={timestamp} />
				</td>
				<td>
					<SelectTransactionSubcategory
						isListView={isListView}
						onSelect={onSelect}
						categoryId={categoryId}
						transaction={transaction}
						categories={Categories}
					/>
				</td>
				<td>
					<textarea placeholder="Notes" />
				</td>
			</tr>
		);
	}
	return (
		<>
			<tr key={id}>
				<td
					width={100}
					onClick={() => {
						if (transaction.transactions?.length < 2) {
							return;
						}

						if (isDetailedView) {
							setAggregatedDetailsId(null);
							return;
						}

						setAggregatedDetailsId(id);
					}}
				>
					<TransactionName
						name={name}
						icon={transaction.icon}
						count={transactionsCount}
					/>{" "}
					{transactions?.length > 1 && `(${transactions.length})`}
					<TransactionChildrenView
						transaction={transaction}
						isOpen={isDetailedView}
					/>
				</td>
				<td width={100}>
					<TransactionAmount amount={amount} />
				</td>
				<td width={100}>
					<TransactionDate timestamp={timestamp} />
				</td>
			</tr>
			<tr>
				<td>
					<SelectTransactionSubcategory
						isListView={isListView}
						onSelect={onSelect}
						categoryId={categoryId}
						transaction={transaction}
						categories={Categories}
					/>
				</td>
				<td>
					<textarea placeholder="Notes" />
				</td>
			</tr>
		</>
	);
};

export default Transaction;
