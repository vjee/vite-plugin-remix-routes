# vite-react-remix-routes

Use [Remix.run](https://github.com/remix-run/remix) routing in your [Vite](https://github.com/vitejs/vite) project.

## Plugin config

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactRemixRoutes from "vite-react-remix-routes";

export default defineConfig({
  plugins: [react(), reactRemixRoutes()],
});
```

**With options:**

```ts
reactRemixRoutes({
  /* options here */
});
```

## Options

### appDir

- **Optional**
- **Type**: `string`
- **Default**: `path.join(process.cwd(), "src")`

An absolute path to the folder containing the `routes` folder.
This will most likely be your `/src` folder.

### importMode

- **Optional**
- **Type**: `(route: Route) => "async" | "sync"`
- **Default**: `() => "sync"`

A function that receives a `Route` to determine if the route's component should be imported synchronously or asynchronously.

### is404Route

- **Optional**
- **Type**: `(route: Route) => boolean`
- **Default**: `(route) => route.id === "routes/404"`

A function that receives a `Route` to determine if it should be a 404 route. (`path="*"`)

By default this matches the same 404 file as Remix does.

Keep in mind this only receives top level routes, so you can't mark nested routes as 404 routes.

## Usage

```ts
import routes from "virtual:react-remix-routes";
```

**Example:**

```tsx
import { render } from "react-dom";
import { BrowserRouter, useRoutes } from "react-router-dom";
import routes from "virtual:routes";

function App() {
  const element = useRoutes(routes);

  return <>{element}</>;
}

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector("#app")
);
```

## Async nested routes

When you configure routes to be imported asynchronously with the `importMode` option, it is important to note that this can create a request waterfall.

Lets say we land on the nested route `/one/two/three`.

React will first render (and load) the component for `one`, then `two` and at last `three` in series.\
Each component needs to be loaded and rendered before the next one is loaded.

This is not ideal so you can use the `EagerLoader` component exported by `vite-react-remix-routes/client` to immediately load all the components that will be needed for the current route.

**Example:**

```jsx
import { render } from "react-dom";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { EagerLoader } from "vite-react-remix-routes/client";
import routes from "virtual:routes";

function App() {
  const element = useRoutes(routes);

  return (
    <>
      <EagerLoader routes={routes} />
      {element}
    </>
  );
}

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector("#app")
);
```

Note that if you don't render an `<Outlet />` in one of the parent components, this will still load the subcomponent(s), even though React will not render it and would not have loaded it.\
But in that case, you probably don't want a nested route anyway.

<details>
<summary>How does this work?</summary>

[This is the code](https://github.com/vjee/vite-react-remix-routes/blob/main/lib/client/EagerLoader.ts) for `EagerLoader`.
It gets the current location with the `useLocation` hook and gets all the matching routes for that location with `matchRoutes`.
Then we loop over each of the matching routes and call it's `loader` method.

This `loader` method is added to async routes by `vite-react-remix-routes` and looks like this: `loader: () => import("./path/to/route/component")`.

This will start the download of the route component. When React tries to render it later on, it is already loaded or it reuses the pending request if it hasn't finished yet.

```jsx
function EagerLoader({ routes }) {
  const location = useLocation();

  useEffect(() => {
    const matches = matchRoutes(routes, location) || [];

    for (const match of matches) {
      match.route.loader?.();
    }
  }, [location]);

  return null;
}
```

</details>
<br />

More info about `useRoutes` can be found here:

- https://reactrouter.com/docs/en/v6/api#useroutes
- https://reactrouter.com/docs/en/v6/examples/route-objects

## TypeScript

If you use TypeScript you can add the following to your `vite-env.d.ts` file.\
This will add types for the `virtual:react-remix-routes` module.

```ts
/// <reference types="vite-react-remix-routes/virtual" />
```

## Similar projects

### vite-plugin-pages

This project is inspired by [`vite-plugin-pages`](https://github.com/hannoeru/vite-plugin-pages)
that can be used with both Vue and React.

`vite-react-remix-routes` is different in that it utilizes [`remix-run`](https://github.com/remix-run/remix) to generate the routes array instead of using a custom convention.\
As the name suggests, it also only works with React.

## License

[MIT](https://github.com/vjee/vite-react-remix-routes/blob/main/LICENSE)
