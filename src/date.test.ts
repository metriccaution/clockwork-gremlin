import test, { Macro } from "ava";
import { parseDate } from "./date";

/*
 * Parse date
 */
const invalidDate: Macro = (t, input: string) => {
  t.throws(() => parseDate(input), Error);
};
invalidDate.title = (title, input: string) => `${title} - ${input} is invalid`;

const validDate: Macro = (t, input: string, expected: Date) => {
  const actual = parseDate(input);
  t.deepEqual(actual, expected);
};
validDate.title = (title, input: string, expected: Date) =>
  `${title} - ${input} parses to ${expected.toISOString()}`;

// Valid cases
(() => {
  const now = new Date();
  test("Parses now", validDate, now.toISOString(), now);
})();
test(
  "Hardcoded date string",
  validDate,
  "2018-09-19T19:02:49.471Z",
  new Date("2018-09-19T19:02:49.471Z")
);

// Invalid cases
test("A word as a date", invalidDate, "Test");
test("Blank string", invalidDate, "");
test("Almost right", invalidDate, "2018-09-19T19:02:49.471ZABC");
test("The month past December", invalidDate, "2018-13-19T19:02:49.471Z");
