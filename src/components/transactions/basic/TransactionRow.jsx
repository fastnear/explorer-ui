import React from "react";
import { CryptoHash } from "../../common/CryptoHash.jsx";
import { AccountId } from "../../common/AccountId.jsx";

function txStatus(transaction) {
  let exectuionOutcome = transaction["execution_outcome"];
  const receipts = transaction["receipts"].reduce((acc, r) => {
    acc[r["receipt"]["receipt_id"]] = r;
    return acc;
  }, {});
  while (true) {
    const status = exectuionOutcome.outcome.status;
    if ("SuccessReceiptId" in status) {
      const receiptId = status["SuccessReceiptId"];
      exectuionOutcome = receipts[receiptId]["execution_outcome"];
    } else {
      return status;
    }
  }
}

export function TransactionRow(props) {
  const { transaction: transactionFull, contextAccountId } = props;
  console.log(transactionFull, contextAccountId);
  const transaction = transactionFull["transaction"];
  const status = txStatus(transactionFull);
  return (
    <tr>
      <td>{"SuccessValue" in status ? "SUCCESS" : "FAILURE"}</td>
      <td>
        <CryptoHash hash={transaction.hash} />
      </td>
      <td>{transaction.timestamp}</td>
      <td>
        <AccountId accountId={transaction["signer_id"]} />
      </td>
      <td>
        <AccountId accountId={transaction["receiver_id"]} />
      </td>
      <td>{transaction.amount}</td>
    </tr>
  );
}
