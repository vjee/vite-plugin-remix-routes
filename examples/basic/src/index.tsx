import { StrictMode, Suspense } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./app";

render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback="Loading...">
        <App />
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
  document.querySelector("#app")
);
