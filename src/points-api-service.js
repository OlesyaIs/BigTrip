import ApiService from './framework/api-service.js';
import { Method } from './const.js';

export default class PointsApiService extends ApiService {

  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(point),
      headres: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }
}
