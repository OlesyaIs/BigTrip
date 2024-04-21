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

const PointEditMode = {
  ADD: 'ADD',
  EDIT: 'EDIT'
};

const FLATPICKR_DATE_FORMAT = 'd/m/y H:i';

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  POINT: 'POINT',
  BOARD: 'BOARD',
  BOARD_WITH_INFO: 'BOARD_WITH_INFO',
  FILTERS_WITH_BOARD: 'FILTERS_WITH_BOARD',
  FULL: 'FULL'
};

export { POINTS_QUANTITY, ButtonFavoriteClassName, FilterType, SortType, EmptyListMessage, Mode, PointEditMode, FLATPICKR_DATE_FORMAT, UserAction, UpdateType };
