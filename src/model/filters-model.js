import { FilterType } from '../const.js';
import Observable from '../framework/observable.js';

export default class FiltersModel extends Observable {
  #filterPack = structuredClone(FilterType);
  #filters = Object.entries(this.#filterPack).map((filtersPair) => filtersPair[1]);
  #currentFilter = this.#filterPack.EVERYTHING;

  get filters() {
    return this.#filters;
  }

  set filters(newFilterPack) {
    this.#filterPack = newFilterPack;
  }

  get currentFilter() {
    return this.#currentFilter;
  }

  setCurrentFilter(updateType, newFilter) {
    this.#currentFilter = newFilter;
    this._notify(updateType, newFilter);
  }
}
