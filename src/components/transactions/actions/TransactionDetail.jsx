import React, { useMemo } from "react";
import { extractTransfers } from "../../../api/transaction/transactions.js";
import { TransfersDetail } from "./transfers/TransfersDetail.jsx";

export function TransactionDetail(props) {
  const { transaction, contextAccountId } = props;
  const transfers = useMemo(() => extractTransfers(transaction), [transaction]);
  return contextAccountId ? (
    <pre>
      <TransfersDetail transfers={transfers[contextAccountId]} />
    </pre>
  ) : (
    <pre>{JSON.stringify(transfers, null, 2)}</pre>
  );
}
