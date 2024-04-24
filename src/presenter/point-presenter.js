import { render, replace, remove } from '../framework/render.js';
import { formatToScreamingSnakeCase, isEscKeydown } from '../utils/common-utils.js';
import { Mode, PointEditMode, ResetEditPointMode, UserAction, UpdateType } from '../const.js';

import PointItemView from '../view/point-item-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';

import PointValidator from '../utils/point-validate-utils.js';

export default class PointPresenter {
  #pointsModel = null;
  #point = null;

  #mode = Mode.DEFAULT;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointListContainer = null;
  #pointItemComponent = null;
  #pointComponent = null;
  #pointEditComponent = null;

  #formValidator = new PointValidator();

  constructor({pointsModel, pointListContainer, onDataChange, onModeChange}) {
    this.#pointsModel = pointsModel;
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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

  init({
    point,
  }) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    const currentPointKeyType = formatToScreamingSnakeCase(this.#point.type);
    const currentDestination = this.destinations.find((destination) => destination.id === this.#point.destination);
    const currentTypeFullOffers = this.offerPack[currentPointKeyType];

    this.#pointComponent = new PointView({
      currentPoint: this.#point,
      currentDestination,
      offers: currentTypeFullOffers,
      onClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new PointEditView({
      mode: PointEditMode.EDIT,
      typePack: this.typePack,
      destinations: this.destinations,
      offerPack: this.offerPack,
      currentPoint: this.#point,
      onSubmit: this.#handleFormSubmit,
      onReturnClick: this.#handleCancelClick,
      onDeleteClick: this.#handleDeleteClick,
      onUpdateElement: this.#handleUpdateElement,
      onPriceInput: this.#handlePriceInput
    });

    if (this.#pointItemComponent === null) {
      this.#pointItemComponent = new PointItemView();
      render(this.#pointItemComponent, this.#pointListContainer);
      render(this.#pointComponent, this.#pointItemComponent.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
    remove(this.#pointItemComponent);
  }

  resetView() {
    if(this.#mode !== Mode.DEFAULT) {
      this.#replaceEditFormToPoint();
    }
  }

  #replacePointToEditPoint() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeydown);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
    this.#formValidator.init({
      formElement: this.#pointEditComponent.element,
      destinations: this.destinations
    });
  }

  #replaceEditFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.#mode = Mode.DEFAULT;
    this.#formValidator.destroy();
  }

  #handleEditClick = () => {
    this.#replacePointToEditPoint();
  };

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
      UserAction.UPDATE_POINT,
      UpdateType.BOARD_WITH_INFO,
      point
    );
  };

  #handleCancelClick = (point) => {
    this.#pointEditComponent.reset(point, ResetEditPointMode.CLOSE);
    this.#replaceEditFormToPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.POINT,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.BOARD_WITH_INFO,
      point
    );
  };

  #handlePriceInput = () => {
    this.#formValidator.resetErrors();
  };

  #onEscKeydown = (evt) => {
    if (!isEscKeydown(evt)) {
      return;
    }

    evt.preventDefault();
    this.#replaceEditFormToPoint();
  };
}
