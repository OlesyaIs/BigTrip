import { isEscKeydown } from '../utils/common-utils.js';
import { render, remove, RenderPosition } from '../framework/render';
import { PointEditMode, UpdateType, UserAction } from '../const';

import PointItemView from '../view/point-item-view.js';
import PointEditView from '../view/point-edit-view.js';

import PointValidator from '../utils/point-validate-utils.js';

export default class NewPointPresenter {
  #pointsModel = null;
  #pointListContainer = null;
  #pointItemComponent = null;
  #pointEditComponent = null;

  #handleDataChange = null;
  #handleDestroy = null;

  #formValidator = new PointValidator();

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
      onSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleCancelClick,
      onUpdateElement: this.#handleUpdateElement,
      onPriceInput: this.#handlePriceInput
    });

    render(this.#pointItemComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    render(this.#pointEditComponent, this.#pointItemComponent.element);


    this.#formValidator.init({
      formElement: this.#pointEditComponent.element,
      destinations: this.destinations
    });

    document.addEventListener('keydown', this.#onEscKeydown);
  }

  destroy() {
    if (!this.#pointItemComponent) {
      return;
    }
    this.#formValidator.destroy();
    remove(this.#pointEditComponent);
    remove(this.#pointItemComponent);
    this.#pointEditComponent = null;
    this.#pointItemComponent = null;
    document.removeEventListener('keydown', this.#onEscKeydown);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisable: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisable: false,
        isDeleting: false,
        isSaving: false
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleNewPointDestroy() {
    this.#handleDestroy();
  }

  #handleUpdateElement = () => {
    this.#formValidator.destroy();
    this.#formValidator.init({
      formElement: this.#pointEditComponent.element,
      destinations: this.destinations
    });
  };

  #handleFormSubmit = (point) => {
    if (!this.#formValidator.validatePoint()) {
      return;
    }

    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.FULL,
      {...point}
    );
  };

  #handleCancelClick = () => {
    this.#handleNewPointDestroy();
  };

  #handlePriceInput = () => {
    this.#formValidator.resetErrors();
  };

  #onEscKeydown = (evt) => {
    if (!isEscKeydown(evt)) {
      return;
    }

    evt.preventDefault();
    this.#handleNewPointDestroy();
  };
}
