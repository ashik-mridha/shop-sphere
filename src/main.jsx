import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { LoadingProvider } from "./context/LoadingContext";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <ThemeProvider>
        <App />
        <Toaster position="top-right" />
        </ThemeProvider>
      </LoadingProvider>
    </BrowserRouter>
  </React.StrictMode>
);