const moment = require("moment");

const dayText = day => {
  const hoursWorked = (day.sum / (1000 * 60 * 60)).toFixed(1);
  return moment(day.timestamp).format("DD/MM/YYYY") + " - " + hoursWorked;
};

const daysText = days =>
  days
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(dayText)
    .reduce((str, line) => str + "\n" + line, "");

module.exports = days => {
  return daysText(days);
};
