import { FilterType } from '../const.js';

export default class FiltersModel {
  #filterPack = structuredClone(FilterType);
  #filters = Object.entries(this.#filterPack).map((filtersPair) => filtersPair[1]);
  #defaultFilter = this.#filterPack.EVERYTHING;

  get filters() {
    return this.#filters;
  }

  set filters(newFilterPack) {
    this.#filterPack = newFilterPack;
  }

  get defaultFilter() {
    return this.#defaultFilter;
  }
}
