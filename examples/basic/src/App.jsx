import { useRoutes } from "react-router";
import routes from "virtual:react-remix-routes";

export default function App() {
  const element = useRoutes(routes);

  return <>{element}</>;
}
