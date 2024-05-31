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
  const blockTxs = blocks["block_txs"];
  const blocksByHeight = {};
  // Group blocks by height
  blockTxs.forEach((block) => {
    const height = block["block_height"];
    if (!blocksByHeight[height]) {
      blocksByHeight[height] = [];
    }
    blocksByHeight[height].push(block);
  });
  return Object.keys(blocksByHeight)
    .sort((a, b) => b - a)
    .map((height) => {
      const blocks = blocksByHeight[height];
      const firstBlock = blocks[0];
      return (
        <div key={height} className="d-flex gap-4 font-monospace">
          <div>
            {new Date(firstBlock["block_timestamp"] / 1e6).toLocaleString()}
          </div>
          <div>#{height}</div>
          <div>{blocks.length} transactions and receipts</div>
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
