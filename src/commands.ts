import { TimeDb } from "./db";
import { parseDate } from "./date";
import { dailyReporter, weeklyReporter } from "./text-report";

export const stop = async (db: TimeDb, time: string, project: string) => {
  const date = parseDate(time);
  await db.updateCurrentInterval(date, project);
};

export const start = async (db: TimeDb, time: string, project: string) => {
  const date = parseDate(time);
  await db.startNewInterval(date, project);
};

export const view = async (db: TimeDb) => {
  const data = await db.fetchIntervals();

  console.log("Days:");
  console.log(dailyReporter(data), "\n");

  console.log("Weeks:");
  console.log(weeklyReporter(data), "\n");
};

export const help = () => console.log("TODO");
