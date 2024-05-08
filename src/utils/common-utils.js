import { HYPHEN_OR_WHITESPACE_REGEXP } from '../const.js';

const getInteger = (string) => parseInt(string, 10);

// Functions for String
const getStringWithUpperCaseFirst = (string) => {
  if (!string) {
    return string;
  }

  return string[0].toUpperCase() + string.slice(1);
};

// Formatting
const formatToScreamingSnakeCase = (string) => {
  if (!string) {
    return string;
  }

  return string.replace(HYPHEN_OR_WHITESPACE_REGEXP, '_').toUpperCase();
};

const formatToKebabCase = (string) => {
  if (!string) {
    return string;
  }

  return string.replace(HYPHEN_OR_WHITESPACE_REGEXP, '-').toLowerCase();
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
