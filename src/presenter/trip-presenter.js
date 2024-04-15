import { RenderPosition, render } from '../framework/render.js';
import { FilterType } from '../const.js';
import { filterFunction } from '../utils/filter-utils.js';
import { SortType } from '../const.js';
import { sortFunction } from '../utils/sort-utils.js';
import { getTripRouteDestinations, getTripCost } from '../utils/trip-info-utils.js';

import TripInfoView from '../view/trip-info-view.js';
import TripRouteView from '../view/trip-route-view.js';
import TripCostView from '../view/trip-cost-view.js';
import FilterView from '../view/filter-view.js';
import PointsBoardPresenter from './points-board-presenter.js';

export default class TripPresenter {
  #filtersModel = null;
  #pointsModel = null;

  #points = [];
  #sourcedPoints = [];
  #sortedAllPoints = [];
  #filters = [];
  #destinations = [];
  #offerPack = {};
  #typePack = {};
  #currentFilter = null;

  #tripInfoContainer = null;
  #filterContainer = null;
  #pointsBoardContainer = null;
  #tripInfoComponent = null;
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
    this.#sourcedPoints = [...this.#pointsModel.points];
    this.#sortedAllPoints = sortFunction[SortType.DAY]([...this.#sourcedPoints]);
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offerPack = structuredClone(this.#pointsModel.offerPack);
    this.#typePack = structuredClone(this.#pointsModel.typePack);
    this.#currentFilter = FilterType.EVERYTHING;

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

    this.#tripInfoComponent = new TripInfoView();
    render(this.#tripInfoComponent, container, RenderPosition.AFTERBEGIN);
    render(new TripRouteView({
      destinationNames: getTripRouteDestinations(this.#sortedAllPoints, this.#destinations),
      timing: {
        dateFrom: this.#sortedAllPoints[0].dateFrom,
        dateTo: this.#sortedAllPoints[this.#sortedAllPoints.length - 1].dateTo,
      }}),
    this.#tripInfoComponent.element, RenderPosition.AFTERBEGIN);
    render(new TripCostView({cost: getTripCost(this.#sortedAllPoints, this.#offerPack)}), this.#tripInfoComponent.element);
  }

  #renderFilters(container) {
    this.#filtersComponent = new FilterView({filters: this.#filters, onFilterChange: this.#handleFilterChange});
    render(this.#filtersComponent, container);
  }

  #renderPointsBoard() {
    this.#pointsBoardPresenter = new PointsBoardPresenter({
      pointsBoardContainer: this.#pointsBoardContainer,
    });

    this.#pointsBoardPresenter.init(
      this.#points,
      this.#destinations,
      this.#offerPack,
      this.#typePack,
      this.#currentFilter
    );
  }

  #renderTripBoard() {
    this.#renderTripInfo(this.#tripInfoContainer);
    this.#renderFilters(this.#filterContainer);
    this.#renderPointsBoard();
  }
}
