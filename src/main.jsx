
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { IpProvider } from "./context/IpContext"; // 👈 import provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IpProvider>
      <App />
    </IpProvider>
  </React.StrictMode>
);

