/*
 * Ways to group up time logs
 */

import { TimeInterval } from "./db";
import * as moment from "moment";

type DateGrouping = (date: Date) => string;
type Reporter<T> = (times: TimeInterval[]) => T;

const dayGrouping: DateGrouping = t => moment(t).format("YYYY-MM-DD");
const weekGrouping: DateGrouping = t => moment(t).format("YYYY-ww");

const sumIntervalsInHours: Reporter<number> = i => {
  const millis = i
    .map(({ start, end }) => end.getTime() - start.getTime())
    .reduce((sum: number, value) => sum + value, 0);

  return millis / (1000 * 60 * 60);
};

const groupingReporter = (grouping: DateGrouping): Reporter<string> => {
  return times => {
    const days: Record<string, TimeInterval[]> = times.reduce(
      (groups: Record<string, TimeInterval[]>, interval) => {
        const group = grouping(interval.start);
        groups[group] = (groups[group] || []).concat(interval);
        return groups;
      },
      {}
    );

    return (
      Object.keys(days)
        .sort((a, b) => b.localeCompare(a))
        // TODO - Configurable days
        .slice(0, 20)
        .map(day => `${day}: ${sumIntervalsInHours(days[day]).toFixed(1)}`)
        .join("\n")
        .trim()
    );
  };
};

export const dailyReporter: Reporter<String> = groupingReporter(dayGrouping);
export const weeklyReporter: Reporter<String> = groupingReporter(weekGrouping);
