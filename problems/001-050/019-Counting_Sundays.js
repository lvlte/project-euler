/**
 * Problem 19 - Counting Sundays
 *
 * @see {@link https://projecteuler.net/problem=19}
 *
 * You are given the following information, but you may prefer to do some
 * research for yourself.
 *
 * - 1 Jan 1900 was a Monday.
 *
 * - Thirty days has September,
 *   April, June and November.
 *   All the rest have thirty-one,
 *   Saving February alone,
 *   Which has twenty-eight, rain or shine.
 *   And on leap years, twenty-nine.
 *
 * - A leap year occurs on any year evenly divisible by 4, but not on a century
 *   unless it is divisible by 400.
 *
 * How many Sundays fell on the first of the month during the twentieth century
 * (1 Jan 1901 to 31 Dec 2000)?
 */

this.solve = function () {

  const dayCount = function (month, year) {
    switch (month) {
      case 8:   // September
      case 3:   // April
      case 5:   // June
      case 10:  // and November
        return 30;
      case 1:    // February
        return isLeap(year) ? 29 : 28;
      default:
        return 31;
    }
  };

  const isLeap = function (year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  };

  // monday 1 Jan 1900 is day 0, 1 Jan 1901 is :
  const startDay = isLeap(1900) ? 366 : 365;

  // If 1 Jan 1900 was a monday (dayNum=0) then all days for which dayNum mod 7
  // is zero are mondays. Sundays correspond to dayNum for which mod 7 is 6.

  // Let's count starting from 1 Jan 1901 + offset (first sunday of year 1901).
  const offset = 6 - (startDay % 7);
  let date = [offset, 0, 1901];

  let sundayCount = 0;
  do {
    date[0] === 0 && sundayCount++;
    const monthDays = dayCount(date[1], date[2]);
    date[0] += 7;
    if (date[0] < monthDays)
      continue;
    date[0] -= monthDays;
    if (++date[1] > 11) {
      date[1] = 0;
      date[2]++;
    }
  }
  while (date[2] < 2001);

  return sundayCount;
}
