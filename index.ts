import * as validate from "validate.js";
import lodash_assign = require('lodash.assign');
import closest from "zw-closest";

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

export interface FormValidatorOptions {
  /**
   * Class to be applied when root is valid (e.g. all elements inside the root are validated and valid)
   */
  rootValidClass?: string;

  /**
   * Class to be applied when root is invalid (e.g. at least one element inside the root is validated and valid)
   */
  rootInvalidClass?: string;

  /**
   * Class name for an input block.
   * Input block as an optional element that wraps a single input.
   * If input block element exists, it can contain a special 'errorElement' which holds an error message associated with wrapped input.
   * If no errorElement exists, it is automatically created.
   */
  inputBlockClass?: string;

  /**
   * Class to be applied to a valid input block (e.g. when wrapped element is validated and is valid)
   */
  inputBlockValidClass?: string;

  /**
   * Class to be applied to an invalid input block (e.g. when wrapped element is validated and is invalid)
   */
  inputBlockInvalidClass?: string;

  /**
   * Class name for an error element inside input block.
   * If there are no element with given class inside an input block, a new node is created and attached to DOM.
   */
  errorElementClass?: string;

  /**
   * A class to be applied to validated and valid element itself.
   */
  inputValidClass?: string;

  /**
   * A class to be applied to validated and invalid element itself.
   */
  inputInvalidClass?: string;

  /**
   * Error messages that should be shown.
   */
  messages?: FormMessages;

  /**
   * When in live mode, whether the element should be revalidated on 'change' event (usually fired after user changed input value and the input has lost focus)
   */
  revalidateOnChange?: boolean;

  /**
   * When in live mode, whether the element should be revalidated on 'input' event (if it is supported).
   */
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
  rootValidClass: 'form--valid',
  rootInvalidClass: 'form--invalid',
  inputBlockClass: 'ib',
  inputBlockValidClass: 'ib--valid',
  inputBlockInvalidClass: 'ib--invalid',
  errorElementClass: 'ib__error',
  inputValidClass: 'input--valid',
  inputInvalidClass: 'input--invalid',
  revalidateOnChange: false,
  revalidateOnInput: false,
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

const ATTRS_TO_INVALIDATE_CONSTRAINTS = [ 'type', 'required', 'min', 'max', 'step', 'pattern', 'minlength', 'formnovalidate' ];

export class FormValidator {
  /**
   * Creates a validator attached to the given root element.
   * It is not required for the root element to be a form.
   * But if it is a form, its native validation is disabled and validation is implemented by this class.
   * @param {HTMLFormElement} _root
   * @param {FormValidatorOptions} options
   */
  constructor(protected _root: HTMLFormElement, options?: FormValidatorOptions) {
    createCustomValidators();

    this._options = assign({}, OPTION_DEFAULTS, options || {});

    if (this._root.tagName.toLowerCase() === 'form') {
      this._root.setAttribute('novalidate', '');
      this._root.addEventListener('submit', this.onSubmit.bind(this));
    }

    this._root.__hidden_validator = this;

    // react on changes in DOM that can trigger changes in constraints
    if ((window as any).MutationObserver) {
      let observer = new MutationObserver(mutations => {
        for (let q = 0; q < mutations.length; ++q) {
          let mut = mutations[q];

          if (mut.type !== 'attributes') {
            this._constraints = null;
            return;
          }
          let attr = mut.attributeName;
          if (!attr) {
            continue;
          }
          attr = attr.toLowerCase();
          if (attr.indexOf('data-') === 0) {
            this._constraints = null;
            return;
          } else if (ATTRS_TO_INVALIDATE_CONSTRAINTS.indexOf(attr) >= 0) {
            this._constraints = null;
            return;
          }
        }
      });

      observer.observe(this._root, {
        childList: true,
        attributes: true,
        subtree: true
      });
    } else {
      // no MutationObserver support
      this._autoInvalidateConstraints = true;
    }
  }

  /**
   * Call this function to validate the all elements inside the root block.
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
    this._ensureConstraintsAreBuilt();

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
    this._ensureConstraintsAreBuilt();
    return this._constraints as ValidationConstraints;
  }

  /**
   * @returns {Element} Form element assotiated with the object
   */
  get root(): Element {
    return this._root;
  }

  get options(): FormValidatorOptions {
    return assign({}, this._options);
  }

  /**
   * @returns {boolean} True if the validator is currently in live mode, false otherwise
   */
  get liveValidation(): boolean {
    return this._liveValidation;
  }

  /**
   * Get validator object for the given root element.
   * @param {Element} root
   * @returns {FormValidator | null}
   */
  static fromRoot(root: Element): FormValidator|null {
    if (!root) {
      return null;
    }
    return (root as any).__hidden_validator as FormValidator;
  }

  /**
   * Call this function to automatically create and initialize validators for all elements with given class in the current DOM.
   * @param {string} rootClass Class of root element
   * @param {FormValidatorOptions} options Options for validator objects
   */
  static init(rootClass: string = 'js-validate', options?: FormValidatorOptions): void {
    let forms = document.querySelectorAll('.' + rootClass);
    for (let q = 0; q < forms.length; ++q) {
      new FormValidator(forms[q] as HTMLFormElement, options);
    }
  }

  /**
   * You can create custom validators that can be attached to your inputs and manipulated by DOM.
   * But you should register the constraint builder first.
   * A constraint builder acts like a filter for constraints object and is called each time validator rebuilds constraints.
   * Each constraint builder has a name.
   * If an input has a data attribute in form of `data-validate-${constraint-builder-name}`, validator will call your constraint builder and give it constraint object to process.
   * You are free to modify this object as you wish.
   * @param {string} name
   * @param {ConstraintBuilder} builder
   * @param {CustomValidator} validator
   */
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

  /**
   * Formats a message, replacing placeholders in form $name with values from `params` object.
   * @param {string} msg Message string to be formatted.
   * @param {FormatParams} params Object holding parameters to be replaced
   * @returns {string} Formatted string
   */
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
   * It is guaranteed that after successfully calling this functions constraints are up-to date with DOM values.
   * @private
   */
  protected _ensureConstraintsAreBuilt(): void {
    if (!this._constraints || this._autoInvalidateConstraints) {
      this._rebuildElems();
      this._buildConstraints();
    }
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

  /**
   * Called to set error state for the element in DOM.
   * @param {string} msg Error message for the element
   * @param {InputData} elem Element data
   */
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
      if (this.options.inputBlockValidClass) {
        elem.ib.classList.remove(this.options.inputBlockValidClass);
      }
      if (this.options.inputBlockInvalidClass) {
        elem.ib.classList.add(this.options.inputBlockInvalidClass);
      }
    }

    if (this.options.inputInvalidClass) {
      elem.elem.classList.add(this.options.inputInvalidClass);
    }
    if (this.options.inputValidClass) {
      elem.elem.classList.remove(this.options.inputValidClass);
    }

    elem.valid = false;

    this.setRootHasErrors(true);
  }

  /**
   * Called to set valid state for the element in DOM
   * @param {InputData} elem Element data
   */
  protected clearError(elem: InputData): void {
    // clear titles
    elem.elem.setAttribute('title', '');
    if (elem.errorElement) {
      elem.errorElement.innerHTML = '';
      elem.errorElement.setAttribute('title', '');
    }

    // clear error classes
    if (elem.ib) {
      if (this.options.inputBlockValidClass) {
        elem.ib.classList.add(this.options.inputBlockValidClass);
      }
      if (this.options.inputBlockInvalidClass) {
        elem.ib.classList.remove(this.options.inputBlockInvalidClass);
      }
    }

    if (this.options.inputInvalidClass) {
      elem.elem.classList.remove(this.options.inputInvalidClass);
    }
    if (this.options.inputValidClass) {
      elem.elem.classList.add(this.options.inputValidClass);
    }

    elem.valid = true;

    this.setRootHasErrors(this._hasInvalidElems());
  }

  /**
   * @returns {boolean} True if the root has at least validated and invalid element.
   * @private
   */
  protected _hasInvalidElems(): boolean {
    if (this._elems) {
      return Object.keys(this._elems).map(x => (this._elems as any)[x]).some(x => !x.valid);
    }
    return false;
  }

  /**
   * Updates input element data, getting its state from DOM.
   * Validity state is not resetted.
   * @param {InputData} data Element data
   * @param {Element} elem Element node in DOM
   * @private
   */
  protected _updateInputData(data: InputData, elem: Element): void {
    let ib = this._options.inputBlockClass ? closest(elem, '.' + this._options.inputBlockClass) : null;
    if (!ib) {
      data.elem = elem;
      data.ib = null;
      data.errorElement = null;
      return;
    }

    let errorElement: Element|null = null;
    if (this._options.errorElementClass) {
      errorElement = ib.querySelector('.' + this._options.errorElementClass);
      if (!errorElement) {
        errorElement = document.createElement('div');
        ib.appendChild(errorElement);
      }
    }

    data.elem = elem;
    data.ib = ib;
    data.errorElement = errorElement;
  }

  /**
   * Creates data entry for element inside the root.
   * @param {Element} elem Element node in DOM
   * @returns {InputData} Element data
   * @private
   */
  protected _buildInputData(elem: Element): InputData {
    let result: InputData = { valid: null } as InputData;
    this._updateInputData(result, elem);
    return result;
  }

  /**
   * Get unformatted message of the given class text for an element
   * @param {Element} elem Element node
   * @param {string} msgClasses List of message classes.
   * @returns {string | null}
   * @private
   */
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

  /**
   * Update element data.
   * It synchronizes element data with DOM, removing data entries for element that has been removed from DOM, adding data for elements added to DOM and updating data for updated nodes.
   * @private
   */
  protected _rebuildElems(): void {
    if (!this._elems) {
      this._elems = { };
    }

    let elems = this.root.querySelectorAll('[name]');
    let notUpdated = Object.keys(this._elems);
    for (let q = 0; q < elems.length; ++q) {
      let elem = elems[q],
          elemName = elem.getAttribute('name') || '';

      if (!elemName) {
        console.warn(`No name for element`, elem);
        continue;
      }

      if (this._elems[elemName]) {
        this._updateInputData(this._elems[elemName], elem);
        notUpdated.splice(notUpdated.indexOf(elemName), 1);
      } else {
        this._elems[elemName] = this._buildInputData(elem);
      }
    }

    // remove entries that no more exist
    for (let q = 0; q < notUpdated.length; ++q) {
      delete this._elems[notUpdated[q]];
    }
  }

  /**
   * Rebuilds constraint data from DOM data.
   * Constraints are automatilly rebuilded when DOM is changed.
   * @private
   */
  protected _buildConstraints(): void {
    this._rebuildElems();
    if (!this._elems) {
      return;
    }

    let builderKeys = Object.keys(FormValidator._constraintBuilders);
    let builderAttrs = builderKeys.map(x => 'data-validate-' + x);

    this._constraints = { };

    let elemNames = Object.keys(this._elems);
    for (let q = 0; q < elemNames.length; ++q) {
      let elemName = elemNames[q],
          elemData = this._elems[elemName],
          elem = elemData.elem;

      if (elem.hasAttribute('data-ignored') || elem.hasAttribute('formnovalidate')) {
        continue;
      }

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
        this._constraints[elemName] = constraint;
      }
    }
  }

  /**
   * Enter live validation mode
   * @private
   */
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

  /**
   * Called when value of an element has been changed.
   * @param {string} elemName
   * @param {Event} e
   */
  protected onElementChange(elemName: string, e: Event): void {
    this.validateSingle(elemName);
  }

  /**
   * Updates root node to reflect its validity state.
   * @param {boolean} hasErrors
   */
  protected setRootHasErrors(hasErrors: boolean) {
    if (this._options.rootValidClass) {
      toggleClass(this._root, this._options.rootValidClass, !hasErrors);
    }
    if (this._options.rootInvalidClass) {
      toggleClass(this._root, this._options.rootInvalidClass, hasErrors);
    }
  }

  /**
   * Helper function to get value of an element.
   * @param {Element} elem
   * @returns {string | null}
   * @private
   */
  protected _getInputValue(elem: Element): string|null {
    let value = (elem as HTMLInputElement).value;
    return value == null || value === '' ? null : value;
  }

  private _options: FormValidatorOptions;
  private _constraints: ValidationConstraints|null = null;
  private _elems: { [name: string]: InputData }|null = null;
  private _liveValidation: boolean = false;
  private _autoInvalidateConstraints: boolean = false;
  private static _constraintBuilders: { [name: string]: ConstraintBuilder } = { };
}

function assign<T>(...objs: T[]): T {
  if ((Object as any).assign) {
    return (Object as any).assign.apply(this, objs);
  } else {
    return lodash_assign.apply(this, objs);
  }
}

function toggleClass(elem: Element, className: string, value: boolean): void {
  (value ? elem.classList.add : elem.classList.remove).call(elem.classList, className);
}

/**
 * Helper function that converts a name into a name in underscore-separated format (in fact, you can replace an underscore with a character of your choice)
 * @param {string} name Name in camel-case format (or mixed with underscores and dashes)
 * @param {string} sep Separator to use instead of underscore
 * @returns {string} Formatted name
 */
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

/**
 * Converts name where parts are separated with underscores or dashes to camel-case format
 * @param {string} name
 * @returns {string} Camel-case formatted name
 */
export function camel(name: string): string {
  let result = name.split(/[_\-]/).filter(x => x);
  return result.map((x, i) => i > 0 ? (x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase()) : x).join('');
}
