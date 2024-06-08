import React from "react";
import { TokenWithAmount } from "../../../tokens/TokenWithAmount.jsx";

export function TransfersDetail(props) {
  const transfers = props.transfers || {};
  console.log(transfers);
  return (
    <div>
      {Object.entries(transfers).map(([tokenId, amount]) => (
        <div key={tokenId}>
          <TokenWithAmount tokenId={tokenId} amount={amount} forceSign={true} />
        </div>
      ))}
    </div>
  );
}
