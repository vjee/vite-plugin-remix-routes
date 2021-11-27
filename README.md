# vite-react-remix-routes

Use Remix.run routing in your Vite project.

## Vite config

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactRemixRoutes from "vite-react-remix-routes";

export default defineConfig({
  plugins: [
    react(),
    reactRemixRoutes()
  ],
});
```

## Usage

```ts
import routes from "virtual:react-remix-routes";
```

Example:

```tsx
import { render } from "react-dom";
import { BrowserRouter, useRoutes } from "react-router-dom";
import routes from "virtual:react-remix-routes";

function App() {
  const element = useRoutes(routes);
  return element;
}

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector("#app")
);
```

More info about `useRoutes` can be found here:

https://reactrouter.com/docs/en/v6/api#useroutes\
https://reactrouter.com/docs/en/v6/examples/route-objects

## TypeScript

If you use TypeScript you can add the following to your `vite-env.d.ts` file.
This will add types for the `virtual:react-remix-routes` import.

```ts
/// <reference types="vite-react-remix-routes/client" />
```

## Similar projects

### vite-plugin-pages

This project is inspired by [`vite-plugin-pages`](https://github.com/hannoeru/vite-plugin-pages)
that can be used with both Vue and React.

`vite-react-remix-routes` is different in that it utilizes [`remix-run`](https://github.com/remix-run/remix)
to generate the routes array instead of using a custom convention.

## License

[MIT](https://github.com/vjee/vite-react-remix-routes/blob/main/LICENSE)
