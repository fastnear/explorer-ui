import React, { useMemo } from "react";
import { CryptoHash } from "../../common/CryptoHash.jsx";
import { AccountId } from "../../common/AccountId.jsx";
import { Link } from "react-router-dom";
import { transactionStatus } from "../../../api/transaction/transactions.js";
import { TransactionDetail } from "../actions/TransactionDetail.jsx";

export function TransactionRow(props) {
  const { transaction, contextAccountId } = props;
  const status = useMemo(() => transactionStatus(transaction), [transaction]);
  return (
    <tr>
      <td>{"SuccessValue" in status ? "OK" : "F"}</td>
      <td>
        <Link to={`/tx/${transaction.hash}`}>
          <CryptoHash hash={transaction.hash} />
        </Link>
      </td>
      <td>
        <TransactionDetail
          transaction={transaction}
          contextAccountId={contextAccountId}
        />
      </td>
      <td>
        {transaction.signerId !== transaction.realSignerId ? "[D] " : ""}
        <Link to={`/account/${transaction.realSignerId}`}>
          <AccountId accountId={transaction.realSignerId} />
        </Link>
      </td>
      <td>
        <Link to={`/account/${transaction.receiverId}`}>
          <AccountId accountId={transaction.receiverId} />
        </Link>
      </td>
      <td>
        <Link to={`/block/${transaction.executionOutcome.blockHash}`}>
          <CryptoHash hash={transaction.executionOutcome.blockHash} />
        </Link>
      </td>
    </tr>
  );
}
