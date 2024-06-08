import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CryptoHash } from "../common/CryptoHash.jsx";
import { fetchJson } from "../../utils/fetch-json.js";

const fetchLastBlocks = () =>
  fetchJson({
    method: "POST",
    url: "https://explorer.main.fastnear.com/v0/blocks/last",
  });

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
            <tr key={height}>
              <td>
                <Link to={`/block/${blockHash}`}>
                  <CryptoHash hash={blockHash} />
                </Link>
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
    fetchLastBlocks().then(setBlocks).catch(console.error);
  }, []);

  return blocks ? (
    <div>{renderBlocks(blocks)}</div>
  ) : blocks === null ? (
    <p>Loading...</p>
  ) : (
    <p>Error loading blocks</p>
  );
}
