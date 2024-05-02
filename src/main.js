import TripPresenter from './presenter/trip-presenter.js';
import FiltersModel from './model/filters-model.js';
import SortModel from './model/sort-model.js';
import PointsModel from './model/points-model.js';

import PointsApiService from './points-api-service.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const tripMainElement = document.querySelector('.trip-main');
const filterContainerElement = tripMainElement.querySelector('.trip-controls__filters');
const tripPointsBoardContainerElement = document.querySelector('.trip-events');
const addNewPointButtonElement = tripMainElement.querySelector('.trip-main__event-add-btn');

const filtersModel = new FiltersModel();
const sortModel = new SortModel();
const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const tripPresenter = new TripPresenter({
  tripInfoContainer: tripMainElement,
  filterContainer: filterContainerElement,
  tripPointsBoardContainer: tripPointsBoardContainerElement,
  addNewPointButtonElement,
  filtersModel,
  sortModel,
  pointsModel,
});

tripPresenter.init();
