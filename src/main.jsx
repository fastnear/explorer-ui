import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import * as bootstrap from "bootstrap";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import IndexPage from "./pages/index/IndexPage.jsx";
import ErrorPage from "./pages/error/ErrorPage.jsx";
import RootWrapper from "./components/navigation/RootWrapper.jsx";

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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
