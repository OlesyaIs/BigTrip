import { nanoid } from 'nanoid';
import { isEscKeydown } from '../utils/common-utils.js';
import { render, remove, RenderPosition } from '../framework/render';
import { UpdateType, UserAction } from '../const';

import PointItemView from '../view/point-item-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class NewPointPresenter {
  #destinations = [];
  #offerPack = {};
  #typePack = {};

  #pointListContainer = null;
  #pointItemComponent = null;
  #pointEditComponent = null;

  #handleDataChange = null;
  #handleDestroy = null;

  constructor({pointListContainer, onDataChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init({destinations, offerPack, typePack}) {
    this.#destinations = destinations;
    this.#offerPack = offerPack;
    this.#typePack = typePack;


    this.#pointItemComponent = new PointItemView();
    this.#pointEditComponent = new PointEditView({
      typePack: this.#typePack,
      destinations: this.#destinations,
      offerPack: this.#offerPack,
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
    this.#handleNewPointDestroy();
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
      {id: nanoid(), ...point}
    );
    this.destroy();
  };

  #handleReturnClick = () => {
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #onEscKeydown = (evt) => {
    if (!isEscKeydown(evt)) {
      return;
    }

    evt.preventDefault();
    this.destroy();
  };
}
