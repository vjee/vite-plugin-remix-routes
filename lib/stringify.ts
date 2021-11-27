import type { Route } from "./types";

export function stringifyRoutes(routes: Route[], prefix: string): string {
  return `[${routes
    .map((route) => stringifyRoute(route, prefix))
    .join(",\n")}]`;
}

export function stringifyRoute(route: Route, prefix: string): string {
  const absPath = prefix + "/" + route.file;
  const children = stringifyRoutes(route.children, prefix);

  return (
    `{` +
    `path:'${route.path}',` +
    `index:${route.index},` +
    `caseSensitive:${route.caseSensitive},` +
    `element:createElement(lazy(() => import('${absPath}'))),` +
    `children:${children}` +
    `}`
  );
}
