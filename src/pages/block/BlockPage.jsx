import React from "react";
import { useEffect, useState } from "react";
import "./BlockPage.scss";
import { useParams } from "react-router-dom";
import { Transaction } from "../../components/transaction/Transaction.jsx";

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

async function fetchBlockTransactions(blockId) {
  try {
    const response = await fetch(
      "https://explorer.main.fastnear.com/v0/block",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ block_id: parseBlockId(blockId) }),
      },
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
}

function renderBlockTransactions(blockData) {
  return (
    <>
      <p>Total transactions: {blockData["block_txs"].length}</p>
      <div>
        {blockData["transactions"].map((transaction, i) => (
          <Transaction key={i} transaction={transaction} />
        ))}
      </div>
    </>
  );
}

export default function BlockPage(props) {
  const { blockId } = useParams();
  const [blockData, setBlockData] = useState(null);

  useEffect(() => {
    if (blockId) {
      fetchBlockTransactions(blockId).then(setBlockData);
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
