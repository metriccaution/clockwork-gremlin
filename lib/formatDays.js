const moment = require("moment");
const join = require("lodash/join");
const flow = require("lodash/flow");
const values = require("lodash/values");
const reduce = require("lodash/fp/reduce");
const map = require("lodash/fp/map");

const joinStrings = (...strings) => join(strings, "\n");
const formatMillis = millis => (millis / (1000 * 60 * 60)).toFixed(1);
const weekStart = timestamp =>
  moment(timestamp)
    .day("Monday")
    .valueOf();

const dayText = day =>
  moment(day.timestamp).format("DD/MM/YYYY") + " - " + formatMillis(day.sum);

const daysText = days =>
  days
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(dayText)
    .reduce((str, line) => joinStrings(str, line), "")
    .trim();

const weeksText = flow(
  reduce((weeks, day) => {
    const parsed = moment(day.timestamp);
    const weekId = parsed.year() + " - " + parsed.week();

    if (!weeks[weekId]) {
      weeks[weekId] = {
        timestamp: day.timestamp,
        time: 0
      };
    }

    weeks[weekId].time = weeks[weekId].time + day.sum;

    return weeks;
  }, {}),
  values,
  weeks => weeks.sort((a, b) => b.timestamp - a.timestamp),
  map(week => ({
    timestamp: weekStart(week.timestamp),
    time: week.time
  })),
  map(
    week =>
      moment(week.timestamp).format("DD/MM/YYYY") +
      " - " +
      formatMillis(week.time)
  ),
  reduce((str, line) => joinStrings(str, line), ""),
  str => str.trim()
);

module.exports = days =>
  joinStrings("Days", daysText(days), "", "Weeks", weeksText(days));
