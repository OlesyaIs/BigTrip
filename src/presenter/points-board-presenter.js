import { render, remove, replace } from '../framework/render.js';
import { updateItem } from '../utils/common-utils.js';
import { SortType } from '../const.js';
import { sortFunction } from '../utils/sort-utils.js';

import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import EmptyListMessageView from '../view/empty-list-message-view.js';
import PointPresenter from './point-presenter.js';

export default class PointsBoardPresenter {
  #points = [];
  #defaultSortedPoints = [];
  #destinations = [];
  #offerPack = {};
  #typePack = {};
  #currentFilter = null;

  #currentSortType = SortType.DAY;

  #pointsBoardContainer = null;
  #sortComponent = null;
  #pointsListComponent = null;
  #emptyListMessageComponent = null;

  #pointPresenters = new Map();

  constructor({pointsBoardContainer}) {
    this.#pointsBoardContainer = pointsBoardContainer;
  }

  init(points, destinations, offerPack, typePack, currentFilter) {
    this.#currentSortType = SortType.DAY;
    this.#defaultSortedPoints = sortFunction[this.#currentSortType]([...points]);
    this.#destinations = destinations;
    this.#offerPack = offerPack;
    this.#typePack = typePack;
    this.#currentFilter = currentFilter;

    this.#sortPoints(this.#currentSortType);

    const prevSortComponent = this.#sortComponent;
    const prevPointsListComponent = this.#pointsListComponent;
    const prevEmptyListMessageComponent = this.#emptyListMessageComponent;

    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange});
    this.#pointsListComponent = new PointsListView();
    this.#emptyListMessageComponent = new EmptyListMessageView({currentFilter: this.#currentFilter});

    if (prevSortComponent === null || prevPointsListComponent === null || prevEmptyListMessageComponent === null) {
      this.#renderPointsBoard();
      return;
    }

    if (this.#pointsBoardContainer.contains(prevSortComponent.element)) {
      replace(this.#sortComponent, prevSortComponent);
    }

    if (this.#pointsBoardContainer.contains(prevPointsListComponent.element)) {
      this.#clearPointsList();
      remove(prevPointsListComponent);
      this.#renderPointList();
    }

    if (this.#pointsBoardContainer.contains(prevEmptyListMessageComponent.element)) {
      replace(this.#emptyListMessageComponent, prevEmptyListMessageComponent);
    }
  }

  destroy() {
    remove(this.#sortComponent);
    remove(this.#pointsListComponent);
    remove(this.#emptyListMessageComponent);
  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.TIME:
        this.#points = sortFunction[SortType.TIME]([...this.#defaultSortedPoints]);
        break;
      case SortType.PRICE:
        this.#points = sortFunction[SortType.PRICE]([...this.#defaultSortedPoints]);
        break;
      default:
        this.#points = [...this.#defaultSortedPoints];
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointList();
    this.#currentSortType = sortType;
  };

  #clearPointsList() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, this.#destinations, this.#offerPack, this.#typePack);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderSort() {
    render(this.#sortComponent, this.#pointsBoardContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point, this.#destinations, this.#offerPack, this.#typePack);
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
      render(this.#emptyListMessageComponent, this.#pointsBoardContainer);
      return;
    }

    this.#renderSort();
    this.#renderPointList();
  }
}
