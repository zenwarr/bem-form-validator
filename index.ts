import * as validate from "validate.js";
import lodash_assign = require('lodash.assign');

export type ValidationConstraints =  { [name: string]: any };
export type FormatParams = { [name: string]: any };
export type ConstraintBuilder = (constraint: any, input: Element, option: string, msg: string|null, validator: FormValidator) => any;
export type CustomValidator = (value: string, options: any, key: string, attributes: string) => string|null|void;

export interface InputData {
  elem: Element;
  ib: Element|null;
  errorElement: Element|null;
  valid: boolean|null;
}

/**
 * All classes follow BEM convention.
 * The root element (in most cases, this is the <form> element) is a container for all element to be validated.
 */
export interface FormValidatorOptions {
  rootBlock?: string;
  rootValidMod?: string;
  rootInvalidMod?: string;
  inputBlock?: string;
  inputBlockValidMod?: string;
  inputBlockInvalidMod?: string;
  inputBlockErrorElem?: string;
  messages?: FormMessages;
  revalidateOnChange?: boolean;
  revalidateOnInput?: boolean;
}

export interface FormMessages {
  [name: string]: string|undefined;
  required?: string;
  minlength?: string;
  pattern?: string;
  email?: string;
  number?: string;
  numberMinMax?: string;
  numberMin?: string;
  numberMax?: string;
  step?: string;
  equality?: string;
  exclude?: string;
  include?: string;
  integer?: string;
  divisible?: string;
  odd?: string;
  even?: string;
  lengthEqual?: string;
  lengthMax?: string;
}

const RussianFormMessages: FormMessages = {
  required: 'Введите значение',
  minlength: 'Введите значение не короче $minlength символов',
  pattern: 'Введите значение в нужном формате',
  email: 'Введите корректный e-mail',
  number: 'Введите число',
  numberMinMax: 'Введите число в диапазоне от $min до $max',
  numberMin: 'Введите число не меньше $min',
  numberMax: 'Введите число не больше $max',
  step: 'Число должно быть с шагом в $step'
};

const OPTION_DEFAULTS: FormValidatorOptions = {
  rootBlock: 'form',
  rootValidMod: 'valid',
  rootInvalidMod: 'invalid',
  inputBlock: 'ib',
  inputBlockValidMod: 'valid',
  inputBlockInvalidMod: 'invalid',
  inputBlockErrorElem: 'error',
  revalidateOnChange: false,
  revalidateOnInput: false
};

let _customValidatorsCreated = false;
function createCustomValidators(): void {
  if (_customValidatorsCreated) {
    return;
  } else {
    _customValidatorsCreated = true;
  }

  validate.validators.step = (value: any, options: any) => {
    if (value == null) {
      return;
    }

    let numValue = +value;
    let isOptionsNumber = typeof options === 'number';

    let step = isOptionsNumber ? options : (+options.step || 0);
    if (step <= 0 || isNaN(step)) {
      step = 1;
    }
    let minValue = isOptionsNumber ? 0 : (+options.min || 0);
    if (isNaN(minValue)) {
      minValue = 0;
    }

    let defMsg = `value has invalid step (should have step ${step})`;
    let msg = isOptionsNumber ? defMsg : (options.message || defMsg);

    if ((numValue - minValue) % step) {
      return msg;
    }
  };

  FormValidator.addConstraintBuilder('equality', (constraint, input, option, message, validator) => {
    if (message) {
      constraint.equality = {
        attribute: option,
        message: validator.formatMsg(message, {
          other: option
        })
      }
    } else {
      constraint.equality = option;
    }
  });

  FormValidator.addConstraintBuilder('exclude', (constraint, input, option, message, validator) => {
    let data: any;
    try {
      data = JSON.parse(option);
    } catch (err) {
      data = [ option ];
    }

    constraint.exclusion = {
      within: data
    };
    if (message) {
      constraint.exclusion.message = message;
    }
  });

  FormValidator.addConstraintBuilder('include', (constraint, input, option, message, validator) => {
    let data: any;
    try {
      data = JSON.parse(option);
    } catch (err) {
      data = [ option ];
    }

    constraint.inclusion = {
      within: data
    };
    if (message) {
      constraint.inclusion.message = message;
    }
  });

  function setConstraintProp(constraint: any, prop: string, options: any): void {
    if (constraint[prop]) {
      assign(constraint[prop], options);
    } else {
      constraint[prop] = options;
    }
  }

  FormValidator.addConstraintBuilder('integer', (constraint, input, option, message) => {
    setConstraintProp(constraint, 'numericality', {
      onlyInteger: message ? { message } : true
    });
  });

  FormValidator.addConstraintBuilder('divisible', (constraint, input, option, message) => {
    let divisor = +option;
    if (isNaN(divisor) || divisor === 0 ) {
      console.error('invalid validation attribute divisble');
      return;
    }

    setConstraintProp(constraint, 'numericality', {
      divisibleBy: message ? { message, count: divisor } : divisor
    });
  });

  FormValidator.addConstraintBuilder('odd', (constraint, input, option, message) => {
    setConstraintProp(constraint, 'numericality', {
      odd: message ? { message } : true
    });
  });

  FormValidator.addConstraintBuilder('even', (constraint, input, option, message) => {
    setConstraintProp(constraint, 'numericality', {
      even: message ? { message } : true
    });
  });

  FormValidator.addConstraintBuilder('length-equal', (constraint, input, option, message) => {
    let length = +option;
    if (isNaN(length)) {
      console.error('invalid validation attribute length-equal');
      return;
    }

    setConstraintProp(constraint, 'length', {
      is: message ? { message, count: length } : length
    });
  });

  FormValidator.addConstraintBuilder('length-max', (constraint, input, option, message) => {
    let length = +option;
    if (isNaN(length)) {
      console.error('invalid validation attribute length-max');
      return;
    }

    setConstraintProp(constraint, 'length', {
      maximum: message ? { message, count: length } : length
    });
  });
}

export class FormValidator {
  constructor(protected _root: HTMLFormElement, options?: FormValidatorOptions) {
    createCustomValidators();

    this._options = assign({}, OPTION_DEFAULTS, options || {});

    if (this._root.tagName.toLowerCase() === 'form') {
      this._root.setAttribute('novalidate', '');
      this._root.addEventListener('submit', this.onSubmit.bind(this));
    }

    this._root.__hidden_validator = this;

    if (this._options.rootBlock) {
      this._root.classList.add(this._options.rootBlock);
    }
  }

  /**
   * Call this function to validate the all elements of the root block.
   * @param {boolean} silent Silent validation means that DOM is not altered in any way.
   * @returns {boolean} True if all elements are valid, false otherwise
   */
  validate(silent: boolean = false): boolean {
    let errors = validate(this._root, this.constraints, {
      fullMessages: false
    });

    let hasErrors = errors != null;
    if (!silent) {
      this.showErrors(errors);
      this._beginLiveValidation();
    }
    return !hasErrors;
  }

  /**
   * Call this function to validate a single element with given name.
   * @param {string} elemName Name of the element to validate
   * @param {boolean} silent Silent validation means that DOM is not altered in any way.
   * @returns {boolean} True if the element is valid, false otherwise
   */
  validateSingle(elemName: string, silent: boolean = false): boolean {
    if (!this._constraints || !this._elems) {
      this._buildConstraints();
    }

    let elemData = this._elems ? this._elems[elemName] : null;
    if (!elemData) {
      console.warn(`element with name ${elemName} has not been found while validating a single element`);
      return true;
    }

    let constraint = this._constraints ? this._constraints[elemName] : null;

    let error: string|null = null;
    if (constraint) {
      error = validate.single(this._getInputValue(elemData.elem), constraint);
    }

    if (!silent) {
      if (error) {
        this.setError(error, elemData);
      } else {
        this.clearError(elemData);
      }
    }

    return error == null;
  }

  /**
   * @returns {ValidationConstraints} List of constraints collected from HTML5 validation attributes
   */
  get constraints(): ValidationConstraints {
    if (!this._constraints) {
      this._buildConstraints();
    }
    return this._constraints as ValidationConstraints;
  }

  /**
   * @returns {Element} Form element assotiated with the object
   */
  get root(): Element {
    return this._root;
  }

  /**
   * @returns {string} Block name for a root element
   */
  get rootBlock(): string {
    return this._options.rootBlock || (OPTION_DEFAULTS.rootBlock as string);
  }

  /**
   * @returns {string} A class name applied to the root block if all its children are valid
   */
  get rootValidClass(): string {
    return makeMod(this.rootBlock, this._options.rootValidMod);
  }

  /**
   * @returns {string} A class name applied to the root element if at least one of its children is invalid
   */
  get rootInvalidClass(): string {
    return makeMod(this.rootBlock, this._options.rootInvalidMod);
  }

  get inputBlock(): string {
    return '' + this._options.inputBlock;
  }

  get inputBlockErrorElement(): string {
    return makeElem(this.inputBlock, '' + this._options.inputBlockErrorElem);
  }

  get inputBlockValidClass(): string {
    return makeMod(this.inputBlock, '' + this._options.inputBlockValidMod);
  }

  get inputBlockInvalidClass(): string {
    return makeMod(this.inputBlock, '' + this._options.inputBlockInvalidMod);
  }

  get options(): FormValidatorOptions {
    return assign({}, this._options);
  }

  get liveValidation(): boolean {
    return this._liveValidation;
  }

  static fromRoot(root: Element): FormValidator|null {
    if (!root) {
      return null;
    }
    return (root as any).__hidden_validator as FormValidator;
  }

  static init(rootClass: string = 'js-validate', options?: FormValidatorOptions): void {
    let forms = document.querySelectorAll('.' + rootClass);
    for (let q = 0; q < forms.length; ++q) {
      new FormValidator(forms[q] as HTMLFormElement, options);
    }
  }

  static addConstraintBuilder(name: string, builder: ConstraintBuilder, validator?: CustomValidator): void {
    if (this._constraintBuilders[name] != null) {
      throw new Error(`Cannot register a custom constraint builder: name [${name}] is already in use`);
    }

    if (validator && validate.validators[name] != null) {
      throw new Error(`Cannot register a custom validator: name [${name}] is already in use`);
    }

    this._constraintBuilders[name] = builder;
    if (validator) {
      validate.validators[name] = validator;
    }
  }

  formatMsg(msg: string, params: FormatParams): string {
    const SEP_CHARCODE = '$'.charCodeAt(0),
        LOW_ALPHA_START = 'a'.charCodeAt(0),
        HIGH_ALPHA_END = 'z'.charCodeAt(0),
        LG_ALPHA_START = 'A'.charCodeAt(0),
        LG_ALPHA_END = 'Z'.charCodeAt(0),
        DIGIT_START = '0'.charCodeAt(0),
        DIGIT_END = '9'.charCodeAt(0),
        UNDERSCORE = '_'.charCodeAt(0);

    let result: string[] = [];
    let tail = 0, head = 0;

    while (head < msg.length) {
      if (msg.charCodeAt(head) === SEP_CHARCODE) {
        // enter placeholder
        result.push(msg.slice(tail, head));
        tail = head;

        ++head;
        let ch = msg.charCodeAt(head);
        while ((ch >= LOW_ALPHA_START && ch <= HIGH_ALPHA_END) || (ch >= LG_ALPHA_START && ch <= LG_ALPHA_END)
        || (ch >= DIGIT_START && ch <= DIGIT_END) || ch === UNDERSCORE) {
          ch = msg.charCodeAt(++head);
        }
        let placeholder = msg.slice(tail + 1, head);
        if (placeholder.length < 2) {
          throw new Error('Invalid format string: error at ' + placeholder);
        }
        result.push('' + (params[placeholder] || ''));
        --head;
        tail = head + 1;
      } else {
        ++head;
      }
    }

    result.push(msg.slice(tail));

    return result.join('');
  }

  /** Protected area **/

  /**
   * Called to handle form submit event
   * @param {Event} e Event object
   * @returns {boolean} Return true if form should be submitted, false otherwise
   */
  protected onSubmit(e: Event): boolean {
    return this.validate();
  }

  /**
   * Called to show errors on corresponding elements.
   * @param errors Error object as retrieved from validate.js.
   */
  protected showErrors(errors: any): void {
    if (!this._elems) {
      console.warn('Invalid showErrors call: no elements has been collected');
      return;
    }

    for (let elem_name of Object.keys(this._elems)) {
      if (errors && errors[elem_name] != null) {
        this.setError(errors[elem_name], this._elems[elem_name]);
      } else {
        this.clearError(this._elems[elem_name]);
      }
    }
  }

  protected setError(msg: string, elem: InputData): void {
    // set titles
    elem.elem.setAttribute('title', msg);
    if (elem.errorElement) {
      let msgNode = document.createTextNode(msg);
      elem.errorElement.innerHTML = '';
      elem.errorElement.appendChild(msgNode);
      elem.errorElement.setAttribute('title', msg);
    }

    // set classes
    if (elem.ib) {
      elem.ib.classList.remove(this.inputBlockValidClass);
      elem.ib.classList.add(this.inputBlockInvalidClass);
    }

    elem.valid = false;

    this.setRootHasErrors(true);
  }

  protected clearError(elem: InputData): void {
    // clear titles
    elem.elem.setAttribute('title', '');
    if (elem.errorElement) {
      elem.errorElement.innerHTML = '';
      elem.errorElement.setAttribute('title', '');
    }

    // clear error classes
    if (elem.ib) {
      elem.ib.classList.add(this.inputBlockValidClass);
      elem.ib.classList.remove(this.inputBlockInvalidClass);
    }

    elem.valid = true;

    this.setRootHasErrors(this._hasInvalidElems());
  }

  protected _hasInvalidElems(): boolean {
    if (this._elems) {
      return Object.keys(this._elems).map(x => (this._elems as any)[x]).some(x => !x.valid);
    }
    return false;
  }

  protected _buildInputData(elem: Element): InputData {
    let ib = closest(elem, '.' + this._options.inputBlock);
    if (!ib) {
      return {
        elem: elem,
        ib: null,
        errorElement: null,
        valid: null
      };
    }

    let errContainerClass = makeElem('' + this._options.inputBlock, '' + this._options.inputBlockErrorElem);
    let errorElement = ib.querySelector('.' + errContainerClass);
    if (!errorElement) {
      errorElement = document.createElement('div');
      ib.appendChild(errorElement);
    }

    return {
      elem,
      ib,
      errorElement,
      valid: null
    };
  }

  protected _getElementMsg(elem: Element, ...msgClasses: string[]): string|null {
    for (let q = 0; q < msgClasses.length; ++q) {
      let msgClassUnderscored = 'data-msg-' + separated(msgClasses[q], '-'),
          msgClassCamel = 'data-msg-' + camel(msgClasses[q]);

      let attr = elem.getAttribute(msgClassUnderscored) || elem.getAttribute(msgClassCamel);
      if (attr) {
        return attr;
      }
    }

    // try generic message
    let attr = elem.getAttribute('data-msg-error');
    if (attr) {
      return attr;
    }

    if (!this._options.messages) {
      return null;
    }

    for (let q = 0; q < msgClasses.length; ++q) {
      let def = this._options.messages[camel(msgClasses[q])];
      if (def) {
        return def;
      }
    }

    return null;
  }

  protected _buildConstraints() {
    let elems = this.root.querySelectorAll('[name]');
    let builderKeys = Object.keys(FormValidator._constraintBuilders);
    let builderAttrs = builderKeys.map(x => 'data-validate-' + x);

    this._constraints = { };
    this._elems = { };
    for (let q = 0; q < elems.length; ++q) {
      let elem = elems[q];
      let elem_name = elem.getAttribute('name');
      if (!elem_name) {
        console.warn(`No name for element`, elem);
        continue;
      }

      this._elems[elem_name] = this._buildInputData(elem);

      let constraint: { [name: string]: any } = { };
      if (elem.hasAttribute('required')) {
        let message = this._getElementMsg(elem, 'required');
        constraint.presence = message ? { message } : true;
      }

      if (elem.hasAttribute('minlength')) {
        let minlength = +(elem.getAttribute('minlength') as string);
        let message = this._getElementMsg(elem, 'minlength');
        constraint.length = {
          minimum: minlength
        };

        if (message) {
          message = this.formatMsg(message, {
            minlength
          });
          constraint.length.message = message;
        }
      }

      if (elem.hasAttribute('pattern')) {
        let pattern = elem.getAttribute('pattern') as string;
        constraint.format = { pattern };

        let message = this._getElementMsg(elem, 'pattern');
        if (message) {
          message = this.formatMsg(message, { pattern });
          constraint.format.message = message;
        }
      }

      switch (elem.tagName.toLowerCase()) {
        case 'input': {
          switch ((elem.getAttribute('type') || 'text').toLowerCase()) {
            case 'email': {
              let message = this._getElementMsg(elem, 'email');
              constraint.email = message ? { message } : true;
            } break;

            case 'url': {
              let message = this._getElementMsg(elem, 'url');
              constraint.url = message ? { message } : true;

              if (elem.hasAttribute('data-validate-url-allow-local')) {
                if (typeof constraint.url === 'object') {
                  constraint.url.allowLocal = true;
                } else {
                  constraint.url = { allowLocal: true }
                }
              }

              if (elem.hasAttribute('data-validate-url-schemes')) {
                let schemes: any, schemesAttr: string = elem.getAttribute('data-validate-url-schemes') as string;
                if (schemesAttr) {
                  try {
                    schemes = JSON.parse(schemesAttr);
                  } catch (err) {
                    schemes = [ schemesAttr ]
                  }
                  if (typeof constraint.url === 'object') {
                    constraint.url.schemes = schemes;
                  } else {
                    constraint.url = {
                      schemes
                    }
                  }
                }
              }
            } break;

            case 'number': {
              constraint.numericality = { };

              let min: number|null = null, max: number|null = null, step: number|null = null;

              if (elem.hasAttribute('min')) {
                min = +(elem.getAttribute('min') as string);
                constraint.numericality.greaterThanOrEqualTo = min;
              }

              if (elem.hasAttribute('max')) {
                max = +(elem.getAttribute('max') as string);
                constraint.numericality.lessThanOrEqualTo = max;
              }

              if (elem.hasAttribute('step')) {
                step = +(elem.getAttribute('step') as string);
                constraint.step = {
                  step: step
                };
                if (min != null) {
                  constraint.step.min = min;
                }

                let msg = this._getElementMsg(elem, 'step', 'number');
                if (msg) {
                  constraint.step.message = msg;
                }
              }

              let defMsgClass: string;
              if (min == null && max == null) {
                defMsgClass = 'number';
              } else if (min != null && max != null) {
                defMsgClass = 'numberMinMax';
              } else if (min != null) {
                defMsgClass = 'numberMin';
              } else {
                defMsgClass = 'numberMax';
              }

              let message = this._getElementMsg(elem, defMsgClass, 'number');
              if (message) {
                message = this.formatMsg(message, {
                  min,
                  max,
                  step
                });
                constraint.numericality.message = message;
              }
            } break;
          }
        } break;

        case 'select':
        case 'textarea':
          break;

        default:
          console.warn('Unsupported element tag: ', elem);
          break;
      }

      for (let q = 0; q < builderKeys.length; ++q) {
        if (elem.hasAttribute(builderAttrs[q])) {
          let msg = this._getElementMsg(elem, builderKeys[q]);
          let new_constraint = FormValidator._constraintBuilders[builderKeys[q]](constraint, elem,
              '' + elem.getAttribute(builderAttrs[q]), msg, this);
          if (new_constraint) {
            constraint = new_constraint;
          }
        }
      }

      if (Object.keys(constraint).length > 0) {
        this._constraints[elem_name] = constraint;
      }
    }
  }

  protected _beginLiveValidation(): void {
    if (this._liveValidation) {
      return;
    }

    if (!this._options.revalidateOnInput && !this._options.revalidateOnChange) {
      return;
    }

    if (!this._elems) {
      this._buildConstraints();
    }

    for (let elemName of Object.keys(this._elems as any)) {
      let elemData = (this._elems as any)[elemName];

      if (this._options.revalidateOnChange) {
        elemData.elem.addEventListener('change', this.onElementChange.bind(this, elemName));
      }

      if (this._options.revalidateOnInput) {
        elemData.elem.addEventListener('input', this.onElementChange.bind(this, elemName));
      }
    }

    this._liveValidation = true;
  }

  protected onElementChange(elemName: string, e: Event): void {
    this.validateSingle(elemName);
  }

  protected setRootHasErrors(hasErrors: boolean) {
    toggleClass(this._root, this.rootValidClass, !hasErrors);
    toggleClass(this._root, this.rootInvalidClass, hasErrors);
  }

  protected _getInputValue(elem: Element): string|null {
    let value = (elem as HTMLInputElement).value;
    return value == null || value === '' ? null : value;
  }

  private _options: FormValidatorOptions;
  private _constraints: ValidationConstraints|null = null;
  private _elems: { [name: string]: InputData }|null = null;
  private _liveValidation: boolean = false;
  private static _constraintBuilders: { [name: string]: ConstraintBuilder } = { };
}

/**
 * Element.matches method polyfill.
 * We should not touch prototype of Element to avoid messing with another libs
 */
let matchesFunc: ((selector: string) => boolean)|null = null;
function matches(elem: Element, selector: string): boolean {
  if (!matchesFunc) {
    matchesFunc = Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }
  return matchesFunc.call(elem, selector);
}

/**
 * Element.closest method polyfill
 */
function closest(elem: Element, selector: string): Element|null {
  if (elem.closest) {
    return elem.closest(selector);
  } else {
    let el: Element|null = elem;
    while (el != null) {
      if (matches(el, selector)) {
        return el;
      }
      el = el.parentElement;
    }
    return el;
  }
}

function assign<T>(...objs: T[]): T {
  if ((Object as any).assign) {
    return (Object as any).assign.apply(this, objs);
  } else {
    return lodash_assign.apply(this, objs);
  }
}

function makeMod(block: string, modifier?: string|null): string {
  return modifier ? block + '--' + modifier : block;
}

function makeElem(block: string, elem: string): string {
  return block + '__' + elem;
}

function toggleClass(elem: Element, className: string, value: boolean): void {
  (value ? elem.classList.add : elem.classList.remove).call(elem.classList, className);
}

export function separated(name: string, sep: string = '_'): string {
  const CH_LG_LOWER = 'A'.charCodeAt(0),
      CH_LG_HIGH = 'Z'.charCodeAt(0);

  let tail = 0, head = 0;
  let result: string[] = [];
  while (head < name.length) {
    let ch = name.charCodeAt(head);
    if (ch >= CH_LG_LOWER && ch <= CH_LG_HIGH && head !== 0) {
      // split here
      result.push(name.slice(tail, head).toLowerCase());
      tail = head;
    }
    ++head;
  }

  if (head != tail) {
    result.push(name.slice(tail, head).toLowerCase());
  }

  return result.join(sep);
}

export function camel(name: string): string {
  let result = name.split(/[_\-]/).filter(x => x);
  return result.map((x, i) => i > 0 ? (x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase()) : x).join('');
}
