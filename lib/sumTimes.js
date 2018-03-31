const flow = require("lodash/flow");
const filter = require("lodash/fp/filter");
const pick = require("lodash/fp/pick");
const keys = require("lodash/fp/keys");
const values = require("lodash/fp/values");
const uniq = require("lodash/fp/uniq");

const isValid = i => i.start && i.stop && i.start < i.stop;

const calculateLength = i => i.stop - i.start;

const daysSinceEpoch = interval =>
  Math.floor(interval.start / (1000 * 60 * 60 * 24));

const topNKeys = n => object =>
  keys(object)
    .sort((a, b) => b - a)
    .slice(0, n);

const topNDays = n => object => {
  const days = topNKeys(n)(object);
  return pick(days, object);
};

const mostRecentNDays = n => times => {
  const days = uniq(times.map(daysSinceEpoch))
    .sort()
    .slice(0, n);

  return times.filter(time => days.indexOf(daysSinceEpoch(time)) > -1);
};

const sumByDay = times =>
  times.reduce((summed, interval) => {
    const day = daysSinceEpoch(interval);
    if (!summed[day])
      summed[day] = {
        timestamp: interval.start,
        sum: 0
      };

    summed[day].sum = summed[day].sum + calculateLength(interval);

    return summed;
  }, {});

module.exports = flow(filter(isValid), mostRecentNDays(20), sumByDay, values);
