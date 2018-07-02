import * as moment from "moment";
import { join, flow, values } from "lodash";
import { reduce, map } from "lodash/fp";
import { SummedInterval, IntervalsByStart } from "./date-range";

const joinStrings = (...strings: string[]) => join(strings, "\n");
const formatMillis = (millis: number) => (millis / (1000 * 60 * 60)).toFixed(1);
const weekStart = (timestamp: number) =>
  moment(timestamp)
    .day("Monday")
    .valueOf();

const dayText = (day: SummedInterval) =>
  moment(day.timestamp).format("DD/MM/YYYY") + " - " + formatMillis(day.sum);

const daysText = (days: SummedInterval[]) =>
  days
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(dayText)
    .reduce((str, line) => joinStrings(str, line), "")
    .trim();

const weeksText = flow(
  reduce((weeks: IntervalsByStart, day: SummedInterval) => {
    const parsed = moment(day.timestamp);
    const weekId = parsed.year() + " - " + parsed.week();

    if (!weeks[weekId]) {
      weeks[weekId] = {
        timestamp: day.timestamp,
        sum: 0
      };
    }

    weeks[weekId].sum = weeks[weekId].sum + day.sum;

    return weeks;
  }, {}),
  values,
  weeks => weeks.sort((a: SummedInterval, b: SummedInterval) => b.sum - a.sum),
  map((week: SummedInterval) => ({
    timestamp: weekStart(week.sum),
    time: week.sum
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

export default (days: SummedInterval[]) =>
  joinStrings("Days", daysText(days), "", "Weeks", weeksText(days));
