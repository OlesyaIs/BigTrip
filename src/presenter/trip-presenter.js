import { RenderPosition, render, replace } from '../framework/render.js';
import { formatToScreamingSnakeCase, isEscKeydown } from '../utils/common-utils.js';

import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointsListView from '../view/points-list-view.js';
import PointItemView from '../view/point-item-view.js';
import PointView from '../view/point-view.js';

export default class TripPresenter {
  #pointsListComponent = new PointsListView();
  #tripInfoContainer = null;
  #filterContainer = null;
  #tripPointsContainer = null;
  #filtersModel = null;
  #pointsModel = null;

  #filters = [];
  #tripPoints = [];
  #destinations = [];
  #offerPack = {};
  #typePack = {};

  constructor({tripInfoContainer, filterContainer, tripPointsContainer, filtersModel, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#filterContainer = filterContainer;
    this.#tripPointsContainer = tripPointsContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#filters = [...this.#filtersModel.filters];
    this.#tripPoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offerPack = structuredClone(this.#pointsModel.offerPack);
    this.#typePack = structuredClone(this.#pointsModel.typePack);

    this.#renderTrip();
  }

  #renderTripInfo(container) {
    render(new TripInfoView(), container, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const currentPoint = point;
    const currentPointKeyType = formatToScreamingSnakeCase(currentPoint.type);
    const currentDestination = this.#destinations.find((destination) => destination.id === currentPoint.destination);
    const currentTypeFullOffers = this.#offerPack[currentPointKeyType];
    const newItemComponent = new PointItemView();

    const pointComponent = new PointView({
      currentPoint,
      currentDestination,
      offers: currentTypeFullOffers,
      onClick: openEditPointForm,
    });

    const pointEditComponent = new PointEditView({
      typePack: this.#typePack,
      destinations: this.#destinations,
      offerPack: this.#offerPack,
      currentPoint,
      onSubmit: closeEditPointForm,
      onClick: closeEditPointForm,
    });

    const onEscKeydown = function(evt) {
      if (!isEscKeydown(evt)) {
        return;
      }

      evt.preventDefault();
      closeEditPointForm();
    };

    function openEditPointForm() {
      replace(pointEditComponent, pointComponent);
      document.addEventListener('keydown', onEscKeydown);
    }

    function closeEditPointForm() {
      replace(pointComponent, pointEditComponent);
      document.removeEventListener('keydown', onEscKeydown);
    }

    render(newItemComponent, this.#pointsListComponent.element);
    render(pointComponent, newItemComponent.element);
  }

  #renderTrip() {
    this.#renderTripInfo(this.#tripInfoContainer);

    const FilterViewComponent = new FilterView({filters: this.#filters});
    const currentFilter = FilterViewComponent.element.querySelector('.trip-filters__filter-input[checked]');
    render(FilterViewComponent, this.#filterContainer);

    // if (!this.#tripPoints.length) {

    //   return;
    // }

    render(new SortView(), this.#tripPointsContainer);
    render(this.#pointsListComponent, this.#tripPointsContainer);

    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderPoint(this.#tripPoints[i]);
    }
  }
}
