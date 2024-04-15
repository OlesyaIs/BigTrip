import AbstractView from '../framework/view/abstract-view.js';
import { getMonth, getYear, formatToDayMonth, formatToDayOnly } from '../utils/date-utils.js';

const VISIBLE_DESTINATIONS_LIMIT = 3;

const createTripRouteTemplate = (destinations, timing) => {
  let destinationsTemplate = '';
  let followingDestinations = '';

  switch(true) {
    case destinations.length <= 0:
      break;

    case destinations.length > VISIBLE_DESTINATIONS_LIMIT:
      destinationsTemplate = `${destinations[0]} &mdash; ... &mdash; ${destinations[destinations.length - 1]}`;
      break;

    case destinations.length <= VISIBLE_DESTINATIONS_LIMIT:
      for (let i = 1; i < destinations.length; i++) {
        followingDestinations = `${followingDestinations} &mdash; ${destinations[i]}`;
      }

      destinationsTemplate = `${destinations[0]}${followingDestinations}`;
      break;
  }

  const dateFrom = timing.dateFrom;
  const dateTo = timing.dateTo;
  let dateTemplate = '';

  if (dateFrom && dateTo) {
    if (getMonth(dateFrom) === getMonth(dateTo) && getYear(dateFrom) === getYear(dateTo)) {
      dateTemplate = `${formatToDayOnly(dateFrom)}&nbsp;&mdash;&nbsp;${formatToDayMonth(dateTo)}`;
    } else {
      dateTemplate = `${formatToDayMonth(dateFrom)}&nbsp;&mdash;&nbsp;${formatToDayMonth(dateTo)}`;
    }
  }

  return `<div class="trip-info__main">
    ${destinationsTemplate ? `<h1 class="trip-info__title">${destinationsTemplate}</h1>` : ''}

    <p class="trip-info__dates">${dateTemplate}</p>
  </div>`;
};


export default class TripRouteView extends AbstractView {
  #destinations = [];
  #timing = null;

  constructor({destinationNames, timing}) {
    super();
    this.#destinations = destinationNames;
    this.#timing = timing;
  }

  get template() {
    return createTripRouteTemplate(this.#destinations, this.#timing);
  }
}
