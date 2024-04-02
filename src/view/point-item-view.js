import AbstractView from '../framework/view/abstract-view.js';

const createPointItemTemplate = () => '<li class="trip-events__item"></li>';

export default class PointItemView extends AbstractView {
  get template() {
    return createPointItemTemplate();
  }
}
