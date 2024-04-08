import { SortType } from '../const.js';
import { getDataDifferenceInDays, getDataDifference } from './date-utils.js';

const sort = {
  [SortType.DAY]: (points) => points.sort((currentPoint, nextPoint) => getDataDifferenceInDays(nextPoint.dateFrom, currentPoint.dateFrom)),
  [SortType.TIME]: (points) => points.sort((currentPoint, nextPoint) => getDataDifference(nextPoint.dateFrom, nextPoint.dateTo) - getDataDifference(currentPoint.dateFrom, currentPoint.dateTo)),
  [SortType.PRICE]: (points) => points.sort((currentPoint, nextPoint) => nextPoint.basePrice - currentPoint.basePrice),
};

export { sort };
