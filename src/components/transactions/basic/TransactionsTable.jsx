import React from "react";
import { TransactionRow } from "./TransactionRow.jsx";

// Takes a list of tx_hashes and a list of preloaded transactions.
export function TransactionsTable(props) {
  const { transactions, txHashes, contextAccountId } = props;
  return (
    <table className="table table-sm table-striped">
      <thead>
        <tr>
          <th>Status</th>
          <th>Hash</th>
          <th>Timestamp</th>
          <th>Signer</th>
          <th>Receiver</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <TransactionRow
            contextAccountId={contextAccountId}
            transaction={transaction}
            key={transaction.transaction.hash}
          />
        ))}
      </tbody>
    </table>
  );
}
