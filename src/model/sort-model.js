import { SortType } from '../const';

export default class SortModel {
  #sortTypePack = structuredClone(SortType);
  #defaultSortType = Object.values(SortType).find((typeElement) => typeElement.isDefault).type;
  #currentSortType = null;

  get sortTypePack() {
    return this.#sortTypePack;
  }

  set sortTypePack(newSortTypePack) {
    this.#sortTypePack = newSortTypePack;
  }

  get defaultSortType() {
    return this.#defaultSortType;
  }

  get currentSortType() {
    return this.#currentSortType;
  }

  set currentSortType(newType) {
    if (!this.#sortTypePack[newType.toUpperCase()]) {
      throw new Error('Can\'t set unknown sort type');
    }

    this.#currentSortType = newType;
  }
}
