import path from "node:path";
import url from "node:url";
import { test } from "uvu";
import * as assert from "uvu/assert";

import routesArrayFixture from "./fixtures/routes-array.js";

import { getRoutes } from "../dist/node";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const appDir = path.join(dirname, "../examples/basic/src");

test("getRoutes", async () => {
  const routes = getRoutes({ appDir });
  const actual = JSON.stringify(routes, null, 4);

  assert.fixture(actual, routesArrayFixture);
});

test.run();
