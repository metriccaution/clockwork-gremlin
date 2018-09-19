// TODO - More rigorous/flexible date parsing

export const parseDate = (dateString: string): Date => {
  const parsed = new Date(dateString);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Couldn't parse ${dateString} as a date`);
  }

  return parsed;
};
