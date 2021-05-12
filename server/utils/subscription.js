import { DateTime } from 'luxon';

export const firstDayOfCurrentBillingCycle = (subscriptionStart) => {
  let compareDate = DateTime.fromJSDate(subscriptionStart).startOf('day');
  const dateToday = DateTime.now().startOf('day');
  while (dateToday.diff(compareDate, 'days').days >= 30) {
    compareDate = compareDate.plus({ days: 30 });
  }
  return compareDate;
};
