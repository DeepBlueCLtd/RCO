export const isSameDate = (date1: Date, date2: Date): boolean =>
  new Date(date1).toISOString() === new Date(date2).toISOString()
