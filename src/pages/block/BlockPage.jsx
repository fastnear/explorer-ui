import React from "react";
import { useEffect, useState } from "react";
import "./BlockPage.scss";
import { useParams } from "react-router-dom";
import { TransactionsTable } from "../../components/transactions/basic/TransactionsTable.jsx";
import { processTransaction } from "../../api/transaction/transactions.js";
import { fetchJson } from "../../utils/fetch-json.js";

// Returns number if the blockId is a valid block height, otherwise returns original string
function parseBlockId(blockId) {
  const parsed = parseInt(blockId, 10);
  if (
    !parsed ||
    isNaN(parsed) ||
    parsed < 0 ||
    parsed > 1e15 ||
    parsed.toString() !== blockId ||
    Math.trunc(parsed) !== parsed
  ) {
    return blockId;
  }
  return parsed;
}

const fetchBlockTransactions = (blockId) =>
  fetchJson({
    method: "POST",
    url: "https://explorer.main.fastnear.com/v0/block",
    body: { block_id: parseBlockId(blockId) },
  });

function renderBlockTransactions(blockData) {
  return (
    <>
      <p>Total transactions: {blockData["block_txs"].length}</p>
      <div>
        <TransactionsTable
          contextAccountId={null}
          transactions={blockData["transactions"].map(processTransaction)}
          txHashes={blockData["block_txs"].map((r) => r["transaction_hash"])}
        />
      </div>
    </>
  );
}

export default function BlockPage(props) {
  const { blockId } = useParams();
  const [blockData, setBlockData] = useState(null);

  useEffect(() => {
    if (blockId) {
      fetchBlockTransactions(blockId).then(setBlockData).catch(console.error);
    } else {
      setBlockData(false);
    }
  }, [blockId]);

  return (
    <>
      <div className="mb-3">
        <h1>Block #{blockId}</h1>
      </div>
      <div>
        {blockData ? (
          <div>{renderBlockTransactions(blockData)}</div>
        ) : blockData === null ? (
          <p>Loading...</p>
        ) : (
          <p>Error loading blocks</p>
        )}
      </div>
    </>
  );
}
