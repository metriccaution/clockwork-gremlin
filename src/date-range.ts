export interface DateRange {
  start: number;
  stop?: number;
}

export interface SummedInterval {
  timestamp: number;
  sum: number;
}

export interface IntervalsByStart {
  [index: string]: SummedInterval;
}
