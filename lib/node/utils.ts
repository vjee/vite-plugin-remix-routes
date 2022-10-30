import path from "node:path";
import type { Route } from "./remix";

export type RequireOnly<Object, Keys extends keyof Object> = Omit<
  Object,
  Keys
> &
  Required<Pick<Object, Keys>>;

export interface Context {
  prefix: string;
  dataRouterCompatible?: boolean;
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
  const importMode = context.importMode?.(route) || "sync";
  const componentName = getRouteComponentName(route);
  const componentPath = `${context.prefix}${path.sep}${route.file}`
    .split(path.sep)
    .join(path.posix.sep);

  const props = new Map<string, string>();

  if (route.path !== "") {
    props.set("path", `'${route.path}'`);
  }

  if (context.dataRouterCompatible) {
    components.sync.push(
      `import * as ${componentName} from '${componentPath}';`
    );

    props.set(
      "element",
      `${componentName}.default ? createElement(${componentName}.default) : undefined`
    );
    props.set("loader", `${componentName}.loader`);
    props.set("action", `${componentName}.action`);
    props.set(
      "errorElement",
      `${componentName}.ErrorBoundary ? createElement(${componentName}.ErrorBoundary) : undefined`
    );
    props.set("handle", `${componentName}.handle`);
    props.set("shouldRevalidate", `${componentName}.shouldRevalidate`);
  } else {
    if (importMode === "async") {
      components.async.push(
        `const ${componentName} = () => import('${componentPath}');`
      );

      props.set("element", `createElement(lazy(${componentName}))`);
      props.set("importPromise", componentName);
    }

    if (importMode === "sync") {
      components.sync.push(`import ${componentName} from '${componentPath}';`);

      props.set("element", `createElement(${componentName})`);
    }
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
