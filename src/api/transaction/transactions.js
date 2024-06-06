import { keysToCamel } from "../utils/utils.js";
import { fetchJson } from "../../utils/fetch-json.js";

const LogEventPrefix = "EVENT_JSON:";

function processExecutionOutcome(executionOutcome) {
  delete executionOutcome.proof;
  delete executionOutcome.outcome.metadata;
  // Parsing logs
  executionOutcome.outcome.logs = executionOutcome.outcome.logs.map((log) => {
    if (log.startsWith(LogEventPrefix)) {
      try {
        return JSON.parse(log.slice(LogEventPrefix.length));
      } catch (error) {}
    }
    return log;
  });

  return executionOutcome;
}

export function processTransaction(rawTransaction) {
  const { transaction, executionOutcome, receipts, dataReceipts } =
    keysToCamel(rawTransaction);
  receipts.forEach((r) => {
    processExecutionOutcome(r.executionOutcome);
  });
  transaction.receipts = Object.fromEntries(
    receipts.map(({ receipt, executionOutcome }) => [
      receipt.receiptId,
      Object.assign(receipt, { executionOutcome }),
    ]),
  );
  processExecutionOutcome(executionOutcome);
  transaction.executionOutcome = executionOutcome;
  transaction.dataReceipts = Object.fromEntries(
    dataReceipts.map((r) => [r.receipt.Data.dataId, r]),
  );
  transaction.realSignerId =
    transaction.actions[0]?.Delegate?.delegateAction.senderId ||
    transaction.signerId;
  return transaction;
}

export function transactionStatus(transaction) {
  let executionOutcome = transaction.executionOutcome;
  while (true) {
    const status = executionOutcome.outcome.status;
    if ("SuccessReceiptId" in status) {
      const receiptId = status["SuccessReceiptId"];
      executionOutcome = transaction.receipts[receiptId].executionOutcome;
    } else {
      return status;
    }
  }
}

export const fetchTransactions = async (txHashes) =>
  fetchJson({
    method: "POST",
    url: "https://explorer.main.fastnear.com/v0/transactions",
    body: { tx_hashes: txHashes },
  });
