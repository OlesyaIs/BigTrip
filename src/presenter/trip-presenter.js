import { filterFunction } from '../utils/filter-utils.js';
import { UserAction, UpdateType } from '../const.js';

import TripInfoPresenter from './trip-info-presenter.js';
import PointsBoardPresenter from './points-board-presenter.js';
import FiltersPresenter from './filters-presenter.js';

export default class TripPresenter {
  #filtersModel = null;
  #sortModel = null;
  #pointsModel = null;

  #destinations = [];
  #offerPack = {};
  #typePack = {};

  #tripInfoContainer = null;
  #filterContainer = null;
  #pointsBoardContainer = null;

  #tripInfoPresenter = null;
  #filtersPresenter = null;
  #pointsBoardPresenter = null;

  constructor({tripInfoContainer, filterContainer, tripPointsBoardContainer, filtersModel, sortModel, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#filterContainer = filterContainer;
    this.#pointsBoardContainer = tripPointsBoardContainer;

    this.#filtersModel = filtersModel;
    this.#sortModel = sortModel;
    this.#pointsModel = pointsModel;

    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#sortModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return [...this.#filtersModel.filters];
  }

  get currentFilter() {
    return this.#filtersModel.currentFilter;
  }

  get defaultSortType() {
    return this.#sortModel.defaultSortType;
  }

  get currentSortType() {
    return this.#sortModel.currentSortType;
  }

  set currentSortType(newSortType) {
    this.#sortModel.currentSortType = newSortType;
  }

  get points() {
    return [...this.#pointsModel.points];
  }

  get filteredPoints() {
    return filterFunction[this.currentFilter](this.points);
  }

  init() {
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offerPack = structuredClone(this.#pointsModel.offerPack);
    this.#typePack = structuredClone(this.#pointsModel.typePack);
    this.#renderTripBoard();
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

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.BOARD:
        this.#pointsBoardPresenter.init({
          points: this.filteredPoints
        });
        break;

      case UpdateType.BOARD_WITH_INFO:
        this.#tripInfoPresenter.init({points: this.points});
        this.#pointsBoardPresenter.init({
          points: this.filteredPoints
        });
        break;

      case UpdateType.FILTERS_WITH_BOARD:
        this.#filtersPresenter.init();
        this.#pointsBoardPresenter.init({
          points: this.filteredPoints,
          currentFilter: this.currentFilter
        });
    }
  };

  #handleFilterChange = () => {
    this.currentSortType = this.defaultSortType;
  };

  #renderTripInfo(container) {
    this.#tripInfoPresenter = new TripInfoPresenter({container});
    this.#tripInfoPresenter.init({
      points: this.points,
      destinations: this.#destinations,
      offerPack: this.#offerPack,
    });
  }

  #renderFilters(container) {
    this.#filtersPresenter = new FiltersPresenter({
      filtersModel: this.#filtersModel,
      filtersContainer: container,
      onFilterChange: this.#handleFilterChange,
    });

    this.#filtersPresenter.init();
  }

  #renderPointsBoard(container) {
    this.#pointsBoardPresenter = new PointsBoardPresenter({
      pointsBoardContainer: container,
      pointsModel: this.#pointsModel,
      sortModel: this.#sortModel
    });

    this.#pointsBoardPresenter.init({
      points: this.filteredPoints,
      destinations: this.#destinations,
      offerPack: this.#offerPack,
      typePack: this.#typePack,
      currentFilter: this.currentFilter,
      onDataChange: this.#handleViewAction
    });
  }

  #renderTripBoard() {
    this.#renderTripInfo(this.#tripInfoContainer);
    this.#renderFilters(this.#filterContainer);
    this.#renderPointsBoard(this.#pointsBoardContainer);
  }
}
