import { SortType } from '../const';

export default class SortModel {
  #sortPack = structuredClone(SortType);
  #defaultType = Object.values(SortType).find((typeElement) => typeElement.isDefault).type;

  get sortPack() {
    return this.#sortPack;
  }

  get defaultType() {
    return this.#defaultType;
  }
}
