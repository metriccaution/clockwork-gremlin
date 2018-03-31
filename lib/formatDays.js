const moment = require("moment");
const join = require("lodash/join");

const joinStrings = (...strings) => join(strings, "\n");

const dayText = day => {
  const hoursWorked = (day.sum / (1000 * 60 * 60)).toFixed(1);
  return moment(day.timestamp).format("DD/MM/YYYY") + " - " + hoursWorked;
};

const daysText = days =>
  days
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(dayText)
    .reduce((str, line) => joinStrings(str, line), "")
    .trim();

module.exports = daysText;
