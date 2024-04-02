import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
// const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);


// Date formatting
const SHORT_DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const FULL_DATE_FORMAT = 'DD/MM/YY HH:mm';

const formatSomeDate = (date, format) => date ? dayjs(date).format(format ? format : '') : '';

const formatFullDate = (date) => formatSomeDate(date);
const huminizeFullDate = (date) => formatSomeDate(date, FULL_DATE_FORMAT);
const formatDate = (date) => formatSomeDate(date, SHORT_DATE_FORMAT);
const formatTime = (date) => formatSomeDate(date, TIME_FORMAT);

// Functions for duration
const getDuration = (startDate, endDate) => dayjs.duration(dayjs(endDate).diff(dayjs(startDate)));

export {
  formatFullDate,
  huminizeFullDate,
  formatDate,
  formatTime,
  getDuration,
};
