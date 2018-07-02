import { flow } from "lodash";
import { join } from "path";
import { DateRange } from "./date-range";
import sumTimes from "./sumTimes";
import formatDays from "./formatDays";
import db from "./db";

const config = {
  db: join(process.cwd(), "db.json"),
  displayDays: 20
};

const saved = db(config.db);
const args = () => process.argv.slice(2);

const printSummary = () =>
  saved.read().then(flow(sumTimes, formatDays, console.log));

// If no arguments are passed, print out worked time
if (args().length === 0) {
  printSummary();
}

// Either parse the provided time, or just put out now
const getTime = () => {
  const suppliedTime = args()[1];
  if (suppliedTime) {
    const parts = suppliedTime.split(":");
    const date = new Date();
    date.setHours(parseInt(parts[0], 10));
    date.setMinutes(parseInt(parts[1], 10));
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date.getTime();
  }

  return new Date().getTime();
};

// Either put a new start time in, or overwrite the last one
const setStart = (intervals: DateRange[], start: number) =>
  Boolean(intervals.length && intervals[intervals.length - 1].stop)
    ? intervals.concat({ start })
    : intervals.slice(0, intervals.length - 1).concat({ start });

// Either set a stop time on the last interval, or do nothing
const setStop = (intervals: DateRange[], stop: number) => {
  if (Boolean(intervals.length)) {
    intervals[intervals.length - 1].stop = stop;
  }

  return intervals;
};

if (args().length === 0) process.exit(0);

console.log(args()[0].toLocaleLowerCase())

// Update the db
switch (args()[0].toLocaleLowerCase()) {
  case "start":
    saved
      .read()
      .then(d => setStart(d, getTime()))
      .then(saved.write)
      .then(printSummary)
      .catch(e => console.log("Oh no!", e));
    break;
  case "stop":
    saved
      .read()
      .then(d => setStop(d, getTime()))
      .then(saved.write)
      .then(printSummary)
      .catch(e => console.log("Oh no!", e));
    break;
  default:
    console.log("I don't know what to do with '" + args()[0] + "'");
}
