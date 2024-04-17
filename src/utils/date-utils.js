import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
// const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

// Get
const getMonth = (date) => dayjs(date).month();
const getYear = (date) => dayjs(date).year();

// Date formatting
const TIME_FORMAT = 'HH:mm';
const SHORT_DATE_FORMAT = 'MMM DD';
const FULL_DATE_FORMAT = 'DD/MM/YY HH:mm';

const DAY_MONTH_FORMAT = 'DD MMM';
const DAY_ONLY_FORMAT = 'DD';

const formatSomeDate = (date, format) => date ? dayjs(date).format(format ? format : '') : '';

const formatFullDate = (date) => formatSomeDate(date);
const huminizeFullDate = (date) => formatSomeDate(date, FULL_DATE_FORMAT);
const formatDate = (date) => formatSomeDate(date, SHORT_DATE_FORMAT);
const formatTime = (date) => formatSomeDate(date, TIME_FORMAT);

const formatToDayMonth = (date) => formatSomeDate(date, DAY_MONTH_FORMAT);
const formatToDayOnly = (date) => formatSomeDate(date, DAY_ONLY_FORMAT);

// Duration
const getDuration = (startDate, endDate) => dayjs.duration(dayjs(endDate).diff(dayjs(startDate)));

// Functions for Difference
const getDataDifference = (startDate, endDate) => dayjs(endDate).diff(dayjs(startDate));
// const getDataDifferenceInDays = (startDate, endDate) => dayjs(endDate).diff(dayjs(startDate), 'day');
const getDataDifferenceInDays = (startDate, endDate) => {
  const date1 = dayjs(startDate);
  const date2 = dayjs(endDate);
  return date2.diff(date1, 'day');
};

export {
  getMonth,
  getYear,
  formatFullDate,
  huminizeFullDate,
  formatDate,
  formatTime,
  formatToDayMonth,
  formatToDayOnly,
  getDuration,
  getDataDifference,
  getDataDifferenceInDays,
};
