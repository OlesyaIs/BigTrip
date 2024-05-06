import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getStringWithUpperCaseFirst, formatToScreamingSnakeCase } from '../utils/common-utils.js';
import { huminizeFullDate } from '../utils/date-utils.js';
import { ResetEditPointMode, FLATPICKR_DATE_FORMAT, PointEditMode } from '../const.js';

import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

const createEmptyPoint = (typePack) => {
  const defaultType = Object.values(typePack)[0].type;

  return {
    type: defaultType,
    dateFrom: null,
    dateTo: null,
    destination: null,
    basePrice: '',
    offers: [],
    isFavorite: false,
  };
};

const createTypeItemTemplate = (pointType, currentType) => {
  const checkedAttribute = (currentType === pointType) ? ' checked' : '';

  return (
    `<div class="event__type-item">
    <input id="event-type-${currentType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${currentType}"${checkedAttribute}>
    <label class="event__type-label  event__type-label--${currentType}" for="event-type-${currentType}-1">${getStringWithUpperCaseFirst(currentType)}</label>
  </div>`
  );
};

const createTypeTemplate = (point, types) => (
  `<div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
    <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
        ${types.map((element) => createTypeItemTemplate(point.type, element)).join('')}
      </div>
    </fieldset>
  </div>
  </div>`
);

const createDestinationWithTypeTemplate = (point, destinations, currentDestination) => (
  `<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${getStringWithUpperCaseFirst(point.type)}
    </label>
    ${`<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination ? currentDestination.name : ''}" list="destination-list-1" required data-pristine-required-message="Необходимо выбрать пункт назчачения">`}
    ${`<datalist id="destination-list-1">
        ${destinations.map((element) => `<option value="${element.name}"></option>`).join('')}
      </datalist>`}
  </div>`
);

const createTimeTemplate = (point) => {
  const startDate = point.dateFrom ? huminizeFullDate(point.dateFrom) : '';
  const endDate = point.dateTo ? huminizeFullDate(point.dateTo) : '';

  return (
    `<div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
    </div>`
  );
};

const createPriceTemplate = ({basePrice}) => (
  `<div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(basePrice.toString())}" pattern="/(^[0-9]+$)/" required data-pristine-required-message="Необходимо указать стоимость" data-pristine-pattern-message="Необходимо ввести целое положительное число">
  </div>`
);

const createOfferTemplate = (offer, isChecked) => {
  const checkedAttribute = isChecked ? ' checked' : '';

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.shortTitle}-1" type="checkbox" name="event-offer-${offer.shortTitle}" data-offer-id="${offer.id}"${checkedAttribute}>
      <label class="event__offer-label" for="event-offer-${offer.shortTitle}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const createOffersTemplate = (point, offers = []) => {
  if (!offers.length) {
    return '';
  }

  const checkedOffersIds = point.offers;

  const offersList = offers.map((offer) => {
    const isChecked = checkedOffersIds ? checkedOffersIds.some((checkedOfferId) => checkedOfferId === offer.id) : false;
    return createOfferTemplate(offer, isChecked);
  }).join('');

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersList}
      </div>
    </section>`
  );
};

const createPhotosTemplate = (pictures) => {
  if(!pictures.length) {
    return '';
  }

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>`
  );
};

const createDestinationInfoTemplate = (currentDestination) => {
  if (!currentDestination) {
    return '';
  }

  const {description, pictures} = currentDestination;

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${createPhotosTemplate(pictures)}
    </section>`
  );
};
const createButtonsTemplate = (mode) => {
  let resetButtonTemplate = '';
  let rollupButtonTemplate = '';

  switch (mode) {
    case PointEditMode.ADD:
      resetButtonTemplate = '<button class="event__reset-btn" type="reset">Cancel</button>';
      break;
    case PointEditMode.EDIT:
      resetButtonTemplate = '<button class="event__reset-btn" type="reset">Delete</button>';
      rollupButtonTemplate = '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>';
      break;
  }
  return (
    `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    ${resetButtonTemplate}
    ${rollupButtonTemplate}`
  );
};

const createPointEditTemplate = (typePack, destinations, offerPack, currentPoint, mode) => {
  const editedPoint = currentPoint;
  const types = Object.values(typePack).map((element) => element.type);
  const keyType = formatToScreamingSnakeCase(editedPoint.type);
  const currentDestination = destinations.find((destination) => destination.id === editedPoint.destination);

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${createTypeTemplate(editedPoint, types)}
        ${createDestinationWithTypeTemplate(editedPoint, destinations, currentDestination)}
        ${createTimeTemplate(editedPoint)}
        ${createPriceTemplate(editedPoint)}
        ${createButtonsTemplate(mode)}
      </header>
      <section class="event__details">
        ${createOffersTemplate(editedPoint, offerPack[keyType])}
        ${createDestinationInfoTemplate(currentDestination)}
      </section>
    </form>`
  );
};

export default class PointEditView extends AbstractStatefulView {
  #typePack = null;
  #destinations = null;
  #offerPack = null;
  #handleSubmit = null;
  #handleReturnClick = null;
  #handleDeleteClick = null;
  #handleUpdateElement = null;
  #handlePriceInput = null;

  #point = null;
  #mode = null;

  #datePickerFrom = null;
  #datePickerTo = null;

  constructor({typePack, destinations, offerPack, currentPoint, onSubmit, onReturnClick, onDeleteClick, onUpdateElement, onPriceInput, mode}) {
    super();

    this.#typePack = typePack;
    this.#destinations = destinations;
    this.#offerPack = offerPack;
    this.#handleSubmit = onSubmit;
    this.#handleReturnClick = onReturnClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleUpdateElement = onUpdateElement;
    this.#handlePriceInput = onPriceInput;

    this.#point = currentPoint ? currentPoint : createEmptyPoint(this.#typePack);
    this.#mode = mode;
    this._setState(PointEditView.parsePointToState(this.#point));

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this.#typePack, this.#destinations, this.#offerPack, this._state, this.#mode);
  }

  static parsePointToState(point) {
    return structuredClone(point);
  }

  static parseStateToPoint(state) {
    return structuredClone(state);
  }

  updateElement(update) {
    super.updateElement(update);

    if (this.#handleUpdateElement) {
      this.#handleUpdateElement();
    }
  }

  reset(point, mode) {
    switch (mode) {
      case ResetEditPointMode.CLOSE:
        this._setState(PointEditView.parsePointToState(point));
        break;
      case ResetEditPointMode.RERENDER:
        this.updateElement(PointEditView.parsePointToState(point));
        break;
    }
  }

  removeElement() {
    super.removeElement();

    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#onSubmit);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onDeleteClick);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#onTypeChange);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#onDestinationChange);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#onPriceChange);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#onPriceInput);

    if (this.#mode === PointEditMode.EDIT) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onReturnClick);
    }

    const offersGroup = this.element.querySelector('.event__available-offers');
    if (offersGroup) {
      offersGroup.addEventListener('change', this.#onOfferClick);
    }


    this.#setDatePicker();
  }

  #onSubmit = (evt) => {
    evt.preventDefault();
    this.#handleSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #onReturnClick = (evt) => {
    evt.preventDefault();
    this.#handleReturnClick(this.#point);
  };

  #onDeleteClick = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(this.#point);
  };

  #onTypeChange = (evt) => {
    const newType = evt.target.value;

    if (this._state.type === newType) {
      return;
    }
    const newTypeKey = formatToScreamingSnakeCase(newType);

    this.updateElement({
      type: newType,
      basePrice: this.#typePack[newTypeKey].price,
      offers: [],
    });
  };

  #onDestinationChange = (evt) => {
    const newDestination = this.#destinations.find((destination) => destination.name === evt.target.value);

    if (!newDestination || this._state.destination === newDestination.id) {
      return;
    }

    this.updateElement({destination: newDestination.id});
  };

  #onOfferClick = (evt) => {
    evt.preventDefault();

    const checkedOfferComponents = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      offers: checkedOfferComponents.map((checkedOffer) => checkedOffer.dataset.offerId)
    });
  };

  #onPriceChange = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value
    });
  };

  #onPriceInput = (evt) => {
    if (!this.#handlePriceInput) {
      return;
    }

    evt.preventDefault();
    this.#handlePriceInput();
  };

  #onDateFromChange = ([userDate]) => {
    const dateTo = this.#datePickerTo.parseDate(this.element.querySelector('#event-end-time-1').value);
    if (userDate > dateTo) {
      this.updateElement({
        dateFrom: userDate,
        dateTo: userDate,
      });
      return;
    }

    this.updateElement({
      dateFrom: userDate,
    });
  };

  #onDateToChange = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatePicker() {

    this.#datePickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: FLATPICKR_DATE_FORMAT,
        onChange: this.#onDateFromChange,
      }
    );

    this.#datePickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: FLATPICKR_DATE_FORMAT,
        onChange: this.#onDateToChange,
        minDate: this.#datePickerFrom.parseDate(this.element.querySelector('#event-start-time-1').value),
      }
    );
  }
}
