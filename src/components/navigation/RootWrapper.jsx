import React from "react";
import Header from "./Header.jsx";
import { Outlet } from "react-router-dom";

export default function RootWrapper() {
  return (
    <>
      <Header />
      <div className="container-fluid">
        <Outlet />
      </div>
    </>
  );
}
