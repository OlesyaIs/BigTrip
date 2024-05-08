import { UpdateType } from '../const.js';
import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';

export default class FiltersPresenter {
  #filtersModel = null;

  #filtersContainer = null;
  #filtersComponent = null;

  #onFilterTypeChange = null;
  #filterAvailability = null;

  constructor({filtersModel, filtersContainer, onFilterChange}) {
    this.#filtersModel = filtersModel;
    this.#filtersContainer = filtersContainer;
    this.#onFilterTypeChange = onFilterChange;
  }

  get filters() {
    return [...this.#filtersModel.filters];
  }

  init({filterAvailability = this.#filterAvailability}) {
    const previousFiltersComponent = this.#filtersComponent;
    this.#filterAvailability = filterAvailability;

    this.#filtersComponent = new FilterView({
      filters: this.filters,
      filterAvailability: this.#filterAvailability,
      currentFilter: this.#filtersModel.currentFilter,
      onFilterChange: this.#handleFilterTypeChange
    });

    if (!previousFiltersComponent) {
      render(this.#filtersComponent, this.#filtersContainer);
      return;
    }

    if (this.#filtersContainer.contains(previousFiltersComponent.element)) {
      replace(this.#filtersComponent, previousFiltersComponent);
    }
  }

  destroy() {
    remove (this.#filtersComponent);
  }

  #handleFilterTypeChange = (newFilter) => {
    if (this.#filtersModel.currentFilter === newFilter) {
      return;
    }

    this.#onFilterTypeChange();
    this.#filtersModel.setCurrentFilter(UpdateType.FILTERS_WITH_BOARD, newFilter);
  };
}
