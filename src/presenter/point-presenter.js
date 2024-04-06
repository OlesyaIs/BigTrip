import { render, replace } from '../framework/render.js';
import { formatToScreamingSnakeCase, isEscKeydown } from '../utils/common-utils.js';

import PointItemView from '../view/point-item-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class PointPresenter {
  #pointListContainer = null;
  #pointItemComponent = null;
  #pointComponent = null;
  #pointEditComponent = null;

  #destinations = [];
  #offerPack = {};
  #typePack = {};
  #point = null;

  #handleDataChange = null;

  constructor({pointListContainer, onDataChange}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
  }

  init(point, destinations, offerPack, typePack) {
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

    if (this.#pointItemComponent.element.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointItemComponent.element.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }
  }

  #handleEscKeydown = (evt) => {
    if (!isEscKeydown(evt)) {
      return;
    }

    evt.preventDefault();
    this.#replaceEditPointToPoint();
  };

  #replacePointToEditPoint() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#handleEscKeydown);
  }

  #replaceEditPointToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#handleEscKeydown);
  }

  #handleEditClick = () => {
    this.#replacePointToEditPoint();
  };

  #handleEditFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceEditPointToPoint();
  };

  #handleEditFormCancel = () => {
    this.#replaceEditPointToPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
