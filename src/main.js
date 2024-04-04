import TripPresenter from './presenter/trip-presenter.js';
import FiltersModel from './model/filters-model.js';
import PointsModel from './model/points-model.js';

const tripMainElement = document.querySelector('.trip-main');
const filterContainerElement = tripMainElement.querySelector('.trip-controls__filters');
const tripPointsContainerElement = document.querySelector('.trip-events');

const filtersModel = new FiltersModel();
const pointsModel = new PointsModel();

const tripPresenter = new TripPresenter({
  tripInfoContainer: tripMainElement,
  filterContainer: filterContainerElement,
  tripPointsContainer: tripPointsContainerElement,
  filtersModel,
  pointsModel,
});

tripPresenter.init();
