import { existsSync, readFile, writeFile } from "fs";
import { promisify } from "util";
import { parseDate } from "./date";

export interface TimeInterval {
  project: string;
  start: Date;
  end: Date;
}

export interface TimeDb {
  startNewInterval: (time: Date, project: string) => Promise<TimeInterval>;
  updateCurrentInterval: (time: Date, project: string) => Promise<TimeInterval>;
  fetchIntervals: () => Promise<TimeInterval[]>;
}

const read = promisify(readFile);
const write = promisify(writeFile);

export const compareTimes = (a: TimeInterval, b: TimeInterval): number =>
  b.start.getTime() - a.start.getTime() || b.end.getTime() - a.end.getTime();

export const parseInterval = (entry: any) => {
  const parsed: TimeInterval = {
    start: parseDate(entry.start),
    end: parseDate(entry.end),
    project: entry.project
  };

  if (parsed.end.getTime() < parsed.start.getTime()) {
    throw new Error(
      `Invalid date entry: ${parsed.start} is after ${parsed.end}`
    );
  }

  return parsed;
};

export const parseTimestampFile = (data: any): TimeInterval[] => {
  if (!Array.isArray(data)) {
    throw new Error("Data store must be an array");
  }

  return data.map(parseInterval).sort(compareTimes);
};

export const stringify = (data: TimeInterval) => ({
  start: data.start.toISOString(),
  end: data.end.toISOString(),
  project: data.project
});

const prepareFile = (data: TimeInterval[]): any[] => {
  return data.sort(compareTimes).map(stringify);
};

export class FileDb implements TimeDb {
  private readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  public async startNewInterval(time: Date, project: string) {
    const data = await this.loadDb();
    const newInterval = {
      start: time,
      end: time,
      project
    };

    await this.updateDb([newInterval, ...data]);
    return newInterval;
  }

  public async updateCurrentInterval(time: Date, project: string) {
    const data = await this.loadDb();

    if (data.length === 0) {
      return this.startNewInterval(time, project);
    }

    const last = data[0];
    last.end = time;

    await this.updateDb(data);
    return last;
  }

  public async fetchIntervals() {
    return this.loadDb();
  }

  private async loadDb(): Promise<TimeInterval[]> {
    if (!existsSync(this.path)) {
      return [];
    }

    const rawText = await read(this.path, "utf8");
    return parseTimestampFile(JSON.parse(rawText));
  }

  private async updateDb(data: TimeInterval[]) {
    data.forEach(i => this.validateInterval(i));

    const contents = JSON.stringify(prepareFile(data), null, 4);
    await write(this.path, contents, "utf8");
  }

  private validateInterval(interval: TimeInterval) {
    if (interval.start > interval.end) {
      throw new Error(
        `Invalid date entry: ${interval.start} is after ${interval.end}`
      );
    }
  }
}
