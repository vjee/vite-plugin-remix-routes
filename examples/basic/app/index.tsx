import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import App from "./app";

createRoot(document.querySelector("#app")!).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </StrictMode>
);
