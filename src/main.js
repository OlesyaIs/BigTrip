import { nanoid } from 'nanoid';
import TripApiService from './trip-api-service.js';
import { EndPoint } from './const.js';

import TripPresenter from './presenter/trip-presenter.js';
import FiltersModel from './model/filters-model.js';
import SortModel from './model/sort-model.js';
import PointsModel from './model/points-model.js';


const tripMainElement = document.querySelector('.trip-main');
const filterContainerElement = tripMainElement.querySelector('.trip-controls__filters');
const tripPointsBoardContainerElement = document.querySelector('.trip-events');
const addNewPointButtonElement = tripMainElement.querySelector('.trip-main__event-add-btn');

const authorization = `Basic ${nanoid()}`;

const filtersModel = new FiltersModel();
const sortModel = new SortModel();
const pointsModel = new PointsModel({
  tripApiService: new TripApiService(EndPoint.BASE, authorization)
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
pointsModel.init();
