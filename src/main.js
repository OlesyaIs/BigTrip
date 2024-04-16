import TripPresenter from './presenter/trip-presenter.js';
import FiltersModel from './model/filters-model.js';
import SortModel from './model/sort-model.js';
import PointsModel from './model/points-model.js';

const tripMainElement = document.querySelector('.trip-main');
const filterContainerElement = tripMainElement.querySelector('.trip-controls__filters');
const tripPointsBoardContainerElement = document.querySelector('.trip-events');

const filtersModel = new FiltersModel();
const sortModel = new SortModel();
const pointsModel = new PointsModel();

const tripPresenter = new TripPresenter({
  tripInfoContainer: tripMainElement,
  filterContainer: filterContainerElement,
  tripPointsBoardContainer: tripPointsBoardContainerElement,
  filtersModel,
  sortModel,
  pointsModel,
});

tripPresenter.init();
