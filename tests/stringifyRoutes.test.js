import path from "node:path";
import url from "node:url";
import { test } from "uvu";
import * as assert from "uvu/assert";

import routesStringFixture from "./fixtures/routesString.fixture.js";
import componentsStringFixture from "./fixtures/componentsString.fixture.js";

import { getRoutes, stringifyRoutes } from "../dist";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const appDir = path.join(dirname, "../examples/basic/src");

test("stringifyRoutes", async () => {
  const routes = getRoutes(appDir);
  const prefix = "/src";
  const importMode = (route) =>
    route.id.startsWith("routes/demos/about") ? "async" : "sync";

  const { routesString, componentsString } = stringifyRoutes(routes, {
    prefix,
    importMode,
  });

  assert.fixture(routesString, routesStringFixture);
  assert.fixture(componentsString, componentsStringFixture);
});

test.run();
