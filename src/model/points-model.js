import { TypePack } from '../const.js';
import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #tripApiService = null;
  #points = [];
  #destinations = [];
  #offerPack = {};
  #typePack = structuredClone(TypePack);

  constructor({tripApiService}) {
    super();
    this.#tripApiService = tripApiService;
  }

  get points() {
    return this.#points;
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

  async init() {
    try {
      this.#points = await this.#tripApiService.points;
    } catch(err) {
      this.#points = [];
    }

    try {
      this.#destinations = await this.#tripApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    try {
      this.#offerPack = await this.#tripApiService.offerPack;
    } catch(err) {
      this.#offerPack = {};
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point.');
    }

    try {
      const updatedPoint = await this.#tripApiService.updatePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];
      this._notify(updateType, updatedPoint);
    } catch {
      throw new Error('Can\'t update point.');
    }
  }

  async addPoint(updateType, update) {
    try {
      const newPoint = await this.#tripApiService.addPoint(update);
      this.#points = [
        newPoint,
        ...this.#points,
      ];
      this._notify(updateType, newPoint);
    } catch {
      throw new Error('Can\t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point.');
    }

    try {
      await this.#tripApiService.deletePoint(update);
      this.#points = this.#points.filter((point) => point.id !== update.id);
      this._notify(updateType);
    } catch {
      throw new Error('Can\'t delete point');
    }
  }
}
