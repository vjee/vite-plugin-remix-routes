import { createBrowserRouter, RouterProvider } from "react-router-dom";
import remixRoutes from "virtual:remix-routes";
import * as Root from "./root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root.default />,
    errorElement: <Root.ErrorBoundary />,
    children: remixRoutes,
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
  );
}
