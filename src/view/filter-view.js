import AbstractView from '../framework/view/abstract-view.js';
import { getStringWithUpperCaseFirst } from '../utils/common-utils.js';

const createFilterTemplate = (filter, isAvailable, isChecked) =>
  `<div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${isAvailable ? '' : 'disabled'} ${isChecked ? ' checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${filter}">${getStringWithUpperCaseFirst(filter)}</label>
  </div>`;

const createFilterListTemplate = (filters, filterAvailability, currentFilter) =>
  `<form class="trip-filters" action="#" method="get">
    ${filters
    .map((filter) => createFilterTemplate(filter, filterAvailability[filter], filter === currentFilter))
    .join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class FilterView extends AbstractView {
  #filters = null;
  #filterAvailability = null;
  #currentFilter = null;
  #handleFilterChange = null;

  constructor({filters, filterAvailability, currentFilter, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#filterAvailability = filterAvailability;
    this.#currentFilter = currentFilter;
    this.#handleFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#onFilterChange);
  }

  get template() {
    return createFilterListTemplate(this.#filters, this.#filterAvailability, this.#currentFilter);
  }

  #onFilterChange = (evt) => {
    if (!evt.target.value) {
      return;
    }

    evt.preventDefault();
    this.#handleFilterChange(evt.target.value);
  };
}
