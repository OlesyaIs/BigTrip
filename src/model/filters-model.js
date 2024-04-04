import { FilterType } from '../const.js';

export default class FiltersModel {
  #filters = Object.entries(FilterType).map((filtersPair) => filtersPair[1]);

  get filters() {
    return this.#filters;
  }
}
