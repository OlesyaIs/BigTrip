import { RenderPosition, render } from '../framework/render.js';

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
  #filtersModel = null;
  #pointsModel = null;

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

  #renderTripInfo(container) {
    render(new TripInfoView(), container, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({pointListContainer: this.#pointsListComponent.element});
    pointPresenter.init(point, this.#destinations, this.#offerPack, this.#typePack);
  }

  #renderPointsDesk(currentFilter) {
    if (!this.#tripPoints.length) {
      render(new EmptyListMessageView({currentFilter}), this.#tripPointsContainer);
      return;
    }

    render(new SortView(), this.#tripPointsContainer);
    render(this.#pointsListComponent, this.#tripPointsContainer);

    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderPoint(this.#tripPoints[i]);
    }
  }

  #renderTrip() {
    this.#renderTripInfo(this.#tripInfoContainer);

    const FilterViewComponent = new FilterView({filters: this.#filters});
    const currentFilter = FilterViewComponent.element.querySelector('.trip-filters__filter-input[checked]');
    render(FilterViewComponent, this.#filterContainer);

    this.#renderPointsDesk(currentFilter);
  }
}
