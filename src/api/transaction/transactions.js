import { isObject, isValidAccountId, keysToCamel } from "../utils/utils.js";
import { fetchJson } from "../../utils/fetch-json.js";
import { Buffer } from "buffer";
import Big from "big.js";

const LogEventPrefix = "EVENT_JSON:";
export const NativeTokenId = "near";
export const WrapNearTokenId = "wrap.near";

function processExecutionOutcome(executionOutcome) {
  delete executionOutcome.proof;
  delete executionOutcome.outcome.metadata;
  executionOutcome.success =
    "SuccessValue" in executionOutcome.outcome.status ||
    "SuccessReceiptId" in executionOutcome.outcome.status;
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

export const extractTransfers = (transaction) => {
  const transfers = {};
  const addOneTransfer = (accountId, tokenId, amount, negative) => {
    if (!isValidAccountId(accountId) || !isValidAccountId(tokenId)) {
      return;
    }
    try {
      amount = Big(amount);
      if (amount.eq(0)) {
        return;
      }
      if (negative) {
        amount = amount.mul(-1);
      }
      transfers[accountId] = transfers[accountId] || {};
      transfers[accountId][tokenId] = (
        transfers[accountId][tokenId] || Big(0)
      ).add(amount);
    } catch (error) {}
  };
  const addTransfer = (senderId, receiverId, tokenId, amount) => {
    if (!isValidAccountId(receiverId) || !isValidAccountId(senderId)) {
      return;
    }
    addOneTransfer(senderId, tokenId, amount, true);
    addOneTransfer(receiverId, tokenId, amount);
  };

  for (const receipt of Object.values(transaction.receipts)) {
    if (!receipt.executionOutcome.success) {
      continue;
    }
    for (const action of receipt.receipt.Action.actions) {
      if (!isObject(action)) {
        continue; // E.g. CreateAccount
      }
      if ("Transfer" in action) {
        addTransfer(
          receipt.predecessorId,
          receipt.receiverId,
          NativeTokenId,
          action.Transfer.deposit,
        );
      } else if ("FunctionCall" in action) {
        addTransfer(
          receipt.predecessorId,
          receipt.receiverId,
          NativeTokenId,
          action.FunctionCall.deposit,
        );
        const methodName = action.FunctionCall.methodName;
        if (methodName === "ft_transfer" || methodName === "ft_transfer_call") {
          const args = parseArgs(action.FunctionCall.args);
          if (!args) {
            continue;
          }
          if ("amount" in args && "receiver_id" in args) {
            addTransfer(
              receipt.predecessorId,
              args["receiver_id"],
              receipt.receiverId,
              args["amount"],
            );
          }
        } else if (methodName === "ft_resolve_transfer") {
          const args = parseArgs(action.FunctionCall.args);
          if (!args || receipt.receipt.Action.inputDataIds.length !== 1) {
            continue;
          }
          const inputData =
            transaction.dataReceipts[receipt.receipt.Action.inputDataIds[0]]
              .receipt.Data.data;
          if (
            "sender_id" in args &&
            "amount" in args &&
            "receiver_id" in args
          ) {
            addTransfer(
              args["receiver_id"],
              args["sender_id"],
              receipt.receiverId,
              inputData === null ? args["amount"] : inputData,
            );
          }
        } else if (
          methodName === "near_deposit" &&
          receipt.receiverId === WrapNearTokenId
        ) {
          // TODO: Storage deposit (unclear
          addOneTransfer(
            receipt.predecessorId,
            receipt.receiverId,
            action.FunctionCall.deposit,
          );
        } else if (
          methodName === "near_withdraw" &&
          receipt.receiverId === WrapNearTokenId
        ) {
          const args = parseArgs(action.FunctionCall.args);
          if (!args) {
            continue;
          }
          if ("amount" in args) {
            addOneTransfer(
              receipt.predecessorId,
              receipt.receiverId,
              args["amount"],
              true,
            );
          }
        }
      }
    }
  }
  return transfers;
};

export function parseArgs(args) {
  try {
    const str = Buffer.from(args, "base64").toString("utf-8");
    return JSON.parse(str);
  } catch (error) {
    return undefined;
  }
}
