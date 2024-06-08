import React from "react";
import { useEffect, useState } from "react";
import "./TransactionPage.scss";
import { useParams } from "react-router-dom";
import { TransactionsTable } from "../../components/transactions/basic/TransactionsTable.jsx";
import {
  extractTransfers,
  fetchTransactions,
  processTransaction,
} from "../../api/transaction/transactions.js";

function renderTransaction(transaction) {
  return (
    <>
      <div>
        <pre>{JSON.stringify(extractTransfers(transaction), null, 2)}</pre>
      </div>
      <div>
        <pre>{JSON.stringify(transaction, null, 2)}</pre>
      </div>
      <div>
        <TransactionsTable
          contextAccountId={null}
          transactions={[transaction]}
          txHashes={[transaction.hash]}
        />
      </div>
    </>
  );
}

export default function TransactionPage(props) {
  const { txHash } = useParams();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    if (txHash) {
      fetchTransactions([txHash]).then((response) => {
        if (response?.transactions?.length === 1) {
          setTransaction(processTransaction(response.transactions[0]));
        } else {
          setTransaction(false);
        }
      });
    } else {
      setTransaction(false);
    }
  }, [txHash]);

  return (
    <>
      <div className="mb-3">
        <h1>TX #{txHash}</h1>
      </div>
      <div>
        {transaction ? (
          <div>{renderTransaction(transaction)}</div>
        ) : transaction === null ? (
          <p>Loading...</p>
        ) : (
          <p>Error loading transaction</p>
        )}
      </div>
    </>
  );
}
