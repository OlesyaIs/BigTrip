import pristine from 'pristinejs';
import { EditValidatorSettingClassName, EditPointInputId, ValidateErrorMessage } from '../const.js';

export default class PointValidator {
  #destinations = [];

  #pristine = null;
  #formElement = null;

  #destinationInput = null;
  #priceInput = null;
  #dateInputs = [];
  #inputs = [];

  init({formElement, destinations}) {
    this.#destinations = destinations;

    this.#formElement = formElement;
    this.#destinationInput = this.#formElement.querySelector(`#${EditPointInputId.DESTINATION}`);
    this.#priceInput = this.#formElement.querySelector(`#${EditPointInputId.PRICE}`);
    this.#dateInputs.push(this.#formElement.querySelector(`#${EditPointInputId.STARTTIME}`));
    this.#dateInputs.push(this.#formElement.querySelector(`#${EditPointInputId.ENDTIME}`));
    this.#inputs = [
      this.#destinationInput,
      this.#priceInput,
      ...this.#dateInputs
    ];

    this.#pristine = new pristine(
      this.#formElement,
      {
        classTo: EditValidatorSettingClassName.ERROR_TEXT_PARENT,
        errorTextParent: EditValidatorSettingClassName.ERROR_TEXT_PARENT,
        errorTextClass: EditValidatorSettingClassName.ERROR_TEXT
      },
      false
    );

    this.addValidator(this.#destinationInput, this.#validateDestination, ValidateErrorMessage.INKNOWN_DESTINATION);
    this.#dateInputs.forEach((dateInput) => this.addValidator(dateInput, this.#validateDate, ValidateErrorMessage.REQUIRE_DATE));

  }

  addValidator(element, validateFunction, message) {
    this.#pristine.addValidator(element, validateFunction, message, 1, true);
  }

  #validateDestination = (value) => this.#destinations.some((destination) => destination.name === value);


  #validateDate = (value) => Boolean(value);

  validatePoint() {
    return this.#pristine.validate(this.#inputs);
  }

  resetErrors() {
    this.#pristine.reset();
  }

  destroy() {
    this.#pristine.destroy();
    this.#pristine = null;
    this.#formElement = null;
    this.#destinationInput = null;
    this.#priceInput = null;
    this.#dateInputs = [];
    this.#inputs = [];
  }
}
