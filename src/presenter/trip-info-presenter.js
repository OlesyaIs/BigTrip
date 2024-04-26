import { RenderPosition, render, replace, remove } from '../framework/render.js';
import { getTripRouteDestinations, getTripCost } from '../utils/trip-info-utils.js';
import { SortType } from '../const.js';
import { sortFunction } from '../utils/sort-utils.js';

import TripInfoView from '../view/trip-info-view.js';
import TripRouteView from '../view/trip-route-view.js';
import TripCostView from '../view/trip-cost-view.js';

export default class TripInfoPresenter {
  #sortedPoints = [];
  #pointsModel = null;

  #tripInfoContainer = null;
  #tripInfoComponent = null;
  #tripRouteComponent = null;
  #tripCostComponent = null;

  constructor({container, pointsModel}) {
    this.#tripInfoContainer = container;
    this.#pointsModel = pointsModel;
  }

  get destinations() {
    return [...this.#pointsModel.destinations];
  }

  get offerPack() {
    return {...this.#pointsModel.offerPack};
  }

  init({points}) {
    if (points.length === 0) {
      this.destroy();
      this.#tripInfoComponent = null;
      this.#tripRouteComponent = null;
      this.#tripCostComponent = null;
      return;
    }

    this.#sortedPoints = sortFunction[SortType.DAY.type]([...points]);
    const previousInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView();

    this.#tripRouteComponent = new TripRouteView({
      destinationNames: getTripRouteDestinations(this.#sortedPoints, this.destinations),
      timing: {
        dateFrom: this.#sortedPoints[0].dateFrom,
        dateTo: this.#sortedPoints[this.#sortedPoints.length - 1].dateTo,
      }
    });

    this.#tripCostComponent = new TripCostView({cost: getTripCost(this.#sortedPoints, this.offerPack)});

    if (!previousInfoComponent || !this.#tripInfoContainer.contains(previousInfoComponent.element)) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      render(this.#tripRouteComponent, this.#tripInfoComponent.element, RenderPosition.AFTERBEGIN);
      render(this.#tripCostComponent, this.#tripInfoComponent.element);
      return;
    }

    replace(this.#tripInfoComponent, previousInfoComponent);
    render(this.#tripRouteComponent, this.#tripInfoComponent.element, RenderPosition.AFTERBEGIN);
    render(this.#tripCostComponent, this.#tripInfoComponent.element);
  }

  destroy() {
    remove(this.#tripInfoComponent);
    remove(this.#tripRouteComponent);
    remove(this.#tripCostComponent);
  }
}
