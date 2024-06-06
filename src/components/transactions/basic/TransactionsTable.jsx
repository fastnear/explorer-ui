import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { TransactionRow } from "./TransactionRow.jsx";
import {
  fetchTransactions,
  processTransaction,
} from "../../../api/transaction/transactions.js";

// Takes a list of tx_hashes and a list of preloaded transactions.
export function TransactionsTable(props) {
  const { transactions: transactionsHint, txHashes, contextAccountId } = props;
  const [transactions, setTransactions] = useState(transactionsHint);
  const [pageData, setPageData] = useState({
    0: {
      transactions: transactionsHint,
      needValidation: true,
    },
  });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(!transactionsHint);

  const loadPage = useCallback(
    (page) => {
      console.log("Loading page", page);
      const nextTxHashes = txHashes.slice(
        page * pageSize,
        (page + 1) * pageSize,
      );
      setPageData((pageData) => ({
        ...pageData,
        [page]: {
          loading: true,
        },
      }));
      fetchTransactions(nextTxHashes)
        .then((nextTransactions) => {
          console.log("READY page", page);
          setPageData((pageData) => ({
            ...pageData,
            [page]: nextTransactions
              ? {
                  transactions:
                    nextTransactions.transactions.map(processTransaction),
                }
              : { transactions: [], error: true },
          }));
        })
        .catch(console.error);
    },
    [pageSize, txHashes],
  );

  const selectPage = (page) => {
    if (!pageData[page]) {
      loadPage(page);
      setLoading(true);
    } else if (pageData[page].transactions) {
      setTransactions(pageData[page].transactions);
    } else {
      setLoading(true);
    }
    setPage(page);
  };

  useEffect(() => {
    // Decide if you need to load more.
    const pages = Math.ceil(txHashes.length / pageSize);
    // Preload the next page.
    if (!loading && page < pages - 1 && !pageData[page + 1]) {
      loadPage(page + 1);
    }
    if (!loading && page > 0 && !pageData[page - 1]) {
      loadPage(page - 1);
    }
  }, [pageData, transactions, txHashes, page, pageSize]);

  useEffect(() => {
    if (loading) {
      if (pageData[page] && !pageData[page].loading) {
        console.log("Active page", page);
        setTransactions(pageData[page].transactions);
        setLoading(false);
      }
    }
  }, [loading, page, pageData]);

  return loading ? (
    "BEEP BOOP LOADING"
  ) : (
    <div>
      <table className="table table-sm table-striped">
        <thead>
          <tr>
            <th>Status</th>
            <th>TX Hash</th>
            <th>Actions</th>
            <th>Signer</th>
            <th>Receiver</th>
            <th>Block hash</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionRow
              contextAccountId={contextAccountId}
              transaction={transaction}
              key={transaction.hash}
            />
          ))}
        </tbody>
      </table>
      Page: {page + 1}
      <button
        className="btn btn-outline-secondary"
        onClick={() => selectPage(page - 1)}
        disabled={page <= 0}
      >
        Previous
      </button>
      <button
        className="btn btn-outline-secondary"
        onClick={() => selectPage(page + 1)}
        disabled={page >= Math.ceil(txHashes.length / pageSize) - 1}
      >
        Next
      </button>
      <button
        className="btn btn-outline-secondary"
        onClick={() => selectPage(9)}
        disabled={page >= Math.ceil(txHashes.length / pageSize) - 1}
      >
        Page 10
      </button>
    </div>
  );
}
