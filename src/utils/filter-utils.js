import { FilterType } from '../const.js';

const isFuture = (point, currentDate) => point.dateFrom > currentDate;
const isPresent = (point, currentDate) => (point.dateFrom <= currentDate) && (point.dateTo >= currentDate);
const isPast = (point, currentDate) => point.dateTo < currentDate;

const filterFunction = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => {
    const currentDate = new Date();
    return points.filter((point) => isFuture(point, currentDate));
  },
  [FilterType.PRESENT]: (points) => {
    const currentDate = new Date();
    return points.filter((point) => isPresent(point, currentDate));
  },
  [FilterType.PAST]: (points) => {
    const currentDate = new Date();
    return points.filter((point) => isPast(point, currentDate));
  },
};

const getFilterAvailability = (filters, points) => {
  const filterAvailability = {};

  filters.forEach((filter) => {
    filterAvailability[filter] = false;

    if (filter === FilterType.EVERYTHING) {
      filterAvailability[filter] = true;
      return;
    }

    const filteredPoint = filterFunction[filter](points);
    if (filteredPoint.length > 0) {
      filterAvailability[filter] = true;
    }
  });

  return filterAvailability;
};

export { filterFunction, getFilterAvailability };
