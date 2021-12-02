declare module "virtual:react-remix-routes" {
  import type { FunctionComponent } from "react";
  import type { RouteObject } from "react-router";

  const routes: RouteObject[];
  const EagerLoader: FunctionComponent<{ routes: RouteObject[] }>;

  export default routes;
  export { EagerLoader };
}
