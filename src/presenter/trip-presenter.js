import { RenderPosition, render } from '../framework/render.js';
import { updateItem } from '../utils/common-utils.js';

import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import EmptyListMessageView from '../view/empty-list-message-view.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #pointsListComponent = new PointsListView();
  #tripInfoContainer = null;
  #filterContainer = null;
  #tripPointsContainer = null;
  #filtersComponent = null;

  #filtersModel = null;
  #pointsModel = null;

  #pointPresenters = new Map();

  #filters = [];
  #tripPoints = [];
  #destinations = [];
  #offerPack = {};
  #typePack = {};

  constructor({tripInfoContainer, filterContainer, tripPointsContainer, filtersModel, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#filterContainer = filterContainer;
    this.#tripPointsContainer = tripPointsContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#filters = [...this.#filtersModel.filters];
    this.#tripPoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offerPack = structuredClone(this.#pointsModel.offerPack);
    this.#typePack = structuredClone(this.#pointsModel.typePack);

    this.#renderTrip();
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, this.#destinations, this.#offerPack, this.#typePack);
  };

  #renderTripInfo(container) {
    render(new TripInfoView(), container, RenderPosition.AFTERBEGIN);
  }

  #renderFilters(container) {
    this.#filtersComponent = new FilterView({filters: this.#filters});
    render(this.#filtersComponent, container);
  }

  #renderSort(container) {
    render(new SortView(), container);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handlePointChange,
    });
    pointPresenter.init(point, this.#destinations, this.#offerPack, this.#typePack);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPointList(container) {
    render(this.#pointsListComponent, container);

    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderPoint(this.#tripPoints[i]);
    }
  }

  #renderPointsDesk(container, currentFilter) {
    if (!this.#tripPoints.length) {
      render(new EmptyListMessageView({currentFilter}), container);
      return;
    }

    this.#renderSort(container);
    this.#renderPointList(container);
  }

  #renderTrip() {
    this.#renderTripInfo(this.#tripInfoContainer);
    this.#renderFilters(this.#filterContainer);

    const currentFilter = this.#filtersComponent.element.querySelector('.trip-filters__filter-input[checked]');
    this.#renderPointsDesk(this.#tripPointsContainer, currentFilter);
  }
}
