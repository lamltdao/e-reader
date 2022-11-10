import React from "react";
import { App } from "./app";
import { RootProvider } from "./rootProviders";
import { createRoot } from 'react-dom/client';


const root = createRoot(document.getElementById("root") as Element)
root.render(
  <React.StrictMode>
    <RootProvider>
      <App />
    </RootProvider>
  </React.StrictMode>
);
