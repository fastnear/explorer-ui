import React, { useEffect, useState } from "react";

async function fetchLastTxs() {
  try {
    const response = await fetch(
      "https://explorer.main.fastnear.com/v0/blocks/last",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "{}",
      },
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
}

function renderBlocks(blocks) {
  return blocks.blocks.map((b) => {
    const height = b["block_height"];
    const count = b["txs_count"];
    const blockHash = b["block_hash"];
    const timestamp = b["block_timestamp"] / 1e6;
    return (
      <div key={height} className="d-flex gap-4 font-monospace">
        <div>{blockHash.padStart(44)}</div>
        <div>{new Date(timestamp).toLocaleString()}</div>
        <div>#{height}</div>
        <div>{count} transactions and receipts</div>
      </div>
    );
  });
}

export default function LastBlocks() {
  const [blocks, setBlocks] = useState(null);

  useEffect(() => {
    fetchLastTxs().then(setBlocks);
  }, []);

  return blocks ? (
    <div>{renderBlocks(blocks)}</div>
  ) : blocks === null ? (
    <p>Loading...</p>
  ) : (
    <p>Error loading blocks</p>
  );
}
