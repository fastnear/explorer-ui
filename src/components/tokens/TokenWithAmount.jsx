import React from "react";
import { TokenAmount } from "./TokenAmount.jsx";
import { TokenIcon } from "./TokenIcon.jsx";
import { TokenName } from "./TokenName.jsx";

export function TokenWithAmount(props) {
  const { tokenId, amount, forceSign } = props;
  return (
    <span>
      <TokenAmount tokenId={tokenId} amount={amount} forceSign={forceSign} />
      <TokenIcon tokenId={tokenId} />
      <TokenName tokenId={tokenId} />
    </span>
  );
}
