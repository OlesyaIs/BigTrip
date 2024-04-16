import AbstractView from '../framework/view/abstract-view.js';
import { getStringWithUpperCaseFirst } from '../utils/common-utils.js';

const createFilterTemplate = (filter, isChecked) =>
  `<div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}"${isChecked ? ' checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${filter}">${getStringWithUpperCaseFirst(filter)}</label>
  </div>`;

const createFilterListTemplate = (filters, defaultFilter) =>
  `<form class="trip-filters" action="#" method="get">
    ${filters
    .map((filter) => createFilterTemplate(filter, filter === defaultFilter))
    .join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class FilterView extends AbstractView {
  #filters = null;
  #defaultFilter = null;
  #handleFilterChange = null;

  constructor({filters, defaultFilter, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#defaultFilter = defaultFilter;
    this.#handleFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#onFilterChange);
  }

  get template() {
    return createFilterListTemplate(this.#filters, this.#defaultFilter);
  }

  #onFilterChange = (evt) => {
    if (!evt.target.value) {
      return;
    }

    evt.preventDefault();
    this.#handleFilterChange(evt.target.value);
  };
}
