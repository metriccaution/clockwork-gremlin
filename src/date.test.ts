import test, { Macro } from "ava";
import { parseDate, parseTime } from "./date";

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

/*
 * Parse time
 */
const validTime: Macro = (t, input: string, expected: Date) => {
  const parsed = parseTime(input);
  t.deepEqual(parsed, expected);
};
validTime.title = (title, input: string) => `${title} - ${input}`;
const invalidTime: Macro = (t, input: string) => {
  t.throws(() => parseTime(input), Error);
};
invalidTime.title = (title, input: string) => `${title} - ${input} is invalid`;

const timeToday = (hours: number, minutes: number) => {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

// Date - Valid cases
const now = new Date();
test("Parses now", validDate, now.toISOString(), now);
test(
  "Hardcoded date string",
  validDate,
  "2018-09-19T19:02:49.471Z",
  new Date("2018-09-19T19:02:49.471Z")
);
// Date - Invalid cases
test("A word as a date", invalidDate, "Test");
test("Blank string", invalidDate, "");
test("Almost right", invalidDate, "2018-09-19T19:02:49.471ZABC");
test("The month past December", invalidDate, "2018-13-19T19:02:49.471Z");
// Time - Valid cases
test("Parsing a regular time", validTime, "10:00", timeToday(10, 0));
test("Parsing midnight", validTime, "00:00", timeToday(0, 0));
test("Parsing the end of the day", validTime, "23:59", timeToday(23, 59));
// Time - Invalid cases
test("Non-parsable date", invalidTime, "Hello world");
test("Negative time", invalidTime, "-01:11");
test("After midnight", invalidTime, "25:00");
