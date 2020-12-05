import React from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "src/layouts/MainLayout";
import NotFoundView from "src/shared/NotFoundView";
import Verify from "src/views/Verify";
import Result from "src/views/Result";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "xac-thuc", element: <Verify /> },
      { path: "ket-qua", element: <Result /> },
      { path: "404", element: <NotFoundView /> },
      { path: "/", element: <Navigate to="xac-thuc" /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
];

export default routes;
