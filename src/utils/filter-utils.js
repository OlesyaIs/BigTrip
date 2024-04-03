import { FilterType } from '../const.js';
import { isTaskInFuture, isTaskLastToday as isTaskInPresent, isTaskExpired } from './task-utils.js';

const FilterFunction = {
  [FilterType.EVERYTHING]: (tasks) => tasks,
  [FilterType.FUTURE]: (tasks) => tasks.filter((task) => isTaskInFuture(task)),
  [FilterType.PRESENT]: (tasks) => tasks.filter((task) => isTaskInPresent(task)),
  [FilterType.PAST]: (tasks) => tasks.filter((task) => isTaskExpired(task)),
};
