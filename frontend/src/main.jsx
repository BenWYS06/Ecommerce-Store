import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="bottom-right" reverseOrder={true} />{" "}
      {/* most recent notification display closest screen */}
    </BrowserRouter>
  </StrictMode>,
);
