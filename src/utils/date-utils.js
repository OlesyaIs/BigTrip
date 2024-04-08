import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
// const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

// Date formatting
const TIME_FORMAT = 'HH:mm';
const SHORT_DATE_FORMAT = 'MMM D';
const FULL_DATE_FORMAT = 'DD/MM/YY HH:mm';

const formatSomeDate = (date, format) => date ? dayjs(date).format(format ? format : '') : '';

const formatFullDate = (date) => formatSomeDate(date);
const huminizeFullDate = (date) => formatSomeDate(date, FULL_DATE_FORMAT);
const formatDate = (date) => formatSomeDate(date, SHORT_DATE_FORMAT);
const formatTime = (date) => formatSomeDate(date, TIME_FORMAT);

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
  formatFullDate,
  huminizeFullDate,
  formatDate,
  formatTime,
  getDuration,
  getDataDifference,
  getDataDifferenceInDays,
};
