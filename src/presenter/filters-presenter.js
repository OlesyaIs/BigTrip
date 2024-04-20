import { UpdateType } from '../const.js';
import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';

export default class FiltersPresenter {
  #filtersModel = null;

  #filtersContainer = null;
  #filtersComponent = null;

  #onFilterTypeChange = null;

  constructor({filtersModel, filtersContainer, onFilterChange}) {
    this.#filtersModel = filtersModel;
    this.#filtersContainer = filtersContainer;
    this.#onFilterTypeChange = onFilterChange;
  }

  get filters() {
    return this.#filtersModel.filters;
  }

  get currentFilter() {
    return this.#filtersModel.currentFilter;
  }

  init() {
    const previousFiltersComponent = this.#filtersComponent;

    this.#filtersComponent = new FilterView({
      filters: this.filters,
      currentFilter: this.currentFilter,
      onFilterChange: this.#handleFilterTypeChange
    });

    if (!previousFiltersComponent) {
      render(this.#filtersComponent, this.#filtersContainer);
      return;
    }

    if (this.#filtersContainer.element.contains(previousFiltersComponent)) {
      replace(this.#filtersComponent, previousFiltersComponent);
    }
  }

  destroy() {
    remove (this.#filtersComponent);
  }

  #handleFilterTypeChange = (newFilter) => {
    if (this.currentFilter === newFilter) {
      return;
    }

    this.#onFilterTypeChange();
    this.#filtersModel.setCurrentFilter(UpdateType.FULL, newFilter);
  };
}
