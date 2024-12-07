// app/utils/dateConverter.js

export const convertToEthiopianDateMoreEnhanced = (gregorianDate) => {
  const ethiopianMonthNames = [
    "መስከረም",
    "ጥቅምት",
    "ህዳር",
    "ታህሳስ",
    "ጥር",
    "የካቲት",
    "መጋቢት",
    "ሚያዝያ",
    "ግንቦት",
    "ሰኔ",
    "ሀምሌ",
    "ነሀሴ",
    "ጳጉሜ",
  ];
  const ethiopianDayNames = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሀሙስ", "አርብ", "ቅዳሜ"];

  const year = gregorianDate.getFullYear();
  const month = gregorianDate.getMonth() + 1;
  const day = gregorianDate.getDate();

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const julianDay =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  const ethiopianEpoch = 1723856;
  const r = (julianDay - ethiopianEpoch) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  let ethYear =
    4 * Math.floor((julianDay - ethiopianEpoch) / 1461) +
    Math.floor(r / 365) -
    Math.floor(r / 1460);
  let ethMonth = Math.floor(n / 30) + 1;
  let ethDay = (n % 30) + 1;

  if (ethMonth === 13 && ethDay > 5) {
    if ((ethYear + 1) % 4 === 0) {
      if (ethDay === 6) {
        ethDay = 1;
        ethMonth = 1;
        ethYear++;
      }
    } else {
      ethDay = 1;
      ethMonth = 1;
      ethYear++;
    }
  }

  if (n === 365) {
    ethDay = 6;
    ethMonth = 13;
  }

  const ethMonthName = ethiopianMonthNames[ethMonth - 1];
  const gregorianDayOfWeek = gregorianDate.getDay();
  const ethDayName = ethiopianDayNames[gregorianDayOfWeek];

  return {
    year: ethYear,
    month: ethMonthName,
    day: ethDay,
    dayName: ethDayName,
  };
};
