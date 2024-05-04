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
  #addNewPointButtonElement = null;

  #tripInfoPresenter = null;
  #filtersPresenter = null;
  #pointsBoardPresenter = null;

  constructor({tripInfoContainer, filterContainer, tripPointsBoardContainer, addNewPointButtonElement, filtersModel, sortModel, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#filterContainer = filterContainer;
    this.#pointsBoardContainer = tripPointsBoardContainer;
    this.#addNewPointButtonElement = addNewPointButtonElement;

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

  get points() {
    return [...this.#pointsModel.points];
  }

  get filteredPoints() {
    return filterFunction[this.#filtersModel.currentFilter](this.points);
  }

  init() {
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offerPack = structuredClone(this.#pointsModel.offerPack);
    this.#typePack = structuredClone(this.#pointsModel.typePack);
    this.#renderTripBoard();

    this.#addNewPointButtonElement.addEventListener('click', this.#onAddNewPointClick);
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
        this.#pointsBoardPresenter.destroy();
        this.#pointsBoardPresenter.init({
          points: this.filteredPoints
        });
        break;

      case UpdateType.BOARD_WITH_INFO:
        this.#tripInfoPresenter.init({points: this.points});
        this.#pointsBoardPresenter.destroy();
        this.#pointsBoardPresenter.init({
          points: this.filteredPoints
        });
        break;

      case UpdateType.FILTERS_WITH_BOARD:
        this.#filtersPresenter.init();
        this.#pointsBoardPresenter.destroy();
        this.#pointsBoardPresenter.init({
          points: this.filteredPoints,
          currentFilter: this.#filtersModel.currentFilter
        });
        break;

      case UpdateType.INIT:
        this.#tripInfoPresenter.init({points: this.points});
        this.#pointsBoardPresenter.destroy();
        this.#pointsBoardPresenter.init({
          points: this.filteredPoints,
          isLoading: false
        });
        break;
    }
  };

  #handleFilterChange = () => {
    this.#sortModel.currentSortType = this.#sortModel.defaultSortType;
  };

  #onAddNewPointClick = () => {
    this.#sortModel.currentSortType = this.#sortModel.defaultSortType;
    this.#filtersModel.setCurrentFilter(UpdateType.FILTERS_WITH_BOARD, this.#filtersModel.defaultFilter);
    this.#pointsBoardPresenter.createNewPoint();
    this.#addNewPointButtonElement.disabled = true;
  };

  #handleNewPointDestroy = () => {
    this.#pointsBoardPresenter.destroy();
    this.#pointsBoardPresenter.init({points: this.filteredPoints});
    this.#addNewPointButtonElement.disabled = false;
  };

  #renderTripInfo(container) {
    this.#tripInfoPresenter = new TripInfoPresenter({container, pointsModel: this.#pointsModel});
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
      sortModel: this.#sortModel,
      onDataChange: this.#handleViewAction,
      onNewPointDestroy: this.#handleNewPointDestroy
    });

    this.#pointsBoardPresenter.init({
      points: this.filteredPoints,
      destinations: this.#destinations,
      offerPack: this.#offerPack,
      typePack: this.#typePack,
      currentFilter: this.#filtersModel.currentFilter,

    });
  }

  #renderTripBoard() {
    this.#renderTripInfo(this.#tripInfoContainer);
    this.#renderFilters(this.#filterContainer);
    this.#renderPointsBoard(this.#pointsBoardContainer);
  }
}
