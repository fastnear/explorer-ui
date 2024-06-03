import React from "react";

export function AccountId(props) {
  const { accountId } = props;
  // TODO: Make it searchable by having truncation in css instead.
  return accountId ? (
    accountId.length > 23 ? (
      <span title={accountId}>
        {accountId.slice(0, 10)}
        <span className="text-muted">...</span>
        {accountId.slice(-10)}
      </span>
    ) : (
      <span>{accountId}</span>
    )
  ) : (
    <span className="text-muted">{"<missing accountId>"}</span>
  );
}
