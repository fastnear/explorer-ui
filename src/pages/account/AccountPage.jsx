import React from "react";
import { useEffect, useState } from "react";
import "./AccountPage.scss";
import { useParams } from "react-router-dom";
import { TransactionsTable } from "../../components/transactions/basic/TransactionsTable.jsx";
import { AccountId } from "../../components/common/AccountId.jsx";
import { processTransaction } from "../../api/transaction/transactions.js";

async function fetchAccountTransactions(accountId) {
  try {
    const response = await fetch(
      "https://explorer.main.fastnear.com/v0/account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account_id: accountId }),
      },
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
}

function renderAccountTransactions(accountId, accountData) {
  console.log(accountData);
  return (
    <>
      <p>Total transactions: {accountData["txs_count"]}</p>
      <div>
        <TransactionsTable
          contextAccountId={accountId}
          transactions={accountData["transactions"].map(processTransaction)}
          txHashes={accountData["account_txs"].map(
            (r) => r["transaction_hash"],
          )}
        />
      </div>
    </>
  );
}

export default function AccountPage(props) {
  const { accountId } = useParams();
  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    setAccountData(null);
    if (accountId) {
      fetchAccountTransactions(accountId).then(setAccountData);
    } else {
      setAccountData(false);
    }
  }, [accountId]);

  return (
    <>
      <div className="mb-3">
        <h1>
          Account: <AccountId accountId={accountId} />
        </h1>
      </div>
      <div>
        {accountData ? (
          <div>{renderAccountTransactions(accountId, accountData)}</div>
        ) : accountData === null ? (
          <p>Loading...</p>
        ) : (
          <p>Error loading account data</p>
        )}
      </div>
    </>
  );
}
