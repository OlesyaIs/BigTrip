import ApiService from './framework/api-service.js';
import { Method } from './const.js';

export default class PointsApiService extends ApiService {

  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse)
      .then((points) => points.map((point) => this.#adaptToClient(point)));
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headres: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  #adaptToServer(point) {
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


  #adaptToClient(point) {
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
}
