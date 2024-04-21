import { nanoid } from 'nanoid';
import { isEscKeydown } from '../utils/common-utils.js';
import { render, remove, RenderPosition } from '../framework/render';
import { PointEditMode, UpdateType, UserAction } from '../const';

import PointItemView from '../view/point-item-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class NewPointPresenter {
  #pointsModel = null;
  #pointListContainer = null;
  #pointItemComponent = null;
  #pointEditComponent = null;

  #handleDataChange = null;
  #handleDestroy = null;

  constructor({pointsModel, pointListContainer, onDataChange, onDestroy}) {
    this.#pointsModel = pointsModel;
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  get destinations() {
    return [...this.#pointsModel.destinations];
  }

  get offerPack() {
    return {...this.#pointsModel.offerPack};
  }

  get typePack() {
    return {...this.#pointsModel.typePack};
  }

  init() {
    this.#pointItemComponent = new PointItemView();
    this.#pointEditComponent = new PointEditView({
      mode: PointEditMode.ADD,
      typePack: this.typePack,
      destinations: this.destinations,
      offerPack: this.offerPack,
      onSubmit: this.#handleSubmitClick,
      onReturnClick: this.#handleReturnClick,
      onDeleteClick: this.#handleDeleteClick
    });

    render(this.#pointItemComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    render(this.#pointEditComponent, this.#pointItemComponent.element);

    document.addEventListener('keydown', this.#onEscKeydown);
  }

  destroy() {
    if (!this.#pointItemComponent) {
      return;
    }
    remove(this.#pointEditComponent);
    remove(this.#pointItemComponent);
    this.#pointEditComponent = null;
    this.#pointItemComponent = null;
    document.removeEventListener('keydown', this.#onEscKeydown);
  }

  #handleNewPointDestroy() {
    this.#handleDestroy();
  }

  #handleSubmitClick = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.BOARD_WITH_INFO,
      {...point, id: nanoid()}
    );
    this.#handleNewPointDestroy();
  };

  #handleReturnClick = () => {
    this.#handleNewPointDestroy();
  };

  #handleDeleteClick = () => {
    this.#handleNewPointDestroy();
  };

  #onEscKeydown = (evt) => {
    if (!isEscKeydown(evt)) {
      return;
    }

    evt.preventDefault();
    this.#handleNewPointDestroy();
  };
}
