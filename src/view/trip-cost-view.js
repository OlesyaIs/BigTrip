import AbstractView from '../framework/view/abstract-view.js';

const createTripCostTemplate = (cost) =>
  `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>`;

export default class TripCostView extends AbstractView {
  #cost = null;

  constructor({cost}) {
    super();
    this.#cost = cost;
  }

  get template() {
    return createTripCostTemplate(this.#cost);
  }
}
