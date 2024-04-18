import { render } from '../framework/render.js';
import { filterFunction } from '../utils/filter-utils.js';

import FilterView from '../view/filter-view.js';

import TripInfoPresenter from './trip-info-presenter.js';
import PointsBoardPresenter from './points-board-presenter.js';

export default class TripPresenter {
  #filtersModel = null;
  #sortModel = null;
  #pointsModel = null;

  #points = [];
  #sourcedPoints = [];
  #filters = [];
  #destinations = [];
  #offerPack = {};
  #typePack = {};
  #currentFilter = null;

  #tripInfoContainer = null;
  #filterContainer = null;
  #pointsBoardContainer = null;
  #filtersComponent = null;

  #tripInfoPresenter = null;
  #pointsBoardPresenter = null;

  constructor({tripInfoContainer, filterContainer, tripPointsBoardContainer, filtersModel, sortModel, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#filterContainer = filterContainer;
    this.#pointsBoardContainer = tripPointsBoardContainer;
    this.#filtersModel = filtersModel;
    this.#sortModel = sortModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#filters = [...this.#filtersModel.filters];
    this.#sourcedPoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offerPack = structuredClone(this.#pointsModel.offerPack);
    this.#typePack = structuredClone(this.#pointsModel.typePack);
    this.#currentFilter = this.#filtersModel.defaultFilter;

    this.#filterPoints();
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

    this.#filterPoints();
    this.#clearPointsBoard();
    this.#renderPointsBoard();
  };

  #filterPoints = () => {
    this.#points = filterFunction[this.#currentFilter](this.#sourcedPoints);
  };

  #renderTripInfo(container) {
    this.#tripInfoPresenter = new TripInfoPresenter({container});
    this.#tripInfoPresenter.init({
      points: this.#points,
      destinations: this.#destinations,
      offerPack: this.#offerPack,
    });
  }

  #renderFilters(container) {
    this.#filtersComponent = new FilterView({filters: this.#filters, defaultFilter: this.#filtersModel.defaultFilter, onFilterChange: this.#handleFilterChange});
    render(this.#filtersComponent, container);
  }

  #renderPointsBoard() {
    this.#pointsBoardPresenter = new PointsBoardPresenter({
      pointsBoardContainer: this.#pointsBoardContainer,
      sortModel: this.#sortModel
    });

    this.#pointsBoardPresenter.init({
      points: this.#points,
      destinations: this.#destinations,
      offerPack: this.#offerPack,
      typePack: this.#typePack,
      currentFilter: this.#currentFilter
    });
  }

  #renderTripBoard() {
    this.#renderTripInfo(this.#tripInfoContainer);
    this.#renderFilters(this.#filterContainer);
    this.#renderPointsBoard();
  }
}
