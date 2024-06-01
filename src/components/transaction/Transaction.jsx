import React from "react";

export function Transaction(props) {
  return <pre>{JSON.stringify(props.transaction).slice(0, 100)}</pre>;
}
