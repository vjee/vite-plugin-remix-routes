import type { Route } from "./remix";

interface Context {
  prefix: string;
  importMode?: (route: Route) => "sync" | "async";
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
  const importMode = context.importMode?.(route) || "sync";

  const props = new Map<string, string>();

  if (route.path !== "") {
    props.set("path", `'${route.path}'`);
  }

  if (importMode === "async") {
    components.async.push(
      `const ${componentName} = () => import('${componentPath}');`
    );

    props.set("element", `createElement(lazy(${componentName}))`);
    props.set("loader", componentName);
  }

  if (importMode === "sync") {
    components.sync.push(`import ${componentName} from '${componentPath}';`);

    props.set("element", `createElement(${componentName})`);
  }

  if (route.index === true) {
    props.set("index", "true");
  }

  if (route.children.length) {
    const children = routesToString(route.children, context, components);
    props.set("children", children);
  }

  return (
    "{" + [...props.entries()].map(([k, v]) => `${k}:${v}`).join(",") + "}"
  );
}

function getRouteComponentName(route: Route) {
  return route.id
    .split(/[/.]/)
    .map((str) => str.replace(/^\w/, (c) => c.toUpperCase()))
    .join("");
}
