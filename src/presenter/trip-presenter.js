import { RenderPosition, render } from '../framework/render.js';
import { formatToScreamingSnakeCase } from '../utils.js';

import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointsListView from '../view/points-list-view.js';
import PointItemView from '../view/point-item-view.js';
import PointView from '../view/point-view.js';

export default class TripPresenter {
  pointsListComponent = new PointsListView();
  // pointsListItemComponent = new PointItemView();

  constructor({tripInfoContainer, filterContainer, tripPointsContainer, pointsModel}) {
    this.tripInfoContainer = tripInfoContainer;
    this.filterContainer = filterContainer;
    this.tripPointsContainer = tripPointsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.tripPoints = [...this.pointsModel.getPoints()];
    this.destinations = [...this.pointsModel.getDestinations()];
    this.offerPack = structuredClone(this.pointsModel.getOfferPack());
    this.typePack = structuredClone(this.pointsModel.getTypePack());

    render(new TripInfoView(), this.tripInfoContainer, RenderPosition.AFTERBEGIN);
    render(new FilterView(), this.filterContainer);
    render(new SortView(), this.tripPointsContainer);
    render(this.pointsListComponent, this.tripPointsContainer);
    // render(this.pointsListItemComponent, this.pointsListComponent.element);
    // render(new PointEditView(this.typePack, this.destinations, this.offerPack), this.pointsListItemComponent.element);

    for (let i = 0; i < this.tripPoints.length; i++) {
      const currentPoint = this.tripPoints[i];
      const currentPointKeyType = formatToScreamingSnakeCase(currentPoint.type);
      const currentDestination = this.destinations.find((destination) => destination.id === currentPoint.destination);
      const currentTypeFullOffers = this.offerPack[currentPointKeyType];

      const newItemComponent = new PointItemView();
      const pointEditComponent = new PointEditView(this.typePack, this.destinations, this.offerPack, currentPoint);

      render(newItemComponent, this.pointsListComponent.element);
      render(new PointView(currentPoint, currentDestination, currentTypeFullOffers), newItemComponent.element);

      // Посмотреть, как рендерится форма редактирования созданных точек:
      // render(new PointEditView(this.typePack, this.destinations, this.offerPack, currentPoint), newItemComponent.element);
    }
  }
}
