import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ServicesProvider } from "@/di/services.provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ServicesProvider>
      <RouterProvider router={router} />
    </ServicesProvider>
  </React.StrictMode>
);