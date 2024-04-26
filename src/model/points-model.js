import { createRandomPoint } from '../mock/point.js';
import { POINTS_QUANTITY } from '../const.js';
import { DESTINATIONS } from '../mock/destination.js';
import { OfferPack } from '../mock/offer-pack.js';
import { TypePack } from '../mock/type-pack.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = Array.from({length: POINTS_QUANTITY}, createRandomPoint);
  #destinations = DESTINATIONS.slice();
  #offerPack = structuredClone(OfferPack);
  #typePack = structuredClone(TypePack);

  get points() {
    return this.#points;
  }

  set points(newPoints) {
    this.#points = newPoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get offerPack() {
    return this.#offerPack;
  }

  get typePack() {
    return this.#typePack;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point.');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    this.#points = this.#points.filter((point) => point.id !== update.id);
    this._notify(updateType, update);
  }
}
