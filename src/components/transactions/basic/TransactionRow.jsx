import React from "react";
import { CryptoHash } from "../../common/CryptoHash.jsx";
import { AccountId } from "../../common/AccountId.jsx";
import { Link } from "react-router-dom";

function txStatus(transaction) {
  let executionOutcome = transaction["execution_outcome"];
  const receipts = transaction["receipts"].reduce((acc, r) => {
    acc[r["receipt"]["receipt_id"]] = r;
    return acc;
  }, {});
  while (true) {
    const status = executionOutcome.outcome.status;
    if ("SuccessReceiptId" in status) {
      const receiptId = status["SuccessReceiptId"];
      executionOutcome = receipts[receiptId]["execution_outcome"];
    } else {
      return status;
    }
  }
}

export function TransactionRow(props) {
  const { transaction: transactionFull, contextAccountId } = props;
  // console.log(transactionFull, contextAccountId);
  const transaction = transactionFull["transaction"];
  const status = txStatus(transactionFull);
  return (
    <tr>
      <td>
        <Link
          to={`/block/${transactionFull["execution_outcome"]["block_hash"]}`}
        >
          <CryptoHash
            hash={transactionFull["execution_outcome"]["block_hash"]}
          />
        </Link>
      </td>
      <td>{"SuccessValue" in status ? "SUCCESS" : "FAILURE"}</td>
      <td>
        <CryptoHash hash={transaction.hash} />
      </td>
      <td>
        <Link to={`/account/${transaction["signer_id"]}`}>
          <AccountId accountId={transaction["signer_id"]} />
        </Link>
      </td>
      <td>
        <Link to={`/account/${transaction["receiver_id"]}`}>
          <AccountId accountId={transaction["receiver_id"]} />
        </Link>
      </td>
    </tr>
  );
}
