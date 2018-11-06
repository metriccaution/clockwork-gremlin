import * as moment from "moment";

export const parseDate = (dateString: string): Date => {
  const parsed = new Date(dateString);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Couldn't parse ${dateString} as a date`);
  }

  return parsed;
};

/**
 * Parse a time to that time, today
 */
export const parseTime = (timeString: string): Date => {
  const parsed = moment(timeString, "HH:mm", true);
  if (!parsed.isValid()) {
    throw new Error(`Couldn't parse ${timeString} as a time`);
  }

  return parsed.toDate();
};
