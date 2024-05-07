import { render, remove, replace } from '../framework/render.js';
import { sortFunction } from '../utils/sort-utils.js';
import { UpdateType } from '../const.js';

import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import LoadingView from '../view/loading-view.js';
import EmptyListMessageView from '../view/empty-list-message-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

export default class PointsBoardPresenter {
  #pointsModel = null;
  #sortModel = null;

  #points = [];
  #defaultSortedPoints = [];
  #currentFilter = null;

  #pointsBoardContainer = null;
  #sortComponent = null;
  #pointsListComponent = null;
  #emptyListMessageComponent = null;
  #loadingMessageComponent = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #handleDataChange = null;
  #handleNewPointDestroy = null;

  #isLoading = true;

  constructor({pointsBoardContainer, sortModel, pointsModel, onDataChange, onNewPointDestroy}) {
    this.#pointsBoardContainer = pointsBoardContainer;
    this.#pointsModel = pointsModel;
    this.#sortModel = sortModel;
    this.#handleDataChange = onDataChange;
    this.#handleNewPointDestroy = onNewPointDestroy;

    this.#sortModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get sortTypePack() {
    return {...this.#sortModel.sortTypePack};
  }

  init({
    points,
    currentFilter = this.#currentFilter,
    isLoading
  }) {
    this.#currentFilter = currentFilter;
    this.#defaultSortedPoints = sortFunction[this.#sortModel.defaultSortType]([...points]);
    this.#points = [...this.#defaultSortedPoints];

    this.#sortPoints(this.#sortModel.currentSortType);

    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange, currentSortType: this.#sortModel.currentSortType});
    this.#pointsListComponent = new PointsListView();
    this.#emptyListMessageComponent = new EmptyListMessageView({currentFilter: this.#currentFilter});
    this.#loadingMessageComponent = new LoadingView();

    this.#newPointPresenter = new NewPointPresenter({
      pointsModel: this.#pointsModel,
      pointListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handleDataChange,
      onDestroy: this.#handleNewPointDestroy
    });

    if (!(isLoading === undefined)) {
      this.#isLoading = isLoading;
    }


    this.#renderPointsBoard();
  }

  destroy() {
    this.#clearPointsList();
    this.#newPointPresenter.destroy();
    this.#newPointPresenter = null;
    remove(this.#sortComponent);
    remove(this.#pointsListComponent);
    remove(this.#emptyListMessageComponent);
    remove(this.#loadingMessageComponent);
  }

  createNewPoint() {
    if (this.#pointsBoardContainer.contains(this.#emptyListMessageComponent.element)) {
      replace(this.#sortComponent, this.#emptyListMessageComponent);
      this.#renderPointList();
    }
    this.#newPointPresenter.init();
  }

  setSaving(point) {
    if (point.id) {
      this.#pointPresenters.get(point.id).setSaving();
      return;
    }

    this.#newPointPresenter.setSaving();
  }

  setDeleting(point) {
    this.#pointPresenters.get(point.id).setDeleting();
  }

  setAborting(point) {
    if (point.id) {
      this.#pointPresenters.get(point.id).setAborting();
      return;
    }

    this.#newPointPresenter.setAborting();
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
  }

  #sortPoints = () => {
    switch (this.#sortModel.currentSortType) {
      case this.sortTypePack.TIME.type:
        this.#points = sortFunction[this.sortTypePack.TIME.type](this.#points);
        break;
      case this.sortTypePack.PRICE.type:
        this.#points = sortFunction[this.sortTypePack.PRICE.type](this.#points);
        break;
      default:
        this.#points = [...this.#defaultSortedPoints];
    }
  };

  #renderLoadingMessage() {
    render(this.#loadingMessageComponent, this.#pointsBoardContainer);
  }

  #renderEmptyListMessage() {
    render(this.#emptyListMessageComponent, this.#pointsBoardContainer);
  }

  #renderSort() {
    render(this.#sortComponent, this.#pointsBoardContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsModel: this.#pointsModel,
      pointListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handleDataChange,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init({point});
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPointList() {
    render(this.#pointsListComponent, this.#pointsBoardContainer);

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #renderPointsBoard() {
    if (this.#isLoading) {
      this.#renderLoadingMessage();
      return;
    }

    if (!this.#points.length) {
      this.#renderEmptyListMessage();
      return;
    }

    this.#renderSort();
    this.#renderPointList();
  }

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
    this.#newPointPresenter.destroy();
  };
}
