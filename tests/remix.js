import path from "node:path";
import url from "node:url";
import { suite } from "uvu";
import * as assert from "uvu/assert";

import { getRoutes } from "../dist";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const remix = suite("remix");

remix("`getRoutes` should work", async () => {
  const appDir = path.join(__dirname, "../examples/basic/src");
  const routesArray = getRoutes(appDir);

  const actual = JSON.stringify(routesArray, null, 4);
  const { default: expected } = await import("./routesArray.fixture.js");

  assert.fixture(actual, expected);
});

remix.run();
