import React from "react";

export function TokenName(props) {
  const { tokenId } = props;
  return tokenId && <span>{tokenId.substring(0, 5)}</span>;
}
