import { useRoutes } from "react-router-dom";
import routes, { EagerLoader } from "virtual:react-remix-routes";

export default function App() {
  const element = useRoutes(routes);

  return (
    <>
      {/* More info about EagerLoader in the README */}
      <EagerLoader routes={routes} />
      {element}
    </>
  );
}
