import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortItemTemplate = ({type, title, isDisabled}, currentType) =>
  `<div class="trip-sort__item  trip-sort__item--${type}">
    <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" data-sort-type="${type}"${type === currentType ? ' checked' : ''}${isDisabled ? ' disabled' : ''}>
    <label class="trip-sort__btn" for="sort-${type}">${title}</label>
  </div>`;

const createSortTemplate = (currentType) =>
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${Object.values(SortType)
    .map((sort) => createSortItemTemplate(sort, currentType))
    .join('')}
  </form>`;

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentType = null;

  constructor({onSortTypeChange, currentType}) {
    super();
    this.#currentType = currentType;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('change', this.#onSortTypeChange);
  }

  get template() {
    return createSortTemplate(this.#currentType);
  }

  #onSortTypeChange = (evt) => {
    if (!evt.target.hasAttribute('data-sort-type')) {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
