import { createRandomPoint } from '../mock/point.js';
import { POINTS_QUANTITY } from '../const.js';
import { DESTINATIONS } from '../mock/destination.js';
import { OfferPack } from '../mock/offer-pack.js';
import { TypePack } from '../mock/type-pack.js';

export default class PointsModel {
  #points = Array.from({length: POINTS_QUANTITY}, createRandomPoint);
  #destinations = DESTINATIONS.slice();
  #offerPack = structuredClone(OfferPack);
  #typePack = structuredClone(TypePack);

  getPoints() {
    return this.#points;
  }

  getDestinations() {
    return this.#destinations;
  }

  getOfferPack() {
    return this.#offerPack;
  }

  getTypePack() {
    return this.#typePack;
  }
}
