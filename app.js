const { readFile, writeFile } = require("fs");
const { promisify } = require("util");
const isArray = require("lodash/isArray");
const groupBy = require("lodash/fp/groupBy");
const pick = require("lodash/pick");
const values = require("lodash/values");
const fromPairs = require("lodash/fromPairs");
const moment = require("moment");

const config = {
  db: "db.json",
  displayDays: 20
};

const readDb = file =>
  promisify(readFile)(file, "utf8")
    .then(JSON.parse)
    .catch(() => [])
    .then(data => (isArray(data) ? data : []));

const writeDb = (file, data) =>
  promisify(writeFile)(file, JSON.stringify(data, null, 2), {
    encoding: "utf8"
  });

const args = () => process.argv.slice(2);

const printSummary = () =>
  readDb(config.db)
    // Filter out bad data & simplify model
    .then(intervals =>
      intervals
        .filter(i => i.start && i.stop && i.start < i.stop)
        .map(i => ({ start: i.start, length: i.stop - i.start }))
    )
    // Group by day
    .then(
      groupBy(interval => Math.floor(interval.start / (1000 * 60 * 60 * 24)))
    )
    // Only get the top few days
    .then(dayGroups =>
      pick(
        dayGroups,
        Object.keys(dayGroups)
          .sort((a, b) => b - a)
          .slice(0, config.displayDays)
      )
    )
    // Sum up each day
    .then(dayGroups =>
      values(dayGroups)
        .map(day =>
          day.reduce((summed, entry) => ({
            start: summed.start,
            length: summed.length + entry.length
          }))
        )
        .map(day => [day.start, day.length])
        .sort((pair1, pair2) => pair2[0] - pair1[0])
    )
    // Format each day
    .then(days =>
      days.map(day => {
        const hoursWorked = (day[1] / (1000 * 60 * 60)).toFixed(1);
        return moment(day[0]).format("DD/MM/YYYY") + " - " + hoursWorked;
      })
    )
    // Print out each day
    .then(days => days.forEach(day => console.log(day)));

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
const setStart = (intervals, start) =>
  Boolean(intervals.length && intervals[intervals.length - 1].stop)
    ? intervals.concat({ start })
    : intervals.slice(0, intervals.length - 1).concat({ start });

// Either set a stop time on the last interval, or do nothing
const setStop = (intervals, stop) => {
  if (Boolean(intervals.length)) {
    intervals[intervals.length - 1].stop = stop;
  }

  return intervals;
};

if (args().length === 0) return;

// Update the db
switch (args()[0].toLocaleLowerCase()) {
  case "start":
    return readDb(config.db)
      .then(d => setStart(d, getTime()))
      .then(d => writeDb(config.db, d))
      .then(printSummary)
      .catch(e => console.log("Oh no!", e));
  case "stop":
    return readDb(config.db)
      .then(d => setStop(d, getTime()))
      .then(d => writeDb(config.db, d))
      .then(printSummary)
      .catch(e => console.log("Oh no!", e));
  default:
    return console.log("I don't know what to do with '" + args()[0] + "'");
}
