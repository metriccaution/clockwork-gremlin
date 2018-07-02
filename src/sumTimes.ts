import { flow, filter, values, uniq } from "lodash/fp";
import { DateRange, IntervalsByStart } from "./date-range";

const isValid = (i: DateRange): boolean =>
  Boolean(i.start && i.stop && i.start < i.stop);

const calculateLength = (i: DateRange) => (i.stop || i.start) - i.start;

const daysSinceEpoch = (interval: DateRange) =>
  Math.floor(interval.start / (1000 * 60 * 60 * 24));

const mostRecentNDays = (n: number) => (times: DateRange[]) => {
  const days = uniq(times.map(daysSinceEpoch))
    .sort()
    .slice(0, n);

  return times.filter(time => days.indexOf(daysSinceEpoch(time)) > -1);
};

const sumByDay = (times: DateRange[]): IntervalsByStart =>
  times.reduce((summed: IntervalsByStart, interval: DateRange) => {
    const day = daysSinceEpoch(interval);
    if (!summed[day])
      summed[day] = {
        timestamp: interval.start,
        sum: 0
      };

    summed[day].sum = summed[day].sum + calculateLength(interval);

    return summed;
  }, {});

export default flow(filter(isValid), mostRecentNDays(20), sumByDay, values);
