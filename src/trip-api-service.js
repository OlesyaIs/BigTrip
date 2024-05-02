import ApiService from './framework/api-service.js';
import { Method } from './const.js';
import { formatToKebabCase } from './utils/common-utils.js';

export default class TripApiService extends ApiService {

  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse)
      .then((points) => points.map((point) => this.#adaptPointToClient(point)));
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptPointToServer(point)),
      headres: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offerPack() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse)
      .then((offers) => this.#adaptOffersToClient(offers));
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
    delete adaptedPoint.basePrice;

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
