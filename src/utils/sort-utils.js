import { SortType } from '../const.js';
import { getDataDifferenceInDays, getDataDifference } from './date-utils.js';

const sortFunction = {
  [SortType.DAY.type]: (points) => points.sort((currentPoint, nextPoint) => getDataDifferenceInDays(nextPoint.dateFrom, currentPoint.dateFrom)),
  [SortType.TIME.type]: (points) => points.sort((currentPoint, nextPoint) => getDataDifference(nextPoint.dateFrom, nextPoint.dateTo) - getDataDifference(currentPoint.dateFrom, currentPoint.dateTo)),
  [SortType.PRICE.type]: (points) => points.sort((currentPoint, nextPoint) => nextPoint.basePrice - currentPoint.basePrice),
};

export { sortFunction };
