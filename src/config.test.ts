import test from "ava";
import config from "./config";

test("Default config is valid", t => {
  t.notThrows(() => config.validate());
});
