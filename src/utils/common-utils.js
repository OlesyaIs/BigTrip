const getInteger = (string) => parseInt(string, 10);

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

const formatToKebabCase = (string) => {
  if (!string) {
    return string;
  }

  return string.replace(hyphenOrWhiteSpaceRegExp, '-').toLowerCase();
};

// Проверки
const isEscKeydown = (evt) => evt.key === 'Escape';

export {
  getInteger,
  getStringWithUpperCaseFirst,
  formatToScreamingSnakeCase,
  formatToKebabCase,
  isEscKeydown
};
