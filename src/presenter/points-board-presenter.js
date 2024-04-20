import { render, remove } from '../framework/render.js';
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

    this.#sortModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get currentSortType() {
    return this.#sortModel.currentSortType;
  }

  init({
    points,
    destinations = this.#destinations,
    offerPack = this.#offerPack,
    typePack = this.#typePack,
    currentFilter = this.#currentFilter,
    onDataChange = this.#handleDataChange,
  }) {
    this.#destinations = destinations;
    this.#offerPack = offerPack;
    this.#typePack = typePack;
    this.#currentFilter = currentFilter;
    this.#sortTypePack = this.#sortModel.sortTypePack;
    this.#defaultSortedPoints = sortFunction[this.#sortModel.defaultSortType]([...points]);
    this.#points = [...this.#defaultSortedPoints];

    this.#handleDataChange = onDataChange;

    this.#sortPoints(this.#sortModel.currentSortType);

    const previousSortComponent = this.#sortComponent;
    const previousPointListComponent = this.#pointsListComponent;
    const previousEmptyListComponent = this.#emptyListMessageComponent;

    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange, currentSortType: this.#sortModel.currentSortType});
    this.#pointsListComponent = new PointsListView();
    this.#emptyListMessageComponent = new EmptyListMessageView({currentFilter: this.#currentFilter});

    if (!previousSortComponent || !previousPointListComponent || !previousEmptyListComponent) {
      this.#renderPointsBoard();
      return;
    }

    this.#clearPointsList();
    remove(previousSortComponent);
    remove(previousPointListComponent);
    remove(previousEmptyListComponent);
    this.#renderPointsBoard();
  }

  destroy() {
    this.#clearPointsList();
    remove(this.#sortComponent);
    remove(this.#pointsListComponent);
    remove(this.#emptyListMessageComponent);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
  }

  #sortPoints = () => {
    switch (this.currentSortType) {
      case this.#sortTypePack.TIME.type:
        this.#points = sortFunction[this.#sortTypePack.TIME.type](this.#points);
        break;
      case this.#sortTypePack.PRICE.type:
        this.#points = sortFunction[this.#sortTypePack.PRICE.type](this.#points);
        break;
      default:
        this.#points = [...this.#defaultSortedPoints];
    }
  };

  #handleModelEvent = (updateType, data) => {
    if (updateType !== UpdateType.POINT) {
      return;
    }

    this.#pointPresenters.get(data.id).init({point: data});
  };

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#sortModel.currentSortType) {
      return;
    }

    this.#sortModel.setCurrentSortType(UpdateType.BOARD, sortType);
  };

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
