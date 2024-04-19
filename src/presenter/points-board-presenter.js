import { render, remove } from '../framework/render.js';
// import { updateItem } from '../utils/common-utils.js';
import { sortFunction } from '../utils/sort-utils.js';
import { UpdateType } from '../const.js';

import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import EmptyListMessageView from '../view/empty-list-message-view.js';
import PointPresenter from './point-presenter.js';

export default class PointsBoardPresenter {
  #pointsModel = null;
  #sortModel = null;

  #points = [];
  #defaultSortedPoints = [];
  #destinations = [];
  #offerPack = {};
  #typePack = {};
  #currentFilter = null;
  #sortTypePack = null;

  #pointsBoardContainer = null;
  #sortComponent = null;
  #pointsListComponent = null;
  #emptyListMessageComponent = null;

  #pointPresenters = new Map();

  #handleDataChange = null;

  constructor({pointsBoardContainer, sortModel, pointsModel}) {
    this.#pointsBoardContainer = pointsBoardContainer;
    this.#pointsModel = pointsModel;
    this.#sortModel = sortModel;

    this.#pointsModel.addObserver(this.#handlePointsModelEvent);
  }

  init({
    points,
    destinations,
    offerPack,
    typePack,
    currentFilter,
    onDataChange,
    currentSortType
  }) {
    this.#destinations = destinations;
    this.#offerPack = offerPack;
    this.#typePack = typePack;
    this.#currentFilter = currentFilter;
    this.#sortTypePack = this.#sortModel.sortTypePack;
    this.#sortModel.currentType = currentSortType;
    this.#defaultSortedPoints = sortFunction[this.#sortModel.currentType]([...points]);

    this.#handleDataChange = onDataChange;

    this.#sortPoints(this.#sortModel.currentType);

    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange, currentType: this.#sortModel.currentType});
    this.#pointsListComponent = new PointsListView();
    this.#emptyListMessageComponent = new EmptyListMessageView({currentFilter: this.#currentFilter});

    this.#renderPointsBoard();
  }

  destroy() {
    remove(this.#sortComponent);
    remove(this.#pointsListComponent);
    remove(this.#emptyListMessageComponent);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case this.#sortTypePack.TIME.type:
        this.#points = sortFunction[this.#sortTypePack.TIME.type]([...this.#defaultSortedPoints]);
        break;
      case this.#sortTypePack.PRICE.type:
        this.#points = sortFunction[this.#sortTypePack.PRICE.type]([...this.#defaultSortedPoints]);
        break;
      default:
        this.#points = [...this.#defaultSortedPoints];
    }
  };

  #handlePointsModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init({point: data});
        break;

      case UpdateType.MINOR_MINOR:
        this.#clearPointsList();
        this.#renderPointList();
        break;

      case UpdateType.MAJOR_MINOR:
        this.#clearPointsList();
        this.#renderPointList();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#sortModel.currentType) {
      return;
    }

    this.#sortModel.currentType = sortType;
    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointList();
  };

  // #handlePointChange = (updatedPoint) => {
  //   this.#points = updateItem(this.#points, updatedPoint);
  //   this.#pointPresenters
  //     .get(updatedPoint.id)
  //     .init({
  //       point: updatedPoint,
  //       destinations: this.#destinations,
  //       offerPack: this.#offerPack,
  //       typePack: this.#typePack
  //     });
  // };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEmptyListMessage() {
    render(this.#emptyListMessageComponent, this.#pointsBoardContainer);
  }

  #renderSort() {
    render(this.#sortComponent, this.#pointsBoardContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handleDataChange,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init({
      point: point,
      destinations: this.#destinations,
      offerPack: this.#offerPack,
      typePack: this.#typePack
    });
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPointList() {
    render(this.#pointsListComponent, this.#pointsBoardContainer);

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #renderPointsBoard() {
    if (!this.#points.length) {
      this.#renderEmptyListMessage();
      return;
    }

    this.#renderSort();
    this.#renderPointList();
  }
}
