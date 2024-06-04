import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import * as bootstrap from "bootstrap";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import IndexPage from "./pages/index/IndexPage.jsx";
import ErrorPage from "./pages/error/ErrorPage.jsx";
import RootWrapper from "./components/navigation/RootWrapper.jsx";
import BlockPage from "./pages/block/BlockPage.jsx";
import AccountPage from "./pages/account/AccountPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootWrapper />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <IndexPage />,
      },
      {
        path: "/block/:blockId",
        element: <BlockPage />,
      },
      {
        path: "/account/:accountId",
        element: <AccountPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
