import AbstractView from '../framework/view/abstract-view.js';
import { getStringWithUpperCaseFirst } from '../utils/common-utils.js';

const createFilterTemplate = (filter, isChecked) => {
  const checkedAttribute = isChecked ? ' checked' : '';
  return `<div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}"${checkedAttribute}>
    <label class="trip-filters__filter-label" for="filter-${filter}">${getStringWithUpperCaseFirst(filter)}</label>
  </div>`;
};

const createFilterListTemplate = (filters) =>
  `<form class="trip-filters" action="#" method="get">
    ${filters
    .map((filter, index) => createFilterTemplate(filter, index === 0))
    .join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class FilterView extends AbstractView {
  #filters = null;
  #handleFilterChange = null;

  constructor({filters, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#handleFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#onFilterChange);
  }

  get template() {
    return createFilterListTemplate(this.#filters);
  }

  #onFilterChange = (evt) => {
    if (!evt.target.value) {
      return;
    }

    evt.preventDefault();
    this.#handleFilterChange(evt.target.value);
  };
}
