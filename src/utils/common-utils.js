const getInteger = (string) => parseInt(string, 10);

const getRandomIntegerWitinRange = (min, max) => {
  const minValue = Math.ceil(Math.min(min, max));
  const maxValue = Math.floor(Math.max(min, max));

  return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
};

const createUniqueNumberGenerator = (min, max) => {
  const values = [];

  return () => {

    if (values.length >= (max - min + 1)) {
      return null;
    }

    let newValue = getRandomIntegerWitinRange(min, max);

    while (values.includes(newValue)) {
      newValue = getRandomIntegerWitinRange(min, max);
    }

    values.push(newValue);

    return newValue;
  };
};

// Functions for String
const getStringWithUpperCaseFirst = (string) => {
  if (!string) {
    return string;
  }

  return string[0].toUpperCase() + string.slice(1);
};

const hyphenOrWhiteSpaceRegExp = /[-|\s]+/g;

const formatToScreamingSnakeCase = (string) => {
  if (!string) {
    return string;
  }

  return string.replace(hyphenOrWhiteSpaceRegExp, '_').toUpperCase();
};

// Functions for Array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getRandomIntegerWitinRange(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const getRandomArrayElement = (array) => array[getRandomIntegerWitinRange(0, array.length - 1)];

const getSomeRandomArrayElements = (array, elementsQuantity = 0) => {
  const shuffledArray = array.slice();

  shuffleArray(shuffledArray);

  return shuffledArray.slice(0, elementsQuantity + 1);
};

const sortArrayToIncrease = (array) => array.sort((a, b) => (a - b));

// Проверки
const isEscKeydown = (evt) => evt.key === 'Escape';

const updateItem = (items, updatedItem) => items.map((item) => item.id === updatedItem.id ? updatedItem : item);

export {
  getInteger,
  getRandomIntegerWitinRange,
  createUniqueNumberGenerator,
  getStringWithUpperCaseFirst,
  formatToScreamingSnakeCase,
  shuffleArray,
  getRandomArrayElement,
  getSomeRandomArrayElements,
  sortArrayToIncrease,
  isEscKeydown,
  updateItem,
};
