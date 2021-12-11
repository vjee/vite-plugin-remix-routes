import { useEffect } from "react";
import type { ComponentType } from "react";
import { matchRoutes, useLocation } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

interface Route extends RouteObject {
  loader?: () => Promise<ComponentType>;
}

interface Props {
  routes: Route[];
}

export default function EagerLoader({ routes }: Props) {
  const location = useLocation();

  useEffect(() => {
    const matches = matchRoutes(routes, location) || [];

    matches.forEach((match) => {
      const route = match.route as Route;
      if (route.loader) route.loader();
    });
  }, [location]);

  return null;
}
