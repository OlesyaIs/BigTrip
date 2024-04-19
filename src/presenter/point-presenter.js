import { render, replace, remove } from '../framework/render.js';
import { formatToScreamingSnakeCase, isEscKeydown } from '../utils/common-utils.js';
import { Mode, UserAction, UpdateType } from '../const.js';

import PointItemView from '../view/point-item-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class PointPresenter {
  #destinations = [];
  #offerPack = {};
  #typePack = {};
  #point = null;

  #mode = Mode.DEFAULT;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointListContainer = null;
  #pointItemComponent = null;
  #pointComponent = null;
  #pointEditComponent = null;

  constructor({pointListContainer, onDataChange, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init({
    point,
    destinations = this.#destinations,
    offerPack = this.#offerPack,
    typePack = this.#typePack
  }) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offerPack = offerPack;
    this.#typePack = typePack;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    const currentPointKeyType = formatToScreamingSnakeCase(this.#point.type);
    const currentDestination = this.#destinations.find((destination) => destination.id === this.#point.destination);
    const currentTypeFullOffers = this.#offerPack[currentPointKeyType];

    this.#pointComponent = new PointView({
      currentPoint: this.#point,
      currentDestination,
      offers: currentTypeFullOffers,
      onClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new PointEditView({
      typePack: this.#typePack,
      destinations: this.#destinations,
      offerPack: this.#offerPack,
      currentPoint: this.#point,
      onSubmit: this.#handleEditFormSubmit,
      onClick: this.#handleEditFormCancel,
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
    remove(this.#pointItemComponent);
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
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
  }

  #replaceEditFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.#mode = Mode.DEFAULT;
  }

  #onEscKeydown = (evt) => {
    if (!isEscKeydown(evt)) {
      return;
    }

    evt.preventDefault();
    this.#replaceEditFormToPoint();
  };

  #handleEditClick = () => {
    this.#replacePointToEditPoint();
  };

  #handleEditFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MAJOR_MAJOR,
      point
    );
    this.#replaceEditFormToPoint();
  };

  #handleEditFormCancel = (point) => {
    this.#pointEditComponent.reset(point);
    this.#replaceEditFormToPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };
}
