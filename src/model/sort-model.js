import { SortType } from '../const';

export default class SortModel {
  #sortTypePack = structuredClone(SortType);
  #defaultType = Object.values(SortType).find((typeElement) => typeElement.isDefault).type;

  get sortTypePack() {
    return this.#sortTypePack;
  }

  get defaultType() {
    return this.#defaultType;
  }
}
