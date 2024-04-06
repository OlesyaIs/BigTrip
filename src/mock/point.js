import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { getRandomIntegerWitinRange, formatToScreamingSnakeCase, getRandomArrayElement, getSomeRandomArrayElements } from '../utils/common-utils.js';
import { TypePack } from './type-pack.js';
import { DESTINATIONS } from './destination.js';
import { OfferPack } from './offer-pack.js';

const MONTHS_QIANTITY = 12;
const DAYS_QUANTITY = 31;
const HOURS_QUANTITY = 23;
const MINUTES_QUANTITY = 59;
const MINUTES_IN_DAY = 1440;

const createRandomDate = () => new Date(2024, getRandomIntegerWitinRange(1, MONTHS_QIANTITY), getRandomIntegerWitinRange(1, DAYS_QUANTITY), getRandomIntegerWitinRange(0, HOURS_QUANTITY), getRandomIntegerWitinRange(0, MINUTES_QUANTITY));

const increaseDate = (initDate) => dayjs(initDate).add(getRandomIntegerWitinRange(0, MINUTES_IN_DAY), 'm').toDate();

const createOffersIndexes = (offers) => {
  const offersIds = offers.map((offer) => offer.id);
  const currentPointOffersIds = getSomeRandomArrayElements(offersIds, getRandomIntegerWitinRange(0, offersIds.length));

  return currentPointOffersIds;
};

const createRandomPoint = () => {
  const type = TypePack[getRandomArrayElement(Object.keys(TypePack))].type;
  const keyType = formatToScreamingSnakeCase(type);
  const startDate = createRandomDate();
  return ({
    id: nanoid(),
    type: type,
    dateFrom: startDate,
    dateTo: increaseDate(startDate),
    destination: getRandomIntegerWitinRange(0, DESTINATIONS.length - 1),
    basePrice: TypePack[keyType].price,
    offers: createOffersIndexes(OfferPack[keyType]),
    isFavorite: Boolean(getRandomIntegerWitinRange(0, 1)),
  });
};

export { createRandomPoint };
