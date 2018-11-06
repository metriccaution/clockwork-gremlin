import { parseTime } from "./date";
import { TimeDb } from "./db";
import { dailyReporter, weeklyReporter } from "./text-report";

// tslint:disable-next-line:no-console
const reportText = (...data: string[]) => console.log(...data);

// tslint:disable-next-line:no-console
export const handleError = (e: Error) => console.log("Error", e);

export const stop = async (db: TimeDb, time: string, project: string) => {
  const date = parseTime(time);
  await db.updateCurrentInterval(date, project);
};

export const start = async (db: TimeDb, time: string, project: string) => {
  const date = parseTime(time);
  await db.startNewInterval(date, project);
};

export const view = async (db: TimeDb) => {
  const data = await db.fetchIntervals();

  reportText("Days:");
  reportText(dailyReporter(data), "\n");

  reportText("Weeks:");
  reportText(weeklyReporter(data), "\n");
};

export const help = () => reportText("TODO");
