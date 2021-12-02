import type { Route } from "./remix";

interface Context {
  prefix: string;
  importMode: (route: Route) => "sync" | "async";
}

interface Components {
  sync: string[];
  async: string[];
}

export function stringifyRoutes(routes: Route[], context: Context) {
  const components: Components = { sync: [], async: [] };
  const routesString = routesToString(routes, context, components);

  return {
    routesString,
    componentsString: [...components.sync, ...components.async].join("\n"),
  };
}

function routesToString(
  routes: Route[],
  context: Context,
  components: Components
) {
  return (
    "[" +
    routes.map((route) => routeToString(route, context, components)).join(",") +
    "]"
  );
}

function routeToString(
  route: Route,
  context: Context,
  components: Components
): string {
  const componentName = getRouteComponentName(route);
  const componentPath = `${context.prefix}/${route.file}`;
  const importMode = context.importMode(route);

  if (importMode === "async") {
    components.async.push(
      `const ${componentName} = lazy(() => import('${componentPath}'));`
    );
  }

  if (importMode === "sync") {
    components.sync.push(`import ${componentName} from '${componentPath}';`);
  }

  const props = new Map<string, string>();

  props.set("path", `'${route.path}'`);
  props.set("element", `createElement(${componentName})`);

  if (route.index === true) {
    props.set("index", "true");
  }

  if (route.children.length) {
    const children = routesToString(route.children, context, components);
    props.set("children", children);
  }

  if (importMode === "async") {
    props.set("loader", `() => import('${componentPath}')`);
  }

  return (
    "{" + [...props.entries()].map(([k, v]) => `${k}:${v}`).join(",") + "}"
  );
}

function getRouteComponentName(route: Route) {
  return route.id
    .split("/")
    .map((str) => str.replace(/^\w/, (c) => c.toUpperCase()))
    .join("");
}
