import { RenderPosition, render } from '../framework/render.js';
import { FilterType } from '../const.js';

import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import PointsBoardPresenter from './points-board-presenter.js';

export default class TripPresenter {
  #filtersModel = null;
  #pointsModel = null;

  #points = [];
  #filters = [];
  #destinations = [];
  #offerPack = {};
  #typePack = {};
  #currentFilter = null;

  #tripInfoContainer = null;
  #filterContainer = null;
  #pointsBoardContainer = null;
  #filtersComponent = null;

  #pointsBoardPresenter = null;

  constructor({tripInfoContainer, filterContainer, tripPointsBoardContainer, filtersModel, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#filterContainer = filterContainer;
    this.#pointsBoardContainer = tripPointsBoardContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#filters = [...this.#filtersModel.filters];
    this.#points = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offerPack = structuredClone(this.#pointsModel.offerPack);
    this.#typePack = structuredClone(this.#pointsModel.typePack);
    this.#currentFilter = FilterType.EVERYTHING;
    this.#pointsBoardPresenter = new PointsBoardPresenter({
      pointsBoardContainer: this.#pointsBoardContainer,
    });

    this.#renderTripBoard();
  }

  #clearPointsBoard() {
    this.#pointsBoardPresenter.destroy();
    this.#pointsBoardPresenter = null;
  }

  #handleFilterChange = (newFilter) => {
    if (newFilter === this.#currentFilter) {
      return;
    }

    this.#currentFilter = newFilter;
    this.#pointsBoardPresenter.init(this.#points, this.#destinations, this.#offerPack, this.#typePack, newFilter);
  };

  #renderTripInfo(container) {
    render(new TripInfoView(), container, RenderPosition.AFTERBEGIN);
  }

  #renderFilters(container) {
    this.#filtersComponent = new FilterView({filters: this.#filters, onFilterChange: this.#handleFilterChange});
    render(this.#filtersComponent, container);
  }

  #renderTripBoard() {
    this.#renderTripInfo(this.#tripInfoContainer);
    this.#renderFilters(this.#filterContainer);
    this.#pointsBoardPresenter.init(this.#points, this.#destinations, this.#offerPack, this.#typePack, this.#currentFilter);
  }
}
