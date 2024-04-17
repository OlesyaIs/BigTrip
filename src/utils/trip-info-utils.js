import { formatToScreamingSnakeCase } from './common-utils.js';

const getTripRouteDestinations = (sortedPoints, allDestinations) => {
  const destinations = [];
  let previousDestination = '';

  sortedPoints.forEach((point) => {
    const currentDestination = allDestinations.find((destination) => destination.id === point.destination).name;
    if (currentDestination !== previousDestination) {
      destinations.push(currentDestination);
    }
    previousDestination = currentDestination;
  });

  return destinations;
};

const getTripCost = (points, offerPack) => {
  let sum = 0;
  points.forEach((point) => {
    sum += point.basePrice;
    const offersPack = offerPack[formatToScreamingSnakeCase(point.type)];
    point.offers.forEach((currentOfferId) => {
      const currentOffer = offersPack.find((offer) => currentOfferId === offer.id);
      sum += currentOffer.price;
    });
  });

  return sum;
};

export { getTripRouteDestinations, getTripCost };
