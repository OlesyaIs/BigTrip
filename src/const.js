const POINTS_QUANTITY = 3;

const ButtonFavoriteClassName = {
  BASE: 'event__favorite-btn',
  ACTIVE: 'event__favorite-btn--active',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DAY: {
    type: 'day',
    title: 'Day',
    isDefault: true,
    isDisabled: false,
  },
  EVENT: {
    type: 'event',
    title: 'Event',
    isDefault: false,
    isDisabled: true,
  },
  TIME: {
    type: 'time',
    title: 'Time',
    isDefault: false,
    isDisabled: false,
  },
  PRICE: {
    type: 'price',
    title: 'Price',
    isDefault: false,
    isDisabled: false,
  },
  OFFER: {
    type: 'offer',
    title: 'Offers',
    isDefault: false,
    isDisabled: true,
  }
};

const EmptyListMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const FLATPICKR_DATE_FORMAT = 'd/m/y H:i';

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR_MINOR: 'MINOR_MINOR',
  MAJOR_MINOR: 'MAJOR_MINOR',
  MINOR_MAJOR: 'MINOR_MAJOR',
  MAJOR_MAJOR: 'MAJOR_MAJOR',
  FULL: 'FULL',
};

export { POINTS_QUANTITY, ButtonFavoriteClassName, FilterType, SortType, EmptyListMessage, Mode, FLATPICKR_DATE_FORMAT, UserAction, UpdateType };
