import { RenderPosition, render } from '../framework/render.js';
import { updateItem } from '../utils/common-utils.js';
import { SortType } from '../const.js';
import { sort } from '../utils/sort-utils.js';

import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import EmptyListMessageView from '../view/empty-list-message-view.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #filtersModel = null;
  #pointsModel = null;

  #points = [];
  #defaultSortedPoints = [];
  #filters = [];
  #destinations = [];
  #offerPack = {};
  #typePack = {};

  #currentSortType = SortType.DAY;

  #pointsListComponent = new PointsListView();
  #tripInfoContainer = null;
  #filterContainer = null;
  #tripPointsBoardContainer = null;
  #filtersComponent = null;

  #pointPresenters = new Map();

  constructor({tripInfoContainer, filterContainer, tripPointsBoardContainer, filtersModel, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#filterContainer = filterContainer;
    this.#tripPointsBoardContainer = tripPointsBoardContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#filters = [...this.#filtersModel.filters];
    this.#defaultSortedPoints = sort[SortType.DAY]([...this.#pointsModel.points]);
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offerPack = structuredClone(this.#pointsModel.offerPack);
    this.#typePack = structuredClone(this.#pointsModel.typePack);

    this.#sortPoints(this.#currentSortType);
    this.#points = [...this.#defaultSortedPoints];
    this.#renderTrip();
  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.TIME:
        this.#points = sort[SortType.TIME]([...this.#defaultSortedPoints]);
        break;
      case SortType.PRICE:
        this.#points = sort[SortType.PRICE]([...this.#defaultSortedPoints]);
        break;
      default:
        this.#points = [...this.#defaultSortedPoints];
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointList();
    this.#currentSortType = sortType;
  };

  #clearPointsList() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, this.#destinations, this.#offerPack, this.#typePack);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderTripInfo(container) {
    render(new TripInfoView(), container, RenderPosition.AFTERBEGIN);
  }

  #renderFilters(container) {
    this.#filtersComponent = new FilterView({filters: this.#filters});
    render(this.#filtersComponent, container);
  }

  #renderSort() {
    render(new SortView({onSortTypeChange: this.#handleSortTypeChange}), this.#tripPointsBoardContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point, this.#destinations, this.#offerPack, this.#typePack);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPointList() {
    render(this.#pointsListComponent, this.#tripPointsBoardContainer);

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #renderPointsDesk(currentFilter) {
    if (!this.#points.length) {
      render(new EmptyListMessageView({currentFilter}), this.#tripPointsBoardContainer);
      return;
    }

    this.#renderSort();
    this.#renderPointList();
  }

  #renderTrip() {
    this.#renderTripInfo(this.#tripInfoContainer);
    this.#renderFilters(this.#filterContainer);

    const currentFilter = this.#filtersComponent.element.querySelector('.trip-filters__filter-input[checked]');
    this.#renderPointsDesk(currentFilter);
  }
}
