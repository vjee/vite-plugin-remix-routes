import { useRoutes } from "react-router-dom";
import routes from "virtual:remix-routes";

export default function App() {
  const element = useRoutes(routes);

  return <>{element}</>;
}
