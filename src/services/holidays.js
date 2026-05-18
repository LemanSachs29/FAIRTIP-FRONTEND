const UK_PUBLIC_HOLIDAYS_URL = 'https://date.nager.at/api/v3/PublicHolidays/2026/GB';
const ENGLAND_COUNTY_CODE = 'GB-ENG';

function getTodayIsoDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

async function getUpcomingUkHoliday() {
  const res = await fetch(UK_PUBLIC_HOLIDAYS_URL);

  if (!res.ok) {
    throw new Error('Failed to load public holidays');
  }

  const holidays = await res.json();
  const today = getTodayIsoDate();

  return getNextUpcomingHoliday(holidays, today);
}

function isRelevantUkHoliday(holiday) {
  return holiday.global === true || holiday.counties?.includes(ENGLAND_COUNTY_CODE);
}

function isFutureHoliday(holiday, today) {
  return holiday.date > today;
}

function getNextUpcomingHoliday(holidays, today) {
  return holidays
    .filter((holiday) => isRelevantUkHoliday(holiday) && isFutureHoliday(holiday, today))
    .sort((a, b) => a.date.localeCompare(b.date))[0] || null;
}

export { getUpcomingUkHoliday };
