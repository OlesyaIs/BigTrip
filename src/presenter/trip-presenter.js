import { render } from '../framework/render.js';
import { filterFunction } from '../utils/filter-utils.js';
import { UserAction, UpdateType } from '../const.js';

import FilterView from '../view/filter-view.js';

import TripInfoPresenter from './trip-info-presenter.js';
import PointsBoardPresenter from './points-board-presenter.js';

export default class TripPresenter {
  #filtersModel = null;
  #sortModel = null;
  #pointsModel = null;

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

    this.#pointsModel.addObserver(this.#handlePointsModelEvent);
  }

  get points() {
    return [...this.#pointsModel.points];
  }

  get filteredPoints() {
    return filterFunction[this.#currentFilter](this.points);
  }

  init() {
    this.#filters = [...this.#filtersModel.filters];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offerPack = structuredClone(this.#pointsModel.offerPack);
    this.#typePack = structuredClone(this.#pointsModel.typePack);
    this.#currentFilter = this.#filtersModel.defaultFilter;

    this.#renderTripBoard();
  }

  #clearPointsBoard() {
    this.#pointsBoardPresenter.destroy();
    this.#pointsBoardPresenter = null;
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;

      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;

      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handlePointsModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.MAJOR_MINOR:
        this.#tripInfoPresenter.init({points: this.points});
        break;

      case UpdateType.MINOR_MAJOR:
        this.#clearPointsBoard();
        this.#renderPointsBoard(this.#sortModel.currentType);
        break;

      case UpdateType.MAJOR_MAJOR:
        this.#clearPointsBoard();
        this.#renderPointsBoard(this.#sortModel.currentType);
        this.#tripInfoPresenter.init({points: this.points});
        break;
    }
  };

  #handleFilterChange = (newFilter) => {
    if (newFilter === this.#currentFilter) {
      return;
    }

    this.#currentFilter = newFilter;

    this.#clearPointsBoard();
    this.#renderPointsBoard();
  };

  // #handleSortTypeChange = (newSortType) => {

  // };

  #renderTripInfo(container) {
    this.#tripInfoPresenter = new TripInfoPresenter({container});
    this.#tripInfoPresenter.init({
      points: this.points,
      destinations: this.#destinations,
      offerPack: this.#offerPack,
    });
  }

  #renderFilters(container) {
    this.#filtersComponent = new FilterView({filters: this.#filters, defaultFilter: this.#filtersModel.defaultFilter, onFilterChange: this.#handleFilterChange});
    render(this.#filtersComponent, container);
  }

  #renderPointsBoard(currentSortType = this.#sortModel.defaultType) {
    this.#pointsBoardPresenter = new PointsBoardPresenter({
      pointsBoardContainer: this.#pointsBoardContainer,
      pointsModel: this.#pointsModel,
      sortModel: this.#sortModel
    });

    this.#pointsBoardPresenter.init({
      points: this.filteredPoints,
      destinations: this.#destinations,
      offerPack: this.#offerPack,
      typePack: this.#typePack,
      currentFilter: this.#currentFilter,
      onDataChange: this.#handleViewAction,
      currentSortType
    });
  }

  #renderTripBoard() {
    this.#renderTripInfo(this.#tripInfoContainer);
    this.#renderFilters(this.#filterContainer);
    this.#renderPointsBoard();
  }
}
