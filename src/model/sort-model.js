import { SortType } from '../const';
import Observable from '../framework/observable';

export default class SortModel extends Observable {
  #sortTypePack = structuredClone(SortType);
  #defaultSortType = Object.values(SortType).find((typeElement) => typeElement.isDefault).type;
  #currentSortType = this.#defaultSortType;

  get sortTypePack() {
    return this.#sortTypePack;
  }

  get defaultSortType() {
    return this.#defaultSortType;
  }

  get currentSortType() {
    return this.#currentSortType;
  }

  set currentSortType(newSortType) {
    this.#currentSortType = newSortType;
  }

  setCurrentSortType(updateType, newSortType) {
    this.#currentSortType = newSortType;
    this._notify(updateType, newSortType);
  }
}
