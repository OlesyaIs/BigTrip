import { formatToScreamingSnakeCase } from './common-utils.js';

const getTripRouteDestinations = (sortedPoints, allDestinations) => {
  const destinations = [];
  let previousDestination = '';

  sortedPoints.forEach((point) => {
    const currentDestination = allDestinations.find((destination) => destination.id === point.destination);
    if (!currentDestination) {
      return;
    }
    const currentDestinationName = currentDestination.name;
    if (currentDestinationName !== previousDestination) {
      destinations.push(currentDestinationName);
    }
    previousDestination = currentDestinationName;
  });

  return destinations;
};

const getTripCost = (points, offerPack) => {
  let sum = 0;
  points.forEach((point) => {
    const addedPrice = parseInt(point.basePrice, 10);
    if (addedPrice && !Number.isNaN(addedPrice)) {
      sum += addedPrice;
    }
    const offersPack = offerPack[formatToScreamingSnakeCase(point.type)];
    point.offers.forEach((currentOfferId) => {
      const currentOffer = offersPack.find((offer) => currentOfferId === offer.id);
      sum += currentOffer.price;
    });
  });

  return sum;
};

export { getTripRouteDestinations, getTripCost };
