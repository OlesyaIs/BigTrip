import AbstractView from '../framework/view/abstract-view.js';
import { EmptyListMessage } from '../const.js';

const createEmptyListMessageTemplate = (currentFilter) => `<p class="trip-events__msg">${EmptyListMessage[currentFilter]}</p>`;

export default class EmptyListMessageView extends AbstractView {
  #currentFilter = null;

  constructor({currentFilter}) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createEmptyListMessageTemplate(this.#currentFilter);
  }
}
