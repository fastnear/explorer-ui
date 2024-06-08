import React from "react";
import Big from "big.js";

export function TokenAmount(props) {
  const { tokenId, amount, forceSign } = props;
  const bigAmount = Big(amount);
  return (
    <span>
      {forceSign && bigAmount.gt(0) && "+"}
      {bigAmount.toFixed(0)}
    </span>
  );
}
