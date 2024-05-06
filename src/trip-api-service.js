import ApiService from './framework/api-service.js';
import { Method, EndPoint } from './const.js';
import { formatToKebabCase } from './utils/common-utils.js';

export default class TripApiService extends ApiService {

  get points() {
    return this._load({url: EndPoint.POINTS})
      .then(ApiService.parseResponse)
      .then((points) => points.map((point) => this.#adaptPointToClient(point)));
  }

  get destinations() {
    return this._load({url: EndPoint.DESTINATIONS})
      .then(ApiService.parseResponse);
  }

  get offerPack() {
    return this._load({url: EndPoint.OFFERS})
      .then(ApiService.parseResponse)
      .then((offers) => this.#adaptOffersToClient(offers));
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `${EndPoint.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    const adaptedResponse = this.#adaptPointToClient(parsedResponse);
    return adaptedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: EndPoint.POINTS,
      method: Method.POST,
      body: JSON.stringify(this.#adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    const adaptedResponse = this.#adaptPointToClient(parsedResponse);

    return adaptedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `${EndPoint.POINTS}/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptPointToServer(point) {
    const adaptedPoint = {...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
      'is_favorite': point.isFavorite
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }

  #adaptPointToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  #adaptOffersToClient(offers) {
    const offerPack = {};
    offers.forEach((offersOfTypePack) => {
      const keeType = offersOfTypePack.type.toUpperCase();
      const offersOfType = offersOfTypePack.offers.map((offer) => ({...offer, shortTitle: formatToKebabCase(offer.title)}));
      offerPack[keeType] = offersOfType;
    });
    return offerPack;
  }
}
