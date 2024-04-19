import { SortType } from '../const';

export default class SortModel {
  #sortTypePack = structuredClone(SortType);
  #defaultType = Object.values(SortType).find((typeElement) => typeElement.isDefault).type;
  #currentType = null;

  get sortTypePack() {
    return this.#sortTypePack;
  }

  set sortTypePack(newSortTypePack) {
    this.#sortTypePack = newSortTypePack;
  }

  get defaultType() {
    return this.#defaultType;
  }

  get currentType() {
    return this.#currentType;
  }

  set currentType(newType) {
    if (!this.#sortTypePack[newType.toUpperCase()]) {
      throw new Error('Can\'t set unknown sort type');
    }

    this.#currentType = newType;
  }
}
