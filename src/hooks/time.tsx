import { DateTime } from "luxon";

export const dateTime = (date: string) => {
  let dateTime = DateTime.fromISO(date);
  return dateTime.toLocaleString(DateTime.DATETIME_MED);
};

export const onlyTime = (date: string) => {
  let dateTime = DateTime.fromISO(date);
  return dateTime.toLocaleString(DateTime.TIME_24_SIMPLE);
};

export const onlyDate = (date: string) => {
  let dateTime = DateTime.fromISO(date);
  return dateTime.toLocaleString(DateTime.DATE_FULL);
};
