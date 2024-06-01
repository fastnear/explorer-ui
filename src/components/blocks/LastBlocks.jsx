import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Block Hash</th>
          <th>Timestamp</th>
          <th>Height</th>
          <th>TX/R Count</th>
        </tr>
      </thead>
      <tbody>
        {blocks.blocks.map((b) => {
          const height = b["block_height"];
          const count = b["txs_count"];
          const blockHash = b["block_hash"];
          const timestamp = b["block_timestamp"] / 1e6;
          return (
            <tr>
              <td>
                <Link to={`/block/${blockHash}`}>{blockHash}</Link>
              </td>
              <td>{new Date(timestamp).toLocaleString()}</td>
              <td>
                <Link to={`/block/${height}`}>#{height}</Link>
              </td>
              <td>{count}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
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
