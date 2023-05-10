import { DateTime } from 'luxon'

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return DateTime.fromJSDate(date1).equals(DateTime.fromJSDate(date2))
}
