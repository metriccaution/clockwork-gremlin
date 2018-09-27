import test, { Macro } from "ava";
import { TimeInterval } from "./db";
import { dailyReporter } from "./text-report";

/*
 * Daily reports
 */
const dailyReport: Macro = (t, times: TimeInterval[], expected: string) => {
  const actual = dailyReporter(times);
  t.is(expected, actual);
};

test("No data", dailyReport, [], "");
test(
  "A single entry",
  dailyReport,
  [
    {
      start: new Date("2018-09-19T19:02:49.471Z"),
      end: new Date("2018-09-19T20:02:49.471Z")
    }
  ],
  `2018-09-19: 1.0`
);
test(
  "Two days",
  dailyReport,
  [
    {
      start: new Date("2018-09-18T19:02:49.471Z"),
      end: new Date("2018-09-18T20:02:49.471Z")
    },
    {
      start: new Date("2018-09-19T19:02:49.471Z"),
      end: new Date("2018-09-19T20:02:49.471Z")
    }
  ],
  `
2018-09-19: 1.0
2018-09-18: 1.0
`.trim()
);
test(
  "Two intervals on the same day",
  dailyReport,
  [
    {
      start: new Date("2018-09-19T19:03:59.471Z"),
      end: new Date("2018-09-19T20:10:59.471Z")
    },
    {
      start: new Date("2018-09-19T19:02:49.471Z"),
      end: new Date("2018-09-19T20:02:49.471Z")
    }
  ],
  `
2018-09-19: 2.1
`.trim()
);
