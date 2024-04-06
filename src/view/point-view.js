import AbstractView from '../framework/view/abstract-view.js';
import { getInteger, getStringWithUpperCaseFirst } from '../utils/common-utils.js';
import { formatFullDate, formatDate, formatTime, getDuration } from '../utils/date-utils.js';
import { ButtonFavoriteClassName } from '../const.js';

const createDateTemplate = (startDate) => `<time class="event__date" datetime=${formatFullDate(startDate)}>${formatDate(startDate)}</time>`;

const createTypeTemplate = (type) => (
  `<div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
  </div>`
);

const createTitleTemplate = (type, name) => `<h3 class="event__title">${getStringWithUpperCaseFirst(type)} ${name}</h3>`;


const createScheduleTemplate = (startDate, endDate) => {
  const difference = getDuration(startDate, endDate);
  const days = difference.format('DD');
  const hours = difference.format('HH');
  const minutes = difference.format('mm');

  const daysTemplate = getInteger(days) ? `${days}D` : '';
  const hoursTemplate = !(getInteger(days) || getInteger(hours)) ? '' : `${hours}H`;
  const minutesTemplate = `${minutes}M`;

  return (
    `<div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime=${formatFullDate(startDate)}>${formatTime(startDate)}</time>
        &mdash;
        <time class="event__end-time" datetime=${formatFullDate(endDate)}>${formatTime(endDate)}</time>
      </p>
      <p class="event__duration">
        ${daysTemplate} ${hoursTemplate} ${minutesTemplate}
      </p>
    </div>`
  );
};

const createPriceTemplate = (price) => (
  `<p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${price}</span>
  </p>`
);

const createOffersTemplate = (currentOffersIds, fullOffers) => {
  const createOfferTemplate = (offerId) => {
    const currentOffer = fullOffers.find((offer) => offer.id === offerId);
    const offerTemplate = currentOffer
      ? `<li class="event__offer">
      <span class="event__offer-title">${currentOffer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${currentOffer.price}</span>
      </li>`
      : '';

    return offerTemplate;
  };

  const offersTemplate = !(currentOffersIds.length)
    ? ''
    : `<h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${currentOffersIds.map((offerId) => createOfferTemplate(offerId)).join('')}
    </ul>`;

  return offersTemplate;
};

const createButtonFavoriteTemplate = (isFavorite) => {
  const isFavoriteClassname = isFavorite ? `${ButtonFavoriteClassName.BASE} ${ButtonFavoriteClassName.ACTIVE}` : ButtonFavoriteClassName.BASE;

  return (
    `<button class="${isFavoriteClassname}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>`
  );
};

const createPointTemplate = (point, destination, offers) => (
  `<div class="event">
    ${createDateTemplate(point.dateFrom)}
    ${createTypeTemplate(point.type)}
    ${createTitleTemplate(point.type, destination.name)}
    ${createScheduleTemplate(point.dateFrom, point.dateTo)}
    ${createPriceTemplate(point.basePrice)}
    ${createOffersTemplate(point.offers, offers)}
    ${createButtonFavoriteTemplate(point.isFavorite)}
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>`
);

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #handleClick = null;
  #handleFavoriteClick = null;

  constructor({currentPoint, currentDestination, offers, onClick, onFavoriteClick}) {
    super();
    this.#point = currentPoint;
    this.#destination = currentDestination;
    this.#offers = offers;
    this.#handleClick = onClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onClick);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#onFavoriteClick);
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#offers);
  }

  #onClick = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
