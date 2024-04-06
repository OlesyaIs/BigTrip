import { render, replace } from '../framework/render.js';
import { formatToScreamingSnakeCase, isEscKeydown } from '../utils/common-utils.js';

import PointItemView from '../view/point-item-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class PointPresenter {
  #pointListContainer = null;
  #pointItemComponent = new PointItemView();
  #pointComponent = null;
  #pointEditComponent = null;

  #destinations = [];
  #offerPack = {};
  #typePack = {};
  #point = null;

  constructor({pointListContainer}) {
    this.#pointListContainer = pointListContainer;
  }

  init(point, destinations, offerPack, typePack) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offerPack = offerPack;
    this.#typePack = typePack;

    const currentPointKeyType = formatToScreamingSnakeCase(this.#point.type);
    const currentDestination = this.#destinations.find((destination) => destination.id === this.#point.destination);
    const currentTypeFullOffers = this.#offerPack[currentPointKeyType];

    this.#pointComponent = new PointView({
      currentPoint: this.#point,
      currentDestination,
      offers: currentTypeFullOffers,
      onClick: this.#onEditClick,
    });

    this.#pointEditComponent = new PointEditView({
      typePack: this.#typePack,
      destinations: this.#destinations,
      offerPack: this.#offerPack,
      currentPoint: this.#point,
      onSubmit: this.#onEditFormSubmit,
      onClick: this.#onEditFormCancel,
    });

    render(this.#pointItemComponent, this.#pointListContainer);
    render(this.#pointComponent, this.#pointItemComponent.element);
  }

  #onEscKeydown = (evt) => {
    if (!isEscKeydown(evt)) {
      return;
    }

    evt.preventDefault();
    this.#replaceEditPointToPoint();
  };

  #replacePointToEditPoint() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeydown);
  }

  #replaceEditPointToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onEscKeydown);
  }

  #onEditClick = () => {
    this.#replacePointToEditPoint();
  };

  #onEditFormSubmit = () => {
    this.#replaceEditPointToPoint();
  };

  #onEditFormCancel = () => {
    this.#replaceEditPointToPoint();
  };
}
