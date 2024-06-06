import React from "react";

export function CryptoHash(props) {
  const { hash } = props;
  // TODO: Make it searchable by having truncation in css instead.
  return hash ? (
    <span title={hash}>
      {hash.slice(0, 6)}
      <span className="text-muted">...</span>
      {hash.slice(-6)}
    </span>
  ) : (
    <span className="text-muted">{"<missing hash>"}</span>
  );
}
