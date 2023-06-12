import { useEffect, useState } from "react";
import { noop } from "lodash";
import TransactionName from "./TransactionName";
import TransactionAmount from "./TransactionAmount";
import TransactionDate from "./TransactionDate";
import TransactionChildrenView from "./TransactionChildrenView";
import SelectTransactionSubcategory from "./SelectTransactionSubcategory";
import { Categories } from "../../../constants";


const Transaction = ({
    transaction = {},
    onSelect = noop,
    isListView = false,
}) => {
    const {
        id,
        name,
        amount,
        timestamp,
        transactionsCount,
        transactions,
        categoryId,
    } = transaction;
    
    const [note, setNote] = useState("");
    const [aggregatedDetailsVisibleId, setAggregatedDetailsId] = useState(false);
    const isDetailedView = aggregatedDetailsVisibleId === id;
    
    useEffect(() => {
        setNote(transaction.note || '');
    }, [transaction]);
    
    // if (isListView) {
    //     return (
    //         <div key={id}>
    //             <div
    //                 onClick={() => {
    //                     if (transaction.transactions?.length < 2) {
    //                         return;
    //                     }
    //                    
    //                     if (isDetailedView) {
    //                         setAggregatedDetailsId(null);
    //                         return;
    //                     }
    //                    
    //                     setAggregatedDetailsId(id);
    //                 }}
    //             >
    //                 <TransactionName
    //                     name={name}
    //                     icon={transaction.icon}
    //                     count={transactionsCount}
    //                 />{" "}
    //                 {transactions?.length > 1 && `(${transactions.length})`}
    //                 <TransactionChildrenView
    //                     transaction={transaction}
    //                     isOpen={isDetailedView}
    //                 />
    //             </div>
    //             <TransactionAmount amount={amount}/>
    //             <TransactionDate timestamp={timestamp}/>
    //             <SelectTransactionSubcategory
    //                 isListView={isListView}
    //                 onSelect={onSelect}
    //                 categoryId={categoryId}
    //                 transaction={transaction}
    //                 categories={Categories}
    //             />
    //             <div>
    //                 <textarea placeholder="Notes"/>
    //             </div>
    //         </div>
    //     );
    // }
    return (
        <>
            <div key={id}>
                <div
                    className="flex justify-start gap-10 items-center"
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
                    />{' '}
                    {transactions?.length > 1 && `(${transactions.length})`}
                    <TransactionChildrenView
                        transaction={transaction}
                        isOpen={isDetailedView}
                    />
                    <TransactionAmount amount={amount}/>{' '}
                    <TransactionDate timestamp={timestamp}/>
                </div>
            </div>
            <div className="w-full">
                <textarea placeholder="Notes" onChange={event => {
                    setNote(event.target.value);
                }}/>
                <SelectTransactionSubcategory
                    note={note}
                    isListView={isListView}
                    onSelect={onSelect}
                    categoryId={categoryId}
                    transaction={transaction}
                    categories={Categories}
                />
            </div>
        </>
    );
};

export default Transaction;
