import { RenderPosition, render, replace, remove } from '../framework/render.js';
import { getTripRouteDestinations, getTripCost } from '../utils/trip-info-utils.js';
import { SortType } from '../const.js';
import { sortFunction } from '../utils/sort-utils.js';

import TripInfoView from '../view/trip-info-view.js';
import TripRouteView from '../view/trip-route-view.js';
import TripCostView from '../view/trip-cost-view.js';

export default class TripInfoPresenter {
  #sortedPoints = [];
  #destinations = [];
  #offerPack = {};

  #tripInfoContainer = null;
  #tripInfoComponent = null;
  #tripRouteComponent = null;
  #tripCostComponent = null;

  constructor({container}) {
    this.#tripInfoContainer = container;
  }

  init({points, destinations, offerPack}) {
    this.#sortedPoints = sortFunction[SortType.DAY]([...points]);
    this.#destinations = destinations;
    this.#offerPack = offerPack;

    const previousInfoComponent = this.#tripInfoComponent;
    const previousRouteComponent = this.#tripRouteComponent;
    const previousCostComponent = this.#tripCostComponent;

    this.#tripRouteComponent = new TripRouteView({
      destinationNames: getTripRouteDestinations(this.#sortedPoints, this.#destinations),
      timing: {
        dateFrom: this.#sortedPoints[0].dateFrom,
        dateTo: this.#sortedPoints[this.#sortedPoints.length - 1].dateTo,
      }
    });

    this.#tripCostComponent = new TripCostView({cost: getTripCost(this.#sortedPoints, this.#offerPack)});

    if (!previousInfoComponent) {
      this.#tripInfoComponent = new TripInfoView();
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      render(this.#tripRouteComponent, this.#tripInfoComponent.element, RenderPosition.AFTERBEGIN);
      render(this.#tripCostComponent, this.#tripInfoComponent.element);
      return;
    }

    if (this.#tripInfoComponent.element.contains(previousRouteComponent)) {
      replace(this.#tripRouteComponent, previousRouteComponent);
    }

    if (this.#tripInfoComponent.element.contains(previousCostComponent)) {
      replace(this.#tripCostComponent, previousCostComponent);
    }
  }

  destroy() {
    remove(this.#tripInfoComponent);
    remove(this.#tripRouteComponent);
    remove(this.#tripCostComponent);
  }
}
