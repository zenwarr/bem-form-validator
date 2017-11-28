(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var validate = __webpack_require__(2);
var lodash_assign = __webpack_require__(4);
var RussianFormMessages = {
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
var OPTION_DEFAULTS = {
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
var _customValidatorsCreated = false;
function createCustomValidators() {
    if (_customValidatorsCreated) {
        return;
    }
    else {
        _customValidatorsCreated = true;
    }
    validate.validators.step = function (value, options) {
        if (value == null) {
            return;
        }
        var numValue = +value;
        var isOptionsNumber = typeof options === 'number';
        var step = isOptionsNumber ? options : (+options.step || 0);
        if (step <= 0 || isNaN(step)) {
            step = 1;
        }
        var minValue = isOptionsNumber ? 0 : (+options.min || 0);
        if (isNaN(minValue)) {
            minValue = 0;
        }
        var defMsg = "value has invalid step (should have step " + step + ")";
        var msg = isOptionsNumber ? defMsg : (options.message || defMsg);
        if ((numValue - minValue) % step) {
            return msg;
        }
    };
    FormValidator.addConstraintBuilder('equality', function (constraint, input, option, message, validator) {
        if (message) {
            constraint.equality = {
                attribute: option,
                message: validator.formatMsg(message, {
                    other: option
                })
            };
        }
        else {
            constraint.equality = option;
        }
    });
    FormValidator.addConstraintBuilder('exclude', function (constraint, input, option, message, validator) {
        var data;
        try {
            data = JSON.parse(option);
        }
        catch (err) {
            data = [option];
        }
        constraint.exclusion = {
            within: data
        };
        if (message) {
            constraint.exclusion.message = message;
        }
    });
    FormValidator.addConstraintBuilder('include', function (constraint, input, option, message, validator) {
        var data;
        try {
            data = JSON.parse(option);
        }
        catch (err) {
            data = [option];
        }
        constraint.inclusion = {
            within: data
        };
        if (message) {
            constraint.inclusion.message = message;
        }
    });
    function setConstraintProp(constraint, prop, options) {
        if (constraint[prop]) {
            assign(constraint[prop], options);
        }
        else {
            constraint[prop] = options;
        }
    }
    FormValidator.addConstraintBuilder('integer', function (constraint, input, option, message) {
        setConstraintProp(constraint, 'numericality', {
            onlyInteger: message ? { message: message } : true
        });
    });
    FormValidator.addConstraintBuilder('divisible', function (constraint, input, option, message) {
        var divisor = +option;
        if (isNaN(divisor) || divisor === 0) {
            console.error('invalid validation attribute divisble');
            return;
        }
        setConstraintProp(constraint, 'numericality', {
            divisibleBy: message ? { message: message, count: divisor } : divisor
        });
    });
    FormValidator.addConstraintBuilder('odd', function (constraint, input, option, message) {
        setConstraintProp(constraint, 'numericality', {
            odd: message ? { message: message } : true
        });
    });
    FormValidator.addConstraintBuilder('even', function (constraint, input, option, message) {
        setConstraintProp(constraint, 'numericality', {
            even: message ? { message: message } : true
        });
    });
    FormValidator.addConstraintBuilder('length-equal', function (constraint, input, option, message) {
        var length = +option;
        if (isNaN(length)) {
            console.error('invalid validation attribute length-equal');
            return;
        }
        setConstraintProp(constraint, 'length', {
            is: message ? { message: message, count: length } : length
        });
    });
    FormValidator.addConstraintBuilder('length-max', function (constraint, input, option, message) {
        var length = +option;
        if (isNaN(length)) {
            console.error('invalid validation attribute length-max');
            return;
        }
        setConstraintProp(constraint, 'length', {
            maximum: message ? { message: message, count: length } : length
        });
    });
}
var FormValidator = /** @class */ (function () {
    function FormValidator(_root, options) {
        this._root = _root;
        this._constraints = null;
        this._elems = null;
        this._liveValidation = false;
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
    FormValidator.prototype.validate = function (silent) {
        if (silent === void 0) { silent = false; }
        var errors = validate(this._root, this.constraints, {
            fullMessages: false
        });
        var hasErrors = errors != null;
        if (!silent) {
            this.showErrors(errors);
            this._beginLiveValidation();
        }
        return !hasErrors;
    };
    /**
     * Call this function to validate a single element with given name.
     * @param {string} elemName Name of the element to validate
     * @param {boolean} silent Silent validation means that DOM is not altered in any way.
     * @returns {boolean} True if the element is valid, false otherwise
     */
    FormValidator.prototype.validateSingle = function (elemName, silent) {
        if (silent === void 0) { silent = false; }
        if (!this._constraints || !this._elems) {
            this._buildConstraints();
        }
        var elemData = this._elems ? this._elems[elemName] : null;
        if (!elemData) {
            console.warn("element with name " + elemName + " has not been found while validating a single element");
            return true;
        }
        var constraint = this._constraints ? this._constraints[elemName] : null;
        var error = null;
        if (constraint) {
            error = validate.single(this._getInputValue(elemData.elem), constraint);
        }
        if (!silent) {
            if (error) {
                this.setError(error, elemData);
            }
            else {
                this.clearError(elemData);
            }
        }
        return error == null;
    };
    Object.defineProperty(FormValidator.prototype, "constraints", {
        /**
         * @returns {ValidationConstraints} List of constraints collected from HTML5 validation attributes
         */
        get: function () {
            if (!this._constraints) {
                this._buildConstraints();
            }
            return this._constraints;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValidator.prototype, "root", {
        /**
         * @returns {Element} Form element assotiated with the object
         */
        get: function () {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValidator.prototype, "rootBlock", {
        /**
         * @returns {string} Block name for a root element
         */
        get: function () {
            return this._options.rootBlock || OPTION_DEFAULTS.rootBlock;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValidator.prototype, "rootValidClass", {
        /**
         * @returns {string} A class name applied to the root block if all its children are valid
         */
        get: function () {
            return makeMod(this.rootBlock, this._options.rootValidMod);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValidator.prototype, "rootInvalidClass", {
        /**
         * @returns {string} A class name applied to the root element if at least one of its children is invalid
         */
        get: function () {
            return makeMod(this.rootBlock, this._options.rootInvalidMod);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValidator.prototype, "inputBlock", {
        get: function () {
            return '' + this._options.inputBlock;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValidator.prototype, "inputBlockErrorElement", {
        get: function () {
            return makeElem(this.inputBlock, '' + this._options.inputBlockErrorElem);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValidator.prototype, "inputBlockValidClass", {
        get: function () {
            return makeMod(this.inputBlock, '' + this._options.inputBlockValidMod);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValidator.prototype, "inputBlockInvalidClass", {
        get: function () {
            return makeMod(this.inputBlock, '' + this._options.inputBlockInvalidMod);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValidator.prototype, "options", {
        get: function () {
            return assign({}, this._options);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormValidator.prototype, "liveValidation", {
        get: function () {
            return this._liveValidation;
        },
        enumerable: true,
        configurable: true
    });
    FormValidator.fromRoot = function (root) {
        if (!root) {
            return null;
        }
        return root.__hidden_validator;
    };
    FormValidator.init = function (rootClass, options) {
        if (rootClass === void 0) { rootClass = 'js-validate'; }
        var forms = document.querySelectorAll('.' + rootClass);
        for (var q = 0; q < forms.length; ++q) {
            new FormValidator(forms[q], options);
        }
    };
    FormValidator.addConstraintBuilder = function (name, builder, validator) {
        if (this._constraintBuilders[name] != null) {
            throw new Error("Cannot register a custom constraint builder: name [" + name + "] is already in use");
        }
        if (validator && validate.validators[name] != null) {
            throw new Error("Cannot register a custom validator: name [" + name + "] is already in use");
        }
        this._constraintBuilders[name] = builder;
        if (validator) {
            validate.validators[name] = validator;
        }
    };
    FormValidator.prototype.formatMsg = function (msg, params) {
        var SEP_CHARCODE = '$'.charCodeAt(0), LOW_ALPHA_START = 'a'.charCodeAt(0), HIGH_ALPHA_END = 'z'.charCodeAt(0), LG_ALPHA_START = 'A'.charCodeAt(0), LG_ALPHA_END = 'Z'.charCodeAt(0), DIGIT_START = '0'.charCodeAt(0), DIGIT_END = '9'.charCodeAt(0), UNDERSCORE = '_'.charCodeAt(0);
        var result = [];
        var tail = 0, head = 0;
        while (head < msg.length) {
            if (msg.charCodeAt(head) === SEP_CHARCODE) {
                // enter placeholder
                result.push(msg.slice(tail, head));
                tail = head;
                ++head;
                var ch = msg.charCodeAt(head);
                while ((ch >= LOW_ALPHA_START && ch <= HIGH_ALPHA_END) || (ch >= LG_ALPHA_START && ch <= LG_ALPHA_END)
                    || (ch >= DIGIT_START && ch <= DIGIT_END) || ch === UNDERSCORE) {
                    ch = msg.charCodeAt(++head);
                }
                var placeholder = msg.slice(tail + 1, head);
                if (placeholder.length < 2) {
                    throw new Error('Invalid format string: error at ' + placeholder);
                }
                result.push('' + (params[placeholder] || ''));
                --head;
                tail = head + 1;
            }
            else {
                ++head;
            }
        }
        result.push(msg.slice(tail));
        return result.join('');
    };
    /** Protected area **/
    /**
     * Called to handle form submit event
     * @param {Event} e Event object
     * @returns {boolean} Return true if form should be submitted, false otherwise
     */
    FormValidator.prototype.onSubmit = function (e) {
        return this.validate();
    };
    /**
     * Called to show errors on corresponding elements.
     * @param errors Error object as retrieved from validate.js.
     */
    FormValidator.prototype.showErrors = function (errors) {
        if (!this._elems) {
            console.warn('Invalid showErrors call: no elements has been collected');
            return;
        }
        for (var _i = 0, _a = Object.keys(this._elems); _i < _a.length; _i++) {
            var elem_name = _a[_i];
            if (errors && errors[elem_name] != null) {
                this.setError(errors[elem_name], this._elems[elem_name]);
            }
            else {
                this.clearError(this._elems[elem_name]);
            }
        }
    };
    FormValidator.prototype.setError = function (msg, elem) {
        // set titles
        elem.elem.setAttribute('title', msg);
        if (elem.errorElement) {
            var msgNode = document.createTextNode(msg);
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
    };
    FormValidator.prototype.clearError = function (elem) {
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
    };
    FormValidator.prototype._hasInvalidElems = function () {
        var _this = this;
        if (this._elems) {
            return Object.keys(this._elems).map(function (x) { return _this._elems[x]; }).some(function (x) { return !x.valid; });
        }
        return false;
    };
    FormValidator.prototype._buildInputData = function (elem) {
        var ib = closest(elem, '.' + this._options.inputBlock);
        if (!ib) {
            return {
                elem: elem,
                ib: null,
                errorElement: null,
                valid: null
            };
        }
        var errContainerClass = makeElem('' + this._options.inputBlock, '' + this._options.inputBlockErrorElem);
        var errorElement = ib.querySelector('.' + errContainerClass);
        if (!errorElement) {
            errorElement = document.createElement('div');
            ib.appendChild(errorElement);
        }
        return {
            elem: elem,
            ib: ib,
            errorElement: errorElement,
            valid: null
        };
    };
    FormValidator.prototype._getElementMsg = function (elem) {
        var msgClasses = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msgClasses[_i - 1] = arguments[_i];
        }
        for (var q = 0; q < msgClasses.length; ++q) {
            var msgClassUnderscored = 'data-msg-' + separated(msgClasses[q], '-'), msgClassCamel = 'data-msg-' + camel(msgClasses[q]);
            var attr_1 = elem.getAttribute(msgClassUnderscored) || elem.getAttribute(msgClassCamel);
            if (attr_1) {
                return attr_1;
            }
        }
        // try generic message
        var attr = elem.getAttribute('data-msg-error');
        if (attr) {
            return attr;
        }
        if (!this._options.messages) {
            return null;
        }
        for (var q = 0; q < msgClasses.length; ++q) {
            var def = this._options.messages[camel(msgClasses[q])];
            if (def) {
                return def;
            }
        }
        return null;
    };
    FormValidator.prototype._buildConstraints = function () {
        var elems = this.root.querySelectorAll('[name]');
        var builderKeys = Object.keys(FormValidator._constraintBuilders);
        var builderAttrs = builderKeys.map(function (x) { return 'data-validate-' + x; });
        this._constraints = {};
        this._elems = {};
        for (var q = 0; q < elems.length; ++q) {
            var elem = elems[q];
            var elem_name = elem.getAttribute('name');
            if (!elem_name) {
                console.warn("No name for element", elem);
                continue;
            }
            this._elems[elem_name] = this._buildInputData(elem);
            var constraint = {};
            if (elem.hasAttribute('required')) {
                var message = this._getElementMsg(elem, 'required');
                constraint.presence = message ? { message: message } : true;
            }
            if (elem.hasAttribute('minlength')) {
                var minlength = +elem.getAttribute('minlength');
                var message = this._getElementMsg(elem, 'minlength');
                constraint.length = {
                    minimum: minlength
                };
                if (message) {
                    message = this.formatMsg(message, {
                        minlength: minlength
                    });
                    constraint.length.message = message;
                }
            }
            if (elem.hasAttribute('pattern')) {
                var pattern = elem.getAttribute('pattern');
                constraint.format = { pattern: pattern };
                var message = this._getElementMsg(elem, 'pattern');
                if (message) {
                    message = this.formatMsg(message, { pattern: pattern });
                    constraint.format.message = message;
                }
            }
            switch (elem.tagName.toLowerCase()) {
                case 'input':
                    {
                        switch ((elem.getAttribute('type') || 'text').toLowerCase()) {
                            case 'email':
                                {
                                    var message = this._getElementMsg(elem, 'email');
                                    constraint.email = message ? { message: message } : true;
                                }
                                break;
                            case 'url':
                                {
                                    var message = this._getElementMsg(elem, 'url');
                                    constraint.url = message ? { message: message } : true;
                                    if (elem.hasAttribute('data-validate-url-allow-local')) {
                                        if (typeof constraint.url === 'object') {
                                            constraint.url.allowLocal = true;
                                        }
                                        else {
                                            constraint.url = { allowLocal: true };
                                        }
                                    }
                                    if (elem.hasAttribute('data-validate-url-schemes')) {
                                        var schemes = void 0, schemesAttr = elem.getAttribute('data-validate-url-schemes');
                                        if (schemesAttr) {
                                            try {
                                                schemes = JSON.parse(schemesAttr);
                                            }
                                            catch (err) {
                                                schemes = [schemesAttr];
                                            }
                                            if (typeof constraint.url === 'object') {
                                                constraint.url.schemes = schemes;
                                            }
                                            else {
                                                constraint.url = {
                                                    schemes: schemes
                                                };
                                            }
                                        }
                                    }
                                }
                                break;
                            case 'number':
                                {
                                    constraint.numericality = {};
                                    var min = null, max = null, step = null;
                                    if (elem.hasAttribute('min')) {
                                        min = +elem.getAttribute('min');
                                        constraint.numericality.greaterThanOrEqualTo = min;
                                    }
                                    if (elem.hasAttribute('max')) {
                                        max = +elem.getAttribute('max');
                                        constraint.numericality.lessThanOrEqualTo = max;
                                    }
                                    if (elem.hasAttribute('step')) {
                                        step = +elem.getAttribute('step');
                                        constraint.step = {
                                            step: step
                                        };
                                        if (min != null) {
                                            constraint.step.min = min;
                                        }
                                        var msg = this._getElementMsg(elem, 'step', 'number');
                                        if (msg) {
                                            constraint.step.message = msg;
                                        }
                                    }
                                    var defMsgClass = void 0;
                                    if (min == null && max == null) {
                                        defMsgClass = 'number';
                                    }
                                    else if (min != null && max != null) {
                                        defMsgClass = 'numberMinMax';
                                    }
                                    else if (min != null) {
                                        defMsgClass = 'numberMin';
                                    }
                                    else {
                                        defMsgClass = 'numberMax';
                                    }
                                    var message = this._getElementMsg(elem, defMsgClass, 'number');
                                    if (message) {
                                        message = this.formatMsg(message, {
                                            min: min,
                                            max: max,
                                            step: step
                                        });
                                        constraint.numericality.message = message;
                                    }
                                }
                                break;
                        }
                    }
                    break;
                case 'select':
                case 'textarea':
                    break;
                default:
                    console.warn('Unsupported element tag: ', elem);
                    break;
            }
            for (var q_1 = 0; q_1 < builderKeys.length; ++q_1) {
                if (elem.hasAttribute(builderAttrs[q_1])) {
                    var msg = this._getElementMsg(elem, builderKeys[q_1]);
                    var new_constraint = FormValidator._constraintBuilders[builderKeys[q_1]](constraint, elem, '' + elem.getAttribute(builderAttrs[q_1]), msg, this);
                    if (new_constraint) {
                        constraint = new_constraint;
                    }
                }
            }
            if (Object.keys(constraint).length > 0) {
                this._constraints[elem_name] = constraint;
            }
        }
    };
    FormValidator.prototype._beginLiveValidation = function () {
        if (this._liveValidation) {
            return;
        }
        if (!this._options.revalidateOnInput && !this._options.revalidateOnChange) {
            return;
        }
        if (!this._elems) {
            this._buildConstraints();
        }
        for (var _i = 0, _a = Object.keys(this._elems); _i < _a.length; _i++) {
            var elemName = _a[_i];
            var elemData = this._elems[elemName];
            if (this._options.revalidateOnChange) {
                elemData.elem.addEventListener('change', this.onElementChange.bind(this, elemName));
            }
            if (this._options.revalidateOnInput) {
                elemData.elem.addEventListener('input', this.onElementChange.bind(this, elemName));
            }
        }
        this._liveValidation = true;
    };
    FormValidator.prototype.onElementChange = function (elemName, e) {
        this.validateSingle(elemName);
    };
    FormValidator.prototype.setRootHasErrors = function (hasErrors) {
        toggleClass(this._root, this.rootValidClass, !hasErrors);
        toggleClass(this._root, this.rootInvalidClass, hasErrors);
    };
    FormValidator.prototype._getInputValue = function (elem) {
        var value = elem.value;
        return value == null || value === '' ? null : value;
    };
    FormValidator._constraintBuilders = {};
    return FormValidator;
}());
exports.FormValidator = FormValidator;
/**
 * Element.matches method polyfill.
 * We should not touch prototype of Element to avoid messing with another libs
 */
var matchesFunc = null;
function matches(elem, selector) {
    if (!matchesFunc) {
        matchesFunc = Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    return matchesFunc.call(elem, selector);
}
/**
 * Element.closest method polyfill
 */
function closest(elem, selector) {
    if (elem.closest) {
        return elem.closest(selector);
    }
    else {
        var el = elem;
        while (el != null) {
            if (matches(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return el;
    }
}
function assign() {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i] = arguments[_i];
    }
    if (Object.assign) {
        return Object.assign.apply(this, objs);
    }
    else {
        return lodash_assign.apply(this, objs);
    }
}
function makeMod(block, modifier) {
    return modifier ? block + '--' + modifier : block;
}
function makeElem(block, elem) {
    return block + '__' + elem;
}
function toggleClass(elem, className, value) {
    (value ? elem.classList.add : elem.classList.remove).call(elem.classList, className);
}
function separated(name, sep) {
    if (sep === void 0) { sep = '_'; }
    var CH_LG_LOWER = 'A'.charCodeAt(0), CH_LG_HIGH = 'Z'.charCodeAt(0);
    var tail = 0, head = 0;
    var result = [];
    while (head < name.length) {
        var ch = name.charCodeAt(head);
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
exports.separated = separated;
function camel(name) {
    var result = name.split(/[_\-]/).filter(function (x) { return x; });
    return result.map(function (x, i) { return i > 0 ? (x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase()) : x; }).join('');
}
exports.camel = camel;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/*!
 * validate.js 0.12.0
 *
 * (c) 2013-2017 Nicklas Ansman, 2013 Wrapp
 * Validate.js may be freely distributed under the MIT license.
 * For all details and documentation:
 * http://validatejs.org/
 */

(function(exports, module, define) {
  "use strict";

  // The main function that calls the validators specified by the constraints.
  // The options are the following:
  //   - format (string) - An option that controls how the returned value is formatted
  //     * flat - Returns a flat array of just the error messages
  //     * grouped - Returns the messages grouped by attribute (default)
  //     * detailed - Returns an array of the raw validation data
  //   - fullMessages (boolean) - If `true` (default) the attribute name is prepended to the error.
  //
  // Please note that the options are also passed to each validator.
  var validate = function(attributes, constraints, options) {
    options = v.extend({}, v.options, options);

    var results = v.runValidations(attributes, constraints, options)
      , attr
      , validator;

    if (results.some(function(r) { return v.isPromise(r.error); })) {
      throw new Error("Use validate.async if you want support for promises");
    }
    return validate.processValidationResults(results, options);
  };

  var v = validate;

  // Copies over attributes from one or more sources to a single destination.
  // Very much similar to underscore's extend.
  // The first argument is the target object and the remaining arguments will be
  // used as sources.
  v.extend = function(obj) {
    [].slice.call(arguments, 1).forEach(function(source) {
      for (var attr in source) {
        obj[attr] = source[attr];
      }
    });
    return obj;
  };

  v.extend(validate, {
    // This is the version of the library as a semver.
    // The toString function will allow it to be coerced into a string
    version: {
      major: 0,
      minor: 12,
      patch: 0,
      metadata: null,
      toString: function() {
        var version = v.format("%{major}.%{minor}.%{patch}", v.version);
        if (!v.isEmpty(v.version.metadata)) {
          version += "+" + v.version.metadata;
        }
        return version;
      }
    },

    // Below is the dependencies that are used in validate.js

    // The constructor of the Promise implementation.
    // If you are using Q.js, RSVP or any other A+ compatible implementation
    // override this attribute to be the constructor of that promise.
    // Since jQuery promises aren't A+ compatible they won't work.
    Promise: typeof Promise !== "undefined" ? Promise : /* istanbul ignore next */ null,

    EMPTY_STRING_REGEXP: /^\s*$/,

    // Runs the validators specified by the constraints object.
    // Will return an array of the format:
    //     [{attribute: "<attribute name>", error: "<validation result>"}, ...]
    runValidations: function(attributes, constraints, options) {
      var results = []
        , attr
        , validatorName
        , value
        , validators
        , validator
        , validatorOptions
        , error;

      if (v.isDomElement(attributes) || v.isJqueryElement(attributes)) {
        attributes = v.collectFormValues(attributes);
      }

      // Loops through each constraints, finds the correct validator and run it.
      for (attr in constraints) {
        value = v.getDeepObjectValue(attributes, attr);
        // This allows the constraints for an attribute to be a function.
        // The function will be called with the value, attribute name, the complete dict of
        // attributes as well as the options and constraints passed in.
        // This is useful when you want to have different
        // validations depending on the attribute value.
        validators = v.result(constraints[attr], value, attributes, attr, options, constraints);

        for (validatorName in validators) {
          validator = v.validators[validatorName];

          if (!validator) {
            error = v.format("Unknown validator %{name}", {name: validatorName});
            throw new Error(error);
          }

          validatorOptions = validators[validatorName];
          // This allows the options to be a function. The function will be
          // called with the value, attribute name, the complete dict of
          // attributes as well as the options and constraints passed in.
          // This is useful when you want to have different
          // validations depending on the attribute value.
          validatorOptions = v.result(validatorOptions, value, attributes, attr, options, constraints);
          if (!validatorOptions) {
            continue;
          }
          results.push({
            attribute: attr,
            value: value,
            validator: validatorName,
            globalOptions: options,
            attributes: attributes,
            options: validatorOptions,
            error: validator.call(validator,
                value,
                validatorOptions,
                attr,
                attributes,
                options)
          });
        }
      }

      return results;
    },

    // Takes the output from runValidations and converts it to the correct
    // output format.
    processValidationResults: function(errors, options) {
      errors = v.pruneEmptyErrors(errors, options);
      errors = v.expandMultipleErrors(errors, options);
      errors = v.convertErrorMessages(errors, options);

      var format = options.format || "grouped";

      if (typeof v.formatters[format] === 'function') {
        errors = v.formatters[format](errors);
      } else {
        throw new Error(v.format("Unknown format %{format}", options));
      }

      return v.isEmpty(errors) ? undefined : errors;
    },

    // Runs the validations with support for promises.
    // This function will return a promise that is settled when all the
    // validation promises have been completed.
    // It can be called even if no validations returned a promise.
    async: function(attributes, constraints, options) {
      options = v.extend({}, v.async.options, options);

      var WrapErrors = options.wrapErrors || function(errors) {
        return errors;
      };

      // Removes unknown attributes
      if (options.cleanAttributes !== false) {
        attributes = v.cleanAttributes(attributes, constraints);
      }

      var results = v.runValidations(attributes, constraints, options);

      return new v.Promise(function(resolve, reject) {
        v.waitForResults(results).then(function() {
          var errors = v.processValidationResults(results, options);
          if (errors) {
            reject(new WrapErrors(errors, options, attributes, constraints));
          } else {
            resolve(attributes);
          }
        }, function(err) {
          reject(err);
        });
      });
    },

    single: function(value, constraints, options) {
      options = v.extend({}, v.single.options, options, {
        format: "flat",
        fullMessages: false
      });
      return v({single: value}, {single: constraints}, options);
    },

    // Returns a promise that is resolved when all promises in the results array
    // are settled. The promise returned from this function is always resolved,
    // never rejected.
    // This function modifies the input argument, it replaces the promises
    // with the value returned from the promise.
    waitForResults: function(results) {
      // Create a sequence of all the results starting with a resolved promise.
      return results.reduce(function(memo, result) {
        // If this result isn't a promise skip it in the sequence.
        if (!v.isPromise(result.error)) {
          return memo;
        }

        return memo.then(function() {
          return result.error.then(function(error) {
            result.error = error || null;
          });
        });
      }, new v.Promise(function(r) { r(); })); // A resolved promise
    },

    // If the given argument is a call: function the and: function return the value
    // otherwise just return the value. Additional arguments will be passed as
    // arguments to the function.
    // Example:
    // ```
    // result('foo') // 'foo'
    // result(Math.max, 1, 2) // 2
    // ```
    result: function(value) {
      var args = [].slice.call(arguments, 1);
      if (typeof value === 'function') {
        value = value.apply(null, args);
      }
      return value;
    },

    // Checks if the value is a number. This function does not consider NaN a
    // number like many other `isNumber` functions do.
    isNumber: function(value) {
      return typeof value === 'number' && !isNaN(value);
    },

    // Returns false if the object is not a function
    isFunction: function(value) {
      return typeof value === 'function';
    },

    // A simple check to verify that the value is an integer. Uses `isNumber`
    // and a simple modulo check.
    isInteger: function(value) {
      return v.isNumber(value) && value % 1 === 0;
    },

    // Checks if the value is a boolean
    isBoolean: function(value) {
      return typeof value === 'boolean';
    },

    // Uses the `Object` function to check if the given argument is an object.
    isObject: function(obj) {
      return obj === Object(obj);
    },

    // Simply checks if the object is an instance of a date
    isDate: function(obj) {
      return obj instanceof Date;
    },

    // Returns false if the object is `null` of `undefined`
    isDefined: function(obj) {
      return obj !== null && obj !== undefined;
    },

    // Checks if the given argument is a promise. Anything with a `then`
    // function is considered a promise.
    isPromise: function(p) {
      return !!p && v.isFunction(p.then);
    },

    isJqueryElement: function(o) {
      return o && v.isString(o.jquery);
    },

    isDomElement: function(o) {
      if (!o) {
        return false;
      }

      if (!o.querySelectorAll || !o.querySelector) {
        return false;
      }

      if (v.isObject(document) && o === document) {
        return true;
      }

      // http://stackoverflow.com/a/384380/699304
      /* istanbul ignore else */
      if (typeof HTMLElement === "object") {
        return o instanceof HTMLElement;
      } else {
        return o &&
          typeof o === "object" &&
          o !== null &&
          o.nodeType === 1 &&
          typeof o.nodeName === "string";
      }
    },

    isEmpty: function(value) {
      var attr;

      // Null and undefined are empty
      if (!v.isDefined(value)) {
        return true;
      }

      // functions are non empty
      if (v.isFunction(value)) {
        return false;
      }

      // Whitespace only strings are empty
      if (v.isString(value)) {
        return v.EMPTY_STRING_REGEXP.test(value);
      }

      // For arrays we use the length property
      if (v.isArray(value)) {
        return value.length === 0;
      }

      // Dates have no attributes but aren't empty
      if (v.isDate(value)) {
        return false;
      }

      // If we find at least one property we consider it non empty
      if (v.isObject(value)) {
        for (attr in value) {
          return false;
        }
        return true;
      }

      return false;
    },

    // Formats the specified strings with the given values like so:
    // ```
    // format("Foo: %{foo}", {foo: "bar"}) // "Foo bar"
    // ```
    // If you want to write %{...} without having it replaced simply
    // prefix it with % like this `Foo: %%{foo}` and it will be returned
    // as `"Foo: %{foo}"`
    format: v.extend(function(str, vals) {
      if (!v.isString(str)) {
        return str;
      }
      return str.replace(v.format.FORMAT_REGEXP, function(m0, m1, m2) {
        if (m1 === '%') {
          return "%{" + m2 + "}";
        } else {
          return String(vals[m2]);
        }
      });
    }, {
      // Finds %{key} style patterns in the given string
      FORMAT_REGEXP: /(%?)%\{([^\}]+)\}/g
    }),

    // "Prettifies" the given string.
    // Prettifying means replacing [.\_-] with spaces as well as splitting
    // camel case words.
    prettify: function(str) {
      if (v.isNumber(str)) {
        // If there are more than 2 decimals round it to two
        if ((str * 100) % 1 === 0) {
          return "" + str;
        } else {
          return parseFloat(Math.round(str * 100) / 100).toFixed(2);
        }
      }

      if (v.isArray(str)) {
        return str.map(function(s) { return v.prettify(s); }).join(", ");
      }

      if (v.isObject(str)) {
        return str.toString();
      }

      // Ensure the string is actually a string
      str = "" + str;

      return str
        // Splits keys separated by periods
        .replace(/([^\s])\.([^\s])/g, '$1 $2')
        // Removes backslashes
        .replace(/\\+/g, '')
        // Replaces - and - with space
        .replace(/[_-]/g, ' ')
        // Splits camel cased words
        .replace(/([a-z])([A-Z])/g, function(m0, m1, m2) {
          return "" + m1 + " " + m2.toLowerCase();
        })
        .toLowerCase();
    },

    stringifyValue: function(value, options) {
      var prettify = options && options.prettify || v.prettify;
      return prettify(value);
    },

    isString: function(value) {
      return typeof value === 'string';
    },

    isArray: function(value) {
      return {}.toString.call(value) === '[object Array]';
    },

    // Checks if the object is a hash, which is equivalent to an object that
    // is neither an array nor a function.
    isHash: function(value) {
      return v.isObject(value) && !v.isArray(value) && !v.isFunction(value);
    },

    contains: function(obj, value) {
      if (!v.isDefined(obj)) {
        return false;
      }
      if (v.isArray(obj)) {
        return obj.indexOf(value) !== -1;
      }
      return value in obj;
    },

    unique: function(array) {
      if (!v.isArray(array)) {
        return array;
      }
      return array.filter(function(el, index, array) {
        return array.indexOf(el) == index;
      });
    },

    forEachKeyInKeypath: function(object, keypath, callback) {
      if (!v.isString(keypath)) {
        return undefined;
      }

      var key = ""
        , i
        , escape = false;

      for (i = 0; i < keypath.length; ++i) {
        switch (keypath[i]) {
          case '.':
            if (escape) {
              escape = false;
              key += '.';
            } else {
              object = callback(object, key, false);
              key = "";
            }
            break;

          case '\\':
            if (escape) {
              escape = false;
              key += '\\';
            } else {
              escape = true;
            }
            break;

          default:
            escape = false;
            key += keypath[i];
            break;
        }
      }

      return callback(object, key, true);
    },

    getDeepObjectValue: function(obj, keypath) {
      if (!v.isObject(obj)) {
        return undefined;
      }

      return v.forEachKeyInKeypath(obj, keypath, function(obj, key) {
        if (v.isObject(obj)) {
          return obj[key];
        }
      });
    },

    // This returns an object with all the values of the form.
    // It uses the input name as key and the value as value
    // So for example this:
    // <input type="text" name="email" value="foo@bar.com" />
    // would return:
    // {email: "foo@bar.com"}
    collectFormValues: function(form, options) {
      var values = {}
        , i
        , j
        , input
        , inputs
        , option
        , value;

      if (v.isJqueryElement(form)) {
        form = form[0];
      }

      if (!form) {
        return values;
      }

      options = options || {};

      inputs = form.querySelectorAll("input[name], textarea[name]");
      for (i = 0; i < inputs.length; ++i) {
        input = inputs.item(i);

        if (v.isDefined(input.getAttribute("data-ignored"))) {
          continue;
        }

        name = input.name.replace(/\./g, "\\\\.");
        value = v.sanitizeFormValue(input.value, options);
        if (input.type === "number") {
          value = value ? +value : null;
        } else if (input.type === "checkbox") {
          if (input.attributes.value) {
            if (!input.checked) {
              value = values[name] || null;
            }
          } else {
            value = input.checked;
          }
        } else if (input.type === "radio") {
          if (!input.checked) {
            value = values[name] || null;
          }
        }
        values[name] = value;
      }

      inputs = form.querySelectorAll("select[name]");
      for (i = 0; i < inputs.length; ++i) {
        input = inputs.item(i);
        if (v.isDefined(input.getAttribute("data-ignored"))) {
          continue;
        }

        if (input.multiple) {
          value = [];
          for (j in input.options) {
            option = input.options[j];
             if (option && option.selected) {
              value.push(v.sanitizeFormValue(option.value, options));
            }
          }
        } else {
          var _val = typeof input.options[input.selectedIndex] !== 'undefined' ? input.options[input.selectedIndex].value : '';
          value = v.sanitizeFormValue(_val, options);
        }
        values[input.name] = value;
      }

      return values;
    },

    sanitizeFormValue: function(value, options) {
      if (options.trim && v.isString(value)) {
        value = value.trim();
      }

      if (options.nullify !== false && value === "") {
        return null;
      }
      return value;
    },

    capitalize: function(str) {
      if (!v.isString(str)) {
        return str;
      }
      return str[0].toUpperCase() + str.slice(1);
    },

    // Remove all errors who's error attribute is empty (null or undefined)
    pruneEmptyErrors: function(errors) {
      return errors.filter(function(error) {
        return !v.isEmpty(error.error);
      });
    },

    // In
    // [{error: ["err1", "err2"], ...}]
    // Out
    // [{error: "err1", ...}, {error: "err2", ...}]
    //
    // All attributes in an error with multiple messages are duplicated
    // when expanding the errors.
    expandMultipleErrors: function(errors) {
      var ret = [];
      errors.forEach(function(error) {
        // Removes errors without a message
        if (v.isArray(error.error)) {
          error.error.forEach(function(msg) {
            ret.push(v.extend({}, error, {error: msg}));
          });
        } else {
          ret.push(error);
        }
      });
      return ret;
    },

    // Converts the error mesages by prepending the attribute name unless the
    // message is prefixed by ^
    convertErrorMessages: function(errors, options) {
      options = options || {};

      var ret = []
        , prettify = options.prettify || v.prettify;
      errors.forEach(function(errorInfo) {
        var error = v.result(errorInfo.error,
            errorInfo.value,
            errorInfo.attribute,
            errorInfo.options,
            errorInfo.attributes,
            errorInfo.globalOptions);

        if (!v.isString(error)) {
          ret.push(errorInfo);
          return;
        }

        if (error[0] === '^') {
          error = error.slice(1);
        } else if (options.fullMessages !== false) {
          error = v.capitalize(prettify(errorInfo.attribute)) + " " + error;
        }
        error = error.replace(/\\\^/g, "^");
        error = v.format(error, {
          value: v.stringifyValue(errorInfo.value, options)
        });
        ret.push(v.extend({}, errorInfo, {error: error}));
      });
      return ret;
    },

    // In:
    // [{attribute: "<attributeName>", ...}]
    // Out:
    // {"<attributeName>": [{attribute: "<attributeName>", ...}]}
    groupErrorsByAttribute: function(errors) {
      var ret = {};
      errors.forEach(function(error) {
        var list = ret[error.attribute];
        if (list) {
          list.push(error);
        } else {
          ret[error.attribute] = [error];
        }
      });
      return ret;
    },

    // In:
    // [{error: "<message 1>", ...}, {error: "<message 2>", ...}]
    // Out:
    // ["<message 1>", "<message 2>"]
    flattenErrorsToArray: function(errors) {
      return errors
        .map(function(error) { return error.error; })
        .filter(function(value, index, self) {
          return self.indexOf(value) === index;
        });
    },

    cleanAttributes: function(attributes, whitelist) {
      function whitelistCreator(obj, key, last) {
        if (v.isObject(obj[key])) {
          return obj[key];
        }
        return (obj[key] = last ? true : {});
      }

      function buildObjectWhitelist(whitelist) {
        var ow = {}
          , lastObject
          , attr;
        for (attr in whitelist) {
          if (!whitelist[attr]) {
            continue;
          }
          v.forEachKeyInKeypath(ow, attr, whitelistCreator);
        }
        return ow;
      }

      function cleanRecursive(attributes, whitelist) {
        if (!v.isObject(attributes)) {
          return attributes;
        }

        var ret = v.extend({}, attributes)
          , w
          , attribute;

        for (attribute in attributes) {
          w = whitelist[attribute];

          if (v.isObject(w)) {
            ret[attribute] = cleanRecursive(ret[attribute], w);
          } else if (!w) {
            delete ret[attribute];
          }
        }
        return ret;
      }

      if (!v.isObject(whitelist) || !v.isObject(attributes)) {
        return {};
      }

      whitelist = buildObjectWhitelist(whitelist);
      return cleanRecursive(attributes, whitelist);
    },

    exposeModule: function(validate, root, exports, module, define) {
      if (exports) {
        if (module && module.exports) {
          exports = module.exports = validate;
        }
        exports.validate = validate;
      } else {
        root.validate = validate;
        if (validate.isFunction(define) && define.amd) {
          define([], function () { return validate; });
        }
      }
    },

    warn: function(msg) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("[validate.js] " + msg);
      }
    },

    error: function(msg) {
      if (typeof console !== "undefined" && console.error) {
        console.error("[validate.js] " + msg);
      }
    }
  });

  validate.validators = {
    // Presence validates that the value isn't empty
    presence: function(value, options) {
      options = v.extend({}, this.options, options);
      if (options.allowEmpty !== false ? !v.isDefined(value) : v.isEmpty(value)) {
        return options.message || this.message || "can't be blank";
      }
    },
    length: function(value, options, attribute) {
      // Empty values are allowed
      if (!v.isDefined(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var is = options.is
        , maximum = options.maximum
        , minimum = options.minimum
        , tokenizer = options.tokenizer || function(val) { return val; }
        , err
        , errors = [];

      value = tokenizer(value);
      var length = value.length;
      if(!v.isNumber(length)) {
        v.error(v.format("Attribute %{attr} has a non numeric value for `length`", {attr: attribute}));
        return options.message || this.notValid || "has an incorrect length";
      }

      // Is checks
      if (v.isNumber(is) && length !== is) {
        err = options.wrongLength ||
          this.wrongLength ||
          "is the wrong length (should be %{count} characters)";
        errors.push(v.format(err, {count: is}));
      }

      if (v.isNumber(minimum) && length < minimum) {
        err = options.tooShort ||
          this.tooShort ||
          "is too short (minimum is %{count} characters)";
        errors.push(v.format(err, {count: minimum}));
      }

      if (v.isNumber(maximum) && length > maximum) {
        err = options.tooLong ||
          this.tooLong ||
          "is too long (maximum is %{count} characters)";
        errors.push(v.format(err, {count: maximum}));
      }

      if (errors.length > 0) {
        return options.message || errors;
      }
    },
    numericality: function(value, options, attribute, attributes, globalOptions) {
      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var errors = []
        , name
        , count
        , checks = {
            greaterThan:          function(v, c) { return v > c; },
            greaterThanOrEqualTo: function(v, c) { return v >= c; },
            equalTo:              function(v, c) { return v === c; },
            lessThan:             function(v, c) { return v < c; },
            lessThanOrEqualTo:    function(v, c) { return v <= c; },
            divisibleBy:          function(v, c) { return v % c === 0; }
          }
        , prettify = options.prettify ||
          (globalOptions && globalOptions.prettify) ||
          v.prettify;

      // Strict will check that it is a valid looking number
      if (v.isString(value) && options.strict) {
        var pattern = "^-?(0|[1-9]\\d*)";
        if (!options.onlyInteger) {
          pattern += "(\\.\\d+)?";
        }
        pattern += "$";

        if (!(new RegExp(pattern).test(value))) {
          return options.message ||
            options.notValid ||
            this.notValid ||
            this.message ||
            "must be a valid number";
        }
      }

      // Coerce the value to a number unless we're being strict.
      if (options.noStrings !== true && v.isString(value) && !v.isEmpty(value)) {
        value = +value;
      }

      // If it's not a number we shouldn't continue since it will compare it.
      if (!v.isNumber(value)) {
        return options.message ||
          options.notValid ||
          this.notValid ||
          this.message ||
          "is not a number";
      }

      // Same logic as above, sort of. Don't bother with comparisons if this
      // doesn't pass.
      if (options.onlyInteger && !v.isInteger(value)) {
        return options.message ||
          options.notInteger ||
          this.notInteger ||
          this.message ||
          "must be an integer";
      }

      for (name in checks) {
        count = options[name];
        if (v.isNumber(count) && !checks[name](value, count)) {
          // This picks the default message if specified
          // For example the greaterThan check uses the message from
          // this.notGreaterThan so we capitalize the name and prepend "not"
          var key = "not" + v.capitalize(name);
          var msg = options[key] ||
            this[key] ||
            this.message ||
            "must be %{type} %{count}";

          errors.push(v.format(msg, {
            count: count,
            type: prettify(name)
          }));
        }
      }

      if (options.odd && value % 2 !== 1) {
        errors.push(options.notOdd ||
            this.notOdd ||
            this.message ||
            "must be odd");
      }
      if (options.even && value % 2 !== 0) {
        errors.push(options.notEven ||
            this.notEven ||
            this.message ||
            "must be even");
      }

      if (errors.length) {
        return options.message || errors;
      }
    },
    datetime: v.extend(function(value, options) {
      if (!v.isFunction(this.parse) || !v.isFunction(this.format)) {
        throw new Error("Both the parse and format functions needs to be set to use the datetime/date validator");
      }

      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var err
        , errors = []
        , earliest = options.earliest ? this.parse(options.earliest, options) : NaN
        , latest = options.latest ? this.parse(options.latest, options) : NaN;

      value = this.parse(value, options);

      // 86400000 is the number of milliseconds in a day, this is used to remove
      // the time from the date
      if (isNaN(value) || options.dateOnly && value % 86400000 !== 0) {
        err = options.notValid ||
          options.message ||
          this.notValid ||
          "must be a valid date";
        return v.format(err, {value: arguments[0]});
      }

      if (!isNaN(earliest) && value < earliest) {
        err = options.tooEarly ||
          options.message ||
          this.tooEarly ||
          "must be no earlier than %{date}";
        err = v.format(err, {
          value: this.format(value, options),
          date: this.format(earliest, options)
        });
        errors.push(err);
      }

      if (!isNaN(latest) && value > latest) {
        err = options.tooLate ||
          options.message ||
          this.tooLate ||
          "must be no later than %{date}";
        err = v.format(err, {
          date: this.format(latest, options),
          value: this.format(value, options)
        });
        errors.push(err);
      }

      if (errors.length) {
        return v.unique(errors);
      }
    }, {
      parse: null,
      format: null
    }),
    date: function(value, options) {
      options = v.extend({}, options, {dateOnly: true});
      return v.validators.datetime.call(v.validators.datetime, value, options);
    },
    format: function(value, options) {
      if (v.isString(options) || (options instanceof RegExp)) {
        options = {pattern: options};
      }

      options = v.extend({}, this.options, options);

      var message = options.message || this.message || "is invalid"
        , pattern = options.pattern
        , match;

      // Empty values are allowed
      if (!v.isDefined(value)) {
        return;
      }
      if (!v.isString(value)) {
        return message;
      }

      if (v.isString(pattern)) {
        pattern = new RegExp(options.pattern, options.flags);
      }
      match = pattern.exec(value);
      if (!match || match[0].length != value.length) {
        return message;
      }
    },
    inclusion: function(value, options) {
      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }
      if (v.isArray(options)) {
        options = {within: options};
      }
      options = v.extend({}, this.options, options);
      if (v.contains(options.within, value)) {
        return;
      }
      var message = options.message ||
        this.message ||
        "^%{value} is not included in the list";
      return v.format(message, {value: value});
    },
    exclusion: function(value, options) {
      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }
      if (v.isArray(options)) {
        options = {within: options};
      }
      options = v.extend({}, this.options, options);
      if (!v.contains(options.within, value)) {
        return;
      }
      var message = options.message || this.message || "^%{value} is restricted";
      return v.format(message, {value: value});
    },
    email: v.extend(function(value, options) {
      options = v.extend({}, this.options, options);
      var message = options.message || this.message || "is not a valid email";
      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }
      if (!v.isString(value)) {
        return message;
      }
      if (!this.PATTERN.exec(value)) {
        return message;
      }
    }, {
      PATTERN: /^[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i
    }),
    equality: function(value, options, attribute, attributes, globalOptions) {
      if (!v.isDefined(value)) {
        return;
      }

      if (v.isString(options)) {
        options = {attribute: options};
      }
      options = v.extend({}, this.options, options);
      var message = options.message ||
        this.message ||
        "is not equal to %{attribute}";

      if (v.isEmpty(options.attribute) || !v.isString(options.attribute)) {
        throw new Error("The attribute must be a non empty string");
      }

      var otherValue = v.getDeepObjectValue(attributes, options.attribute)
        , comparator = options.comparator || function(v1, v2) {
          return v1 === v2;
        }
        , prettify = options.prettify ||
          (globalOptions && globalOptions.prettify) ||
          v.prettify;

      if (!comparator(value, otherValue, options, attribute, attributes)) {
        return v.format(message, {attribute: prettify(options.attribute)});
      }
    },

    // A URL validator that is used to validate URLs with the ability to
    // restrict schemes and some domains.
    url: function(value, options) {
      if (!v.isDefined(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var message = options.message || this.message || "is not a valid url"
        , schemes = options.schemes || this.schemes || ['http', 'https']
        , allowLocal = options.allowLocal || this.allowLocal || false;

      if (!v.isString(value)) {
        return message;
      }

      // https://gist.github.com/dperini/729294
      var regex =
        "^" +
        // protocol identifier
        "(?:(?:" + schemes.join("|") + ")://)" +
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:";

      var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";

      if (allowLocal) {
        tld += "?";
      } else {
        regex +=
          // IP address exclusion
          // private & local networks
          "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
          "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
          "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})";
      }

      regex +=
          // IP address dotted notation octets
          // excludes loopback network 0.0.0.0
          // excludes reserved space >= 224.0.0.0
          // excludes network & broacast addresses
          // (first & last IP address of each class)
          "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
          "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
          "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
          // host name
          "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
          // domain name
          "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
          tld +
        ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:[/?#]\\S*)?" +
      "$";

      var PATTERN = new RegExp(regex, 'i');
      if (!PATTERN.exec(value)) {
        return message;
      }
    }
  };

  validate.formatters = {
    detailed: function(errors) {return errors;},
    flat: v.flattenErrorsToArray,
    grouped: function(errors) {
      var attr;

      errors = v.groupErrorsByAttribute(errors);
      for (attr in errors) {
        errors[attr] = v.flattenErrorsToArray(errors[attr]);
      }
      return errors;
    },
    constraint: function(errors) {
      var attr;
      errors = v.groupErrorsByAttribute(errors);
      for (attr in errors) {
        errors[attr] = errors[attr].map(function(result) {
          return result.validator;
        }).sort();
      }
      return errors;
    }
  };

  validate.exposeModule(validate, this, exports, module, __webpack_require__(0));
}).call(this,
         true ? /* istanbul ignore next */ exports : null,
         true ? /* istanbul ignore next */ module : null,
        __webpack_require__(0));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object),
    nativeMax = Math.max;

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assign({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3 }
 */
var assign = createAssigner(function(object, source) {
  if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = assign;


/***/ })
/******/ ])));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTVjMWZlYjg5MWIwZTNhMTBmODkiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3ZhbGlkYXRlLmpzL3ZhbGlkYXRlLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNGQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixrQkFBa0IsRUFBRTtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLFVBQVU7QUFDckIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFNBQVM7QUFDdEIsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGU1YzFmZWI4OTFiMGUzYTEwZjg5IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0dGhyb3cgbmV3IEVycm9yKFwiZGVmaW5lIGNhbm5vdCBiZSB1c2VkIGluZGlyZWN0XCIpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHZhbGlkYXRlID0gcmVxdWlyZShcInZhbGlkYXRlLmpzXCIpO1xyXG52YXIgbG9kYXNoX2Fzc2lnbiA9IHJlcXVpcmUoXCJsb2Rhc2guYXNzaWduXCIpO1xyXG52YXIgUnVzc2lhbkZvcm1NZXNzYWdlcyA9IHtcclxuICAgIHJlcXVpcmVkOiAn0JLQstC10LTQuNGC0LUg0LfQvdCw0YfQtdC90LjQtScsXHJcbiAgICBtaW5sZW5ndGg6ICfQktCy0LXQtNC40YLQtSDQt9C90LDRh9C10L3QuNC1INC90LUg0LrQvtGA0L7Rh9C1ICRtaW5sZW5ndGgg0YHQuNC80LLQvtC70L7QsicsXHJcbiAgICBwYXR0ZXJuOiAn0JLQstC10LTQuNGC0LUg0LfQvdCw0YfQtdC90LjQtSDQsiDQvdGD0LbQvdC+0Lwg0YTQvtGA0LzQsNGC0LUnLFxyXG4gICAgZW1haWw6ICfQktCy0LXQtNC40YLQtSDQutC+0YDRgNC10LrRgtC90YvQuSBlLW1haWwnLFxyXG4gICAgbnVtYmVyOiAn0JLQstC10LTQuNGC0LUg0YfQuNGB0LvQvicsXHJcbiAgICBudW1iZXJNaW5NYXg6ICfQktCy0LXQtNC40YLQtSDRh9C40YHQu9C+INCyINC00LjQsNC/0LDQt9C+0L3QtSDQvtGCICRtaW4g0LTQviAkbWF4JyxcclxuICAgIG51bWJlck1pbjogJ9CS0LLQtdC00LjRgtC1INGH0LjRgdC70L4g0L3QtSDQvNC10L3RjNGI0LUgJG1pbicsXHJcbiAgICBudW1iZXJNYXg6ICfQktCy0LXQtNC40YLQtSDRh9C40YHQu9C+INC90LUg0LHQvtC70YzRiNC1ICRtYXgnLFxyXG4gICAgc3RlcDogJ9Cn0LjRgdC70L4g0LTQvtC70LbQvdC+INCx0YvRgtGMINGBINGI0LDQs9C+0Lwg0LIgJHN0ZXAnXHJcbn07XHJcbnZhciBPUFRJT05fREVGQVVMVFMgPSB7XHJcbiAgICByb290QmxvY2s6ICdmb3JtJyxcclxuICAgIHJvb3RWYWxpZE1vZDogJ3ZhbGlkJyxcclxuICAgIHJvb3RJbnZhbGlkTW9kOiAnaW52YWxpZCcsXHJcbiAgICBpbnB1dEJsb2NrOiAnaWInLFxyXG4gICAgaW5wdXRCbG9ja1ZhbGlkTW9kOiAndmFsaWQnLFxyXG4gICAgaW5wdXRCbG9ja0ludmFsaWRNb2Q6ICdpbnZhbGlkJyxcclxuICAgIGlucHV0QmxvY2tFcnJvckVsZW06ICdlcnJvcicsXHJcbiAgICByZXZhbGlkYXRlT25DaGFuZ2U6IGZhbHNlLFxyXG4gICAgcmV2YWxpZGF0ZU9uSW5wdXQ6IGZhbHNlXHJcbn07XHJcbnZhciBfY3VzdG9tVmFsaWRhdG9yc0NyZWF0ZWQgPSBmYWxzZTtcclxuZnVuY3Rpb24gY3JlYXRlQ3VzdG9tVmFsaWRhdG9ycygpIHtcclxuICAgIGlmIChfY3VzdG9tVmFsaWRhdG9yc0NyZWF0ZWQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBfY3VzdG9tVmFsaWRhdG9yc0NyZWF0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgdmFsaWRhdGUudmFsaWRhdG9ycy5zdGVwID0gZnVuY3Rpb24gKHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbnVtVmFsdWUgPSArdmFsdWU7XHJcbiAgICAgICAgdmFyIGlzT3B0aW9uc051bWJlciA9IHR5cGVvZiBvcHRpb25zID09PSAnbnVtYmVyJztcclxuICAgICAgICB2YXIgc3RlcCA9IGlzT3B0aW9uc051bWJlciA/IG9wdGlvbnMgOiAoK29wdGlvbnMuc3RlcCB8fCAwKTtcclxuICAgICAgICBpZiAoc3RlcCA8PSAwIHx8IGlzTmFOKHN0ZXApKSB7XHJcbiAgICAgICAgICAgIHN0ZXAgPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbWluVmFsdWUgPSBpc09wdGlvbnNOdW1iZXIgPyAwIDogKCtvcHRpb25zLm1pbiB8fCAwKTtcclxuICAgICAgICBpZiAoaXNOYU4obWluVmFsdWUpKSB7XHJcbiAgICAgICAgICAgIG1pblZhbHVlID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRlZk1zZyA9IFwidmFsdWUgaGFzIGludmFsaWQgc3RlcCAoc2hvdWxkIGhhdmUgc3RlcCBcIiArIHN0ZXAgKyBcIilcIjtcclxuICAgICAgICB2YXIgbXNnID0gaXNPcHRpb25zTnVtYmVyID8gZGVmTXNnIDogKG9wdGlvbnMubWVzc2FnZSB8fCBkZWZNc2cpO1xyXG4gICAgICAgIGlmICgobnVtVmFsdWUgLSBtaW5WYWx1ZSkgJSBzdGVwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtc2c7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIEZvcm1WYWxpZGF0b3IuYWRkQ29uc3RyYWludEJ1aWxkZXIoJ2VxdWFsaXR5JywgZnVuY3Rpb24gKGNvbnN0cmFpbnQsIGlucHV0LCBvcHRpb24sIG1lc3NhZ2UsIHZhbGlkYXRvcikge1xyXG4gICAgICAgIGlmIChtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0cmFpbnQuZXF1YWxpdHkgPSB7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGU6IG9wdGlvbixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRvci5mb3JtYXRNc2cobWVzc2FnZSwge1xyXG4gICAgICAgICAgICAgICAgICAgIG90aGVyOiBvcHRpb25cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdHJhaW50LmVxdWFsaXR5ID0gb3B0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgRm9ybVZhbGlkYXRvci5hZGRDb25zdHJhaW50QnVpbGRlcignZXhjbHVkZScsIGZ1bmN0aW9uIChjb25zdHJhaW50LCBpbnB1dCwgb3B0aW9uLCBtZXNzYWdlLCB2YWxpZGF0b3IpIHtcclxuICAgICAgICB2YXIgZGF0YTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShvcHRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBbb3B0aW9uXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3RyYWludC5leGNsdXNpb24gPSB7XHJcbiAgICAgICAgICAgIHdpdGhpbjogZGF0YVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgY29uc3RyYWludC5leGNsdXNpb24ubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBGb3JtVmFsaWRhdG9yLmFkZENvbnN0cmFpbnRCdWlsZGVyKCdpbmNsdWRlJywgZnVuY3Rpb24gKGNvbnN0cmFpbnQsIGlucHV0LCBvcHRpb24sIG1lc3NhZ2UsIHZhbGlkYXRvcikge1xyXG4gICAgICAgIHZhciBkYXRhO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgZGF0YSA9IFtvcHRpb25dO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdHJhaW50LmluY2x1c2lvbiA9IHtcclxuICAgICAgICAgICAgd2l0aGluOiBkYXRhXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAobWVzc2FnZSkge1xyXG4gICAgICAgICAgICBjb25zdHJhaW50LmluY2x1c2lvbi5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGZ1bmN0aW9uIHNldENvbnN0cmFpbnRQcm9wKGNvbnN0cmFpbnQsIHByb3AsIG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAoY29uc3RyYWludFtwcm9wXSkge1xyXG4gICAgICAgICAgICBhc3NpZ24oY29uc3RyYWludFtwcm9wXSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdHJhaW50W3Byb3BdID0gb3B0aW9ucztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBGb3JtVmFsaWRhdG9yLmFkZENvbnN0cmFpbnRCdWlsZGVyKCdpbnRlZ2VyJywgZnVuY3Rpb24gKGNvbnN0cmFpbnQsIGlucHV0LCBvcHRpb24sIG1lc3NhZ2UpIHtcclxuICAgICAgICBzZXRDb25zdHJhaW50UHJvcChjb25zdHJhaW50LCAnbnVtZXJpY2FsaXR5Jywge1xyXG4gICAgICAgICAgICBvbmx5SW50ZWdlcjogbWVzc2FnZSA/IHsgbWVzc2FnZTogbWVzc2FnZSB9IDogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBGb3JtVmFsaWRhdG9yLmFkZENvbnN0cmFpbnRCdWlsZGVyKCdkaXZpc2libGUnLCBmdW5jdGlvbiAoY29uc3RyYWludCwgaW5wdXQsIG9wdGlvbiwgbWVzc2FnZSkge1xyXG4gICAgICAgIHZhciBkaXZpc29yID0gK29wdGlvbjtcclxuICAgICAgICBpZiAoaXNOYU4oZGl2aXNvcikgfHwgZGl2aXNvciA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdpbnZhbGlkIHZhbGlkYXRpb24gYXR0cmlidXRlIGRpdmlzYmxlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0Q29uc3RyYWludFByb3AoY29uc3RyYWludCwgJ251bWVyaWNhbGl0eScsIHtcclxuICAgICAgICAgICAgZGl2aXNpYmxlQnk6IG1lc3NhZ2UgPyB7IG1lc3NhZ2U6IG1lc3NhZ2UsIGNvdW50OiBkaXZpc29yIH0gOiBkaXZpc29yXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIEZvcm1WYWxpZGF0b3IuYWRkQ29uc3RyYWludEJ1aWxkZXIoJ29kZCcsIGZ1bmN0aW9uIChjb25zdHJhaW50LCBpbnB1dCwgb3B0aW9uLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgc2V0Q29uc3RyYWludFByb3AoY29uc3RyYWludCwgJ251bWVyaWNhbGl0eScsIHtcclxuICAgICAgICAgICAgb2RkOiBtZXNzYWdlID8geyBtZXNzYWdlOiBtZXNzYWdlIH0gOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIEZvcm1WYWxpZGF0b3IuYWRkQ29uc3RyYWludEJ1aWxkZXIoJ2V2ZW4nLCBmdW5jdGlvbiAoY29uc3RyYWludCwgaW5wdXQsIG9wdGlvbiwgbWVzc2FnZSkge1xyXG4gICAgICAgIHNldENvbnN0cmFpbnRQcm9wKGNvbnN0cmFpbnQsICdudW1lcmljYWxpdHknLCB7XHJcbiAgICAgICAgICAgIGV2ZW46IG1lc3NhZ2UgPyB7IG1lc3NhZ2U6IG1lc3NhZ2UgfSA6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgRm9ybVZhbGlkYXRvci5hZGRDb25zdHJhaW50QnVpbGRlcignbGVuZ3RoLWVxdWFsJywgZnVuY3Rpb24gKGNvbnN0cmFpbnQsIGlucHV0LCBvcHRpb24sIG1lc3NhZ2UpIHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gK29wdGlvbjtcclxuICAgICAgICBpZiAoaXNOYU4obGVuZ3RoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdpbnZhbGlkIHZhbGlkYXRpb24gYXR0cmlidXRlIGxlbmd0aC1lcXVhbCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldENvbnN0cmFpbnRQcm9wKGNvbnN0cmFpbnQsICdsZW5ndGgnLCB7XHJcbiAgICAgICAgICAgIGlzOiBtZXNzYWdlID8geyBtZXNzYWdlOiBtZXNzYWdlLCBjb3VudDogbGVuZ3RoIH0gOiBsZW5ndGhcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgRm9ybVZhbGlkYXRvci5hZGRDb25zdHJhaW50QnVpbGRlcignbGVuZ3RoLW1heCcsIGZ1bmN0aW9uIChjb25zdHJhaW50LCBpbnB1dCwgb3B0aW9uLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9ICtvcHRpb247XHJcbiAgICAgICAgaWYgKGlzTmFOKGxlbmd0aCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignaW52YWxpZCB2YWxpZGF0aW9uIGF0dHJpYnV0ZSBsZW5ndGgtbWF4Jyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0Q29uc3RyYWludFByb3AoY29uc3RyYWludCwgJ2xlbmd0aCcsIHtcclxuICAgICAgICAgICAgbWF4aW11bTogbWVzc2FnZSA/IHsgbWVzc2FnZTogbWVzc2FnZSwgY291bnQ6IGxlbmd0aCB9IDogbGVuZ3RoXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG52YXIgRm9ybVZhbGlkYXRvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEZvcm1WYWxpZGF0b3IoX3Jvb3QsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLl9yb290ID0gX3Jvb3Q7XHJcbiAgICAgICAgdGhpcy5fY29uc3RyYWludHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2VsZW1zID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9saXZlVmFsaWRhdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgIGNyZWF0ZUN1c3RvbVZhbGlkYXRvcnMoKTtcclxuICAgICAgICB0aGlzLl9vcHRpb25zID0gYXNzaWduKHt9LCBPUFRJT05fREVGQVVMVFMsIG9wdGlvbnMgfHwge30pO1xyXG4gICAgICAgIGlmICh0aGlzLl9yb290LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2Zvcm0nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3Quc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgJycpO1xyXG4gICAgICAgICAgICB0aGlzLl9yb290LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMub25TdWJtaXQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Jvb3QuX19oaWRkZW5fdmFsaWRhdG9yID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5yb290QmxvY2spIHtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdC5jbGFzc0xpc3QuYWRkKHRoaXMuX29wdGlvbnMucm9vdEJsb2NrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENhbGwgdGhpcyBmdW5jdGlvbiB0byB2YWxpZGF0ZSB0aGUgYWxsIGVsZW1lbnRzIG9mIHRoZSByb290IGJsb2NrLlxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzaWxlbnQgU2lsZW50IHZhbGlkYXRpb24gbWVhbnMgdGhhdCBET00gaXMgbm90IGFsdGVyZWQgaW4gYW55IHdheS5cclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIGFsbCBlbGVtZW50cyBhcmUgdmFsaWQsIGZhbHNlIG90aGVyd2lzZVxyXG4gICAgICovXHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS52YWxpZGF0ZSA9IGZ1bmN0aW9uIChzaWxlbnQpIHtcclxuICAgICAgICBpZiAoc2lsZW50ID09PSB2b2lkIDApIHsgc2lsZW50ID0gZmFsc2U7IH1cclxuICAgICAgICB2YXIgZXJyb3JzID0gdmFsaWRhdGUodGhpcy5fcm9vdCwgdGhpcy5jb25zdHJhaW50cywge1xyXG4gICAgICAgICAgICBmdWxsTWVzc2FnZXM6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGhhc0Vycm9ycyA9IGVycm9ycyAhPSBudWxsO1xyXG4gICAgICAgIGlmICghc2lsZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9ycyhlcnJvcnMpO1xyXG4gICAgICAgICAgICB0aGlzLl9iZWdpbkxpdmVWYWxpZGF0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAhaGFzRXJyb3JzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ2FsbCB0aGlzIGZ1bmN0aW9uIHRvIHZhbGlkYXRlIGEgc2luZ2xlIGVsZW1lbnQgd2l0aCBnaXZlbiBuYW1lLlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVsZW1OYW1lIE5hbWUgb2YgdGhlIGVsZW1lbnQgdG8gdmFsaWRhdGVcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2lsZW50IFNpbGVudCB2YWxpZGF0aW9uIG1lYW5zIHRoYXQgRE9NIGlzIG5vdCBhbHRlcmVkIGluIGFueSB3YXkuXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgZWxlbWVudCBpcyB2YWxpZCwgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAgICAgKi9cclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLnZhbGlkYXRlU2luZ2xlID0gZnVuY3Rpb24gKGVsZW1OYW1lLCBzaWxlbnQpIHtcclxuICAgICAgICBpZiAoc2lsZW50ID09PSB2b2lkIDApIHsgc2lsZW50ID0gZmFsc2U7IH1cclxuICAgICAgICBpZiAoIXRoaXMuX2NvbnN0cmFpbnRzIHx8ICF0aGlzLl9lbGVtcykge1xyXG4gICAgICAgICAgICB0aGlzLl9idWlsZENvbnN0cmFpbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBlbGVtRGF0YSA9IHRoaXMuX2VsZW1zID8gdGhpcy5fZWxlbXNbZWxlbU5hbWVdIDogbnVsbDtcclxuICAgICAgICBpZiAoIWVsZW1EYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcImVsZW1lbnQgd2l0aCBuYW1lIFwiICsgZWxlbU5hbWUgKyBcIiBoYXMgbm90IGJlZW4gZm91bmQgd2hpbGUgdmFsaWRhdGluZyBhIHNpbmdsZSBlbGVtZW50XCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbnN0cmFpbnQgPSB0aGlzLl9jb25zdHJhaW50cyA/IHRoaXMuX2NvbnN0cmFpbnRzW2VsZW1OYW1lXSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGVycm9yID0gbnVsbDtcclxuICAgICAgICBpZiAoY29uc3RyYWludCkge1xyXG4gICAgICAgICAgICBlcnJvciA9IHZhbGlkYXRlLnNpbmdsZSh0aGlzLl9nZXRJbnB1dFZhbHVlKGVsZW1EYXRhLmVsZW0pLCBjb25zdHJhaW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzaWxlbnQpIHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVycm9yKGVycm9yLCBlbGVtRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyRXJyb3IoZWxlbURhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlcnJvciA9PSBudWxsO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJjb25zdHJhaW50c1wiLCB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHJldHVybnMge1ZhbGlkYXRpb25Db25zdHJhaW50c30gTGlzdCBvZiBjb25zdHJhaW50cyBjb2xsZWN0ZWQgZnJvbSBIVE1MNSB2YWxpZGF0aW9uIGF0dHJpYnV0ZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9jb25zdHJhaW50cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYnVpbGRDb25zdHJhaW50cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb25zdHJhaW50cztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJyb290XCIsIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcmV0dXJucyB7RWxlbWVudH0gRm9ybSBlbGVtZW50IGFzc290aWF0ZWQgd2l0aCB0aGUgb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb290O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLCBcInJvb3RCbG9ja1wiLCB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ30gQmxvY2sgbmFtZSBmb3IgYSByb290IGVsZW1lbnRcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnMucm9vdEJsb2NrIHx8IE9QVElPTl9ERUZBVUxUUy5yb290QmxvY2s7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRm9ybVZhbGlkYXRvci5wcm90b3R5cGUsIFwicm9vdFZhbGlkQ2xhc3NcIiwge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IEEgY2xhc3MgbmFtZSBhcHBsaWVkIHRvIHRoZSByb290IGJsb2NrIGlmIGFsbCBpdHMgY2hpbGRyZW4gYXJlIHZhbGlkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlTW9kKHRoaXMucm9vdEJsb2NrLCB0aGlzLl9vcHRpb25zLnJvb3RWYWxpZE1vZCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRm9ybVZhbGlkYXRvci5wcm90b3R5cGUsIFwicm9vdEludmFsaWRDbGFzc1wiLCB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ30gQSBjbGFzcyBuYW1lIGFwcGxpZWQgdG8gdGhlIHJvb3QgZWxlbWVudCBpZiBhdCBsZWFzdCBvbmUgb2YgaXRzIGNoaWxkcmVuIGlzIGludmFsaWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ha2VNb2QodGhpcy5yb290QmxvY2ssIHRoaXMuX29wdGlvbnMucm9vdEludmFsaWRNb2QpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLCBcImlucHV0QmxvY2tcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJycgKyB0aGlzLl9vcHRpb25zLmlucHV0QmxvY2s7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRm9ybVZhbGlkYXRvci5wcm90b3R5cGUsIFwiaW5wdXRCbG9ja0Vycm9yRWxlbWVudFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlRWxlbSh0aGlzLmlucHV0QmxvY2ssICcnICsgdGhpcy5fb3B0aW9ucy5pbnB1dEJsb2NrRXJyb3JFbGVtKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJpbnB1dEJsb2NrVmFsaWRDbGFzc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlTW9kKHRoaXMuaW5wdXRCbG9jaywgJycgKyB0aGlzLl9vcHRpb25zLmlucHV0QmxvY2tWYWxpZE1vZCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRm9ybVZhbGlkYXRvci5wcm90b3R5cGUsIFwiaW5wdXRCbG9ja0ludmFsaWRDbGFzc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlTW9kKHRoaXMuaW5wdXRCbG9jaywgJycgKyB0aGlzLl9vcHRpb25zLmlucHV0QmxvY2tJbnZhbGlkTW9kKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJvcHRpb25zXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFzc2lnbih7fSwgdGhpcy5fb3B0aW9ucyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRm9ybVZhbGlkYXRvci5wcm90b3R5cGUsIFwibGl2ZVZhbGlkYXRpb25cIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGl2ZVZhbGlkYXRpb247XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBGb3JtVmFsaWRhdG9yLmZyb21Sb290ID0gZnVuY3Rpb24gKHJvb3QpIHtcclxuICAgICAgICBpZiAoIXJvb3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByb290Ll9faGlkZGVuX3ZhbGlkYXRvcjtcclxuICAgIH07XHJcbiAgICBGb3JtVmFsaWRhdG9yLmluaXQgPSBmdW5jdGlvbiAocm9vdENsYXNzLCBvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHJvb3RDbGFzcyA9PT0gdm9pZCAwKSB7IHJvb3RDbGFzcyA9ICdqcy12YWxpZGF0ZSc7IH1cclxuICAgICAgICB2YXIgZm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHJvb3RDbGFzcyk7XHJcbiAgICAgICAgZm9yICh2YXIgcSA9IDA7IHEgPCBmb3Jtcy5sZW5ndGg7ICsrcSkge1xyXG4gICAgICAgICAgICBuZXcgRm9ybVZhbGlkYXRvcihmb3Jtc1txXSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIEZvcm1WYWxpZGF0b3IuYWRkQ29uc3RyYWludEJ1aWxkZXIgPSBmdW5jdGlvbiAobmFtZSwgYnVpbGRlciwgdmFsaWRhdG9yKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbnN0cmFpbnRCdWlsZGVyc1tuYW1lXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZWdpc3RlciBhIGN1c3RvbSBjb25zdHJhaW50IGJ1aWxkZXI6IG5hbWUgW1wiICsgbmFtZSArIFwiXSBpcyBhbHJlYWR5IGluIHVzZVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZhbGlkYXRvciAmJiB2YWxpZGF0ZS52YWxpZGF0b3JzW25hbWVdICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJlZ2lzdGVyIGEgY3VzdG9tIHZhbGlkYXRvcjogbmFtZSBbXCIgKyBuYW1lICsgXCJdIGlzIGFscmVhZHkgaW4gdXNlXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb25zdHJhaW50QnVpbGRlcnNbbmFtZV0gPSBidWlsZGVyO1xyXG4gICAgICAgIGlmICh2YWxpZGF0b3IpIHtcclxuICAgICAgICAgICAgdmFsaWRhdGUudmFsaWRhdG9yc1tuYW1lXSA9IHZhbGlkYXRvcjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuZm9ybWF0TXNnID0gZnVuY3Rpb24gKG1zZywgcGFyYW1zKSB7XHJcbiAgICAgICAgdmFyIFNFUF9DSEFSQ09ERSA9ICckJy5jaGFyQ29kZUF0KDApLCBMT1dfQUxQSEFfU1RBUlQgPSAnYScuY2hhckNvZGVBdCgwKSwgSElHSF9BTFBIQV9FTkQgPSAneicuY2hhckNvZGVBdCgwKSwgTEdfQUxQSEFfU1RBUlQgPSAnQScuY2hhckNvZGVBdCgwKSwgTEdfQUxQSEFfRU5EID0gJ1onLmNoYXJDb2RlQXQoMCksIERJR0lUX1NUQVJUID0gJzAnLmNoYXJDb2RlQXQoMCksIERJR0lUX0VORCA9ICc5Jy5jaGFyQ29kZUF0KDApLCBVTkRFUlNDT1JFID0gJ18nLmNoYXJDb2RlQXQoMCk7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIHZhciB0YWlsID0gMCwgaGVhZCA9IDA7XHJcbiAgICAgICAgd2hpbGUgKGhlYWQgPCBtc2cubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlmIChtc2cuY2hhckNvZGVBdChoZWFkKSA9PT0gU0VQX0NIQVJDT0RFKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBlbnRlciBwbGFjZWhvbGRlclxyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobXNnLnNsaWNlKHRhaWwsIGhlYWQpKTtcclxuICAgICAgICAgICAgICAgIHRhaWwgPSBoZWFkO1xyXG4gICAgICAgICAgICAgICAgKytoZWFkO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoID0gbXNnLmNoYXJDb2RlQXQoaGVhZCk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoKGNoID49IExPV19BTFBIQV9TVEFSVCAmJiBjaCA8PSBISUdIX0FMUEhBX0VORCkgfHwgKGNoID49IExHX0FMUEhBX1NUQVJUICYmIGNoIDw9IExHX0FMUEhBX0VORClcclxuICAgICAgICAgICAgICAgICAgICB8fCAoY2ggPj0gRElHSVRfU1RBUlQgJiYgY2ggPD0gRElHSVRfRU5EKSB8fCBjaCA9PT0gVU5ERVJTQ09SRSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoID0gbXNnLmNoYXJDb2RlQXQoKytoZWFkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlciA9IG1zZy5zbGljZSh0YWlsICsgMSwgaGVhZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGxhY2Vob2xkZXIubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBmb3JtYXQgc3RyaW5nOiBlcnJvciBhdCAnICsgcGxhY2Vob2xkZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goJycgKyAocGFyYW1zW3BsYWNlaG9sZGVyXSB8fCAnJykpO1xyXG4gICAgICAgICAgICAgICAgLS1oZWFkO1xyXG4gICAgICAgICAgICAgICAgdGFpbCA9IGhlYWQgKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgKytoZWFkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc3VsdC5wdXNoKG1zZy5zbGljZSh0YWlsKSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcclxuICAgIH07XHJcbiAgICAvKiogUHJvdGVjdGVkIGFyZWEgKiovXHJcbiAgICAvKipcclxuICAgICAqIENhbGxlZCB0byBoYW5kbGUgZm9ybSBzdWJtaXQgZXZlbnRcclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgRXZlbnQgb2JqZWN0XHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJuIHRydWUgaWYgZm9ybSBzaG91bGQgYmUgc3VibWl0dGVkLCBmYWxzZSBvdGhlcndpc2VcclxuICAgICAqL1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUub25TdWJtaXQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlKCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsZWQgdG8gc2hvdyBlcnJvcnMgb24gY29ycmVzcG9uZGluZyBlbGVtZW50cy5cclxuICAgICAqIEBwYXJhbSBlcnJvcnMgRXJyb3Igb2JqZWN0IGFzIHJldHJpZXZlZCBmcm9tIHZhbGlkYXRlLmpzLlxyXG4gICAgICovXHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5zaG93RXJyb3JzID0gZnVuY3Rpb24gKGVycm9ycykge1xyXG4gICAgICAgIGlmICghdGhpcy5fZWxlbXMpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdJbnZhbGlkIHNob3dFcnJvcnMgY2FsbDogbm8gZWxlbWVudHMgaGFzIGJlZW4gY29sbGVjdGVkJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IE9iamVjdC5rZXlzKHRoaXMuX2VsZW1zKTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgdmFyIGVsZW1fbmFtZSA9IF9hW19pXTtcclxuICAgICAgICAgICAgaWYgKGVycm9ycyAmJiBlcnJvcnNbZWxlbV9uYW1lXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVycm9yKGVycm9yc1tlbGVtX25hbWVdLCB0aGlzLl9lbGVtc1tlbGVtX25hbWVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJFcnJvcih0aGlzLl9lbGVtc1tlbGVtX25hbWVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5zZXRFcnJvciA9IGZ1bmN0aW9uIChtc2csIGVsZW0pIHtcclxuICAgICAgICAvLyBzZXQgdGl0bGVzXHJcbiAgICAgICAgZWxlbS5lbGVtLnNldEF0dHJpYnV0ZSgndGl0bGUnLCBtc2cpO1xyXG4gICAgICAgIGlmIChlbGVtLmVycm9yRWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgbXNnTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG1zZyk7XHJcbiAgICAgICAgICAgIGVsZW0uZXJyb3JFbGVtZW50LmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgICAgICBlbGVtLmVycm9yRWxlbWVudC5hcHBlbmRDaGlsZChtc2dOb2RlKTtcclxuICAgICAgICAgICAgZWxlbS5lcnJvckVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aXRsZScsIG1zZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBjbGFzc2VzXHJcbiAgICAgICAgaWYgKGVsZW0uaWIpIHtcclxuICAgICAgICAgICAgZWxlbS5pYi5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuaW5wdXRCbG9ja1ZhbGlkQ2xhc3MpO1xyXG4gICAgICAgICAgICBlbGVtLmliLmNsYXNzTGlzdC5hZGQodGhpcy5pbnB1dEJsb2NrSW52YWxpZENsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxlbS52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2V0Um9vdEhhc0Vycm9ycyh0cnVlKTtcclxuICAgIH07XHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5jbGVhckVycm9yID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICAvLyBjbGVhciB0aXRsZXNcclxuICAgICAgICBlbGVtLmVsZW0uc2V0QXR0cmlidXRlKCd0aXRsZScsICcnKTtcclxuICAgICAgICBpZiAoZWxlbS5lcnJvckVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbS5lcnJvckVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICAgIGVsZW0uZXJyb3JFbGVtZW50LnNldEF0dHJpYnV0ZSgndGl0bGUnLCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNsZWFyIGVycm9yIGNsYXNzZXNcclxuICAgICAgICBpZiAoZWxlbS5pYikge1xyXG4gICAgICAgICAgICBlbGVtLmliLmNsYXNzTGlzdC5hZGQodGhpcy5pbnB1dEJsb2NrVmFsaWRDbGFzcyk7XHJcbiAgICAgICAgICAgIGVsZW0uaWIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmlucHV0QmxvY2tJbnZhbGlkQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbGVtLnZhbGlkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNldFJvb3RIYXNFcnJvcnModGhpcy5faGFzSW52YWxpZEVsZW1zKCkpO1xyXG4gICAgfTtcclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLl9oYXNJbnZhbGlkRWxlbXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5fZWxlbXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2VsZW1zKS5tYXAoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIF90aGlzLl9lbGVtc1t4XTsgfSkuc29tZShmdW5jdGlvbiAoeCkgeyByZXR1cm4gIXgudmFsaWQ7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuX2J1aWxkSW5wdXREYXRhID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgaWIgPSBjbG9zZXN0KGVsZW0sICcuJyArIHRoaXMuX29wdGlvbnMuaW5wdXRCbG9jayk7XHJcbiAgICAgICAgaWYgKCFpYikge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZWxlbTogZWxlbSxcclxuICAgICAgICAgICAgICAgIGliOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgZXJyb3JFbGVtZW50OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgdmFsaWQ6IG51bGxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGVyckNvbnRhaW5lckNsYXNzID0gbWFrZUVsZW0oJycgKyB0aGlzLl9vcHRpb25zLmlucHV0QmxvY2ssICcnICsgdGhpcy5fb3B0aW9ucy5pbnB1dEJsb2NrRXJyb3JFbGVtKTtcclxuICAgICAgICB2YXIgZXJyb3JFbGVtZW50ID0gaWIucXVlcnlTZWxlY3RvcignLicgKyBlcnJDb250YWluZXJDbGFzcyk7XHJcbiAgICAgICAgaWYgKCFlcnJvckVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZXJyb3JFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGliLmFwcGVuZENoaWxkKGVycm9yRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGVsZW06IGVsZW0sXHJcbiAgICAgICAgICAgIGliOiBpYixcclxuICAgICAgICAgICAgZXJyb3JFbGVtZW50OiBlcnJvckVsZW1lbnQsXHJcbiAgICAgICAgICAgIHZhbGlkOiBudWxsXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5fZ2V0RWxlbWVudE1zZyA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgdmFyIG1zZ0NsYXNzZXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBtc2dDbGFzc2VzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBxID0gMDsgcSA8IG1zZ0NsYXNzZXMubGVuZ3RoOyArK3EpIHtcclxuICAgICAgICAgICAgdmFyIG1zZ0NsYXNzVW5kZXJzY29yZWQgPSAnZGF0YS1tc2ctJyArIHNlcGFyYXRlZChtc2dDbGFzc2VzW3FdLCAnLScpLCBtc2dDbGFzc0NhbWVsID0gJ2RhdGEtbXNnLScgKyBjYW1lbChtc2dDbGFzc2VzW3FdKTtcclxuICAgICAgICAgICAgdmFyIGF0dHJfMSA9IGVsZW0uZ2V0QXR0cmlidXRlKG1zZ0NsYXNzVW5kZXJzY29yZWQpIHx8IGVsZW0uZ2V0QXR0cmlidXRlKG1zZ0NsYXNzQ2FtZWwpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cl8xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXR0cl8xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHRyeSBnZW5lcmljIG1lc3NhZ2VcclxuICAgICAgICB2YXIgYXR0ciA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLW1zZy1lcnJvcicpO1xyXG4gICAgICAgIGlmIChhdHRyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhdHRyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuX29wdGlvbnMubWVzc2FnZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIHEgPSAwOyBxIDwgbXNnQ2xhc3Nlcy5sZW5ndGg7ICsrcSkge1xyXG4gICAgICAgICAgICB2YXIgZGVmID0gdGhpcy5fb3B0aW9ucy5tZXNzYWdlc1tjYW1lbChtc2dDbGFzc2VzW3FdKV07XHJcbiAgICAgICAgICAgIGlmIChkZWYpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9O1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuX2J1aWxkQ29uc3RyYWludHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGVsZW1zID0gdGhpcy5yb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuYW1lXScpO1xyXG4gICAgICAgIHZhciBidWlsZGVyS2V5cyA9IE9iamVjdC5rZXlzKEZvcm1WYWxpZGF0b3IuX2NvbnN0cmFpbnRCdWlsZGVycyk7XHJcbiAgICAgICAgdmFyIGJ1aWxkZXJBdHRycyA9IGJ1aWxkZXJLZXlzLm1hcChmdW5jdGlvbiAoeCkgeyByZXR1cm4gJ2RhdGEtdmFsaWRhdGUtJyArIHg7IH0pO1xyXG4gICAgICAgIHRoaXMuX2NvbnN0cmFpbnRzID0ge307XHJcbiAgICAgICAgdGhpcy5fZWxlbXMgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBxID0gMDsgcSA8IGVsZW1zLmxlbmd0aDsgKytxKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtID0gZWxlbXNbcV07XHJcbiAgICAgICAgICAgIHZhciBlbGVtX25hbWUgPSBlbGVtLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xyXG4gICAgICAgICAgICBpZiAoIWVsZW1fbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTm8gbmFtZSBmb3IgZWxlbWVudFwiLCBlbGVtKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1zW2VsZW1fbmFtZV0gPSB0aGlzLl9idWlsZElucHV0RGF0YShlbGVtKTtcclxuICAgICAgICAgICAgdmFyIGNvbnN0cmFpbnQgPSB7fTtcclxuICAgICAgICAgICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKCdyZXF1aXJlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuX2dldEVsZW1lbnRNc2coZWxlbSwgJ3JlcXVpcmVkJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50LnByZXNlbmNlID0gbWVzc2FnZSA/IHsgbWVzc2FnZTogbWVzc2FnZSB9IDogdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWlubGVuZ3RoID0gK2VsZW0uZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKTtcclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5fZ2V0RWxlbWVudE1zZyhlbGVtLCAnbWlubGVuZ3RoJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50Lmxlbmd0aCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBtaW5pbXVtOiBtaW5sZW5ndGhcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSB0aGlzLmZvcm1hdE1zZyhtZXNzYWdlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogbWlubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludC5sZW5ndGgubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKCdwYXR0ZXJuJykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXR0ZXJuID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQuZm9ybWF0ID0geyBwYXR0ZXJuOiBwYXR0ZXJuIH07XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuX2dldEVsZW1lbnRNc2coZWxlbSwgJ3BhdHRlcm4nKTtcclxuICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IHRoaXMuZm9ybWF0TXNnKG1lc3NhZ2UsIHsgcGF0dGVybjogcGF0dGVybiB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50LmZvcm1hdC5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzd2l0Y2ggKGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdpbnB1dCc6XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKChlbGVtLmdldEF0dHJpYnV0ZSgndHlwZScpIHx8ICd0ZXh0JykudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZW1haWwnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLl9nZXRFbGVtZW50TXNnKGVsZW0sICdlbWFpbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50LmVtYWlsID0gbWVzc2FnZSA/IHsgbWVzc2FnZTogbWVzc2FnZSB9IDogdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd1cmwnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLl9nZXRFbGVtZW50TXNnKGVsZW0sICd1cmwnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludC51cmwgPSBtZXNzYWdlID8geyBtZXNzYWdlOiBtZXNzYWdlIH0gOiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUoJ2RhdGEtdmFsaWRhdGUtdXJsLWFsbG93LWxvY2FsJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc3RyYWludC51cmwgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludC51cmwuYWxsb3dMb2NhbCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50LnVybCA9IHsgYWxsb3dMb2NhbDogdHJ1ZSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtLmhhc0F0dHJpYnV0ZSgnZGF0YS12YWxpZGF0ZS11cmwtc2NoZW1lcycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NoZW1lcyA9IHZvaWQgMCwgc2NoZW1lc0F0dHIgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS12YWxpZGF0ZS11cmwtc2NoZW1lcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjaGVtZXNBdHRyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZW1lcyA9IEpTT04ucGFyc2Uoc2NoZW1lc0F0dHIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVtZXMgPSBbc2NoZW1lc0F0dHJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnN0cmFpbnQudXJsID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50LnVybC5zY2hlbWVzID0gc2NoZW1lcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQudXJsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZW1lczogc2NoZW1lc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50Lm51bWVyaWNhbGl0eSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWluID0gbnVsbCwgbWF4ID0gbnVsbCwgc3RlcCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtLmhhc0F0dHJpYnV0ZSgnbWluJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbiA9ICtlbGVtLmdldEF0dHJpYnV0ZSgnbWluJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50Lm51bWVyaWNhbGl0eS5ncmVhdGVyVGhhbk9yRXF1YWxUbyA9IG1pbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUoJ21heCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXggPSArZWxlbS5nZXRBdHRyaWJ1dGUoJ21heCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludC5udW1lcmljYWxpdHkubGVzc1RoYW5PckVxdWFsVG8gPSBtYXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKCdzdGVwJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSArZWxlbS5nZXRBdHRyaWJ1dGUoJ3N0ZXAnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQuc3RlcCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwOiBzdGVwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1pbiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludC5zdGVwLm1pbiA9IG1pbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtc2cgPSB0aGlzLl9nZXRFbGVtZW50TXNnKGVsZW0sICdzdGVwJywgJ251bWJlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1zZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQuc3RlcC5tZXNzYWdlID0gbXNnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWZNc2dDbGFzcyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1pbiA9PSBudWxsICYmIG1heCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZNc2dDbGFzcyA9ICdudW1iZXInO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1pbiAhPSBudWxsICYmIG1heCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZNc2dDbGFzcyA9ICdudW1iZXJNaW5NYXgnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1pbiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZNc2dDbGFzcyA9ICdudW1iZXJNaW4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmTXNnQ2xhc3MgPSAnbnVtYmVyTWF4JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuX2dldEVsZW1lbnRNc2coZWxlbSwgZGVmTXNnQ2xhc3MsICdudW1iZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSB0aGlzLmZvcm1hdE1zZyhtZXNzYWdlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluOiBtaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4OiBtYXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcDogc3RlcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50Lm51bWVyaWNhbGl0eS5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3NlbGVjdCc6XHJcbiAgICAgICAgICAgICAgICBjYXNlICd0ZXh0YXJlYSc6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignVW5zdXBwb3J0ZWQgZWxlbWVudCB0YWc6ICcsIGVsZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIHFfMSA9IDA7IHFfMSA8IGJ1aWxkZXJLZXlzLmxlbmd0aDsgKytxXzEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtLmhhc0F0dHJpYnV0ZShidWlsZGVyQXR0cnNbcV8xXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbXNnID0gdGhpcy5fZ2V0RWxlbWVudE1zZyhlbGVtLCBidWlsZGVyS2V5c1txXzFdKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3X2NvbnN0cmFpbnQgPSBGb3JtVmFsaWRhdG9yLl9jb25zdHJhaW50QnVpbGRlcnNbYnVpbGRlcktleXNbcV8xXV0oY29uc3RyYWludCwgZWxlbSwgJycgKyBlbGVtLmdldEF0dHJpYnV0ZShidWlsZGVyQXR0cnNbcV8xXSksIG1zZywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld19jb25zdHJhaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQgPSBuZXdfY29uc3RyYWludDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGNvbnN0cmFpbnQpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnN0cmFpbnRzW2VsZW1fbmFtZV0gPSBjb25zdHJhaW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLl9iZWdpbkxpdmVWYWxpZGF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9saXZlVmFsaWRhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5fb3B0aW9ucy5yZXZhbGlkYXRlT25JbnB1dCAmJiAhdGhpcy5fb3B0aW9ucy5yZXZhbGlkYXRlT25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuX2VsZW1zKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1aWxkQ29uc3RyYWludHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IE9iamVjdC5rZXlzKHRoaXMuX2VsZW1zKTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgdmFyIGVsZW1OYW1lID0gX2FbX2ldO1xyXG4gICAgICAgICAgICB2YXIgZWxlbURhdGEgPSB0aGlzLl9lbGVtc1tlbGVtTmFtZV07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnJldmFsaWRhdGVPbkNoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbURhdGEuZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLm9uRWxlbWVudENoYW5nZS5iaW5kKHRoaXMsIGVsZW1OYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMucmV2YWxpZGF0ZU9uSW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1EYXRhLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLm9uRWxlbWVudENoYW5nZS5iaW5kKHRoaXMsIGVsZW1OYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbGl2ZVZhbGlkYXRpb24gPSB0cnVlO1xyXG4gICAgfTtcclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLm9uRWxlbWVudENoYW5nZSA9IGZ1bmN0aW9uIChlbGVtTmFtZSwgZSkge1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGVTaW5nbGUoZWxlbU5hbWUpO1xyXG4gICAgfTtcclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLnNldFJvb3RIYXNFcnJvcnMgPSBmdW5jdGlvbiAoaGFzRXJyb3JzKSB7XHJcbiAgICAgICAgdG9nZ2xlQ2xhc3ModGhpcy5fcm9vdCwgdGhpcy5yb290VmFsaWRDbGFzcywgIWhhc0Vycm9ycyk7XHJcbiAgICAgICAgdG9nZ2xlQ2xhc3ModGhpcy5fcm9vdCwgdGhpcy5yb290SW52YWxpZENsYXNzLCBoYXNFcnJvcnMpO1xyXG4gICAgfTtcclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLl9nZXRJbnB1dFZhbHVlID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSBlbGVtLnZhbHVlO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSAnJyA/IG51bGwgOiB2YWx1ZTtcclxuICAgIH07XHJcbiAgICBGb3JtVmFsaWRhdG9yLl9jb25zdHJhaW50QnVpbGRlcnMgPSB7fTtcclxuICAgIHJldHVybiBGb3JtVmFsaWRhdG9yO1xyXG59KCkpO1xyXG5leHBvcnRzLkZvcm1WYWxpZGF0b3IgPSBGb3JtVmFsaWRhdG9yO1xyXG4vKipcclxuICogRWxlbWVudC5tYXRjaGVzIG1ldGhvZCBwb2x5ZmlsbC5cclxuICogV2Ugc2hvdWxkIG5vdCB0b3VjaCBwcm90b3R5cGUgb2YgRWxlbWVudCB0byBhdm9pZCBtZXNzaW5nIHdpdGggYW5vdGhlciBsaWJzXHJcbiAqL1xyXG52YXIgbWF0Y2hlc0Z1bmMgPSBudWxsO1xyXG5mdW5jdGlvbiBtYXRjaGVzKGVsZW0sIHNlbGVjdG9yKSB7XHJcbiAgICBpZiAoIW1hdGNoZXNGdW5jKSB7XHJcbiAgICAgICAgbWF0Y2hlc0Z1bmMgPSBFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzIHx8IEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3RvcjtcclxuICAgIH1cclxuICAgIHJldHVybiBtYXRjaGVzRnVuYy5jYWxsKGVsZW0sIHNlbGVjdG9yKTtcclxufVxyXG4vKipcclxuICogRWxlbWVudC5jbG9zZXN0IG1ldGhvZCBwb2x5ZmlsbFxyXG4gKi9cclxuZnVuY3Rpb24gY2xvc2VzdChlbGVtLCBzZWxlY3Rvcikge1xyXG4gICAgaWYgKGVsZW0uY2xvc2VzdCkge1xyXG4gICAgICAgIHJldHVybiBlbGVtLmNsb3Nlc3Qoc2VsZWN0b3IpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGVsID0gZWxlbTtcclxuICAgICAgICB3aGlsZSAoZWwgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAobWF0Y2hlcyhlbCwgc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWw7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gYXNzaWduKCkge1xyXG4gICAgdmFyIG9ianMgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgb2Jqc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgaWYgKE9iamVjdC5hc3NpZ24pIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbi5hcHBseSh0aGlzLCBvYmpzKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBsb2Rhc2hfYXNzaWduLmFwcGx5KHRoaXMsIG9ianMpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIG1ha2VNb2QoYmxvY2ssIG1vZGlmaWVyKSB7XHJcbiAgICByZXR1cm4gbW9kaWZpZXIgPyBibG9jayArICctLScgKyBtb2RpZmllciA6IGJsb2NrO1xyXG59XHJcbmZ1bmN0aW9uIG1ha2VFbGVtKGJsb2NrLCBlbGVtKSB7XHJcbiAgICByZXR1cm4gYmxvY2sgKyAnX18nICsgZWxlbTtcclxufVxyXG5mdW5jdGlvbiB0b2dnbGVDbGFzcyhlbGVtLCBjbGFzc05hbWUsIHZhbHVlKSB7XHJcbiAgICAodmFsdWUgPyBlbGVtLmNsYXNzTGlzdC5hZGQgOiBlbGVtLmNsYXNzTGlzdC5yZW1vdmUpLmNhbGwoZWxlbS5jbGFzc0xpc3QsIGNsYXNzTmFtZSk7XHJcbn1cclxuZnVuY3Rpb24gc2VwYXJhdGVkKG5hbWUsIHNlcCkge1xyXG4gICAgaWYgKHNlcCA9PT0gdm9pZCAwKSB7IHNlcCA9ICdfJzsgfVxyXG4gICAgdmFyIENIX0xHX0xPV0VSID0gJ0EnLmNoYXJDb2RlQXQoMCksIENIX0xHX0hJR0ggPSAnWicuY2hhckNvZGVBdCgwKTtcclxuICAgIHZhciB0YWlsID0gMCwgaGVhZCA9IDA7XHJcbiAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICB3aGlsZSAoaGVhZCA8IG5hbWUubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIGNoID0gbmFtZS5jaGFyQ29kZUF0KGhlYWQpO1xyXG4gICAgICAgIGlmIChjaCA+PSBDSF9MR19MT1dFUiAmJiBjaCA8PSBDSF9MR19ISUdIICYmIGhlYWQgIT09IDApIHtcclxuICAgICAgICAgICAgLy8gc3BsaXQgaGVyZVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaChuYW1lLnNsaWNlKHRhaWwsIGhlYWQpLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICAgICAgICB0YWlsID0gaGVhZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgKytoZWFkO1xyXG4gICAgfVxyXG4gICAgaWYgKGhlYWQgIT0gdGFpbCkge1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKG5hbWUuc2xpY2UodGFpbCwgaGVhZCkudG9Mb3dlckNhc2UoKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0LmpvaW4oc2VwKTtcclxufVxyXG5leHBvcnRzLnNlcGFyYXRlZCA9IHNlcGFyYXRlZDtcclxuZnVuY3Rpb24gY2FtZWwobmFtZSkge1xyXG4gICAgdmFyIHJlc3VsdCA9IG5hbWUuc3BsaXQoL1tfXFwtXS8pLmZpbHRlcihmdW5jdGlvbiAoeCkgeyByZXR1cm4geDsgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0Lm1hcChmdW5jdGlvbiAoeCwgaSkgeyByZXR1cm4gaSA+IDAgPyAoeC5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgeC5zbGljZSgxKS50b0xvd2VyQ2FzZSgpKSA6IHg7IH0pLmpvaW4oJycpO1xyXG59XHJcbmV4cG9ydHMuY2FtZWwgPSBjYW1lbDtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9pbmRleC50c1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiFcbiAqIHZhbGlkYXRlLmpzIDAuMTIuMFxuICpcbiAqIChjKSAyMDEzLTIwMTcgTmlja2xhcyBBbnNtYW4sIDIwMTMgV3JhcHBcbiAqIFZhbGlkYXRlLmpzIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogRm9yIGFsbCBkZXRhaWxzIGFuZCBkb2N1bWVudGF0aW9uOlxuICogaHR0cDovL3ZhbGlkYXRlanMub3JnL1xuICovXG5cbihmdW5jdGlvbihleHBvcnRzLCBtb2R1bGUsIGRlZmluZSkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBUaGUgbWFpbiBmdW5jdGlvbiB0aGF0IGNhbGxzIHRoZSB2YWxpZGF0b3JzIHNwZWNpZmllZCBieSB0aGUgY29uc3RyYWludHMuXG4gIC8vIFRoZSBvcHRpb25zIGFyZSB0aGUgZm9sbG93aW5nOlxuICAvLyAgIC0gZm9ybWF0IChzdHJpbmcpIC0gQW4gb3B0aW9uIHRoYXQgY29udHJvbHMgaG93IHRoZSByZXR1cm5lZCB2YWx1ZSBpcyBmb3JtYXR0ZWRcbiAgLy8gICAgICogZmxhdCAtIFJldHVybnMgYSBmbGF0IGFycmF5IG9mIGp1c3QgdGhlIGVycm9yIG1lc3NhZ2VzXG4gIC8vICAgICAqIGdyb3VwZWQgLSBSZXR1cm5zIHRoZSBtZXNzYWdlcyBncm91cGVkIGJ5IGF0dHJpYnV0ZSAoZGVmYXVsdClcbiAgLy8gICAgICogZGV0YWlsZWQgLSBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSByYXcgdmFsaWRhdGlvbiBkYXRhXG4gIC8vICAgLSBmdWxsTWVzc2FnZXMgKGJvb2xlYW4pIC0gSWYgYHRydWVgIChkZWZhdWx0KSB0aGUgYXR0cmlidXRlIG5hbWUgaXMgcHJlcGVuZGVkIHRvIHRoZSBlcnJvci5cbiAgLy9cbiAgLy8gUGxlYXNlIG5vdGUgdGhhdCB0aGUgb3B0aW9ucyBhcmUgYWxzbyBwYXNzZWQgdG8gZWFjaCB2YWxpZGF0b3IuXG4gIHZhciB2YWxpZGF0ZSA9IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB2Lm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdmFyIHJlc3VsdHMgPSB2LnJ1blZhbGlkYXRpb25zKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKVxuICAgICAgLCBhdHRyXG4gICAgICAsIHZhbGlkYXRvcjtcblxuICAgIGlmIChyZXN1bHRzLnNvbWUoZnVuY3Rpb24ocikgeyByZXR1cm4gdi5pc1Byb21pc2Uoci5lcnJvcik7IH0pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVc2UgdmFsaWRhdGUuYXN5bmMgaWYgeW91IHdhbnQgc3VwcG9ydCBmb3IgcHJvbWlzZXNcIik7XG4gICAgfVxuICAgIHJldHVybiB2YWxpZGF0ZS5wcm9jZXNzVmFsaWRhdGlvblJlc3VsdHMocmVzdWx0cywgb3B0aW9ucyk7XG4gIH07XG5cbiAgdmFyIHYgPSB2YWxpZGF0ZTtcblxuICAvLyBDb3BpZXMgb3ZlciBhdHRyaWJ1dGVzIGZyb20gb25lIG9yIG1vcmUgc291cmNlcyB0byBhIHNpbmdsZSBkZXN0aW5hdGlvbi5cbiAgLy8gVmVyeSBtdWNoIHNpbWlsYXIgdG8gdW5kZXJzY29yZSdzIGV4dGVuZC5cbiAgLy8gVGhlIGZpcnN0IGFyZ3VtZW50IGlzIHRoZSB0YXJnZXQgb2JqZWN0IGFuZCB0aGUgcmVtYWluaW5nIGFyZ3VtZW50cyB3aWxsIGJlXG4gIC8vIHVzZWQgYXMgc291cmNlcy5cbiAgdi5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgICBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGZvciAodmFyIGF0dHIgaW4gc291cmNlKSB7XG4gICAgICAgIG9ialthdHRyXSA9IHNvdXJjZVthdHRyXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIHYuZXh0ZW5kKHZhbGlkYXRlLCB7XG4gICAgLy8gVGhpcyBpcyB0aGUgdmVyc2lvbiBvZiB0aGUgbGlicmFyeSBhcyBhIHNlbXZlci5cbiAgICAvLyBUaGUgdG9TdHJpbmcgZnVuY3Rpb24gd2lsbCBhbGxvdyBpdCB0byBiZSBjb2VyY2VkIGludG8gYSBzdHJpbmdcbiAgICB2ZXJzaW9uOiB7XG4gICAgICBtYWpvcjogMCxcbiAgICAgIG1pbm9yOiAxMixcbiAgICAgIHBhdGNoOiAwLFxuICAgICAgbWV0YWRhdGE6IG51bGwsXG4gICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gdi5mb3JtYXQoXCIle21ham9yfS4le21pbm9yfS4le3BhdGNofVwiLCB2LnZlcnNpb24pO1xuICAgICAgICBpZiAoIXYuaXNFbXB0eSh2LnZlcnNpb24ubWV0YWRhdGEpKSB7XG4gICAgICAgICAgdmVyc2lvbiArPSBcIitcIiArIHYudmVyc2lvbi5tZXRhZGF0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmVyc2lvbjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQmVsb3cgaXMgdGhlIGRlcGVuZGVuY2llcyB0aGF0IGFyZSB1c2VkIGluIHZhbGlkYXRlLmpzXG5cbiAgICAvLyBUaGUgY29uc3RydWN0b3Igb2YgdGhlIFByb21pc2UgaW1wbGVtZW50YXRpb24uXG4gICAgLy8gSWYgeW91IGFyZSB1c2luZyBRLmpzLCBSU1ZQIG9yIGFueSBvdGhlciBBKyBjb21wYXRpYmxlIGltcGxlbWVudGF0aW9uXG4gICAgLy8gb3ZlcnJpZGUgdGhpcyBhdHRyaWJ1dGUgdG8gYmUgdGhlIGNvbnN0cnVjdG9yIG9mIHRoYXQgcHJvbWlzZS5cbiAgICAvLyBTaW5jZSBqUXVlcnkgcHJvbWlzZXMgYXJlbid0IEErIGNvbXBhdGlibGUgdGhleSB3b24ndCB3b3JrLlxuICAgIFByb21pc2U6IHR5cGVvZiBQcm9taXNlICE9PSBcInVuZGVmaW5lZFwiID8gUHJvbWlzZSA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG51bGwsXG5cbiAgICBFTVBUWV9TVFJJTkdfUkVHRVhQOiAvXlxccyokLyxcblxuICAgIC8vIFJ1bnMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cyBvYmplY3QuXG4gICAgLy8gV2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIGZvcm1hdDpcbiAgICAvLyAgICAgW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZSBuYW1lPlwiLCBlcnJvcjogXCI8dmFsaWRhdGlvbiByZXN1bHQ+XCJ9LCAuLi5dXG4gICAgcnVuVmFsaWRhdGlvbnM6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdXG4gICAgICAgICwgYXR0clxuICAgICAgICAsIHZhbGlkYXRvck5hbWVcbiAgICAgICAgLCB2YWx1ZVxuICAgICAgICAsIHZhbGlkYXRvcnNcbiAgICAgICAgLCB2YWxpZGF0b3JcbiAgICAgICAgLCB2YWxpZGF0b3JPcHRpb25zXG4gICAgICAgICwgZXJyb3I7XG5cbiAgICAgIGlmICh2LmlzRG9tRWxlbWVudChhdHRyaWJ1dGVzKSB8fCB2LmlzSnF1ZXJ5RWxlbWVudChhdHRyaWJ1dGVzKSkge1xuICAgICAgICBhdHRyaWJ1dGVzID0gdi5jb2xsZWN0Rm9ybVZhbHVlcyhhdHRyaWJ1dGVzKTtcbiAgICAgIH1cblxuICAgICAgLy8gTG9vcHMgdGhyb3VnaCBlYWNoIGNvbnN0cmFpbnRzLCBmaW5kcyB0aGUgY29ycmVjdCB2YWxpZGF0b3IgYW5kIHJ1biBpdC5cbiAgICAgIGZvciAoYXR0ciBpbiBjb25zdHJhaW50cykge1xuICAgICAgICB2YWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIGF0dHIpO1xuICAgICAgICAvLyBUaGlzIGFsbG93cyB0aGUgY29uc3RyYWludHMgZm9yIGFuIGF0dHJpYnV0ZSB0byBiZSBhIGZ1bmN0aW9uLlxuICAgICAgICAvLyBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdmFsdWUsIGF0dHJpYnV0ZSBuYW1lLCB0aGUgY29tcGxldGUgZGljdCBvZlxuICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0byBoYXZlIGRpZmZlcmVudFxuICAgICAgICAvLyB2YWxpZGF0aW9ucyBkZXBlbmRpbmcgb24gdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgICAgdmFsaWRhdG9ycyA9IHYucmVzdWx0KGNvbnN0cmFpbnRzW2F0dHJdLCB2YWx1ZSwgYXR0cmlidXRlcywgYXR0ciwgb3B0aW9ucywgY29uc3RyYWludHMpO1xuXG4gICAgICAgIGZvciAodmFsaWRhdG9yTmFtZSBpbiB2YWxpZGF0b3JzKSB7XG4gICAgICAgICAgdmFsaWRhdG9yID0gdi52YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuXG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3IpIHtcbiAgICAgICAgICAgIGVycm9yID0gdi5mb3JtYXQoXCJVbmtub3duIHZhbGlkYXRvciAle25hbWV9XCIsIHtuYW1lOiB2YWxpZGF0b3JOYW1lfSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhbGlkYXRvck9wdGlvbnMgPSB2YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuICAgICAgICAgIC8vIFRoaXMgYWxsb3dzIHRoZSBvcHRpb25zIHRvIGJlIGEgZnVuY3Rpb24uIFRoZSBmdW5jdGlvbiB3aWxsIGJlXG4gICAgICAgICAgLy8gY2FsbGVkIHdpdGggdGhlIHZhbHVlLCBhdHRyaWJ1dGUgbmFtZSwgdGhlIGNvbXBsZXRlIGRpY3Qgb2ZcbiAgICAgICAgICAvLyBhdHRyaWJ1dGVzIGFzIHdlbGwgYXMgdGhlIG9wdGlvbnMgYW5kIGNvbnN0cmFpbnRzIHBhc3NlZCBpbi5cbiAgICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGhhdmUgZGlmZmVyZW50XG4gICAgICAgICAgLy8gdmFsaWRhdGlvbnMgZGVwZW5kaW5nIG9uIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICAgICAgdmFsaWRhdG9yT3B0aW9ucyA9IHYucmVzdWx0KHZhbGlkYXRvck9wdGlvbnMsIHZhbHVlLCBhdHRyaWJ1dGVzLCBhdHRyLCBvcHRpb25zLCBjb25zdHJhaW50cyk7XG4gICAgICAgICAgaWYgKCF2YWxpZGF0b3JPcHRpb25zKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogYXR0cixcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHZhbGlkYXRvcjogdmFsaWRhdG9yTmFtZSxcbiAgICAgICAgICAgIGdsb2JhbE9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgICAgICAgb3B0aW9uczogdmFsaWRhdG9yT3B0aW9ucyxcbiAgICAgICAgICAgIGVycm9yOiB2YWxpZGF0b3IuY2FsbCh2YWxpZGF0b3IsXG4gICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yT3B0aW9ucyxcbiAgICAgICAgICAgICAgICBhdHRyLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgb3B0aW9ucylcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9LFxuXG4gICAgLy8gVGFrZXMgdGhlIG91dHB1dCBmcm9tIHJ1blZhbGlkYXRpb25zIGFuZCBjb252ZXJ0cyBpdCB0byB0aGUgY29ycmVjdFxuICAgIC8vIG91dHB1dCBmb3JtYXQuXG4gICAgcHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzOiBmdW5jdGlvbihlcnJvcnMsIG9wdGlvbnMpIHtcbiAgICAgIGVycm9ycyA9IHYucHJ1bmVFbXB0eUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5leHBhbmRNdWx0aXBsZUVycm9ycyhlcnJvcnMsIG9wdGlvbnMpO1xuICAgICAgZXJyb3JzID0gdi5jb252ZXJ0RXJyb3JNZXNzYWdlcyhlcnJvcnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgZm9ybWF0ID0gb3B0aW9ucy5mb3JtYXQgfHwgXCJncm91cGVkXCI7XG5cbiAgICAgIGlmICh0eXBlb2Ygdi5mb3JtYXR0ZXJzW2Zvcm1hdF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZXJyb3JzID0gdi5mb3JtYXR0ZXJzW2Zvcm1hdF0oZXJyb3JzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcih2LmZvcm1hdChcIlVua25vd24gZm9ybWF0ICV7Zm9ybWF0fVwiLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2LmlzRW1wdHkoZXJyb3JzKSA/IHVuZGVmaW5lZCA6IGVycm9ycztcbiAgICB9LFxuXG4gICAgLy8gUnVucyB0aGUgdmFsaWRhdGlvbnMgd2l0aCBzdXBwb3J0IGZvciBwcm9taXNlcy5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IGlzIHNldHRsZWQgd2hlbiBhbGwgdGhlXG4gICAgLy8gdmFsaWRhdGlvbiBwcm9taXNlcyBoYXZlIGJlZW4gY29tcGxldGVkLlxuICAgIC8vIEl0IGNhbiBiZSBjYWxsZWQgZXZlbiBpZiBubyB2YWxpZGF0aW9ucyByZXR1cm5lZCBhIHByb21pc2UuXG4gICAgYXN5bmM6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYuYXN5bmMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBXcmFwRXJyb3JzID0gb3B0aW9ucy53cmFwRXJyb3JzIHx8IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgICByZXR1cm4gZXJyb3JzO1xuICAgICAgfTtcblxuICAgICAgLy8gUmVtb3ZlcyB1bmtub3duIGF0dHJpYnV0ZXNcbiAgICAgIGlmIChvcHRpb25zLmNsZWFuQXR0cmlidXRlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgYXR0cmlidXRlcyA9IHYuY2xlYW5BdHRyaWJ1dGVzKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlc3VsdHMgPSB2LnJ1blZhbGlkYXRpb25zKGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzLCBvcHRpb25zKTtcblxuICAgICAgcmV0dXJuIG5ldyB2LlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHYud2FpdEZvclJlc3VsdHMocmVzdWx0cykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgZXJyb3JzID0gdi5wcm9jZXNzVmFsaWRhdGlvblJlc3VsdHMocmVzdWx0cywgb3B0aW9ucyk7XG4gICAgICAgICAgaWYgKGVycm9ycykge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBXcmFwRXJyb3JzKGVycm9ycywgb3B0aW9ucywgYXR0cmlidXRlcywgY29uc3RyYWludHMpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZShhdHRyaWJ1dGVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzaW5nbGU6IGZ1bmN0aW9uKHZhbHVlLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB2LnNpbmdsZS5vcHRpb25zLCBvcHRpb25zLCB7XG4gICAgICAgIGZvcm1hdDogXCJmbGF0XCIsXG4gICAgICAgIGZ1bGxNZXNzYWdlczogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHYoe3NpbmdsZTogdmFsdWV9LCB7c2luZ2xlOiBjb25zdHJhaW50c30sIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gYWxsIHByb21pc2VzIGluIHRoZSByZXN1bHRzIGFycmF5XG4gICAgLy8gYXJlIHNldHRsZWQuIFRoZSBwcm9taXNlIHJldHVybmVkIGZyb20gdGhpcyBmdW5jdGlvbiBpcyBhbHdheXMgcmVzb2x2ZWQsXG4gICAgLy8gbmV2ZXIgcmVqZWN0ZWQuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBtb2RpZmllcyB0aGUgaW5wdXQgYXJndW1lbnQsIGl0IHJlcGxhY2VzIHRoZSBwcm9taXNlc1xuICAgIC8vIHdpdGggdGhlIHZhbHVlIHJldHVybmVkIGZyb20gdGhlIHByb21pc2UuXG4gICAgd2FpdEZvclJlc3VsdHM6IGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgIC8vIENyZWF0ZSBhIHNlcXVlbmNlIG9mIGFsbCB0aGUgcmVzdWx0cyBzdGFydGluZyB3aXRoIGEgcmVzb2x2ZWQgcHJvbWlzZS5cbiAgICAgIHJldHVybiByZXN1bHRzLnJlZHVjZShmdW5jdGlvbihtZW1vLCByZXN1bHQpIHtcbiAgICAgICAgLy8gSWYgdGhpcyByZXN1bHQgaXNuJ3QgYSBwcm9taXNlIHNraXAgaXQgaW4gdGhlIHNlcXVlbmNlLlxuICAgICAgICBpZiAoIXYuaXNQcm9taXNlKHJlc3VsdC5lcnJvcikpIHtcbiAgICAgICAgICByZXR1cm4gbWVtbztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtZW1vLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5lcnJvci50aGVuKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICByZXN1bHQuZXJyb3IgPSBlcnJvciB8fCBudWxsO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sIG5ldyB2LlByb21pc2UoZnVuY3Rpb24ocikgeyByKCk7IH0pKTsgLy8gQSByZXNvbHZlZCBwcm9taXNlXG4gICAgfSxcblxuICAgIC8vIElmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIGNhbGw6IGZ1bmN0aW9uIHRoZSBhbmQ6IGZ1bmN0aW9uIHJldHVybiB0aGUgdmFsdWVcbiAgICAvLyBvdGhlcndpc2UganVzdCByZXR1cm4gdGhlIHZhbHVlLiBBZGRpdGlvbmFsIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCBhc1xuICAgIC8vIGFyZ3VtZW50cyB0byB0aGUgZnVuY3Rpb24uXG4gICAgLy8gRXhhbXBsZTpcbiAgICAvLyBgYGBcbiAgICAvLyByZXN1bHQoJ2ZvbycpIC8vICdmb28nXG4gICAgLy8gcmVzdWx0KE1hdGgubWF4LCAxLCAyKSAvLyAyXG4gICAgLy8gYGBgXG4gICAgcmVzdWx0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyBpZiB0aGUgdmFsdWUgaXMgYSBudW1iZXIuIFRoaXMgZnVuY3Rpb24gZG9lcyBub3QgY29uc2lkZXIgTmFOIGFcbiAgICAvLyBudW1iZXIgbGlrZSBtYW55IG90aGVyIGBpc051bWJlcmAgZnVuY3Rpb25zIGRvLlxuICAgIGlzTnVtYmVyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBmYWxzZSBpZiB0aGUgb2JqZWN0IGlzIG5vdCBhIGZ1bmN0aW9uXG4gICAgaXNGdW5jdGlvbjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG4gICAgfSxcblxuICAgIC8vIEEgc2ltcGxlIGNoZWNrIHRvIHZlcmlmeSB0aGF0IHRoZSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLiBVc2VzIGBpc051bWJlcmBcbiAgICAvLyBhbmQgYSBzaW1wbGUgbW9kdWxvIGNoZWNrLlxuICAgIGlzSW50ZWdlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2LmlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSAlIDEgPT09IDA7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyBpZiB0aGUgdmFsdWUgaXMgYSBib29sZWFuXG4gICAgaXNCb29sZWFuOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nO1xuICAgIH0sXG5cbiAgICAvLyBVc2VzIHRoZSBgT2JqZWN0YCBmdW5jdGlvbiB0byBjaGVjayBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYW4gb2JqZWN0LlxuICAgIGlzT2JqZWN0OiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICAgIH0sXG5cbiAgICAvLyBTaW1wbHkgY2hlY2tzIGlmIHRoZSBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgYSBkYXRlXG4gICAgaXNEYXRlOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEYXRlO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGZhbHNlIGlmIHRoZSBvYmplY3QgaXMgYG51bGxgIG9mIGB1bmRlZmluZWRgXG4gICAgaXNEZWZpbmVkOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogIT09IG51bGwgJiYgb2JqICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBwcm9taXNlLiBBbnl0aGluZyB3aXRoIGEgYHRoZW5gXG4gICAgLy8gZnVuY3Rpb24gaXMgY29uc2lkZXJlZCBhIHByb21pc2UuXG4gICAgaXNQcm9taXNlOiBmdW5jdGlvbihwKSB7XG4gICAgICByZXR1cm4gISFwICYmIHYuaXNGdW5jdGlvbihwLnRoZW4pO1xuICAgIH0sXG5cbiAgICBpc0pxdWVyeUVsZW1lbnQ6IGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvICYmIHYuaXNTdHJpbmcoby5qcXVlcnkpO1xuICAgIH0sXG5cbiAgICBpc0RvbUVsZW1lbnQ6IGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmICghbykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICghby5xdWVyeVNlbGVjdG9yQWxsIHx8ICFvLnF1ZXJ5U2VsZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc09iamVjdChkb2N1bWVudCkgJiYgbyA9PT0gZG9jdW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM4NDM4MC82OTkzMDRcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAodHlwZW9mIEhUTUxFbGVtZW50ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbyAmJlxuICAgICAgICAgIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgbyAhPT0gbnVsbCAmJlxuICAgICAgICAgIG8ubm9kZVR5cGUgPT09IDEgJiZcbiAgICAgICAgICB0eXBlb2Ygby5ub2RlTmFtZSA9PT0gXCJzdHJpbmdcIjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNFbXB0eTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhdHRyO1xuXG4gICAgICAvLyBOdWxsIGFuZCB1bmRlZmluZWQgYXJlIGVtcHR5XG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gZnVuY3Rpb25zIGFyZSBub24gZW1wdHlcbiAgICAgIGlmICh2LmlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gV2hpdGVzcGFjZSBvbmx5IHN0cmluZ3MgYXJlIGVtcHR5XG4gICAgICBpZiAodi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHYuRU1QVFlfU1RSSU5HX1JFR0VYUC50ZXN0KHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gRm9yIGFycmF5cyB3ZSB1c2UgdGhlIGxlbmd0aCBwcm9wZXJ0eVxuICAgICAgaWYgKHYuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA9PT0gMDtcbiAgICAgIH1cblxuICAgICAgLy8gRGF0ZXMgaGF2ZSBubyBhdHRyaWJ1dGVzIGJ1dCBhcmVuJ3QgZW1wdHlcbiAgICAgIGlmICh2LmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB3ZSBmaW5kIGF0IGxlYXN0IG9uZSBwcm9wZXJ0eSB3ZSBjb25zaWRlciBpdCBub24gZW1wdHlcbiAgICAgIGlmICh2LmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICBmb3IgKGF0dHIgaW4gdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gRm9ybWF0cyB0aGUgc3BlY2lmaWVkIHN0cmluZ3Mgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVzIGxpa2Ugc286XG4gICAgLy8gYGBgXG4gICAgLy8gZm9ybWF0KFwiRm9vOiAle2Zvb31cIiwge2ZvbzogXCJiYXJcIn0pIC8vIFwiRm9vIGJhclwiXG4gICAgLy8gYGBgXG4gICAgLy8gSWYgeW91IHdhbnQgdG8gd3JpdGUgJXsuLi59IHdpdGhvdXQgaGF2aW5nIGl0IHJlcGxhY2VkIHNpbXBseVxuICAgIC8vIHByZWZpeCBpdCB3aXRoICUgbGlrZSB0aGlzIGBGb286ICUle2Zvb31gIGFuZCBpdCB3aWxsIGJlIHJldHVybmVkXG4gICAgLy8gYXMgYFwiRm9vOiAle2Zvb31cImBcbiAgICBmb3JtYXQ6IHYuZXh0ZW5kKGZ1bmN0aW9uKHN0ciwgdmFscykge1xuICAgICAgaWYgKCF2LmlzU3RyaW5nKHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSh2LmZvcm1hdC5GT1JNQVRfUkVHRVhQLCBmdW5jdGlvbihtMCwgbTEsIG0yKSB7XG4gICAgICAgIGlmIChtMSA9PT0gJyUnKSB7XG4gICAgICAgICAgcmV0dXJuIFwiJXtcIiArIG0yICsgXCJ9XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWxzW20yXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sIHtcbiAgICAgIC8vIEZpbmRzICV7a2V5fSBzdHlsZSBwYXR0ZXJucyBpbiB0aGUgZ2l2ZW4gc3RyaW5nXG4gICAgICBGT1JNQVRfUkVHRVhQOiAvKCU/KSVcXHsoW15cXH1dKylcXH0vZ1xuICAgIH0pLFxuXG4gICAgLy8gXCJQcmV0dGlmaWVzXCIgdGhlIGdpdmVuIHN0cmluZy5cbiAgICAvLyBQcmV0dGlmeWluZyBtZWFucyByZXBsYWNpbmcgWy5cXF8tXSB3aXRoIHNwYWNlcyBhcyB3ZWxsIGFzIHNwbGl0dGluZ1xuICAgIC8vIGNhbWVsIGNhc2Ugd29yZHMuXG4gICAgcHJldHRpZnk6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgaWYgKHYuaXNOdW1iZXIoc3RyKSkge1xuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDIgZGVjaW1hbHMgcm91bmQgaXQgdG8gdHdvXG4gICAgICAgIGlmICgoc3RyICogMTAwKSAlIDEgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIHN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChNYXRoLnJvdW5kKHN0ciAqIDEwMCkgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNBcnJheShzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHIubWFwKGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHYucHJldHRpZnkocyk7IH0pLmpvaW4oXCIsIFwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3Qoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyLnRvU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEVuc3VyZSB0aGUgc3RyaW5nIGlzIGFjdHVhbGx5IGEgc3RyaW5nXG4gICAgICBzdHIgPSBcIlwiICsgc3RyO1xuXG4gICAgICByZXR1cm4gc3RyXG4gICAgICAgIC8vIFNwbGl0cyBrZXlzIHNlcGFyYXRlZCBieSBwZXJpb2RzXG4gICAgICAgIC5yZXBsYWNlKC8oW15cXHNdKVxcLihbXlxcc10pL2csICckMSAkMicpXG4gICAgICAgIC8vIFJlbW92ZXMgYmFja3NsYXNoZXNcbiAgICAgICAgLnJlcGxhY2UoL1xcXFwrL2csICcnKVxuICAgICAgICAvLyBSZXBsYWNlcyAtIGFuZCAtIHdpdGggc3BhY2VcbiAgICAgICAgLnJlcGxhY2UoL1tfLV0vZywgJyAnKVxuICAgICAgICAvLyBTcGxpdHMgY2FtZWwgY2FzZWQgd29yZHNcbiAgICAgICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIGZ1bmN0aW9uKG0wLCBtMSwgbTIpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIG0xICsgXCIgXCIgKyBtMi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9KVxuICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICB9LFxuXG4gICAgc3RyaW5naWZ5VmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICB2YXIgcHJldHRpZnkgPSBvcHRpb25zICYmIG9wdGlvbnMucHJldHRpZnkgfHwgdi5wcmV0dGlmeTtcbiAgICAgIHJldHVybiBwcmV0dGlmeSh2YWx1ZSk7XG4gICAgfSxcblxuICAgIGlzU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG4gICAgfSxcblxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfSxcblxuICAgIC8vIENoZWNrcyBpZiB0aGUgb2JqZWN0IGlzIGEgaGFzaCwgd2hpY2ggaXMgZXF1aXZhbGVudCB0byBhbiBvYmplY3QgdGhhdFxuICAgIC8vIGlzIG5laXRoZXIgYW4gYXJyYXkgbm9yIGEgZnVuY3Rpb24uXG4gICAgaXNIYXNoOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHYuaXNPYmplY3QodmFsdWUpICYmICF2LmlzQXJyYXkodmFsdWUpICYmICF2LmlzRnVuY3Rpb24odmFsdWUpO1xuICAgIH0sXG5cbiAgICBjb250YWluczogZnVuY3Rpb24ob2JqLCB2YWx1ZSkge1xuICAgICAgaWYgKCF2LmlzRGVmaW5lZChvYmopKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob2JqKSkge1xuICAgICAgICByZXR1cm4gb2JqLmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZSBpbiBvYmo7XG4gICAgfSxcblxuICAgIHVuaXF1ZTogZnVuY3Rpb24oYXJyYXkpIHtcbiAgICAgIGlmICghdi5pc0FycmF5KGFycmF5KSkge1xuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKGVsLCBpbmRleCwgYXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YoZWwpID09IGluZGV4O1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGZvckVhY2hLZXlJbktleXBhdGg6IGZ1bmN0aW9uKG9iamVjdCwga2V5cGF0aCwgY2FsbGJhY2spIHtcbiAgICAgIGlmICghdi5pc1N0cmluZyhrZXlwYXRoKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICB2YXIga2V5ID0gXCJcIlxuICAgICAgICAsIGlcbiAgICAgICAgLCBlc2NhcGUgPSBmYWxzZTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGtleXBhdGgubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3dpdGNoIChrZXlwYXRoW2ldKSB7XG4gICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgICAgICAgIGVzY2FwZSA9IGZhbHNlO1xuICAgICAgICAgICAgICBrZXkgKz0gJy4nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb2JqZWN0ID0gY2FsbGJhY2sob2JqZWN0LCBrZXksIGZhbHNlKTtcbiAgICAgICAgICAgICAga2V5ID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnXFxcXCc6XG4gICAgICAgICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgICAgICAgIGVzY2FwZSA9IGZhbHNlO1xuICAgICAgICAgICAgICBrZXkgKz0gJ1xcXFwnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGVzY2FwZSA9IGZhbHNlO1xuICAgICAgICAgICAga2V5ICs9IGtleXBhdGhbaV07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2FsbGJhY2sob2JqZWN0LCBrZXksIHRydWUpO1xuICAgIH0sXG5cbiAgICBnZXREZWVwT2JqZWN0VmFsdWU6IGZ1bmN0aW9uKG9iaiwga2V5cGF0aCkge1xuICAgICAgaWYgKCF2LmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHYuZm9yRWFjaEtleUluS2V5cGF0aChvYmosIGtleXBhdGgsIGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgICAgIGlmICh2LmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyBUaGlzIHJldHVybnMgYW4gb2JqZWN0IHdpdGggYWxsIHRoZSB2YWx1ZXMgb2YgdGhlIGZvcm0uXG4gICAgLy8gSXQgdXNlcyB0aGUgaW5wdXQgbmFtZSBhcyBrZXkgYW5kIHRoZSB2YWx1ZSBhcyB2YWx1ZVxuICAgIC8vIFNvIGZvciBleGFtcGxlIHRoaXM6XG4gICAgLy8gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImVtYWlsXCIgdmFsdWU9XCJmb29AYmFyLmNvbVwiIC8+XG4gICAgLy8gd291bGQgcmV0dXJuOlxuICAgIC8vIHtlbWFpbDogXCJmb29AYmFyLmNvbVwifVxuICAgIGNvbGxlY3RGb3JtVmFsdWVzOiBmdW5jdGlvbihmb3JtLCBvcHRpb25zKSB7XG4gICAgICB2YXIgdmFsdWVzID0ge31cbiAgICAgICAgLCBpXG4gICAgICAgICwgalxuICAgICAgICAsIGlucHV0XG4gICAgICAgICwgaW5wdXRzXG4gICAgICAgICwgb3B0aW9uXG4gICAgICAgICwgdmFsdWU7XG5cbiAgICAgIGlmICh2LmlzSnF1ZXJ5RWxlbWVudChmb3JtKSkge1xuICAgICAgICBmb3JtID0gZm9ybVswXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFmb3JtKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFtuYW1lXSwgdGV4dGFyZWFbbmFtZV1cIik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlucHV0ID0gaW5wdXRzLml0ZW0oaSk7XG5cbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKGlucHV0LmdldEF0dHJpYnV0ZShcImRhdGEtaWdub3JlZFwiKSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hbWUgPSBpbnB1dC5uYW1lLnJlcGxhY2UoL1xcLi9nLCBcIlxcXFxcXFxcLlwiKTtcbiAgICAgICAgdmFsdWUgPSB2LnNhbml0aXplRm9ybVZhbHVlKGlucHV0LnZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlID8gK3ZhbHVlIDogbnVsbDtcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC50eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuYXR0cmlidXRlcy52YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCFpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzW25hbWVdIHx8IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gaW5wdXQuY2hlY2tlZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PT0gXCJyYWRpb1wiKSB7XG4gICAgICAgICAgaWYgKCFpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlc1tuYW1lXSB8fCBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YWx1ZXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwic2VsZWN0W25hbWVdXCIpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpbnB1dCA9IGlucHV0cy5pdGVtKGkpO1xuICAgICAgICBpZiAodi5pc0RlZmluZWQoaW5wdXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZ25vcmVkXCIpKSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlucHV0Lm11bHRpcGxlKSB7XG4gICAgICAgICAgdmFsdWUgPSBbXTtcbiAgICAgICAgICBmb3IgKGogaW4gaW5wdXQub3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9uID0gaW5wdXQub3B0aW9uc1tqXTtcbiAgICAgICAgICAgICBpZiAob3B0aW9uICYmIG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICB2YWx1ZS5wdXNoKHYuc2FuaXRpemVGb3JtVmFsdWUob3B0aW9uLnZhbHVlLCBvcHRpb25zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBfdmFsID0gdHlwZW9mIGlucHV0Lm9wdGlvbnNbaW5wdXQuc2VsZWN0ZWRJbmRleF0gIT09ICd1bmRlZmluZWQnID8gaW5wdXQub3B0aW9uc1tpbnB1dC5zZWxlY3RlZEluZGV4XS52YWx1ZSA6ICcnO1xuICAgICAgICAgIHZhbHVlID0gdi5zYW5pdGl6ZUZvcm1WYWx1ZShfdmFsLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZXNbaW5wdXQubmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9LFxuXG4gICAgc2FuaXRpemVGb3JtVmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy50cmltICYmIHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5udWxsaWZ5ICE9PSBmYWxzZSAmJiB2YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgY2FwaXRhbGl6ZTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAoIXYuaXNTdHJpbmcoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0clswXS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xuICAgIH0sXG5cbiAgICAvLyBSZW1vdmUgYWxsIGVycm9ycyB3aG8ncyBlcnJvciBhdHRyaWJ1dGUgaXMgZW1wdHkgKG51bGwgb3IgdW5kZWZpbmVkKVxuICAgIHBydW5lRW1wdHlFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgcmV0dXJuIGVycm9ycy5maWx0ZXIoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuICF2LmlzRW1wdHkoZXJyb3IuZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIEluXG4gICAgLy8gW3tlcnJvcjogW1wiZXJyMVwiLCBcImVycjJcIl0sIC4uLn1dXG4gICAgLy8gT3V0XG4gICAgLy8gW3tlcnJvcjogXCJlcnIxXCIsIC4uLn0sIHtlcnJvcjogXCJlcnIyXCIsIC4uLn1dXG4gICAgLy9cbiAgICAvLyBBbGwgYXR0cmlidXRlcyBpbiBhbiBlcnJvciB3aXRoIG11bHRpcGxlIG1lc3NhZ2VzIGFyZSBkdXBsaWNhdGVkXG4gICAgLy8gd2hlbiBleHBhbmRpbmcgdGhlIGVycm9ycy5cbiAgICBleHBhbmRNdWx0aXBsZUVycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICB2YXIgcmV0ID0gW107XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAvLyBSZW1vdmVzIGVycm9ycyB3aXRob3V0IGEgbWVzc2FnZVxuICAgICAgICBpZiAodi5pc0FycmF5KGVycm9yLmVycm9yKSkge1xuICAgICAgICAgIGVycm9yLmVycm9yLmZvckVhY2goZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3IsIHtlcnJvcjogbXNnfSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldC5wdXNoKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0cyB0aGUgZXJyb3IgbWVzYWdlcyBieSBwcmVwZW5kaW5nIHRoZSBhdHRyaWJ1dGUgbmFtZSB1bmxlc3MgdGhlXG4gICAgLy8gbWVzc2FnZSBpcyBwcmVmaXhlZCBieSBeXG4gICAgY29udmVydEVycm9yTWVzc2FnZXM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHZhciByZXQgPSBbXVxuICAgICAgICAsIHByZXR0aWZ5ID0gb3B0aW9ucy5wcmV0dGlmeSB8fCB2LnByZXR0aWZ5O1xuICAgICAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24oZXJyb3JJbmZvKSB7XG4gICAgICAgIHZhciBlcnJvciA9IHYucmVzdWx0KGVycm9ySW5mby5lcnJvcixcbiAgICAgICAgICAgIGVycm9ySW5mby52YWx1ZSxcbiAgICAgICAgICAgIGVycm9ySW5mby5hdHRyaWJ1dGUsXG4gICAgICAgICAgICBlcnJvckluZm8ub3B0aW9ucyxcbiAgICAgICAgICAgIGVycm9ySW5mby5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgZXJyb3JJbmZvLmdsb2JhbE9wdGlvbnMpO1xuXG4gICAgICAgIGlmICghdi5pc1N0cmluZyhlcnJvcikpIHtcbiAgICAgICAgICByZXQucHVzaChlcnJvckluZm8pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvclswXSA9PT0gJ14nKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvci5zbGljZSgxKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmZ1bGxNZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBlcnJvciA9IHYuY2FwaXRhbGl6ZShwcmV0dGlmeShlcnJvckluZm8uYXR0cmlidXRlKSkgKyBcIiBcIiArIGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIGVycm9yID0gZXJyb3IucmVwbGFjZSgvXFxcXFxcXi9nLCBcIl5cIik7XG4gICAgICAgIGVycm9yID0gdi5mb3JtYXQoZXJyb3IsIHtcbiAgICAgICAgICB2YWx1ZTogdi5zdHJpbmdpZnlWYWx1ZShlcnJvckluZm8udmFsdWUsIG9wdGlvbnMpXG4gICAgICAgIH0pO1xuICAgICAgICByZXQucHVzaCh2LmV4dGVuZCh7fSwgZXJyb3JJbmZvLCB7ZXJyb3I6IGVycm9yfSkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBJbjpcbiAgICAvLyBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlTmFtZT5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8ge1wiPGF0dHJpYnV0ZU5hbWU+XCI6IFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGVOYW1lPlwiLCAuLi59XX1cbiAgICBncm91cEVycm9yc0J5QXR0cmlidXRlOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHZhciBsaXN0ID0gcmV0W2Vycm9yLmF0dHJpYnV0ZV07XG4gICAgICAgIGlmIChsaXN0KSB7XG4gICAgICAgICAgbGlzdC5wdXNoKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXRbZXJyb3IuYXR0cmlidXRlXSA9IFtlcnJvcl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gSW46XG4gICAgLy8gW3tlcnJvcjogXCI8bWVzc2FnZSAxPlwiLCAuLi59LCB7ZXJyb3I6IFwiPG1lc3NhZ2UgMj5cIiwgLi4ufV1cbiAgICAvLyBPdXQ6XG4gICAgLy8gW1wiPG1lc3NhZ2UgMT5cIiwgXCI8bWVzc2FnZSAyPlwiXVxuICAgIGZsYXR0ZW5FcnJvcnNUb0FycmF5OiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHJldHVybiBlcnJvcnNcbiAgICAgICAgLm1hcChmdW5jdGlvbihlcnJvcikgeyByZXR1cm4gZXJyb3IuZXJyb3I7IH0pXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24odmFsdWUsIGluZGV4LCBzZWxmKSB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuaW5kZXhPZih2YWx1ZSkgPT09IGluZGV4O1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY2xlYW5BdHRyaWJ1dGVzOiBmdW5jdGlvbihhdHRyaWJ1dGVzLCB3aGl0ZWxpc3QpIHtcbiAgICAgIGZ1bmN0aW9uIHdoaXRlbGlzdENyZWF0b3Iob2JqLCBrZXksIGxhc3QpIHtcbiAgICAgICAgaWYgKHYuaXNPYmplY3Qob2JqW2tleV0pKSB7XG4gICAgICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAob2JqW2tleV0gPSBsYXN0ID8gdHJ1ZSA6IHt9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYnVpbGRPYmplY3RXaGl0ZWxpc3Qod2hpdGVsaXN0KSB7XG4gICAgICAgIHZhciBvdyA9IHt9XG4gICAgICAgICAgLCBsYXN0T2JqZWN0XG4gICAgICAgICAgLCBhdHRyO1xuICAgICAgICBmb3IgKGF0dHIgaW4gd2hpdGVsaXN0KSB7XG4gICAgICAgICAgaWYgKCF3aGl0ZWxpc3RbYXR0cl0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2LmZvckVhY2hLZXlJbktleXBhdGgob3csIGF0dHIsIHdoaXRlbGlzdENyZWF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdztcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY2xlYW5SZWN1cnNpdmUoYXR0cmlidXRlcywgd2hpdGVsaXN0KSB7XG4gICAgICAgIGlmICghdi5pc09iamVjdChhdHRyaWJ1dGVzKSkge1xuICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJldCA9IHYuZXh0ZW5kKHt9LCBhdHRyaWJ1dGVzKVxuICAgICAgICAgICwgd1xuICAgICAgICAgICwgYXR0cmlidXRlO1xuXG4gICAgICAgIGZvciAoYXR0cmlidXRlIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICB3ID0gd2hpdGVsaXN0W2F0dHJpYnV0ZV07XG5cbiAgICAgICAgICBpZiAodi5pc09iamVjdCh3KSkge1xuICAgICAgICAgICAgcmV0W2F0dHJpYnV0ZV0gPSBjbGVhblJlY3Vyc2l2ZShyZXRbYXR0cmlidXRlXSwgdyk7XG4gICAgICAgICAgfSBlbHNlIGlmICghdykge1xuICAgICAgICAgICAgZGVsZXRlIHJldFthdHRyaWJ1dGVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfVxuXG4gICAgICBpZiAoIXYuaXNPYmplY3Qod2hpdGVsaXN0KSB8fCAhdi5pc09iamVjdChhdHRyaWJ1dGVzKSkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG5cbiAgICAgIHdoaXRlbGlzdCA9IGJ1aWxkT2JqZWN0V2hpdGVsaXN0KHdoaXRlbGlzdCk7XG4gICAgICByZXR1cm4gY2xlYW5SZWN1cnNpdmUoYXR0cmlidXRlcywgd2hpdGVsaXN0KTtcbiAgICB9LFxuXG4gICAgZXhwb3NlTW9kdWxlOiBmdW5jdGlvbih2YWxpZGF0ZSwgcm9vdCwgZXhwb3J0cywgbW9kdWxlLCBkZWZpbmUpIHtcbiAgICAgIGlmIChleHBvcnRzKSB7XG4gICAgICAgIGlmIChtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB2YWxpZGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLnZhbGlkYXRlID0gdmFsaWRhdGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByb290LnZhbGlkYXRlID0gdmFsaWRhdGU7XG4gICAgICAgIGlmICh2YWxpZGF0ZS5pc0Z1bmN0aW9uKGRlZmluZSkgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsaWRhdGU7IH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHdhcm46IGZ1bmN0aW9uKG1zZykge1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJbdmFsaWRhdGUuanNdIFwiICsgbXNnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZXJyb3I6IGZ1bmN0aW9uKG1zZykge1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlt2YWxpZGF0ZS5qc10gXCIgKyBtc2cpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgdmFsaWRhdGUudmFsaWRhdG9ycyA9IHtcbiAgICAvLyBQcmVzZW5jZSB2YWxpZGF0ZXMgdGhhdCB0aGUgdmFsdWUgaXNuJ3QgZW1wdHlcbiAgICBwcmVzZW5jZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmIChvcHRpb25zLmFsbG93RW1wdHkgIT09IGZhbHNlID8gIXYuaXNEZWZpbmVkKHZhbHVlKSA6IHYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJjYW4ndCBiZSBibGFua1wiO1xuICAgICAgfVxuICAgIH0sXG4gICAgbGVuZ3RoOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucywgYXR0cmlidXRlKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGFsbG93ZWRcbiAgICAgIGlmICghdi5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgaXMgPSBvcHRpb25zLmlzXG4gICAgICAgICwgbWF4aW11bSA9IG9wdGlvbnMubWF4aW11bVxuICAgICAgICAsIG1pbmltdW0gPSBvcHRpb25zLm1pbmltdW1cbiAgICAgICAgLCB0b2tlbml6ZXIgPSBvcHRpb25zLnRva2VuaXplciB8fCBmdW5jdGlvbih2YWwpIHsgcmV0dXJuIHZhbDsgfVxuICAgICAgICAsIGVyclxuICAgICAgICAsIGVycm9ycyA9IFtdO1xuXG4gICAgICB2YWx1ZSA9IHRva2VuaXplcih2YWx1ZSk7XG4gICAgICB2YXIgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgaWYoIXYuaXNOdW1iZXIobGVuZ3RoKSkge1xuICAgICAgICB2LmVycm9yKHYuZm9ybWF0KFwiQXR0cmlidXRlICV7YXR0cn0gaGFzIGEgbm9uIG51bWVyaWMgdmFsdWUgZm9yIGBsZW5ndGhgXCIsIHthdHRyOiBhdHRyaWJ1dGV9KSk7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5ub3RWYWxpZCB8fCBcImhhcyBhbiBpbmNvcnJlY3QgbGVuZ3RoXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIElzIGNoZWNrc1xuICAgICAgaWYgKHYuaXNOdW1iZXIoaXMpICYmIGxlbmd0aCAhPT0gaXMpIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy53cm9uZ0xlbmd0aCB8fFxuICAgICAgICAgIHRoaXMud3JvbmdMZW5ndGggfHxcbiAgICAgICAgICBcImlzIHRoZSB3cm9uZyBsZW5ndGggKHNob3VsZCBiZSAle2NvdW50fSBjaGFyYWN0ZXJzKVwiO1xuICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChlcnIsIHtjb3VudDogaXN9KSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzTnVtYmVyKG1pbmltdW0pICYmIGxlbmd0aCA8IG1pbmltdW0pIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy50b29TaG9ydCB8fFxuICAgICAgICAgIHRoaXMudG9vU2hvcnQgfHxcbiAgICAgICAgICBcImlzIHRvbyBzaG9ydCAobWluaW11bSBpcyAle2NvdW50fSBjaGFyYWN0ZXJzKVwiO1xuICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChlcnIsIHtjb3VudDogbWluaW11bX0pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNOdW1iZXIobWF4aW11bSkgJiYgbGVuZ3RoID4gbWF4aW11bSkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLnRvb0xvbmcgfHxcbiAgICAgICAgICB0aGlzLnRvb0xvbmcgfHxcbiAgICAgICAgICBcImlzIHRvbyBsb25nIChtYXhpbXVtIGlzICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBtYXhpbXVtfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCBlcnJvcnM7XG4gICAgICB9XG4gICAgfSxcbiAgICBudW1lcmljYWxpdHk6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMsIGdsb2JhbE9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBlcnJvcnMgPSBbXVxuICAgICAgICAsIG5hbWVcbiAgICAgICAgLCBjb3VudFxuICAgICAgICAsIGNoZWNrcyA9IHtcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuOiAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID4gYzsgfSxcbiAgICAgICAgICAgIGdyZWF0ZXJUaGFuT3JFcXVhbFRvOiBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID49IGM7IH0sXG4gICAgICAgICAgICBlcXVhbFRvOiAgICAgICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA9PT0gYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuOiAgICAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDwgYzsgfSxcbiAgICAgICAgICAgIGxlc3NUaGFuT3JFcXVhbFRvOiAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2IDw9IGM7IH0sXG4gICAgICAgICAgICBkaXZpc2libGVCeTogICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiAlIGMgPT09IDA7IH1cbiAgICAgICAgICB9XG4gICAgICAgICwgcHJldHRpZnkgPSBvcHRpb25zLnByZXR0aWZ5IHx8XG4gICAgICAgICAgKGdsb2JhbE9wdGlvbnMgJiYgZ2xvYmFsT3B0aW9ucy5wcmV0dGlmeSkgfHxcbiAgICAgICAgICB2LnByZXR0aWZ5O1xuXG4gICAgICAvLyBTdHJpY3Qgd2lsbCBjaGVjayB0aGF0IGl0IGlzIGEgdmFsaWQgbG9va2luZyBudW1iZXJcbiAgICAgIGlmICh2LmlzU3RyaW5nKHZhbHVlKSAmJiBvcHRpb25zLnN0cmljdCkge1xuICAgICAgICB2YXIgcGF0dGVybiA9IFwiXi0/KDB8WzEtOV1cXFxcZCopXCI7XG4gICAgICAgIGlmICghb3B0aW9ucy5vbmx5SW50ZWdlcikge1xuICAgICAgICAgIHBhdHRlcm4gKz0gXCIoXFxcXC5cXFxcZCspP1wiO1xuICAgICAgICB9XG4gICAgICAgIHBhdHRlcm4gKz0gXCIkXCI7XG5cbiAgICAgICAgaWYgKCEobmV3IFJlZ0V4cChwYXR0ZXJuKS50ZXN0KHZhbHVlKSkpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgICAgICBvcHRpb25zLm5vdFZhbGlkIHx8XG4gICAgICAgICAgICB0aGlzLm5vdFZhbGlkIHx8XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgICAgIFwibXVzdCBiZSBhIHZhbGlkIG51bWJlclwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENvZXJjZSB0aGUgdmFsdWUgdG8gYSBudW1iZXIgdW5sZXNzIHdlJ3JlIGJlaW5nIHN0cmljdC5cbiAgICAgIGlmIChvcHRpb25zLm5vU3RyaW5ncyAhPT0gdHJ1ZSAmJiB2LmlzU3RyaW5nKHZhbHVlKSAmJiAhdi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9ICt2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgaXQncyBub3QgYSBudW1iZXIgd2Ugc2hvdWxkbid0IGNvbnRpbnVlIHNpbmNlIGl0IHdpbGwgY29tcGFyZSBpdC5cbiAgICAgIGlmICghdi5pc051bWJlcih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICAgIG9wdGlvbnMubm90VmFsaWQgfHxcbiAgICAgICAgICB0aGlzLm5vdFZhbGlkIHx8XG4gICAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgICAgXCJpcyBub3QgYSBudW1iZXJcIjtcbiAgICAgIH1cblxuICAgICAgLy8gU2FtZSBsb2dpYyBhcyBhYm92ZSwgc29ydCBvZi4gRG9uJ3QgYm90aGVyIHdpdGggY29tcGFyaXNvbnMgaWYgdGhpc1xuICAgICAgLy8gZG9lc24ndCBwYXNzLlxuICAgICAgaWYgKG9wdGlvbnMub25seUludGVnZXIgJiYgIXYuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgICAgb3B0aW9ucy5ub3RJbnRlZ2VyIHx8XG4gICAgICAgICAgdGhpcy5ub3RJbnRlZ2VyIHx8XG4gICAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgICAgXCJtdXN0IGJlIGFuIGludGVnZXJcIjtcbiAgICAgIH1cblxuICAgICAgZm9yIChuYW1lIGluIGNoZWNrcykge1xuICAgICAgICBjb3VudCA9IG9wdGlvbnNbbmFtZV07XG4gICAgICAgIGlmICh2LmlzTnVtYmVyKGNvdW50KSAmJiAhY2hlY2tzW25hbWVdKHZhbHVlLCBjb3VudCkpIHtcbiAgICAgICAgICAvLyBUaGlzIHBpY2tzIHRoZSBkZWZhdWx0IG1lc3NhZ2UgaWYgc3BlY2lmaWVkXG4gICAgICAgICAgLy8gRm9yIGV4YW1wbGUgdGhlIGdyZWF0ZXJUaGFuIGNoZWNrIHVzZXMgdGhlIG1lc3NhZ2UgZnJvbVxuICAgICAgICAgIC8vIHRoaXMubm90R3JlYXRlclRoYW4gc28gd2UgY2FwaXRhbGl6ZSB0aGUgbmFtZSBhbmQgcHJlcGVuZCBcIm5vdFwiXG4gICAgICAgICAgdmFyIGtleSA9IFwibm90XCIgKyB2LmNhcGl0YWxpemUobmFtZSk7XG4gICAgICAgICAgdmFyIG1zZyA9IG9wdGlvbnNba2V5XSB8fFxuICAgICAgICAgICAgdGhpc1trZXldIHx8XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgICAgIFwibXVzdCBiZSAle3R5cGV9ICV7Y291bnR9XCI7XG5cbiAgICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChtc2csIHtcbiAgICAgICAgICAgIGNvdW50OiBjb3VudCxcbiAgICAgICAgICAgIHR5cGU6IHByZXR0aWZ5KG5hbWUpXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm9kZCAmJiB2YWx1ZSAlIDIgIT09IDEpIHtcbiAgICAgICAgZXJyb3JzLnB1c2gob3B0aW9ucy5ub3RPZGQgfHxcbiAgICAgICAgICAgIHRoaXMubm90T2RkIHx8XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgICAgIFwibXVzdCBiZSBvZGRcIik7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5ldmVuICYmIHZhbHVlICUgMiAhPT0gMCkge1xuICAgICAgICBlcnJvcnMucHVzaChvcHRpb25zLm5vdEV2ZW4gfHxcbiAgICAgICAgICAgIHRoaXMubm90RXZlbiB8fFxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgICAgICBcIm11c3QgYmUgZXZlblwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCBlcnJvcnM7XG4gICAgICB9XG4gICAgfSxcbiAgICBkYXRldGltZTogdi5leHRlbmQoZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIGlmICghdi5pc0Z1bmN0aW9uKHRoaXMucGFyc2UpIHx8ICF2LmlzRnVuY3Rpb24odGhpcy5mb3JtYXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJvdGggdGhlIHBhcnNlIGFuZCBmb3JtYXQgZnVuY3Rpb25zIG5lZWRzIHRvIGJlIHNldCB0byB1c2UgdGhlIGRhdGV0aW1lL2RhdGUgdmFsaWRhdG9yXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICghdi5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW11cbiAgICAgICAgLCBlYXJsaWVzdCA9IG9wdGlvbnMuZWFybGllc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMuZWFybGllc3QsIG9wdGlvbnMpIDogTmFOXG4gICAgICAgICwgbGF0ZXN0ID0gb3B0aW9ucy5sYXRlc3QgPyB0aGlzLnBhcnNlKG9wdGlvbnMubGF0ZXN0LCBvcHRpb25zKSA6IE5hTjtcblxuICAgICAgdmFsdWUgPSB0aGlzLnBhcnNlKHZhbHVlLCBvcHRpb25zKTtcblxuICAgICAgLy8gODY0MDAwMDAgaXMgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaW4gYSBkYXksIHRoaXMgaXMgdXNlZCB0byByZW1vdmVcbiAgICAgIC8vIHRoZSB0aW1lIGZyb20gdGhlIGRhdGVcbiAgICAgIGlmIChpc05hTih2YWx1ZSkgfHwgb3B0aW9ucy5kYXRlT25seSAmJiB2YWx1ZSAlIDg2NDAwMDAwICE9PSAwKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMubm90VmFsaWQgfHxcbiAgICAgICAgICBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgICB0aGlzLm5vdFZhbGlkIHx8XG4gICAgICAgICAgXCJtdXN0IGJlIGEgdmFsaWQgZGF0ZVwiO1xuICAgICAgICByZXR1cm4gdi5mb3JtYXQoZXJyLCB7dmFsdWU6IGFyZ3VtZW50c1swXX0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGVhcmxpZXN0KSAmJiB2YWx1ZSA8IGVhcmxpZXN0KSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMudG9vRWFybHkgfHxcbiAgICAgICAgICBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgICB0aGlzLnRvb0Vhcmx5IHx8XG4gICAgICAgICAgXCJtdXN0IGJlIG5vIGVhcmxpZXIgdGhhbiAle2RhdGV9XCI7XG4gICAgICAgIGVyciA9IHYuZm9ybWF0KGVyciwge1xuICAgICAgICAgIHZhbHVlOiB0aGlzLmZvcm1hdCh2YWx1ZSwgb3B0aW9ucyksXG4gICAgICAgICAgZGF0ZTogdGhpcy5mb3JtYXQoZWFybGllc3QsIG9wdGlvbnMpXG4gICAgICAgIH0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGxhdGVzdCkgJiYgdmFsdWUgPiBsYXRlc3QpIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy50b29MYXRlIHx8XG4gICAgICAgICAgb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgICAgdGhpcy50b29MYXRlIHx8XG4gICAgICAgICAgXCJtdXN0IGJlIG5vIGxhdGVyIHRoYW4gJXtkYXRlfVwiO1xuICAgICAgICBlcnIgPSB2LmZvcm1hdChlcnIsIHtcbiAgICAgICAgICBkYXRlOiB0aGlzLmZvcm1hdChsYXRlc3QsIG9wdGlvbnMpLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLmZvcm1hdCh2YWx1ZSwgb3B0aW9ucylcbiAgICAgICAgfSk7XG4gICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB2LnVuaXF1ZShlcnJvcnMpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHBhcnNlOiBudWxsLFxuICAgICAgZm9ybWF0OiBudWxsXG4gICAgfSksXG4gICAgZGF0ZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgb3B0aW9ucywge2RhdGVPbmx5OiB0cnVlfSk7XG4gICAgICByZXR1cm4gdi52YWxpZGF0b3JzLmRhdGV0aW1lLmNhbGwodi52YWxpZGF0b3JzLmRhdGV0aW1lLCB2YWx1ZSwgb3B0aW9ucyk7XG4gICAgfSxcbiAgICBmb3JtYXQ6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAodi5pc1N0cmluZyhvcHRpb25zKSB8fCAob3B0aW9ucyBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICAgICAgb3B0aW9ucyA9IHtwYXR0ZXJuOiBvcHRpb25zfTtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJpcyBpbnZhbGlkXCJcbiAgICAgICAgLCBwYXR0ZXJuID0gb3B0aW9ucy5wYXR0ZXJuXG4gICAgICAgICwgbWF0Y2g7XG5cbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgYWxsb3dlZFxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNTdHJpbmcocGF0dGVybikpIHtcbiAgICAgICAgcGF0dGVybiA9IG5ldyBSZWdFeHAob3B0aW9ucy5wYXR0ZXJuLCBvcHRpb25zLmZsYWdzKTtcbiAgICAgIH1cbiAgICAgIG1hdGNoID0gcGF0dGVybi5leGVjKHZhbHVlKTtcbiAgICAgIGlmICghbWF0Y2ggfHwgbWF0Y2hbMF0ubGVuZ3RoICE9IHZhbHVlLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGluY2x1c2lvbjogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge3dpdGhpbjogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAodi5jb250YWlucyhvcHRpb25zLndpdGhpbiwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICBcIl4le3ZhbHVlfSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGxpc3RcIjtcbiAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7dmFsdWU6IHZhbHVlfSk7XG4gICAgfSxcbiAgICBleGNsdXNpb246IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICghdi5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt3aXRoaW46IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKCF2LmNvbnRhaW5zKG9wdGlvbnMud2l0aGluLCB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiXiV7dmFsdWV9IGlzIHJlc3RyaWN0ZWRcIjtcbiAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7dmFsdWU6IHZhbHVlfSk7XG4gICAgfSxcbiAgICBlbWFpbDogdi5leHRlbmQoZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImlzIG5vdCBhIHZhbGlkIGVtYWlsXCI7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICghdi5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuUEFUVEVSTi5leGVjKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBQQVRURVJOOiAvXlthLXowLTlcXHUwMDdGLVxcdWZmZmYhIyQlJicqK1xcLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTlcXHUwMDdGLVxcdWZmZmYhIyQlJicqK1xcLz0/Xl9ge3x9fi1dKykqQCg/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXpdezIsfSQvaVxuICAgIH0pLFxuICAgIGVxdWFsaXR5OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucywgYXR0cmlidXRlLCBhdHRyaWJ1dGVzLCBnbG9iYWxPcHRpb25zKSB7XG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7YXR0cmlidXRlOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICBcImlzIG5vdCBlcXVhbCB0byAle2F0dHJpYnV0ZX1cIjtcblxuICAgICAgaWYgKHYuaXNFbXB0eShvcHRpb25zLmF0dHJpYnV0ZSkgfHwgIXYuaXNTdHJpbmcob3B0aW9ucy5hdHRyaWJ1dGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBhdHRyaWJ1dGUgbXVzdCBiZSBhIG5vbiBlbXB0eSBzdHJpbmdcIik7XG4gICAgICB9XG5cbiAgICAgIHZhciBvdGhlclZhbHVlID0gdi5nZXREZWVwT2JqZWN0VmFsdWUoYXR0cmlidXRlcywgb3B0aW9ucy5hdHRyaWJ1dGUpXG4gICAgICAgICwgY29tcGFyYXRvciA9IG9wdGlvbnMuY29tcGFyYXRvciB8fCBmdW5jdGlvbih2MSwgdjIpIHtcbiAgICAgICAgICByZXR1cm4gdjEgPT09IHYyO1xuICAgICAgICB9XG4gICAgICAgICwgcHJldHRpZnkgPSBvcHRpb25zLnByZXR0aWZ5IHx8XG4gICAgICAgICAgKGdsb2JhbE9wdGlvbnMgJiYgZ2xvYmFsT3B0aW9ucy5wcmV0dGlmeSkgfHxcbiAgICAgICAgICB2LnByZXR0aWZ5O1xuXG4gICAgICBpZiAoIWNvbXBhcmF0b3IodmFsdWUsIG90aGVyVmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSwgYXR0cmlidXRlcykpIHtcbiAgICAgICAgcmV0dXJuIHYuZm9ybWF0KG1lc3NhZ2UsIHthdHRyaWJ1dGU6IHByZXR0aWZ5KG9wdGlvbnMuYXR0cmlidXRlKX0pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBBIFVSTCB2YWxpZGF0b3IgdGhhdCBpcyB1c2VkIHRvIHZhbGlkYXRlIFVSTHMgd2l0aCB0aGUgYWJpbGl0eSB0b1xuICAgIC8vIHJlc3RyaWN0IHNjaGVtZXMgYW5kIHNvbWUgZG9tYWlucy5cbiAgICB1cmw6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiaXMgbm90IGEgdmFsaWQgdXJsXCJcbiAgICAgICAgLCBzY2hlbWVzID0gb3B0aW9ucy5zY2hlbWVzIHx8IHRoaXMuc2NoZW1lcyB8fCBbJ2h0dHAnLCAnaHR0cHMnXVxuICAgICAgICAsIGFsbG93TG9jYWwgPSBvcHRpb25zLmFsbG93TG9jYWwgfHwgdGhpcy5hbGxvd0xvY2FsIHx8IGZhbHNlO1xuXG4gICAgICBpZiAoIXYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuXG4gICAgICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9kcGVyaW5pLzcyOTI5NFxuICAgICAgdmFyIHJlZ2V4ID1cbiAgICAgICAgXCJeXCIgK1xuICAgICAgICAvLyBwcm90b2NvbCBpZGVudGlmaWVyXG4gICAgICAgIFwiKD86KD86XCIgKyBzY2hlbWVzLmpvaW4oXCJ8XCIpICsgXCIpOi8vKVwiICtcbiAgICAgICAgLy8gdXNlcjpwYXNzIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgIFwiKD86XFxcXFMrKD86OlxcXFxTKik/QCk/XCIgK1xuICAgICAgICBcIig/OlwiO1xuXG4gICAgICB2YXIgdGxkID0gXCIoPzpcXFxcLig/OlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmXXsyLH0pKVwiO1xuXG4gICAgICBpZiAoYWxsb3dMb2NhbCkge1xuICAgICAgICB0bGQgKz0gXCI/XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWdleCArPVxuICAgICAgICAgIC8vIElQIGFkZHJlc3MgZXhjbHVzaW9uXG4gICAgICAgICAgLy8gcHJpdmF0ZSAmIGxvY2FsIG5ldHdvcmtzXG4gICAgICAgICAgXCIoPyEoPzoxMHwxMjcpKD86XFxcXC5cXFxcZHsxLDN9KXszfSlcIiArXG4gICAgICAgICAgXCIoPyEoPzoxNjlcXFxcLjI1NHwxOTJcXFxcLjE2OCkoPzpcXFxcLlxcXFxkezEsM30pezJ9KVwiICtcbiAgICAgICAgICBcIig/ITE3MlxcXFwuKD86MVs2LTldfDJcXFxcZHwzWzAtMV0pKD86XFxcXC5cXFxcZHsxLDN9KXsyfSlcIjtcbiAgICAgIH1cblxuICAgICAgcmVnZXggKz1cbiAgICAgICAgICAvLyBJUCBhZGRyZXNzIGRvdHRlZCBub3RhdGlvbiBvY3RldHNcbiAgICAgICAgICAvLyBleGNsdWRlcyBsb29wYmFjayBuZXR3b3JrIDAuMC4wLjBcbiAgICAgICAgICAvLyBleGNsdWRlcyByZXNlcnZlZCBzcGFjZSA+PSAyMjQuMC4wLjBcbiAgICAgICAgICAvLyBleGNsdWRlcyBuZXR3b3JrICYgYnJvYWNhc3QgYWRkcmVzc2VzXG4gICAgICAgICAgLy8gKGZpcnN0ICYgbGFzdCBJUCBhZGRyZXNzIG9mIGVhY2ggY2xhc3MpXG4gICAgICAgICAgXCIoPzpbMS05XVxcXFxkP3wxXFxcXGRcXFxcZHwyWzAxXVxcXFxkfDIyWzAtM10pXCIgK1xuICAgICAgICAgIFwiKD86XFxcXC4oPzoxP1xcXFxkezEsMn18MlswLTRdXFxcXGR8MjVbMC01XSkpezJ9XCIgK1xuICAgICAgICAgIFwiKD86XFxcXC4oPzpbMS05XVxcXFxkP3wxXFxcXGRcXFxcZHwyWzAtNF1cXFxcZHwyNVswLTRdKSlcIiArXG4gICAgICAgIFwifFwiICtcbiAgICAgICAgICAvLyBob3N0IG5hbWVcbiAgICAgICAgICBcIig/Oig/OlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XS0qKSpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0rKVwiICtcbiAgICAgICAgICAvLyBkb21haW4gbmFtZVxuICAgICAgICAgIFwiKD86XFxcXC4oPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0tKikqW2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKykqXCIgK1xuICAgICAgICAgIHRsZCArXG4gICAgICAgIFwiKVwiICtcbiAgICAgICAgLy8gcG9ydCBudW1iZXJcbiAgICAgICAgXCIoPzo6XFxcXGR7Miw1fSk/XCIgK1xuICAgICAgICAvLyByZXNvdXJjZSBwYXRoXG4gICAgICAgIFwiKD86Wy8/I11cXFxcUyopP1wiICtcbiAgICAgIFwiJFwiO1xuXG4gICAgICB2YXIgUEFUVEVSTiA9IG5ldyBSZWdFeHAocmVnZXgsICdpJyk7XG4gICAgICBpZiAoIVBBVFRFUk4uZXhlYyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHZhbGlkYXRlLmZvcm1hdHRlcnMgPSB7XG4gICAgZGV0YWlsZWQ6IGZ1bmN0aW9uKGVycm9ycykge3JldHVybiBlcnJvcnM7fSxcbiAgICBmbGF0OiB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5LFxuICAgIGdyb3VwZWQ6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgdmFyIGF0dHI7XG5cbiAgICAgIGVycm9ycyA9IHYuZ3JvdXBFcnJvcnNCeUF0dHJpYnV0ZShlcnJvcnMpO1xuICAgICAgZm9yIChhdHRyIGluIGVycm9ycykge1xuICAgICAgICBlcnJvcnNbYXR0cl0gPSB2LmZsYXR0ZW5FcnJvcnNUb0FycmF5KGVycm9yc1thdHRyXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXJyb3JzO1xuICAgIH0sXG4gICAgY29uc3RyYWludDogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICB2YXIgYXR0cjtcbiAgICAgIGVycm9ycyA9IHYuZ3JvdXBFcnJvcnNCeUF0dHJpYnV0ZShlcnJvcnMpO1xuICAgICAgZm9yIChhdHRyIGluIGVycm9ycykge1xuICAgICAgICBlcnJvcnNbYXR0cl0gPSBlcnJvcnNbYXR0cl0ubWFwKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQudmFsaWRhdG9yO1xuICAgICAgICB9KS5zb3J0KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXJyb3JzO1xuICAgIH1cbiAgfTtcblxuICB2YWxpZGF0ZS5leHBvc2VNb2R1bGUodmFsaWRhdGUsIHRoaXMsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKTtcbn0pLmNhbGwodGhpcyxcbiAgICAgICAgdHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gZXhwb3J0cyA6IG51bGwsXG4gICAgICAgIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbW9kdWxlIDogbnVsbCxcbiAgICAgICAgdHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBkZWZpbmUgOiBudWxsKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3ZhbGlkYXRlLmpzL3ZhbGlkYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdGlmKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XG5cdFx0bW9kdWxlLnBhdGhzID0gW107XG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cdFx0aWYoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XG5cdH1cblx0cmV0dXJuIG1vZHVsZTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgfVxuICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCksXG4gICAgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKiBEZXRlY3QgaWYgcHJvcGVydGllcyBzaGFkb3dpbmcgdGhvc2Ugb24gYE9iamVjdC5wcm90b3R5cGVgIGFyZSBub24tZW51bWVyYWJsZS4gKi9cbnZhciBub25FbnVtU2hhZG93cyA9ICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHsgJ3ZhbHVlT2YnOiAxIH0sICd2YWx1ZU9mJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICAvLyBTYWZhcmkgOC4xIG1ha2VzIGBhcmd1bWVudHMuY2FsbGVlYCBlbnVtZXJhYmxlIGluIHN0cmljdCBtb2RlLlxuICAvLyBTYWZhcmkgOSBtYWtlcyBgYXJndW1lbnRzLmxlbmd0aGAgZW51bWVyYWJsZSBpbiBzdHJpY3QgbW9kZS5cbiAgdmFyIHJlc3VsdCA9IChpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkpXG4gICAgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpXG4gICAgOiBbXTtcblxuICB2YXIgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aCxcbiAgICAgIHNraXBJbmRleGVzID0gISFsZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoa2V5ID09ICdsZW5ndGgnIHx8IGlzSW5kZXgoa2V5LCBsZW5ndGgpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgaW5kZXggPSAtMTtcbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSBhcnJheTtcbiAgICByZXR1cm4gYXBwbHkoZnVuYywgdGhpcywgb3RoZXJBcmdzKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb3BpZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weU9iamVjdChzb3VyY2UsIHByb3BzLCBvYmplY3QsIGN1c3RvbWl6ZXIpIHtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXG4gICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSlcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlID09PSB1bmRlZmluZWQgPyBzb3VyY2Vba2V5XSA6IG5ld1ZhbHVlKTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiBsaWtlIGBfLmFzc2lnbmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbmVyIFRoZSBmdW5jdGlvbiB0byBhc3NpZ24gdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYXNzaWduZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGFzc2lnbmVyKSB7XG4gIHJldHVybiBiYXNlUmVzdChmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gc291cmNlcy5sZW5ndGgsXG4gICAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPiAxID8gc291cmNlc1tsZW5ndGggLSAxXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZ3VhcmQgPSBsZW5ndGggPiAyID8gc291cmNlc1syXSA6IHVuZGVmaW5lZDtcblxuICAgIGN1c3RvbWl6ZXIgPSAoYXNzaWduZXIubGVuZ3RoID4gMyAmJiB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nKVxuICAgICAgPyAobGVuZ3RoLS0sIGN1c3RvbWl6ZXIpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChndWFyZCAmJiBpc0l0ZXJhdGVlQ2FsbChzb3VyY2VzWzBdLCBzb3VyY2VzWzFdLCBndWFyZCkpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPCAzID8gdW5kZWZpbmVkIDogY3VzdG9taXplcjtcbiAgICAgIGxlbmd0aCA9IDE7XG4gICAgfVxuICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgc291cmNlID0gc291cmNlc1tpbmRleF07XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGFzc2lnbmVyKG9iamVjdCwgc291cmNlLCBpbmRleCwgY3VzdG9taXplcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH0pO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KVxuICAgICAgKSB7XG4gICAgcmV0dXJuIGVxKG9iamVjdFtpbmRleF0sIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIC8vIFNhZmFyaSA4LjEgbWFrZXMgYGFyZ3VtZW50cy5jYWxsZWVgIGVudW1lcmFibGUgaW4gc3RyaWN0IG1vZGUuXG4gIHJldHVybiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgKCFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgfHwgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJnc1RhZyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmlzQXJyYXlMaWtlYCBleGNlcHQgdGhhdCBpdCBhbHNvIGNoZWNrcyBpZiBgdmFsdWVgXG4gKiBpcyBhbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXktbGlrZSBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNBcnJheUxpa2UodmFsdWUpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDgtOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gaXNPYmplY3QodmFsdWUpID8gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQXNzaWducyBvd24gZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0cyB0byB0aGVcbiAqIGRlc3RpbmF0aW9uIG9iamVjdC4gU291cmNlIG9iamVjdHMgYXJlIGFwcGxpZWQgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxuICogU3Vic2VxdWVudCBzb3VyY2VzIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgIGFuZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYE9iamVjdC5hc3NpZ25gXShodHRwczovL21kbi5pby9PYmplY3QvYXNzaWduKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMTAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQHNlZSBfLmFzc2lnbkluXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBCYXIoKSB7XG4gKiAgIHRoaXMuYyA9IDM7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5iID0gMjtcbiAqIEJhci5wcm90b3R5cGUuZCA9IDQ7XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDAgfSwgbmV3IEZvbywgbmV3IEJhcik7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2MnOiAzIH1cbiAqL1xudmFyIGFzc2lnbiA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlKSB7XG4gIGlmIChub25FbnVtU2hhZG93cyB8fCBpc1Byb3RvdHlwZShzb3VyY2UpIHx8IGlzQXJyYXlMaWtlKHNvdXJjZSkpIHtcbiAgICBjb3B5T2JqZWN0KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xuICAgIHJldHVybjtcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgc291cmNlW2tleV0pO1xuICAgIH1cbiAgfVxufSk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==