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
    inputValidClass: 'input--valid',
    inputInvalidClass: 'input--invalid',
    revalidateOnChange: false,
    revalidateOnInput: false,
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
var ATTRS_TO_INVALIDATE_CONSTRAINTS = ['type', 'required', 'min', 'max', 'step', 'pattern', 'minlength', 'formnovalidate'];
var FormValidator = /** @class */ (function () {
    function FormValidator(_root, options) {
        var _this = this;
        this._root = _root;
        this._constraints = null;
        this._elems = null;
        this._liveValidation = false;
        this._autoInvalidateConstraints = false;
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
        // react on changes in DOM that can trigger changes in constraints
        if (window.MutationObserver) {
            var observer = new MutationObserver(function (mutations) {
                for (var q = 0; q < mutations.length; ++q) {
                    var mut = mutations[q];
                    if (mut.type !== 'attributes') {
                        _this._constraints = null;
                        return;
                    }
                    var attr = mut.attributeName;
                    if (!attr) {
                        continue;
                    }
                    attr = attr.toLowerCase();
                    if (attr.indexOf('data-') === 0) {
                        _this._constraints = null;
                        return;
                    }
                    else if (ATTRS_TO_INVALIDATE_CONSTRAINTS.indexOf(attr) >= 0) {
                        _this._constraints = null;
                        return;
                    }
                }
            });
            observer.observe(this._root, {
                childList: true,
                attributes: true,
                subtree: true
            });
        }
        else {
            // no MutationObserver support
            this._autoInvalidateConstraints = true;
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
        this._ensureConstraintsAreBuilt();
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
            this._ensureConstraintsAreBuilt();
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
    FormValidator.prototype._ensureConstraintsAreBuilt = function () {
        if (!this._constraints || this._autoInvalidateConstraints) {
            this._rebuildElems();
            this._buildConstraints();
        }
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
        if (this.options.inputInvalidClass) {
            elem.elem.classList.add(this.options.inputInvalidClass);
        }
        if (this.options.inputValidClass) {
            elem.elem.classList.remove(this.options.inputValidClass);
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
        if (this.options.inputInvalidClass) {
            elem.elem.classList.remove(this.options.inputInvalidClass);
        }
        if (this.options.inputValidClass) {
            elem.elem.classList.add(this.options.inputValidClass);
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
    FormValidator.prototype._updateInputData = function (data, elem) {
        var ib = closest(elem, '.' + this._options.inputBlock);
        if (!ib) {
            data.elem = elem;
            data.ib = null;
            data.errorElement = null;
            return;
        }
        var errContainerClass = makeElem('' + this._options.inputBlock, '' + this._options.inputBlockErrorElem);
        var errorElement = ib.querySelector('.' + errContainerClass);
        if (!errorElement) {
            errorElement = document.createElement('div');
            ib.appendChild(errorElement);
        }
        data.elem = elem;
        data.ib = ib;
        data.errorElement = errorElement;
    };
    FormValidator.prototype._buildInputData = function (elem) {
        var result = { valid: null };
        this._updateInputData(result, elem);
        return result;
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
    FormValidator.prototype._rebuildElems = function () {
        if (!this._elems) {
            this._elems = {};
        }
        var elems = this.root.querySelectorAll('[name]');
        var notUpdated = Object.keys(this._elems);
        for (var q = 0; q < elems.length; ++q) {
            var elem = elems[q], elemName = elem.getAttribute('name') || '';
            if (!elemName) {
                console.warn("No name for element", elem);
                continue;
            }
            if (this._elems[elemName]) {
                this._updateInputData(this._elems[elemName], elem);
                notUpdated.splice(notUpdated.indexOf(elemName), 1);
            }
            else {
                this._elems[elemName] = this._buildInputData(elem);
            }
        }
        // remove entries that no more exist
        for (var q = 0; q < notUpdated.length; ++q) {
            delete this._elems[notUpdated[q]];
        }
    };
    FormValidator.prototype._buildConstraints = function () {
        this._rebuildElems();
        if (!this._elems) {
            return;
        }
        var builderKeys = Object.keys(FormValidator._constraintBuilders);
        var builderAttrs = builderKeys.map(function (x) { return 'data-validate-' + x; });
        this._constraints = {};
        var elemNames = Object.keys(this._elems);
        for (var q = 0; q < elemNames.length; ++q) {
            var elemName = elemNames[q], elemData = this._elems[elemName], elem = elemData.elem;
            if (elem.hasAttribute('data-ignored') || elem.hasAttribute('formnovalidate')) {
                continue;
            }
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
                this._constraints[elemName] = constraint;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODcyNGYwMTM1MzE3MTU5NjhjNTYiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3ZhbGlkYXRlLmpzL3ZhbGlkYXRlLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNGQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QixTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQywyQkFBMkI7QUFDOUQ7QUFDQSx1QkFBdUIsa0JBQWtCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsTUFBTTtBQUNyQixpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxnQkFBZ0I7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLFVBQVU7QUFDckIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFNBQVM7QUFDdEIsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDg3MjRmMDEzNTMxNzE1OTY4YzU2IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0dGhyb3cgbmV3IEVycm9yKFwiZGVmaW5lIGNhbm5vdCBiZSB1c2VkIGluZGlyZWN0XCIpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHZhbGlkYXRlID0gcmVxdWlyZShcInZhbGlkYXRlLmpzXCIpO1xyXG52YXIgbG9kYXNoX2Fzc2lnbiA9IHJlcXVpcmUoXCJsb2Rhc2guYXNzaWduXCIpO1xyXG52YXIgUnVzc2lhbkZvcm1NZXNzYWdlcyA9IHtcclxuICAgIHJlcXVpcmVkOiAn0JLQstC10LTQuNGC0LUg0LfQvdCw0YfQtdC90LjQtScsXHJcbiAgICBtaW5sZW5ndGg6ICfQktCy0LXQtNC40YLQtSDQt9C90LDRh9C10L3QuNC1INC90LUg0LrQvtGA0L7Rh9C1ICRtaW5sZW5ndGgg0YHQuNC80LLQvtC70L7QsicsXHJcbiAgICBwYXR0ZXJuOiAn0JLQstC10LTQuNGC0LUg0LfQvdCw0YfQtdC90LjQtSDQsiDQvdGD0LbQvdC+0Lwg0YTQvtGA0LzQsNGC0LUnLFxyXG4gICAgZW1haWw6ICfQktCy0LXQtNC40YLQtSDQutC+0YDRgNC10LrRgtC90YvQuSBlLW1haWwnLFxyXG4gICAgbnVtYmVyOiAn0JLQstC10LTQuNGC0LUg0YfQuNGB0LvQvicsXHJcbiAgICBudW1iZXJNaW5NYXg6ICfQktCy0LXQtNC40YLQtSDRh9C40YHQu9C+INCyINC00LjQsNC/0LDQt9C+0L3QtSDQvtGCICRtaW4g0LTQviAkbWF4JyxcclxuICAgIG51bWJlck1pbjogJ9CS0LLQtdC00LjRgtC1INGH0LjRgdC70L4g0L3QtSDQvNC10L3RjNGI0LUgJG1pbicsXHJcbiAgICBudW1iZXJNYXg6ICfQktCy0LXQtNC40YLQtSDRh9C40YHQu9C+INC90LUg0LHQvtC70YzRiNC1ICRtYXgnLFxyXG4gICAgc3RlcDogJ9Cn0LjRgdC70L4g0LTQvtC70LbQvdC+INCx0YvRgtGMINGBINGI0LDQs9C+0Lwg0LIgJHN0ZXAnXHJcbn07XHJcbnZhciBPUFRJT05fREVGQVVMVFMgPSB7XHJcbiAgICByb290QmxvY2s6ICdmb3JtJyxcclxuICAgIHJvb3RWYWxpZE1vZDogJ3ZhbGlkJyxcclxuICAgIHJvb3RJbnZhbGlkTW9kOiAnaW52YWxpZCcsXHJcbiAgICBpbnB1dEJsb2NrOiAnaWInLFxyXG4gICAgaW5wdXRCbG9ja1ZhbGlkTW9kOiAndmFsaWQnLFxyXG4gICAgaW5wdXRCbG9ja0ludmFsaWRNb2Q6ICdpbnZhbGlkJyxcclxuICAgIGlucHV0QmxvY2tFcnJvckVsZW06ICdlcnJvcicsXHJcbiAgICBpbnB1dFZhbGlkQ2xhc3M6ICdpbnB1dC0tdmFsaWQnLFxyXG4gICAgaW5wdXRJbnZhbGlkQ2xhc3M6ICdpbnB1dC0taW52YWxpZCcsXHJcbiAgICByZXZhbGlkYXRlT25DaGFuZ2U6IGZhbHNlLFxyXG4gICAgcmV2YWxpZGF0ZU9uSW5wdXQ6IGZhbHNlLFxyXG59O1xyXG52YXIgX2N1c3RvbVZhbGlkYXRvcnNDcmVhdGVkID0gZmFsc2U7XHJcbmZ1bmN0aW9uIGNyZWF0ZUN1c3RvbVZhbGlkYXRvcnMoKSB7XHJcbiAgICBpZiAoX2N1c3RvbVZhbGlkYXRvcnNDcmVhdGVkKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgX2N1c3RvbVZhbGlkYXRvcnNDcmVhdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHZhbGlkYXRlLnZhbGlkYXRvcnMuc3RlcCA9IGZ1bmN0aW9uICh2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG51bVZhbHVlID0gK3ZhbHVlO1xyXG4gICAgICAgIHZhciBpc09wdGlvbnNOdW1iZXIgPSB0eXBlb2Ygb3B0aW9ucyA9PT0gJ251bWJlcic7XHJcbiAgICAgICAgdmFyIHN0ZXAgPSBpc09wdGlvbnNOdW1iZXIgPyBvcHRpb25zIDogKCtvcHRpb25zLnN0ZXAgfHwgMCk7XHJcbiAgICAgICAgaWYgKHN0ZXAgPD0gMCB8fCBpc05hTihzdGVwKSkge1xyXG4gICAgICAgICAgICBzdGVwID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG1pblZhbHVlID0gaXNPcHRpb25zTnVtYmVyID8gMCA6ICgrb3B0aW9ucy5taW4gfHwgMCk7XHJcbiAgICAgICAgaWYgKGlzTmFOKG1pblZhbHVlKSkge1xyXG4gICAgICAgICAgICBtaW5WYWx1ZSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkZWZNc2cgPSBcInZhbHVlIGhhcyBpbnZhbGlkIHN0ZXAgKHNob3VsZCBoYXZlIHN0ZXAgXCIgKyBzdGVwICsgXCIpXCI7XHJcbiAgICAgICAgdmFyIG1zZyA9IGlzT3B0aW9uc051bWJlciA/IGRlZk1zZyA6IChvcHRpb25zLm1lc3NhZ2UgfHwgZGVmTXNnKTtcclxuICAgICAgICBpZiAoKG51bVZhbHVlIC0gbWluVmFsdWUpICUgc3RlcCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbXNnO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBGb3JtVmFsaWRhdG9yLmFkZENvbnN0cmFpbnRCdWlsZGVyKCdlcXVhbGl0eScsIGZ1bmN0aW9uIChjb25zdHJhaW50LCBpbnB1dCwgb3B0aW9uLCBtZXNzYWdlLCB2YWxpZGF0b3IpIHtcclxuICAgICAgICBpZiAobWVzc2FnZSkge1xyXG4gICAgICAgICAgICBjb25zdHJhaW50LmVxdWFsaXR5ID0ge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlOiBvcHRpb24sXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB2YWxpZGF0b3IuZm9ybWF0TXNnKG1lc3NhZ2UsIHtcclxuICAgICAgICAgICAgICAgICAgICBvdGhlcjogb3B0aW9uXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3RyYWludC5lcXVhbGl0eSA9IG9wdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIEZvcm1WYWxpZGF0b3IuYWRkQ29uc3RyYWludEJ1aWxkZXIoJ2V4Y2x1ZGUnLCBmdW5jdGlvbiAoY29uc3RyYWludCwgaW5wdXQsIG9wdGlvbiwgbWVzc2FnZSwgdmFsaWRhdG9yKSB7XHJcbiAgICAgICAgdmFyIGRhdGE7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2Uob3B0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBkYXRhID0gW29wdGlvbl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0cmFpbnQuZXhjbHVzaW9uID0ge1xyXG4gICAgICAgICAgICB3aXRoaW46IGRhdGFcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0cmFpbnQuZXhjbHVzaW9uLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgRm9ybVZhbGlkYXRvci5hZGRDb25zdHJhaW50QnVpbGRlcignaW5jbHVkZScsIGZ1bmN0aW9uIChjb25zdHJhaW50LCBpbnB1dCwgb3B0aW9uLCBtZXNzYWdlLCB2YWxpZGF0b3IpIHtcclxuICAgICAgICB2YXIgZGF0YTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShvcHRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBbb3B0aW9uXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3RyYWludC5pbmNsdXNpb24gPSB7XHJcbiAgICAgICAgICAgIHdpdGhpbjogZGF0YVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgY29uc3RyYWludC5pbmNsdXNpb24ubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBmdW5jdGlvbiBzZXRDb25zdHJhaW50UHJvcChjb25zdHJhaW50LCBwcm9wLCBvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKGNvbnN0cmFpbnRbcHJvcF0pIHtcclxuICAgICAgICAgICAgYXNzaWduKGNvbnN0cmFpbnRbcHJvcF0sIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3RyYWludFtwcm9wXSA9IG9wdGlvbnM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgRm9ybVZhbGlkYXRvci5hZGRDb25zdHJhaW50QnVpbGRlcignaW50ZWdlcicsIGZ1bmN0aW9uIChjb25zdHJhaW50LCBpbnB1dCwgb3B0aW9uLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgc2V0Q29uc3RyYWludFByb3AoY29uc3RyYWludCwgJ251bWVyaWNhbGl0eScsIHtcclxuICAgICAgICAgICAgb25seUludGVnZXI6IG1lc3NhZ2UgPyB7IG1lc3NhZ2U6IG1lc3NhZ2UgfSA6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgRm9ybVZhbGlkYXRvci5hZGRDb25zdHJhaW50QnVpbGRlcignZGl2aXNpYmxlJywgZnVuY3Rpb24gKGNvbnN0cmFpbnQsIGlucHV0LCBvcHRpb24sIG1lc3NhZ2UpIHtcclxuICAgICAgICB2YXIgZGl2aXNvciA9ICtvcHRpb247XHJcbiAgICAgICAgaWYgKGlzTmFOKGRpdmlzb3IpIHx8IGRpdmlzb3IgPT09IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignaW52YWxpZCB2YWxpZGF0aW9uIGF0dHJpYnV0ZSBkaXZpc2JsZScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldENvbnN0cmFpbnRQcm9wKGNvbnN0cmFpbnQsICdudW1lcmljYWxpdHknLCB7XHJcbiAgICAgICAgICAgIGRpdmlzaWJsZUJ5OiBtZXNzYWdlID8geyBtZXNzYWdlOiBtZXNzYWdlLCBjb3VudDogZGl2aXNvciB9IDogZGl2aXNvclxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBGb3JtVmFsaWRhdG9yLmFkZENvbnN0cmFpbnRCdWlsZGVyKCdvZGQnLCBmdW5jdGlvbiAoY29uc3RyYWludCwgaW5wdXQsIG9wdGlvbiwgbWVzc2FnZSkge1xyXG4gICAgICAgIHNldENvbnN0cmFpbnRQcm9wKGNvbnN0cmFpbnQsICdudW1lcmljYWxpdHknLCB7XHJcbiAgICAgICAgICAgIG9kZDogbWVzc2FnZSA/IHsgbWVzc2FnZTogbWVzc2FnZSB9IDogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBGb3JtVmFsaWRhdG9yLmFkZENvbnN0cmFpbnRCdWlsZGVyKCdldmVuJywgZnVuY3Rpb24gKGNvbnN0cmFpbnQsIGlucHV0LCBvcHRpb24sIG1lc3NhZ2UpIHtcclxuICAgICAgICBzZXRDb25zdHJhaW50UHJvcChjb25zdHJhaW50LCAnbnVtZXJpY2FsaXR5Jywge1xyXG4gICAgICAgICAgICBldmVuOiBtZXNzYWdlID8geyBtZXNzYWdlOiBtZXNzYWdlIH0gOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIEZvcm1WYWxpZGF0b3IuYWRkQ29uc3RyYWludEJ1aWxkZXIoJ2xlbmd0aC1lcXVhbCcsIGZ1bmN0aW9uIChjb25zdHJhaW50LCBpbnB1dCwgb3B0aW9uLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9ICtvcHRpb247XHJcbiAgICAgICAgaWYgKGlzTmFOKGxlbmd0aCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignaW52YWxpZCB2YWxpZGF0aW9uIGF0dHJpYnV0ZSBsZW5ndGgtZXF1YWwnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRDb25zdHJhaW50UHJvcChjb25zdHJhaW50LCAnbGVuZ3RoJywge1xyXG4gICAgICAgICAgICBpczogbWVzc2FnZSA/IHsgbWVzc2FnZTogbWVzc2FnZSwgY291bnQ6IGxlbmd0aCB9IDogbGVuZ3RoXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIEZvcm1WYWxpZGF0b3IuYWRkQ29uc3RyYWludEJ1aWxkZXIoJ2xlbmd0aC1tYXgnLCBmdW5jdGlvbiAoY29uc3RyYWludCwgaW5wdXQsIG9wdGlvbiwgbWVzc2FnZSkge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSArb3B0aW9uO1xyXG4gICAgICAgIGlmIChpc05hTihsZW5ndGgpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2ludmFsaWQgdmFsaWRhdGlvbiBhdHRyaWJ1dGUgbGVuZ3RoLW1heCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldENvbnN0cmFpbnRQcm9wKGNvbnN0cmFpbnQsICdsZW5ndGgnLCB7XHJcbiAgICAgICAgICAgIG1heGltdW06IG1lc3NhZ2UgPyB7IG1lc3NhZ2U6IG1lc3NhZ2UsIGNvdW50OiBsZW5ndGggfSA6IGxlbmd0aFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxudmFyIEFUVFJTX1RPX0lOVkFMSURBVEVfQ09OU1RSQUlOVFMgPSBbJ3R5cGUnLCAncmVxdWlyZWQnLCAnbWluJywgJ21heCcsICdzdGVwJywgJ3BhdHRlcm4nLCAnbWlubGVuZ3RoJywgJ2Zvcm1ub3ZhbGlkYXRlJ107XHJcbnZhciBGb3JtVmFsaWRhdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gRm9ybVZhbGlkYXRvcihfcm9vdCwgb3B0aW9ucykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fcm9vdCA9IF9yb290O1xyXG4gICAgICAgIHRoaXMuX2NvbnN0cmFpbnRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9lbGVtcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fbGl2ZVZhbGlkYXRpb24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9hdXRvSW52YWxpZGF0ZUNvbnN0cmFpbnRzID0gZmFsc2U7XHJcbiAgICAgICAgY3JlYXRlQ3VzdG9tVmFsaWRhdG9ycygpO1xyXG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBhc3NpZ24oe30sIE9QVElPTl9ERUZBVUxUUywgb3B0aW9ucyB8fCB7fSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Jvb3QudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnZm9ybScpIHtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdC5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnJyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3QuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5vblN1Ym1pdC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcm9vdC5fX2hpZGRlbl92YWxpZGF0b3IgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnJvb3RCbG9jaykge1xyXG4gICAgICAgICAgICB0aGlzLl9yb290LmNsYXNzTGlzdC5hZGQodGhpcy5fb3B0aW9ucy5yb290QmxvY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyByZWFjdCBvbiBjaGFuZ2VzIGluIERPTSB0aGF0IGNhbiB0cmlnZ2VyIGNoYW5nZXMgaW4gY29uc3RyYWludHNcclxuICAgICAgICBpZiAod2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIpIHtcclxuICAgICAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcSA9IDA7IHEgPCBtdXRhdGlvbnMubGVuZ3RoOyArK3EpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbXV0ID0gbXV0YXRpb25zW3FdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtdXQudHlwZSAhPT0gJ2F0dHJpYnV0ZXMnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb25zdHJhaW50cyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSBtdXQuYXR0cmlidXRlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWF0dHIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHIgPSBhdHRyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHIuaW5kZXhPZignZGF0YS0nKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fY29uc3RyYWludHMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKEFUVFJTX1RPX0lOVkFMSURBVEVfQ09OU1RSQUlOVFMuaW5kZXhPZihhdHRyKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb25zdHJhaW50cyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHRoaXMuX3Jvb3QsIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gbm8gTXV0YXRpb25PYnNlcnZlciBzdXBwb3J0XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9JbnZhbGlkYXRlQ29uc3RyYWludHMgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbCB0aGlzIGZ1bmN0aW9uIHRvIHZhbGlkYXRlIHRoZSBhbGwgZWxlbWVudHMgb2YgdGhlIHJvb3QgYmxvY2suXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNpbGVudCBTaWxlbnQgdmFsaWRhdGlvbiBtZWFucyB0aGF0IERPTSBpcyBub3QgYWx0ZXJlZCBpbiBhbnkgd2F5LlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgYWxsIGVsZW1lbnRzIGFyZSB2YWxpZCwgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAgICAgKi9cclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24gKHNpbGVudCkge1xyXG4gICAgICAgIGlmIChzaWxlbnQgPT09IHZvaWQgMCkgeyBzaWxlbnQgPSBmYWxzZTsgfVxyXG4gICAgICAgIHZhciBlcnJvcnMgPSB2YWxpZGF0ZSh0aGlzLl9yb290LCB0aGlzLmNvbnN0cmFpbnRzLCB7XHJcbiAgICAgICAgICAgIGZ1bGxNZXNzYWdlczogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgaGFzRXJyb3JzID0gZXJyb3JzICE9IG51bGw7XHJcbiAgICAgICAgaWYgKCFzaWxlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5zaG93RXJyb3JzKGVycm9ycyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2JlZ2luTGl2ZVZhbGlkYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICFoYXNFcnJvcnM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsIHRoaXMgZnVuY3Rpb24gdG8gdmFsaWRhdGUgYSBzaW5nbGUgZWxlbWVudCB3aXRoIGdpdmVuIG5hbWUuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZWxlbU5hbWUgTmFtZSBvZiB0aGUgZWxlbWVudCB0byB2YWxpZGF0ZVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzaWxlbnQgU2lsZW50IHZhbGlkYXRpb24gbWVhbnMgdGhhdCBET00gaXMgbm90IGFsdGVyZWQgaW4gYW55IHdheS5cclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBlbGVtZW50IGlzIHZhbGlkLCBmYWxzZSBvdGhlcndpc2VcclxuICAgICAqL1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUudmFsaWRhdGVTaW5nbGUgPSBmdW5jdGlvbiAoZWxlbU5hbWUsIHNpbGVudCkge1xyXG4gICAgICAgIGlmIChzaWxlbnQgPT09IHZvaWQgMCkgeyBzaWxlbnQgPSBmYWxzZTsgfVxyXG4gICAgICAgIHRoaXMuX2Vuc3VyZUNvbnN0cmFpbnRzQXJlQnVpbHQoKTtcclxuICAgICAgICB2YXIgZWxlbURhdGEgPSB0aGlzLl9lbGVtcyA/IHRoaXMuX2VsZW1zW2VsZW1OYW1lXSA6IG51bGw7XHJcbiAgICAgICAgaWYgKCFlbGVtRGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJlbGVtZW50IHdpdGggbmFtZSBcIiArIGVsZW1OYW1lICsgXCIgaGFzIG5vdCBiZWVuIGZvdW5kIHdoaWxlIHZhbGlkYXRpbmcgYSBzaW5nbGUgZWxlbWVudFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb25zdHJhaW50ID0gdGhpcy5fY29uc3RyYWludHMgPyB0aGlzLl9jb25zdHJhaW50c1tlbGVtTmFtZV0gOiBudWxsO1xyXG4gICAgICAgIHZhciBlcnJvciA9IG51bGw7XHJcbiAgICAgICAgaWYgKGNvbnN0cmFpbnQpIHtcclxuICAgICAgICAgICAgZXJyb3IgPSB2YWxpZGF0ZS5zaW5nbGUodGhpcy5fZ2V0SW5wdXRWYWx1ZShlbGVtRGF0YS5lbGVtKSwgY29uc3RyYWludCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc2lsZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFcnJvcihlcnJvciwgZWxlbURhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhckVycm9yKGVsZW1EYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZXJyb3IgPT0gbnVsbDtcclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRm9ybVZhbGlkYXRvci5wcm90b3R5cGUsIFwiY29uc3RyYWludHNcIiwge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtWYWxpZGF0aW9uQ29uc3RyYWludHN9IExpc3Qgb2YgY29uc3RyYWludHMgY29sbGVjdGVkIGZyb20gSFRNTDUgdmFsaWRhdGlvbiBhdHRyaWJ1dGVzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Vuc3VyZUNvbnN0cmFpbnRzQXJlQnVpbHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnN0cmFpbnRzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLCBcInJvb3RcIiwge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtFbGVtZW50fSBGb3JtIGVsZW1lbnQgYXNzb3RpYXRlZCB3aXRoIHRoZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRm9ybVZhbGlkYXRvci5wcm90b3R5cGUsIFwicm9vdEJsb2NrXCIsIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBCbG9jayBuYW1lIGZvciBhIHJvb3QgZWxlbWVudFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucy5yb290QmxvY2sgfHwgT1BUSU9OX0RFRkFVTFRTLnJvb3RCbG9jaztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJyb290VmFsaWRDbGFzc1wiLCB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ30gQSBjbGFzcyBuYW1lIGFwcGxpZWQgdG8gdGhlIHJvb3QgYmxvY2sgaWYgYWxsIGl0cyBjaGlsZHJlbiBhcmUgdmFsaWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ha2VNb2QodGhpcy5yb290QmxvY2ssIHRoaXMuX29wdGlvbnMucm9vdFZhbGlkTW9kKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJyb290SW52YWxpZENsYXNzXCIsIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBBIGNsYXNzIG5hbWUgYXBwbGllZCB0byB0aGUgcm9vdCBlbGVtZW50IGlmIGF0IGxlYXN0IG9uZSBvZiBpdHMgY2hpbGRyZW4gaXMgaW52YWxpZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWFrZU1vZCh0aGlzLnJvb3RCbG9jaywgdGhpcy5fb3B0aW9ucy5yb290SW52YWxpZE1vZCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRm9ybVZhbGlkYXRvci5wcm90b3R5cGUsIFwiaW5wdXRCbG9ja1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJyArIHRoaXMuX29wdGlvbnMuaW5wdXRCbG9jaztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJpbnB1dEJsb2NrRXJyb3JFbGVtZW50XCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ha2VFbGVtKHRoaXMuaW5wdXRCbG9jaywgJycgKyB0aGlzLl9vcHRpb25zLmlucHV0QmxvY2tFcnJvckVsZW0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLCBcImlucHV0QmxvY2tWYWxpZENsYXNzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ha2VNb2QodGhpcy5pbnB1dEJsb2NrLCAnJyArIHRoaXMuX29wdGlvbnMuaW5wdXRCbG9ja1ZhbGlkTW9kKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJpbnB1dEJsb2NrSW52YWxpZENsYXNzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ha2VNb2QodGhpcy5pbnB1dEJsb2NrLCAnJyArIHRoaXMuX29wdGlvbnMuaW5wdXRCbG9ja0ludmFsaWRNb2QpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLCBcIm9wdGlvbnNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXNzaWduKHt9LCB0aGlzLl9vcHRpb25zKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJsaXZlVmFsaWRhdGlvblwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9saXZlVmFsaWRhdGlvbjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIEZvcm1WYWxpZGF0b3IuZnJvbVJvb3QgPSBmdW5jdGlvbiAocm9vdCkge1xyXG4gICAgICAgIGlmICghcm9vdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvb3QuX19oaWRkZW5fdmFsaWRhdG9yO1xyXG4gICAgfTtcclxuICAgIEZvcm1WYWxpZGF0b3IuaW5pdCA9IGZ1bmN0aW9uIChyb290Q2xhc3MsIG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAocm9vdENsYXNzID09PSB2b2lkIDApIHsgcm9vdENsYXNzID0gJ2pzLXZhbGlkYXRlJzsgfVxyXG4gICAgICAgIHZhciBmb3JtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgcm9vdENsYXNzKTtcclxuICAgICAgICBmb3IgKHZhciBxID0gMDsgcSA8IGZvcm1zLmxlbmd0aDsgKytxKSB7XHJcbiAgICAgICAgICAgIG5ldyBGb3JtVmFsaWRhdG9yKGZvcm1zW3FdLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgRm9ybVZhbGlkYXRvci5hZGRDb25zdHJhaW50QnVpbGRlciA9IGZ1bmN0aW9uIChuYW1lLCBidWlsZGVyLCB2YWxpZGF0b3IpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29uc3RyYWludEJ1aWxkZXJzW25hbWVdICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJlZ2lzdGVyIGEgY3VzdG9tIGNvbnN0cmFpbnQgYnVpbGRlcjogbmFtZSBbXCIgKyBuYW1lICsgXCJdIGlzIGFscmVhZHkgaW4gdXNlXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFsaWRhdG9yICYmIHZhbGlkYXRlLnZhbGlkYXRvcnNbbmFtZV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmVnaXN0ZXIgYSBjdXN0b20gdmFsaWRhdG9yOiBuYW1lIFtcIiArIG5hbWUgKyBcIl0gaXMgYWxyZWFkeSBpbiB1c2VcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NvbnN0cmFpbnRCdWlsZGVyc1tuYW1lXSA9IGJ1aWxkZXI7XHJcbiAgICAgICAgaWYgKHZhbGlkYXRvcikge1xyXG4gICAgICAgICAgICB2YWxpZGF0ZS52YWxpZGF0b3JzW25hbWVdID0gdmFsaWRhdG9yO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5mb3JtYXRNc2cgPSBmdW5jdGlvbiAobXNnLCBwYXJhbXMpIHtcclxuICAgICAgICB2YXIgU0VQX0NIQVJDT0RFID0gJyQnLmNoYXJDb2RlQXQoMCksIExPV19BTFBIQV9TVEFSVCA9ICdhJy5jaGFyQ29kZUF0KDApLCBISUdIX0FMUEhBX0VORCA9ICd6Jy5jaGFyQ29kZUF0KDApLCBMR19BTFBIQV9TVEFSVCA9ICdBJy5jaGFyQ29kZUF0KDApLCBMR19BTFBIQV9FTkQgPSAnWicuY2hhckNvZGVBdCgwKSwgRElHSVRfU1RBUlQgPSAnMCcuY2hhckNvZGVBdCgwKSwgRElHSVRfRU5EID0gJzknLmNoYXJDb2RlQXQoMCksIFVOREVSU0NPUkUgPSAnXycuY2hhckNvZGVBdCgwKTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgdmFyIHRhaWwgPSAwLCBoZWFkID0gMDtcclxuICAgICAgICB3aGlsZSAoaGVhZCA8IG1zZy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgaWYgKG1zZy5jaGFyQ29kZUF0KGhlYWQpID09PSBTRVBfQ0hBUkNPREUpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVudGVyIHBsYWNlaG9sZGVyXHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChtc2cuc2xpY2UodGFpbCwgaGVhZCkpO1xyXG4gICAgICAgICAgICAgICAgdGFpbCA9IGhlYWQ7XHJcbiAgICAgICAgICAgICAgICArK2hlYWQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2ggPSBtc2cuY2hhckNvZGVBdChoZWFkKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICgoY2ggPj0gTE9XX0FMUEhBX1NUQVJUICYmIGNoIDw9IEhJR0hfQUxQSEFfRU5EKSB8fCAoY2ggPj0gTEdfQUxQSEFfU1RBUlQgJiYgY2ggPD0gTEdfQUxQSEFfRU5EKVxyXG4gICAgICAgICAgICAgICAgICAgIHx8IChjaCA+PSBESUdJVF9TVEFSVCAmJiBjaCA8PSBESUdJVF9FTkQpIHx8IGNoID09PSBVTkRFUlNDT1JFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2ggPSBtc2cuY2hhckNvZGVBdCgrK2hlYWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyID0gbXNnLnNsaWNlKHRhaWwgKyAxLCBoZWFkKTtcclxuICAgICAgICAgICAgICAgIGlmIChwbGFjZWhvbGRlci5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGZvcm1hdCBzdHJpbmc6IGVycm9yIGF0ICcgKyBwbGFjZWhvbGRlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCgnJyArIChwYXJhbXNbcGxhY2Vob2xkZXJdIHx8ICcnKSk7XHJcbiAgICAgICAgICAgICAgICAtLWhlYWQ7XHJcbiAgICAgICAgICAgICAgICB0YWlsID0gaGVhZCArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICArK2hlYWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzdWx0LnB1c2gobXNnLnNsaWNlKHRhaWwpKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xyXG4gICAgfTtcclxuICAgIC8qKiBQcm90ZWN0ZWQgYXJlYSAqKi9cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbGVkIHRvIGhhbmRsZSBmb3JtIHN1Ym1pdCBldmVudFxyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZSBFdmVudCBvYmplY3RcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm4gdHJ1ZSBpZiBmb3JtIHNob3VsZCBiZSBzdWJtaXR0ZWQsIGZhbHNlIG90aGVyd2lzZVxyXG4gICAgICovXHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5vblN1Ym1pdCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGUoKTtcclxuICAgIH07XHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5fZW5zdXJlQ29uc3RyYWludHNBcmVCdWlsdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NvbnN0cmFpbnRzIHx8IHRoaXMuX2F1dG9JbnZhbGlkYXRlQ29uc3RyYWludHMpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVidWlsZEVsZW1zKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1aWxkQ29uc3RyYWludHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsZWQgdG8gc2hvdyBlcnJvcnMgb24gY29ycmVzcG9uZGluZyBlbGVtZW50cy5cclxuICAgICAqIEBwYXJhbSBlcnJvcnMgRXJyb3Igb2JqZWN0IGFzIHJldHJpZXZlZCBmcm9tIHZhbGlkYXRlLmpzLlxyXG4gICAgICovXHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5zaG93RXJyb3JzID0gZnVuY3Rpb24gKGVycm9ycykge1xyXG4gICAgICAgIGlmICghdGhpcy5fZWxlbXMpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdJbnZhbGlkIHNob3dFcnJvcnMgY2FsbDogbm8gZWxlbWVudHMgaGFzIGJlZW4gY29sbGVjdGVkJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IE9iamVjdC5rZXlzKHRoaXMuX2VsZW1zKTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgdmFyIGVsZW1fbmFtZSA9IF9hW19pXTtcclxuICAgICAgICAgICAgaWYgKGVycm9ycyAmJiBlcnJvcnNbZWxlbV9uYW1lXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVycm9yKGVycm9yc1tlbGVtX25hbWVdLCB0aGlzLl9lbGVtc1tlbGVtX25hbWVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJFcnJvcih0aGlzLl9lbGVtc1tlbGVtX25hbWVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5zZXRFcnJvciA9IGZ1bmN0aW9uIChtc2csIGVsZW0pIHtcclxuICAgICAgICAvLyBzZXQgdGl0bGVzXHJcbiAgICAgICAgZWxlbS5lbGVtLnNldEF0dHJpYnV0ZSgndGl0bGUnLCBtc2cpO1xyXG4gICAgICAgIGlmIChlbGVtLmVycm9yRWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgbXNnTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG1zZyk7XHJcbiAgICAgICAgICAgIGVsZW0uZXJyb3JFbGVtZW50LmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgICAgICBlbGVtLmVycm9yRWxlbWVudC5hcHBlbmRDaGlsZChtc2dOb2RlKTtcclxuICAgICAgICAgICAgZWxlbS5lcnJvckVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aXRsZScsIG1zZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldCBjbGFzc2VzXHJcbiAgICAgICAgaWYgKGVsZW0uaWIpIHtcclxuICAgICAgICAgICAgZWxlbS5pYi5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuaW5wdXRCbG9ja1ZhbGlkQ2xhc3MpO1xyXG4gICAgICAgICAgICBlbGVtLmliLmNsYXNzTGlzdC5hZGQodGhpcy5pbnB1dEJsb2NrSW52YWxpZENsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pbnB1dEludmFsaWRDbGFzcykge1xyXG4gICAgICAgICAgICBlbGVtLmVsZW0uY2xhc3NMaXN0LmFkZCh0aGlzLm9wdGlvbnMuaW5wdXRJbnZhbGlkQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmlucHV0VmFsaWRDbGFzcykge1xyXG4gICAgICAgICAgICBlbGVtLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLm9wdGlvbnMuaW5wdXRWYWxpZENsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxlbS52YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2V0Um9vdEhhc0Vycm9ycyh0cnVlKTtcclxuICAgIH07XHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5jbGVhckVycm9yID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICAvLyBjbGVhciB0aXRsZXNcclxuICAgICAgICBlbGVtLmVsZW0uc2V0QXR0cmlidXRlKCd0aXRsZScsICcnKTtcclxuICAgICAgICBpZiAoZWxlbS5lcnJvckVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbS5lcnJvckVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICAgIGVsZW0uZXJyb3JFbGVtZW50LnNldEF0dHJpYnV0ZSgndGl0bGUnLCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNsZWFyIGVycm9yIGNsYXNzZXNcclxuICAgICAgICBpZiAoZWxlbS5pYikge1xyXG4gICAgICAgICAgICBlbGVtLmliLmNsYXNzTGlzdC5hZGQodGhpcy5pbnB1dEJsb2NrVmFsaWRDbGFzcyk7XHJcbiAgICAgICAgICAgIGVsZW0uaWIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmlucHV0QmxvY2tJbnZhbGlkQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmlucHV0SW52YWxpZENsYXNzKSB7XHJcbiAgICAgICAgICAgIGVsZW0uZWxlbS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMub3B0aW9ucy5pbnB1dEludmFsaWRDbGFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaW5wdXRWYWxpZENsYXNzKSB7XHJcbiAgICAgICAgICAgIGVsZW0uZWxlbS5jbGFzc0xpc3QuYWRkKHRoaXMub3B0aW9ucy5pbnB1dFZhbGlkQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbGVtLnZhbGlkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNldFJvb3RIYXNFcnJvcnModGhpcy5faGFzSW52YWxpZEVsZW1zKCkpO1xyXG4gICAgfTtcclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLl9oYXNJbnZhbGlkRWxlbXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5fZWxlbXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2VsZW1zKS5tYXAoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIF90aGlzLl9lbGVtc1t4XTsgfSkuc29tZShmdW5jdGlvbiAoeCkgeyByZXR1cm4gIXgudmFsaWQ7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuX3VwZGF0ZUlucHV0RGF0YSA9IGZ1bmN0aW9uIChkYXRhLCBlbGVtKSB7XHJcbiAgICAgICAgdmFyIGliID0gY2xvc2VzdChlbGVtLCAnLicgKyB0aGlzLl9vcHRpb25zLmlucHV0QmxvY2spO1xyXG4gICAgICAgIGlmICghaWIpIHtcclxuICAgICAgICAgICAgZGF0YS5lbGVtID0gZWxlbTtcclxuICAgICAgICAgICAgZGF0YS5pYiA9IG51bGw7XHJcbiAgICAgICAgICAgIGRhdGEuZXJyb3JFbGVtZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZXJyQ29udGFpbmVyQ2xhc3MgPSBtYWtlRWxlbSgnJyArIHRoaXMuX29wdGlvbnMuaW5wdXRCbG9jaywgJycgKyB0aGlzLl9vcHRpb25zLmlucHV0QmxvY2tFcnJvckVsZW0pO1xyXG4gICAgICAgIHZhciBlcnJvckVsZW1lbnQgPSBpYi5xdWVyeVNlbGVjdG9yKCcuJyArIGVyckNvbnRhaW5lckNsYXNzKTtcclxuICAgICAgICBpZiAoIWVycm9yRWxlbWVudCkge1xyXG4gICAgICAgICAgICBlcnJvckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgaWIuYXBwZW5kQ2hpbGQoZXJyb3JFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGF0YS5lbGVtID0gZWxlbTtcclxuICAgICAgICBkYXRhLmliID0gaWI7XHJcbiAgICAgICAgZGF0YS5lcnJvckVsZW1lbnQgPSBlcnJvckVsZW1lbnQ7XHJcbiAgICB9O1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuX2J1aWxkSW5wdXREYXRhID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0geyB2YWxpZDogbnVsbCB9O1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUlucHV0RGF0YShyZXN1bHQsIGVsZW0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuX2dldEVsZW1lbnRNc2cgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICAgIHZhciBtc2dDbGFzc2VzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgbXNnQ2xhc3Nlc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgcSA9IDA7IHEgPCBtc2dDbGFzc2VzLmxlbmd0aDsgKytxKSB7XHJcbiAgICAgICAgICAgIHZhciBtc2dDbGFzc1VuZGVyc2NvcmVkID0gJ2RhdGEtbXNnLScgKyBzZXBhcmF0ZWQobXNnQ2xhc3Nlc1txXSwgJy0nKSwgbXNnQ2xhc3NDYW1lbCA9ICdkYXRhLW1zZy0nICsgY2FtZWwobXNnQ2xhc3Nlc1txXSk7XHJcbiAgICAgICAgICAgIHZhciBhdHRyXzEgPSBlbGVtLmdldEF0dHJpYnV0ZShtc2dDbGFzc1VuZGVyc2NvcmVkKSB8fCBlbGVtLmdldEF0dHJpYnV0ZShtc2dDbGFzc0NhbWVsKTtcclxuICAgICAgICAgICAgaWYgKGF0dHJfMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF0dHJfMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0cnkgZ2VuZXJpYyBtZXNzYWdlXHJcbiAgICAgICAgdmFyIGF0dHIgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1tc2ctZXJyb3InKTtcclxuICAgICAgICBpZiAoYXR0cikge1xyXG4gICAgICAgICAgICByZXR1cm4gYXR0cjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zLm1lc3NhZ2VzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBxID0gMDsgcSA8IG1zZ0NsYXNzZXMubGVuZ3RoOyArK3EpIHtcclxuICAgICAgICAgICAgdmFyIGRlZiA9IHRoaXMuX29wdGlvbnMubWVzc2FnZXNbY2FtZWwobXNnQ2xhc3Nlc1txXSldO1xyXG4gICAgICAgICAgICBpZiAoZGVmKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfTtcclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLl9yZWJ1aWxkRWxlbXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9lbGVtcykge1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtcyA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZWxlbXMgPSB0aGlzLnJvb3QucXVlcnlTZWxlY3RvckFsbCgnW25hbWVdJyk7XHJcbiAgICAgICAgdmFyIG5vdFVwZGF0ZWQgPSBPYmplY3Qua2V5cyh0aGlzLl9lbGVtcyk7XHJcbiAgICAgICAgZm9yICh2YXIgcSA9IDA7IHEgPCBlbGVtcy5sZW5ndGg7ICsrcSkge1xyXG4gICAgICAgICAgICB2YXIgZWxlbSA9IGVsZW1zW3FdLCBlbGVtTmFtZSA9IGVsZW0uZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgJyc7XHJcbiAgICAgICAgICAgIGlmICghZWxlbU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5vIG5hbWUgZm9yIGVsZW1lbnRcIiwgZWxlbSk7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fZWxlbXNbZWxlbU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVJbnB1dERhdGEodGhpcy5fZWxlbXNbZWxlbU5hbWVdLCBlbGVtKTtcclxuICAgICAgICAgICAgICAgIG5vdFVwZGF0ZWQuc3BsaWNlKG5vdFVwZGF0ZWQuaW5kZXhPZihlbGVtTmFtZSksIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZWxlbXNbZWxlbU5hbWVdID0gdGhpcy5fYnVpbGRJbnB1dERhdGEoZWxlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcmVtb3ZlIGVudHJpZXMgdGhhdCBubyBtb3JlIGV4aXN0XHJcbiAgICAgICAgZm9yICh2YXIgcSA9IDA7IHEgPCBub3RVcGRhdGVkLmxlbmd0aDsgKytxKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9lbGVtc1tub3RVcGRhdGVkW3FdXTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuX2J1aWxkQ29uc3RyYWludHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fcmVidWlsZEVsZW1zKCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9lbGVtcykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBidWlsZGVyS2V5cyA9IE9iamVjdC5rZXlzKEZvcm1WYWxpZGF0b3IuX2NvbnN0cmFpbnRCdWlsZGVycyk7XHJcbiAgICAgICAgdmFyIGJ1aWxkZXJBdHRycyA9IGJ1aWxkZXJLZXlzLm1hcChmdW5jdGlvbiAoeCkgeyByZXR1cm4gJ2RhdGEtdmFsaWRhdGUtJyArIHg7IH0pO1xyXG4gICAgICAgIHRoaXMuX2NvbnN0cmFpbnRzID0ge307XHJcbiAgICAgICAgdmFyIGVsZW1OYW1lcyA9IE9iamVjdC5rZXlzKHRoaXMuX2VsZW1zKTtcclxuICAgICAgICBmb3IgKHZhciBxID0gMDsgcSA8IGVsZW1OYW1lcy5sZW5ndGg7ICsrcSkge1xyXG4gICAgICAgICAgICB2YXIgZWxlbU5hbWUgPSBlbGVtTmFtZXNbcV0sIGVsZW1EYXRhID0gdGhpcy5fZWxlbXNbZWxlbU5hbWVdLCBlbGVtID0gZWxlbURhdGEuZWxlbTtcclxuICAgICAgICAgICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKCdkYXRhLWlnbm9yZWQnKSB8fCBlbGVtLmhhc0F0dHJpYnV0ZSgnZm9ybW5vdmFsaWRhdGUnKSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGNvbnN0cmFpbnQgPSB7fTtcclxuICAgICAgICAgICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKCdyZXF1aXJlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuX2dldEVsZW1lbnRNc2coZWxlbSwgJ3JlcXVpcmVkJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50LnByZXNlbmNlID0gbWVzc2FnZSA/IHsgbWVzc2FnZTogbWVzc2FnZSB9IDogdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWlubGVuZ3RoID0gK2VsZW0uZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKTtcclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5fZ2V0RWxlbWVudE1zZyhlbGVtLCAnbWlubGVuZ3RoJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50Lmxlbmd0aCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBtaW5pbXVtOiBtaW5sZW5ndGhcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSB0aGlzLmZvcm1hdE1zZyhtZXNzYWdlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogbWlubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludC5sZW5ndGgubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKCdwYXR0ZXJuJykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXR0ZXJuID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQuZm9ybWF0ID0geyBwYXR0ZXJuOiBwYXR0ZXJuIH07XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuX2dldEVsZW1lbnRNc2coZWxlbSwgJ3BhdHRlcm4nKTtcclxuICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IHRoaXMuZm9ybWF0TXNnKG1lc3NhZ2UsIHsgcGF0dGVybjogcGF0dGVybiB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50LmZvcm1hdC5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzd2l0Y2ggKGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdpbnB1dCc6XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKChlbGVtLmdldEF0dHJpYnV0ZSgndHlwZScpIHx8ICd0ZXh0JykudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZW1haWwnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLl9nZXRFbGVtZW50TXNnKGVsZW0sICdlbWFpbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50LmVtYWlsID0gbWVzc2FnZSA/IHsgbWVzc2FnZTogbWVzc2FnZSB9IDogdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd1cmwnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLl9nZXRFbGVtZW50TXNnKGVsZW0sICd1cmwnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludC51cmwgPSBtZXNzYWdlID8geyBtZXNzYWdlOiBtZXNzYWdlIH0gOiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUoJ2RhdGEtdmFsaWRhdGUtdXJsLWFsbG93LWxvY2FsJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc3RyYWludC51cmwgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludC51cmwuYWxsb3dMb2NhbCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50LnVybCA9IHsgYWxsb3dMb2NhbDogdHJ1ZSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtLmhhc0F0dHJpYnV0ZSgnZGF0YS12YWxpZGF0ZS11cmwtc2NoZW1lcycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NoZW1lcyA9IHZvaWQgMCwgc2NoZW1lc0F0dHIgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS12YWxpZGF0ZS11cmwtc2NoZW1lcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjaGVtZXNBdHRyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZW1lcyA9IEpTT04ucGFyc2Uoc2NoZW1lc0F0dHIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVtZXMgPSBbc2NoZW1lc0F0dHJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnN0cmFpbnQudXJsID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50LnVybC5zY2hlbWVzID0gc2NoZW1lcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQudXJsID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZW1lczogc2NoZW1lc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50Lm51bWVyaWNhbGl0eSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWluID0gbnVsbCwgbWF4ID0gbnVsbCwgc3RlcCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtLmhhc0F0dHJpYnV0ZSgnbWluJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbiA9ICtlbGVtLmdldEF0dHJpYnV0ZSgnbWluJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50Lm51bWVyaWNhbGl0eS5ncmVhdGVyVGhhbk9yRXF1YWxUbyA9IG1pbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUoJ21heCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXggPSArZWxlbS5nZXRBdHRyaWJ1dGUoJ21heCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludC5udW1lcmljYWxpdHkubGVzc1RoYW5PckVxdWFsVG8gPSBtYXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKCdzdGVwJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSArZWxlbS5nZXRBdHRyaWJ1dGUoJ3N0ZXAnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQuc3RlcCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwOiBzdGVwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1pbiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludC5zdGVwLm1pbiA9IG1pbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtc2cgPSB0aGlzLl9nZXRFbGVtZW50TXNnKGVsZW0sICdzdGVwJywgJ251bWJlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1zZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQuc3RlcC5tZXNzYWdlID0gbXNnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWZNc2dDbGFzcyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1pbiA9PSBudWxsICYmIG1heCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZNc2dDbGFzcyA9ICdudW1iZXInO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1pbiAhPSBudWxsICYmIG1heCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZNc2dDbGFzcyA9ICdudW1iZXJNaW5NYXgnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1pbiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZNc2dDbGFzcyA9ICdudW1iZXJNaW4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmTXNnQ2xhc3MgPSAnbnVtYmVyTWF4JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuX2dldEVsZW1lbnRNc2coZWxlbSwgZGVmTXNnQ2xhc3MsICdudW1iZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSB0aGlzLmZvcm1hdE1zZyhtZXNzYWdlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluOiBtaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4OiBtYXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcDogc3RlcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50Lm51bWVyaWNhbGl0eS5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3NlbGVjdCc6XHJcbiAgICAgICAgICAgICAgICBjYXNlICd0ZXh0YXJlYSc6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignVW5zdXBwb3J0ZWQgZWxlbWVudCB0YWc6ICcsIGVsZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIHFfMSA9IDA7IHFfMSA8IGJ1aWxkZXJLZXlzLmxlbmd0aDsgKytxXzEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtLmhhc0F0dHJpYnV0ZShidWlsZGVyQXR0cnNbcV8xXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbXNnID0gdGhpcy5fZ2V0RWxlbWVudE1zZyhlbGVtLCBidWlsZGVyS2V5c1txXzFdKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3X2NvbnN0cmFpbnQgPSBGb3JtVmFsaWRhdG9yLl9jb25zdHJhaW50QnVpbGRlcnNbYnVpbGRlcktleXNbcV8xXV0oY29uc3RyYWludCwgZWxlbSwgJycgKyBlbGVtLmdldEF0dHJpYnV0ZShidWlsZGVyQXR0cnNbcV8xXSksIG1zZywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld19jb25zdHJhaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQgPSBuZXdfY29uc3RyYWludDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGNvbnN0cmFpbnQpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnN0cmFpbnRzW2VsZW1OYW1lXSA9IGNvbnN0cmFpbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuX2JlZ2luTGl2ZVZhbGlkYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2xpdmVWYWxpZGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zLnJldmFsaWRhdGVPbklucHV0ICYmICF0aGlzLl9vcHRpb25zLnJldmFsaWRhdGVPbkNoYW5nZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5fZWxlbXMpIHtcclxuICAgICAgICAgICAgdGhpcy5fYnVpbGRDb25zdHJhaW50cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gT2JqZWN0LmtleXModGhpcy5fZWxlbXMpOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICB2YXIgZWxlbU5hbWUgPSBfYVtfaV07XHJcbiAgICAgICAgICAgIHZhciBlbGVtRGF0YSA9IHRoaXMuX2VsZW1zW2VsZW1OYW1lXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMucmV2YWxpZGF0ZU9uQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtRGF0YS5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMub25FbGVtZW50Q2hhbmdlLmJpbmQodGhpcywgZWxlbU5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5yZXZhbGlkYXRlT25JbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgZWxlbURhdGEuZWxlbS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRoaXMub25FbGVtZW50Q2hhbmdlLmJpbmQodGhpcywgZWxlbU5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9saXZlVmFsaWRhdGlvbiA9IHRydWU7XHJcbiAgICB9O1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUub25FbGVtZW50Q2hhbmdlID0gZnVuY3Rpb24gKGVsZW1OYW1lLCBlKSB7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZVNpbmdsZShlbGVtTmFtZSk7XHJcbiAgICB9O1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuc2V0Um9vdEhhc0Vycm9ycyA9IGZ1bmN0aW9uIChoYXNFcnJvcnMpIHtcclxuICAgICAgICB0b2dnbGVDbGFzcyh0aGlzLl9yb290LCB0aGlzLnJvb3RWYWxpZENsYXNzLCAhaGFzRXJyb3JzKTtcclxuICAgICAgICB0b2dnbGVDbGFzcyh0aGlzLl9yb290LCB0aGlzLnJvb3RJbnZhbGlkQ2xhc3MsIGhhc0Vycm9ycyk7XHJcbiAgICB9O1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuX2dldElucHV0VmFsdWUgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IGVsZW0udmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09ICcnID8gbnVsbCA6IHZhbHVlO1xyXG4gICAgfTtcclxuICAgIEZvcm1WYWxpZGF0b3IuX2NvbnN0cmFpbnRCdWlsZGVycyA9IHt9O1xyXG4gICAgcmV0dXJuIEZvcm1WYWxpZGF0b3I7XHJcbn0oKSk7XHJcbmV4cG9ydHMuRm9ybVZhbGlkYXRvciA9IEZvcm1WYWxpZGF0b3I7XHJcbi8qKlxyXG4gKiBFbGVtZW50Lm1hdGNoZXMgbWV0aG9kIHBvbHlmaWxsLlxyXG4gKiBXZSBzaG91bGQgbm90IHRvdWNoIHByb3RvdHlwZSBvZiBFbGVtZW50IHRvIGF2b2lkIG1lc3Npbmcgd2l0aCBhbm90aGVyIGxpYnNcclxuICovXHJcbnZhciBtYXRjaGVzRnVuYyA9IG51bGw7XHJcbmZ1bmN0aW9uIG1hdGNoZXMoZWxlbSwgc2VsZWN0b3IpIHtcclxuICAgIGlmICghbWF0Y2hlc0Z1bmMpIHtcclxuICAgICAgICBtYXRjaGVzRnVuYyA9IEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgfHwgRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1hdGNoZXNGdW5jLmNhbGwoZWxlbSwgc2VsZWN0b3IpO1xyXG59XHJcbi8qKlxyXG4gKiBFbGVtZW50LmNsb3Nlc3QgbWV0aG9kIHBvbHlmaWxsXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9zZXN0KGVsZW0sIHNlbGVjdG9yKSB7XHJcbiAgICBpZiAoZWxlbS5jbG9zZXN0KSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZW0uY2xvc2VzdChzZWxlY3Rvcik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZWwgPSBlbGVtO1xyXG4gICAgICAgIHdoaWxlIChlbCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaGVzKGVsLCBzZWxlY3RvcikpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbDtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBhc3NpZ24oKSB7XHJcbiAgICB2YXIgb2JqcyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBvYmpzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICBpZiAoT2JqZWN0LmFzc2lnbikge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduLmFwcGx5KHRoaXMsIG9ianMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGxvZGFzaF9hc3NpZ24uYXBwbHkodGhpcywgb2Jqcyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gbWFrZU1vZChibG9jaywgbW9kaWZpZXIpIHtcclxuICAgIHJldHVybiBtb2RpZmllciA/IGJsb2NrICsgJy0tJyArIG1vZGlmaWVyIDogYmxvY2s7XHJcbn1cclxuZnVuY3Rpb24gbWFrZUVsZW0oYmxvY2ssIGVsZW0pIHtcclxuICAgIHJldHVybiBibG9jayArICdfXycgKyBlbGVtO1xyXG59XHJcbmZ1bmN0aW9uIHRvZ2dsZUNsYXNzKGVsZW0sIGNsYXNzTmFtZSwgdmFsdWUpIHtcclxuICAgICh2YWx1ZSA/IGVsZW0uY2xhc3NMaXN0LmFkZCA6IGVsZW0uY2xhc3NMaXN0LnJlbW92ZSkuY2FsbChlbGVtLmNsYXNzTGlzdCwgY2xhc3NOYW1lKTtcclxufVxyXG5mdW5jdGlvbiBzZXBhcmF0ZWQobmFtZSwgc2VwKSB7XHJcbiAgICBpZiAoc2VwID09PSB2b2lkIDApIHsgc2VwID0gJ18nOyB9XHJcbiAgICB2YXIgQ0hfTEdfTE9XRVIgPSAnQScuY2hhckNvZGVBdCgwKSwgQ0hfTEdfSElHSCA9ICdaJy5jaGFyQ29kZUF0KDApO1xyXG4gICAgdmFyIHRhaWwgPSAwLCBoZWFkID0gMDtcclxuICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgIHdoaWxlIChoZWFkIDwgbmFtZS5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgY2ggPSBuYW1lLmNoYXJDb2RlQXQoaGVhZCk7XHJcbiAgICAgICAgaWYgKGNoID49IENIX0xHX0xPV0VSICYmIGNoIDw9IENIX0xHX0hJR0ggJiYgaGVhZCAhPT0gMCkge1xyXG4gICAgICAgICAgICAvLyBzcGxpdCBoZXJlXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5hbWUuc2xpY2UodGFpbCwgaGVhZCkudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgICAgIHRhaWwgPSBoZWFkO1xyXG4gICAgICAgIH1cclxuICAgICAgICArK2hlYWQ7XHJcbiAgICB9XHJcbiAgICBpZiAoaGVhZCAhPSB0YWlsKSB7XHJcbiAgICAgICAgcmVzdWx0LnB1c2gobmFtZS5zbGljZSh0YWlsLCBoZWFkKS50b0xvd2VyQ2FzZSgpKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQuam9pbihzZXApO1xyXG59XHJcbmV4cG9ydHMuc2VwYXJhdGVkID0gc2VwYXJhdGVkO1xyXG5mdW5jdGlvbiBjYW1lbChuYW1lKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gbmFtZS5zcGxpdCgvW19cXC1dLykuZmlsdGVyKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4OyB9KTtcclxuICAgIHJldHVybiByZXN1bHQubWFwKGZ1bmN0aW9uICh4LCBpKSB7IHJldHVybiBpID4gMCA/ICh4LnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB4LnNsaWNlKDEpLnRvTG93ZXJDYXNlKCkpIDogeDsgfSkuam9pbignJyk7XHJcbn1cclxuZXhwb3J0cy5jYW1lbCA9IGNhbWVsO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2luZGV4LnRzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIVxuICogdmFsaWRhdGUuanMgMC4xMi4wXG4gKlxuICogKGMpIDIwMTMtMjAxNyBOaWNrbGFzIEFuc21hbiwgMjAxMyBXcmFwcFxuICogVmFsaWRhdGUuanMgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBGb3IgYWxsIGRldGFpbHMgYW5kIGRvY3VtZW50YXRpb246XG4gKiBodHRwOi8vdmFsaWRhdGVqcy5vcmcvXG4gKi9cblxuKGZ1bmN0aW9uKGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIFRoZSBtYWluIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIHZhbGlkYXRvcnMgc3BlY2lmaWVkIGJ5IHRoZSBjb25zdHJhaW50cy5cbiAgLy8gVGhlIG9wdGlvbnMgYXJlIHRoZSBmb2xsb3dpbmc6XG4gIC8vICAgLSBmb3JtYXQgKHN0cmluZykgLSBBbiBvcHRpb24gdGhhdCBjb250cm9scyBob3cgdGhlIHJldHVybmVkIHZhbHVlIGlzIGZvcm1hdHRlZFxuICAvLyAgICAgKiBmbGF0IC0gUmV0dXJucyBhIGZsYXQgYXJyYXkgb2YganVzdCB0aGUgZXJyb3IgbWVzc2FnZXNcbiAgLy8gICAgICogZ3JvdXBlZCAtIFJldHVybnMgdGhlIG1lc3NhZ2VzIGdyb3VwZWQgYnkgYXR0cmlidXRlIChkZWZhdWx0KVxuICAvLyAgICAgKiBkZXRhaWxlZCAtIFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIHJhdyB2YWxpZGF0aW9uIGRhdGFcbiAgLy8gICAtIGZ1bGxNZXNzYWdlcyAoYm9vbGVhbikgLSBJZiBgdHJ1ZWAgKGRlZmF1bHQpIHRoZSBhdHRyaWJ1dGUgbmFtZSBpcyBwcmVwZW5kZWQgdG8gdGhlIGVycm9yLlxuICAvL1xuICAvLyBQbGVhc2Ugbm90ZSB0aGF0IHRoZSBvcHRpb25zIGFyZSBhbHNvIHBhc3NlZCB0byBlYWNoIHZhbGlkYXRvci5cbiAgdmFyIHZhbGlkYXRlID0gZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB2YXIgcmVzdWx0cyA9IHYucnVuVmFsaWRhdGlvbnMoYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpXG4gICAgICAsIGF0dHJcbiAgICAgICwgdmFsaWRhdG9yO1xuXG4gICAgaWYgKHJlc3VsdHMuc29tZShmdW5jdGlvbihyKSB7IHJldHVybiB2LmlzUHJvbWlzZShyLmVycm9yKTsgfSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVzZSB2YWxpZGF0ZS5hc3luYyBpZiB5b3Ugd2FudCBzdXBwb3J0IGZvciBwcm9taXNlc1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRlLnByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0cyhyZXN1bHRzLCBvcHRpb25zKTtcbiAgfTtcblxuICB2YXIgdiA9IHZhbGlkYXRlO1xuXG4gIC8vIENvcGllcyBvdmVyIGF0dHJpYnV0ZXMgZnJvbSBvbmUgb3IgbW9yZSBzb3VyY2VzIHRvIGEgc2luZ2xlIGRlc3RpbmF0aW9uLlxuICAvLyBWZXJ5IG11Y2ggc2ltaWxhciB0byB1bmRlcnNjb3JlJ3MgZXh0ZW5kLlxuICAvLyBUaGUgZmlyc3QgYXJndW1lbnQgaXMgdGhlIHRhcmdldCBvYmplY3QgYW5kIHRoZSByZW1haW5pbmcgYXJndW1lbnRzIHdpbGwgYmVcbiAgLy8gdXNlZCBhcyBzb3VyY2VzLlxuICB2LmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgYXR0ciBpbiBzb3VyY2UpIHtcbiAgICAgICAgb2JqW2F0dHJdID0gc291cmNlW2F0dHJdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgdi5leHRlbmQodmFsaWRhdGUsIHtcbiAgICAvLyBUaGlzIGlzIHRoZSB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5IGFzIGEgc2VtdmVyLlxuICAgIC8vIFRoZSB0b1N0cmluZyBmdW5jdGlvbiB3aWxsIGFsbG93IGl0IHRvIGJlIGNvZXJjZWQgaW50byBhIHN0cmluZ1xuICAgIHZlcnNpb246IHtcbiAgICAgIG1ham9yOiAwLFxuICAgICAgbWlub3I6IDEyLFxuICAgICAgcGF0Y2g6IDAsXG4gICAgICBtZXRhZGF0YTogbnVsbCxcbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZlcnNpb24gPSB2LmZvcm1hdChcIiV7bWFqb3J9LiV7bWlub3J9LiV7cGF0Y2h9XCIsIHYudmVyc2lvbik7XG4gICAgICAgIGlmICghdi5pc0VtcHR5KHYudmVyc2lvbi5tZXRhZGF0YSkpIHtcbiAgICAgICAgICB2ZXJzaW9uICs9IFwiK1wiICsgdi52ZXJzaW9uLm1ldGFkYXRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2ZXJzaW9uO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBCZWxvdyBpcyB0aGUgZGVwZW5kZW5jaWVzIHRoYXQgYXJlIHVzZWQgaW4gdmFsaWRhdGUuanNcblxuICAgIC8vIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgUHJvbWlzZSBpbXBsZW1lbnRhdGlvbi5cbiAgICAvLyBJZiB5b3UgYXJlIHVzaW5nIFEuanMsIFJTVlAgb3IgYW55IG90aGVyIEErIGNvbXBhdGlibGUgaW1wbGVtZW50YXRpb25cbiAgICAvLyBvdmVycmlkZSB0aGlzIGF0dHJpYnV0ZSB0byBiZSB0aGUgY29uc3RydWN0b3Igb2YgdGhhdCBwcm9taXNlLlxuICAgIC8vIFNpbmNlIGpRdWVyeSBwcm9taXNlcyBhcmVuJ3QgQSsgY29tcGF0aWJsZSB0aGV5IHdvbid0IHdvcmsuXG4gICAgUHJvbWlzZTogdHlwZW9mIFByb21pc2UgIT09IFwidW5kZWZpbmVkXCIgPyBQcm9taXNlIDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gbnVsbCxcblxuICAgIEVNUFRZX1NUUklOR19SRUdFWFA6IC9eXFxzKiQvLFxuXG4gICAgLy8gUnVucyB0aGUgdmFsaWRhdG9ycyBzcGVjaWZpZWQgYnkgdGhlIGNvbnN0cmFpbnRzIG9iamVjdC5cbiAgICAvLyBXaWxsIHJldHVybiBhbiBhcnJheSBvZiB0aGUgZm9ybWF0OlxuICAgIC8vICAgICBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlIG5hbWU+XCIsIGVycm9yOiBcIjx2YWxpZGF0aW9uIHJlc3VsdD5cIn0sIC4uLl1cbiAgICBydW5WYWxpZGF0aW9uczogZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciByZXN1bHRzID0gW11cbiAgICAgICAgLCBhdHRyXG4gICAgICAgICwgdmFsaWRhdG9yTmFtZVxuICAgICAgICAsIHZhbHVlXG4gICAgICAgICwgdmFsaWRhdG9yc1xuICAgICAgICAsIHZhbGlkYXRvclxuICAgICAgICAsIHZhbGlkYXRvck9wdGlvbnNcbiAgICAgICAgLCBlcnJvcjtcblxuICAgICAgaWYgKHYuaXNEb21FbGVtZW50KGF0dHJpYnV0ZXMpIHx8IHYuaXNKcXVlcnlFbGVtZW50KGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMgPSB2LmNvbGxlY3RGb3JtVmFsdWVzKGF0dHJpYnV0ZXMpO1xuICAgICAgfVxuXG4gICAgICAvLyBMb29wcyB0aHJvdWdoIGVhY2ggY29uc3RyYWludHMsIGZpbmRzIHRoZSBjb3JyZWN0IHZhbGlkYXRvciBhbmQgcnVuIGl0LlxuICAgICAgZm9yIChhdHRyIGluIGNvbnN0cmFpbnRzKSB7XG4gICAgICAgIHZhbHVlID0gdi5nZXREZWVwT2JqZWN0VmFsdWUoYXR0cmlidXRlcywgYXR0cik7XG4gICAgICAgIC8vIFRoaXMgYWxsb3dzIHRoZSBjb25zdHJhaW50cyBmb3IgYW4gYXR0cmlidXRlIHRvIGJlIGEgZnVuY3Rpb24uXG4gICAgICAgIC8vIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSB2YWx1ZSwgYXR0cmlidXRlIG5hbWUsIHRoZSBjb21wbGV0ZSBkaWN0IG9mXG4gICAgICAgIC8vIGF0dHJpYnV0ZXMgYXMgd2VsbCBhcyB0aGUgb3B0aW9ucyBhbmQgY29uc3RyYWludHMgcGFzc2VkIGluLlxuICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCB3aGVuIHlvdSB3YW50IHRvIGhhdmUgZGlmZmVyZW50XG4gICAgICAgIC8vIHZhbGlkYXRpb25zIGRlcGVuZGluZyBvbiB0aGUgYXR0cmlidXRlIHZhbHVlLlxuICAgICAgICB2YWxpZGF0b3JzID0gdi5yZXN1bHQoY29uc3RyYWludHNbYXR0cl0sIHZhbHVlLCBhdHRyaWJ1dGVzLCBhdHRyLCBvcHRpb25zLCBjb25zdHJhaW50cyk7XG5cbiAgICAgICAgZm9yICh2YWxpZGF0b3JOYW1lIGluIHZhbGlkYXRvcnMpIHtcbiAgICAgICAgICB2YWxpZGF0b3IgPSB2LnZhbGlkYXRvcnNbdmFsaWRhdG9yTmFtZV07XG5cbiAgICAgICAgICBpZiAoIXZhbGlkYXRvcikge1xuICAgICAgICAgICAgZXJyb3IgPSB2LmZvcm1hdChcIlVua25vd24gdmFsaWRhdG9yICV7bmFtZX1cIiwge25hbWU6IHZhbGlkYXRvck5hbWV9KTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFsaWRhdG9yT3B0aW9ucyA9IHZhbGlkYXRvcnNbdmFsaWRhdG9yTmFtZV07XG4gICAgICAgICAgLy8gVGhpcyBhbGxvd3MgdGhlIG9wdGlvbnMgdG8gYmUgYSBmdW5jdGlvbi4gVGhlIGZ1bmN0aW9uIHdpbGwgYmVcbiAgICAgICAgICAvLyBjYWxsZWQgd2l0aCB0aGUgdmFsdWUsIGF0dHJpYnV0ZSBuYW1lLCB0aGUgY29tcGxldGUgZGljdCBvZlxuICAgICAgICAgIC8vIGF0dHJpYnV0ZXMgYXMgd2VsbCBhcyB0aGUgb3B0aW9ucyBhbmQgY29uc3RyYWludHMgcGFzc2VkIGluLlxuICAgICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gaGF2ZSBkaWZmZXJlbnRcbiAgICAgICAgICAvLyB2YWxpZGF0aW9ucyBkZXBlbmRpbmcgb24gdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgICAgICB2YWxpZGF0b3JPcHRpb25zID0gdi5yZXN1bHQodmFsaWRhdG9yT3B0aW9ucywgdmFsdWUsIGF0dHJpYnV0ZXMsIGF0dHIsIG9wdGlvbnMsIGNvbnN0cmFpbnRzKTtcbiAgICAgICAgICBpZiAoIXZhbGlkYXRvck9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgYXR0cmlidXRlOiBhdHRyLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0b3JOYW1lLFxuICAgICAgICAgICAgZ2xvYmFsT3B0aW9uczogb3B0aW9ucyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICBvcHRpb25zOiB2YWxpZGF0b3JPcHRpb25zLFxuICAgICAgICAgICAgZXJyb3I6IHZhbGlkYXRvci5jYWxsKHZhbGlkYXRvcixcbiAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICB2YWxpZGF0b3JPcHRpb25zLFxuICAgICAgICAgICAgICAgIGF0dHIsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICBvcHRpb25zKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0sXG5cbiAgICAvLyBUYWtlcyB0aGUgb3V0cHV0IGZyb20gcnVuVmFsaWRhdGlvbnMgYW5kIGNvbnZlcnRzIGl0IHRvIHRoZSBjb3JyZWN0XG4gICAgLy8gb3V0cHV0IGZvcm1hdC5cbiAgICBwcm9jZXNzVmFsaWRhdGlvblJlc3VsdHM6IGZ1bmN0aW9uKGVycm9ycywgb3B0aW9ucykge1xuICAgICAgZXJyb3JzID0gdi5wcnVuZUVtcHR5RXJyb3JzKGVycm9ycywgb3B0aW9ucyk7XG4gICAgICBlcnJvcnMgPSB2LmV4cGFuZE11bHRpcGxlRXJyb3JzKGVycm9ycywgb3B0aW9ucyk7XG4gICAgICBlcnJvcnMgPSB2LmNvbnZlcnRFcnJvck1lc3NhZ2VzKGVycm9ycywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBmb3JtYXQgPSBvcHRpb25zLmZvcm1hdCB8fCBcImdyb3VwZWRcIjtcblxuICAgICAgaWYgKHR5cGVvZiB2LmZvcm1hdHRlcnNbZm9ybWF0XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlcnJvcnMgPSB2LmZvcm1hdHRlcnNbZm9ybWF0XShlcnJvcnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHYuZm9ybWF0KFwiVW5rbm93biBmb3JtYXQgJXtmb3JtYXR9XCIsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHYuaXNFbXB0eShlcnJvcnMpID8gdW5kZWZpbmVkIDogZXJyb3JzO1xuICAgIH0sXG5cbiAgICAvLyBSdW5zIHRoZSB2YWxpZGF0aW9ucyB3aXRoIHN1cHBvcnQgZm9yIHByb21pc2VzLlxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gYSBwcm9taXNlIHRoYXQgaXMgc2V0dGxlZCB3aGVuIGFsbCB0aGVcbiAgICAvLyB2YWxpZGF0aW9uIHByb21pc2VzIGhhdmUgYmVlbiBjb21wbGV0ZWQuXG4gICAgLy8gSXQgY2FuIGJlIGNhbGxlZCBldmVuIGlmIG5vIHZhbGlkYXRpb25zIHJldHVybmVkIGEgcHJvbWlzZS5cbiAgICBhc3luYzogZnVuY3Rpb24oYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5hc3luYy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIFdyYXBFcnJvcnMgPSBvcHRpb25zLndyYXBFcnJvcnMgfHwgZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICAgIHJldHVybiBlcnJvcnM7XG4gICAgICB9O1xuXG4gICAgICAvLyBSZW1vdmVzIHVua25vd24gYXR0cmlidXRlc1xuICAgICAgaWYgKG9wdGlvbnMuY2xlYW5BdHRyaWJ1dGVzICE9PSBmYWxzZSkge1xuICAgICAgICBhdHRyaWJ1dGVzID0gdi5jbGVhbkF0dHJpYnV0ZXMoYXR0cmlidXRlcywgY29uc3RyYWludHMpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVzdWx0cyA9IHYucnVuVmFsaWRhdGlvbnMoYXR0cmlidXRlcywgY29uc3RyYWludHMsIG9wdGlvbnMpO1xuXG4gICAgICByZXR1cm4gbmV3IHYuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdi53YWl0Rm9yUmVzdWx0cyhyZXN1bHRzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBlcnJvcnMgPSB2LnByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0cyhyZXN1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgICBpZiAoZXJyb3JzKSB7XG4gICAgICAgICAgICByZWplY3QobmV3IFdyYXBFcnJvcnMoZXJyb3JzLCBvcHRpb25zLCBhdHRyaWJ1dGVzLCBjb25zdHJhaW50cykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKGF0dHJpYnV0ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNpbmdsZTogZnVuY3Rpb24odmFsdWUsIGNvbnN0cmFpbnRzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHYuc2luZ2xlLm9wdGlvbnMsIG9wdGlvbnMsIHtcbiAgICAgICAgZm9ybWF0OiBcImZsYXRcIixcbiAgICAgICAgZnVsbE1lc3NhZ2VzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdih7c2luZ2xlOiB2YWx1ZX0sIHtzaW5nbGU6IGNvbnN0cmFpbnRzfSwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiBhbGwgcHJvbWlzZXMgaW4gdGhlIHJlc3VsdHMgYXJyYXlcbiAgICAvLyBhcmUgc2V0dGxlZC4gVGhlIHByb21pc2UgcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIGlzIGFsd2F5cyByZXNvbHZlZCxcbiAgICAvLyBuZXZlciByZWplY3RlZC5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIG1vZGlmaWVzIHRoZSBpbnB1dCBhcmd1bWVudCwgaXQgcmVwbGFjZXMgdGhlIHByb21pc2VzXG4gICAgLy8gd2l0aCB0aGUgdmFsdWUgcmV0dXJuZWQgZnJvbSB0aGUgcHJvbWlzZS5cbiAgICB3YWl0Rm9yUmVzdWx0czogZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgLy8gQ3JlYXRlIGEgc2VxdWVuY2Ugb2YgYWxsIHRoZSByZXN1bHRzIHN0YXJ0aW5nIHdpdGggYSByZXNvbHZlZCBwcm9taXNlLlxuICAgICAgcmV0dXJuIHJlc3VsdHMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHJlc3VsdCkge1xuICAgICAgICAvLyBJZiB0aGlzIHJlc3VsdCBpc24ndCBhIHByb21pc2Ugc2tpcCBpdCBpbiB0aGUgc2VxdWVuY2UuXG4gICAgICAgIGlmICghdi5pc1Byb21pc2UocmVzdWx0LmVycm9yKSkge1xuICAgICAgICAgIHJldHVybiBtZW1vO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lbW8udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmVycm9yLnRoZW4oZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IGVycm9yIHx8IG51bGw7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgbmV3IHYuUHJvbWlzZShmdW5jdGlvbihyKSB7IHIoKTsgfSkpOyAvLyBBIHJlc29sdmVkIHByb21pc2VcbiAgICB9LFxuXG4gICAgLy8gSWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgY2FsbDogZnVuY3Rpb24gdGhlIGFuZDogZnVuY3Rpb24gcmV0dXJuIHRoZSB2YWx1ZVxuICAgIC8vIG90aGVyd2lzZSBqdXN0IHJldHVybiB0aGUgdmFsdWUuIEFkZGl0aW9uYWwgYXJndW1lbnRzIHdpbGwgYmUgcGFzc2VkIGFzXG4gICAgLy8gYXJndW1lbnRzIHRvIHRoZSBmdW5jdGlvbi5cbiAgICAvLyBFeGFtcGxlOlxuICAgIC8vIGBgYFxuICAgIC8vIHJlc3VsdCgnZm9vJykgLy8gJ2ZvbydcbiAgICAvLyByZXN1bHQoTWF0aC5tYXgsIDEsIDIpIC8vIDJcbiAgICAvLyBgYGBcbiAgICByZXN1bHQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBhIG51bWJlci4gVGhpcyBmdW5jdGlvbiBkb2VzIG5vdCBjb25zaWRlciBOYU4gYVxuICAgIC8vIG51bWJlciBsaWtlIG1hbnkgb3RoZXIgYGlzTnVtYmVyYCBmdW5jdGlvbnMgZG8uXG4gICAgaXNOdW1iZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpO1xuICAgIH0sXG5cbiAgICAvLyBSZXR1cm5zIGZhbHNlIGlmIHRoZSBvYmplY3QgaXMgbm90IGEgZnVuY3Rpb25cbiAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9LFxuXG4gICAgLy8gQSBzaW1wbGUgY2hlY2sgdG8gdmVyaWZ5IHRoYXQgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIuIFVzZXMgYGlzTnVtYmVyYFxuICAgIC8vIGFuZCBhIHNpbXBsZSBtb2R1bG8gY2hlY2suXG4gICAgaXNJbnRlZ2VyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHYuaXNOdW1iZXIodmFsdWUpICYmIHZhbHVlICUgMSA9PT0gMDtcbiAgICB9LFxuXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBhIGJvb2xlYW5cbiAgICBpc0Jvb2xlYW46IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbic7XG4gICAgfSxcblxuICAgIC8vIFVzZXMgdGhlIGBPYmplY3RgIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhbiBvYmplY3QuXG4gICAgaXNPYmplY3Q6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gICAgfSxcblxuICAgIC8vIFNpbXBseSBjaGVja3MgaWYgdGhlIG9iamVjdCBpcyBhbiBpbnN0YW5jZSBvZiBhIGRhdGVcbiAgICBpc0RhdGU6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIERhdGU7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgZmFsc2UgaWYgdGhlIG9iamVjdCBpcyBgbnVsbGAgb2YgYHVuZGVmaW5lZGBcbiAgICBpc0RlZmluZWQ6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiBvYmogIT09IHVuZGVmaW5lZDtcbiAgICB9LFxuXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIHByb21pc2UuIEFueXRoaW5nIHdpdGggYSBgdGhlbmBcbiAgICAvLyBmdW5jdGlvbiBpcyBjb25zaWRlcmVkIGEgcHJvbWlzZS5cbiAgICBpc1Byb21pc2U6IGZ1bmN0aW9uKHApIHtcbiAgICAgIHJldHVybiAhIXAgJiYgdi5pc0Z1bmN0aW9uKHAudGhlbik7XG4gICAgfSxcblxuICAgIGlzSnF1ZXJ5RWxlbWVudDogZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8gJiYgdi5pc1N0cmluZyhvLmpxdWVyeSk7XG4gICAgfSxcblxuICAgIGlzRG9tRWxlbWVudDogZnVuY3Rpb24obykge1xuICAgICAgaWYgKCFvKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFvLnF1ZXJ5U2VsZWN0b3JBbGwgfHwgIW8ucXVlcnlTZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzT2JqZWN0KGRvY3VtZW50KSAmJiBvID09PSBkb2N1bWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzg0MzgwLzY5OTMwNFxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICh0eXBlb2YgSFRNTEVsZW1lbnQgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvICYmXG4gICAgICAgICAgdHlwZW9mIG8gPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICBvICE9PSBudWxsICYmXG4gICAgICAgICAgby5ub2RlVHlwZSA9PT0gMSAmJlxuICAgICAgICAgIHR5cGVvZiBvLm5vZGVOYW1lID09PSBcInN0cmluZ1wiO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpc0VtcHR5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGF0dHI7XG5cbiAgICAgIC8vIE51bGwgYW5kIHVuZGVmaW5lZCBhcmUgZW1wdHlcbiAgICAgIGlmICghdi5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBmdW5jdGlvbnMgYXJlIG5vbiBlbXB0eVxuICAgICAgaWYgKHYuaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBXaGl0ZXNwYWNlIG9ubHkgc3RyaW5ncyBhcmUgZW1wdHlcbiAgICAgIGlmICh2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdi5FTVBUWV9TVFJJTkdfUkVHRVhQLnRlc3QodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3IgYXJyYXlzIHdlIHVzZSB0aGUgbGVuZ3RoIHByb3BlcnR5XG4gICAgICBpZiAodi5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID09PSAwO1xuICAgICAgfVxuXG4gICAgICAvLyBEYXRlcyBoYXZlIG5vIGF0dHJpYnV0ZXMgYnV0IGFyZW4ndCBlbXB0eVxuICAgICAgaWYgKHYuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHdlIGZpbmQgYXQgbGVhc3Qgb25lIHByb3BlcnR5IHdlIGNvbnNpZGVyIGl0IG5vbiBlbXB0eVxuICAgICAgaWYgKHYuaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIGZvciAoYXR0ciBpbiB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyBGb3JtYXRzIHRoZSBzcGVjaWZpZWQgc3RyaW5ncyB3aXRoIHRoZSBnaXZlbiB2YWx1ZXMgbGlrZSBzbzpcbiAgICAvLyBgYGBcbiAgICAvLyBmb3JtYXQoXCJGb286ICV7Zm9vfVwiLCB7Zm9vOiBcImJhclwifSkgLy8gXCJGb28gYmFyXCJcbiAgICAvLyBgYGBcbiAgICAvLyBJZiB5b3Ugd2FudCB0byB3cml0ZSAley4uLn0gd2l0aG91dCBoYXZpbmcgaXQgcmVwbGFjZWQgc2ltcGx5XG4gICAgLy8gcHJlZml4IGl0IHdpdGggJSBsaWtlIHRoaXMgYEZvbzogJSV7Zm9vfWAgYW5kIGl0IHdpbGwgYmUgcmV0dXJuZWRcbiAgICAvLyBhcyBgXCJGb286ICV7Zm9vfVwiYFxuICAgIGZvcm1hdDogdi5leHRlbmQoZnVuY3Rpb24oc3RyLCB2YWxzKSB7XG4gICAgICBpZiAoIXYuaXNTdHJpbmcoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHYuZm9ybWF0LkZPUk1BVF9SRUdFWFAsIGZ1bmN0aW9uKG0wLCBtMSwgbTIpIHtcbiAgICAgICAgaWYgKG0xID09PSAnJScpIHtcbiAgICAgICAgICByZXR1cm4gXCIle1wiICsgbTIgKyBcIn1cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHNbbTJdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSwge1xuICAgICAgLy8gRmluZHMgJXtrZXl9IHN0eWxlIHBhdHRlcm5zIGluIHRoZSBnaXZlbiBzdHJpbmdcbiAgICAgIEZPUk1BVF9SRUdFWFA6IC8oJT8pJVxceyhbXlxcfV0rKVxcfS9nXG4gICAgfSksXG5cbiAgICAvLyBcIlByZXR0aWZpZXNcIiB0aGUgZ2l2ZW4gc3RyaW5nLlxuICAgIC8vIFByZXR0aWZ5aW5nIG1lYW5zIHJlcGxhY2luZyBbLlxcXy1dIHdpdGggc3BhY2VzIGFzIHdlbGwgYXMgc3BsaXR0aW5nXG4gICAgLy8gY2FtZWwgY2FzZSB3b3Jkcy5cbiAgICBwcmV0dGlmeTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAodi5pc051bWJlcihzdHIpKSB7XG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBtb3JlIHRoYW4gMiBkZWNpbWFscyByb3VuZCBpdCB0byB0d29cbiAgICAgICAgaWYgKChzdHIgKiAxMDApICUgMSA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBcIlwiICsgc3RyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KE1hdGgucm91bmQoc3RyICogMTAwKSAvIDEwMCkudG9GaXhlZCgyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodi5pc0FycmF5KHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5tYXAoZnVuY3Rpb24ocykgeyByZXR1cm4gdi5wcmV0dGlmeShzKTsgfSkuam9pbihcIiwgXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc09iamVjdChzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHIudG9TdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAgLy8gRW5zdXJlIHRoZSBzdHJpbmcgaXMgYWN0dWFsbHkgYSBzdHJpbmdcbiAgICAgIHN0ciA9IFwiXCIgKyBzdHI7XG5cbiAgICAgIHJldHVybiBzdHJcbiAgICAgICAgLy8gU3BsaXRzIGtleXMgc2VwYXJhdGVkIGJ5IHBlcmlvZHNcbiAgICAgICAgLnJlcGxhY2UoLyhbXlxcc10pXFwuKFteXFxzXSkvZywgJyQxICQyJylcbiAgICAgICAgLy8gUmVtb3ZlcyBiYWNrc2xhc2hlc1xuICAgICAgICAucmVwbGFjZSgvXFxcXCsvZywgJycpXG4gICAgICAgIC8vIFJlcGxhY2VzIC0gYW5kIC0gd2l0aCBzcGFjZVxuICAgICAgICAucmVwbGFjZSgvW18tXS9nLCAnICcpXG4gICAgICAgIC8vIFNwbGl0cyBjYW1lbCBjYXNlZCB3b3Jkc1xuICAgICAgICAucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgZnVuY3Rpb24obTAsIG0xLCBtMikge1xuICAgICAgICAgIHJldHVybiBcIlwiICsgbTEgKyBcIiBcIiArIG0yLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICAgIH0sXG5cbiAgICBzdHJpbmdpZnlWYWx1ZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBwcmV0dGlmeSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5wcmV0dGlmeSB8fCB2LnByZXR0aWZ5O1xuICAgICAgcmV0dXJuIHByZXR0aWZ5KHZhbHVlKTtcbiAgICB9LFxuXG4gICAgaXNTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbiAgICB9LFxuXG4gICAgaXNBcnJheTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB7fS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9LFxuXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSBvYmplY3QgaXMgYSBoYXNoLCB3aGljaCBpcyBlcXVpdmFsZW50IHRvIGFuIG9iamVjdCB0aGF0XG4gICAgLy8gaXMgbmVpdGhlciBhbiBhcnJheSBub3IgYSBmdW5jdGlvbi5cbiAgICBpc0hhc2g6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5pc09iamVjdCh2YWx1ZSkgJiYgIXYuaXNBcnJheSh2YWx1ZSkgJiYgIXYuaXNGdW5jdGlvbih2YWx1ZSk7XG4gICAgfSxcblxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihvYmosIHZhbHVlKSB7XG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvYmopKSB7XG4gICAgICAgIHJldHVybiBvYmouaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlIGluIG9iajtcbiAgICB9LFxuXG4gICAgdW5pcXVlOiBmdW5jdGlvbihhcnJheSkge1xuICAgICAgaWYgKCF2LmlzQXJyYXkoYXJyYXkpKSB7XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24oZWwsIGluZGV4LCBhcnJheSkge1xuICAgICAgICByZXR1cm4gYXJyYXkuaW5kZXhPZihlbCkgPT0gaW5kZXg7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgZm9yRWFjaEtleUluS2V5cGF0aDogZnVuY3Rpb24ob2JqZWN0LCBrZXlwYXRoLCBjYWxsYmFjaykge1xuICAgICAgaWYgKCF2LmlzU3RyaW5nKGtleXBhdGgpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBrZXkgPSBcIlwiXG4gICAgICAgICwgaVxuICAgICAgICAsIGVzY2FwZSA9IGZhbHNlO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cGF0aC5sZW5ndGg7ICsraSkge1xuICAgICAgICBzd2l0Y2ggKGtleXBhdGhbaV0pIHtcbiAgICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnLic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvYmplY3QgPSBjYWxsYmFjayhvYmplY3QsIGtleSwgZmFsc2UpO1xuICAgICAgICAgICAgICBrZXkgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdcXFxcJzpcbiAgICAgICAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGtleSArPSAnXFxcXCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlc2NhcGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZXNjYXBlID0gZmFsc2U7XG4gICAgICAgICAgICBrZXkgKz0ga2V5cGF0aFtpXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjYWxsYmFjayhvYmplY3QsIGtleSwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIGdldERlZXBPYmplY3RWYWx1ZTogZnVuY3Rpb24ob2JqLCBrZXlwYXRoKSB7XG4gICAgICBpZiAoIXYuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdi5mb3JFYWNoS2V5SW5LZXlwYXRoKG9iaiwga2V5cGF0aCwgZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICAgICAgaWYgKHYuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIFRoaXMgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHZhbHVlcyBvZiB0aGUgZm9ybS5cbiAgICAvLyBJdCB1c2VzIHRoZSBpbnB1dCBuYW1lIGFzIGtleSBhbmQgdGhlIHZhbHVlIGFzIHZhbHVlXG4gICAgLy8gU28gZm9yIGV4YW1wbGUgdGhpczpcbiAgICAvLyA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZW1haWxcIiB2YWx1ZT1cImZvb0BiYXIuY29tXCIgLz5cbiAgICAvLyB3b3VsZCByZXR1cm46XG4gICAgLy8ge2VtYWlsOiBcImZvb0BiYXIuY29tXCJ9XG4gICAgY29sbGVjdEZvcm1WYWx1ZXM6IGZ1bmN0aW9uKGZvcm0sIG9wdGlvbnMpIHtcbiAgICAgIHZhciB2YWx1ZXMgPSB7fVxuICAgICAgICAsIGlcbiAgICAgICAgLCBqXG4gICAgICAgICwgaW5wdXRcbiAgICAgICAgLCBpbnB1dHNcbiAgICAgICAgLCBvcHRpb25cbiAgICAgICAgLCB2YWx1ZTtcblxuICAgICAgaWYgKHYuaXNKcXVlcnlFbGVtZW50KGZvcm0pKSB7XG4gICAgICAgIGZvcm0gPSBmb3JtWzBdO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWZvcm0pIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0W25hbWVdLCB0ZXh0YXJlYVtuYW1lXVwiKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5wdXQgPSBpbnB1dHMuaXRlbShpKTtcblxuICAgICAgICBpZiAodi5pc0RlZmluZWQoaW5wdXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZ25vcmVkXCIpKSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbmFtZSA9IGlucHV0Lm5hbWUucmVwbGFjZSgvXFwuL2csIFwiXFxcXFxcXFwuXCIpO1xuICAgICAgICB2YWx1ZSA9IHYuc2FuaXRpemVGb3JtVmFsdWUoaW5wdXQudmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUgPyArdmFsdWUgOiBudWxsO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnR5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgICAgICAgIGlmIChpbnB1dC5hdHRyaWJ1dGVzLnZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIWlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbbmFtZV0gfHwgbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBpbnB1dC5jaGVja2VkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC50eXBlID09PSBcInJhZGlvXCIpIHtcbiAgICAgICAgICBpZiAoIWlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzW25hbWVdIHx8IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhbHVlc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzZWxlY3RbbmFtZV1cIik7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlucHV0ID0gaW5wdXRzLml0ZW0oaSk7XG4gICAgICAgIGlmICh2LmlzRGVmaW5lZChpbnB1dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlnbm9yZWRcIikpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5wdXQubXVsdGlwbGUpIHtcbiAgICAgICAgICB2YWx1ZSA9IFtdO1xuICAgICAgICAgIGZvciAoaiBpbiBpbnB1dC5vcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb24gPSBpbnB1dC5vcHRpb25zW2pdO1xuICAgICAgICAgICAgIGlmIChvcHRpb24gJiYgb3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgIHZhbHVlLnB1c2godi5zYW5pdGl6ZUZvcm1WYWx1ZShvcHRpb24udmFsdWUsIG9wdGlvbnMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIF92YWwgPSB0eXBlb2YgaW5wdXQub3B0aW9uc1tpbnB1dC5zZWxlY3RlZEluZGV4XSAhPT0gJ3VuZGVmaW5lZCcgPyBpbnB1dC5vcHRpb25zW2lucHV0LnNlbGVjdGVkSW5kZXhdLnZhbHVlIDogJyc7XG4gICAgICAgICAgdmFsdWUgPSB2LnNhbml0aXplRm9ybVZhbHVlKF92YWwsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlc1tpbnB1dC5uYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH0sXG5cbiAgICBzYW5pdGl6ZUZvcm1WYWx1ZTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zLnRyaW0gJiYgdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm51bGxpZnkgIT09IGZhbHNlICYmIHZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBjYXBpdGFsaXplOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGlmICghdi5pc1N0cmluZyhzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RyWzBdLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG4gICAgfSxcblxuICAgIC8vIFJlbW92ZSBhbGwgZXJyb3JzIHdobydzIGVycm9yIGF0dHJpYnV0ZSBpcyBlbXB0eSAobnVsbCBvciB1bmRlZmluZWQpXG4gICAgcHJ1bmVFbXB0eUVycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICByZXR1cm4gZXJyb3JzLmZpbHRlcihmdW5jdGlvbihlcnJvcikge1xuICAgICAgICByZXR1cm4gIXYuaXNFbXB0eShlcnJvci5lcnJvcik7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8gSW5cbiAgICAvLyBbe2Vycm9yOiBbXCJlcnIxXCIsIFwiZXJyMlwiXSwgLi4ufV1cbiAgICAvLyBPdXRcbiAgICAvLyBbe2Vycm9yOiBcImVycjFcIiwgLi4ufSwge2Vycm9yOiBcImVycjJcIiwgLi4ufV1cbiAgICAvL1xuICAgIC8vIEFsbCBhdHRyaWJ1dGVzIGluIGFuIGVycm9yIHdpdGggbXVsdGlwbGUgbWVzc2FnZXMgYXJlIGR1cGxpY2F0ZWRcbiAgICAvLyB3aGVuIGV4cGFuZGluZyB0aGUgZXJyb3JzLlxuICAgIGV4cGFuZE11bHRpcGxlRXJyb3JzOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHZhciByZXQgPSBbXTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIC8vIFJlbW92ZXMgZXJyb3JzIHdpdGhvdXQgYSBtZXNzYWdlXG4gICAgICAgIGlmICh2LmlzQXJyYXkoZXJyb3IuZXJyb3IpKSB7XG4gICAgICAgICAgZXJyb3IuZXJyb3IuZm9yRWFjaChmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgIHJldC5wdXNoKHYuZXh0ZW5kKHt9LCBlcnJvciwge2Vycm9yOiBtc2d9KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0LnB1c2goZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnRzIHRoZSBlcnJvciBtZXNhZ2VzIGJ5IHByZXBlbmRpbmcgdGhlIGF0dHJpYnV0ZSBuYW1lIHVubGVzcyB0aGVcbiAgICAvLyBtZXNzYWdlIGlzIHByZWZpeGVkIGJ5IF5cbiAgICBjb252ZXJ0RXJyb3JNZXNzYWdlczogZnVuY3Rpb24oZXJyb3JzLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdmFyIHJldCA9IFtdXG4gICAgICAgICwgcHJldHRpZnkgPSBvcHRpb25zLnByZXR0aWZ5IHx8IHYucHJldHRpZnk7XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvckluZm8pIHtcbiAgICAgICAgdmFyIGVycm9yID0gdi5yZXN1bHQoZXJyb3JJbmZvLmVycm9yLFxuICAgICAgICAgICAgZXJyb3JJbmZvLnZhbHVlLFxuICAgICAgICAgICAgZXJyb3JJbmZvLmF0dHJpYnV0ZSxcbiAgICAgICAgICAgIGVycm9ySW5mby5vcHRpb25zLFxuICAgICAgICAgICAgZXJyb3JJbmZvLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgICBlcnJvckluZm8uZ2xvYmFsT3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKCF2LmlzU3RyaW5nKGVycm9yKSkge1xuICAgICAgICAgIHJldC5wdXNoKGVycm9ySW5mbyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yWzBdID09PSAnXicpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yLnNsaWNlKDEpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZnVsbE1lc3NhZ2VzICE9PSBmYWxzZSkge1xuICAgICAgICAgIGVycm9yID0gdi5jYXBpdGFsaXplKHByZXR0aWZ5KGVycm9ySW5mby5hdHRyaWJ1dGUpKSArIFwiIFwiICsgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgZXJyb3IgPSBlcnJvci5yZXBsYWNlKC9cXFxcXFxeL2csIFwiXlwiKTtcbiAgICAgICAgZXJyb3IgPSB2LmZvcm1hdChlcnJvciwge1xuICAgICAgICAgIHZhbHVlOiB2LnN0cmluZ2lmeVZhbHVlKGVycm9ySW5mby52YWx1ZSwgb3B0aW9ucylcbiAgICAgICAgfSk7XG4gICAgICAgIHJldC5wdXNoKHYuZXh0ZW5kKHt9LCBlcnJvckluZm8sIHtlcnJvcjogZXJyb3J9KSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8vIEluOlxuICAgIC8vIFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGVOYW1lPlwiLCAuLi59XVxuICAgIC8vIE91dDpcbiAgICAvLyB7XCI8YXR0cmlidXRlTmFtZT5cIjogW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZU5hbWU+XCIsIC4uLn1dfVxuICAgIGdyb3VwRXJyb3JzQnlBdHRyaWJ1dGU6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgdmFyIHJldCA9IHt9O1xuICAgICAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgdmFyIGxpc3QgPSByZXRbZXJyb3IuYXR0cmlidXRlXTtcbiAgICAgICAgaWYgKGxpc3QpIHtcbiAgICAgICAgICBsaXN0LnB1c2goZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldFtlcnJvci5hdHRyaWJ1dGVdID0gW2Vycm9yXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvLyBJbjpcbiAgICAvLyBbe2Vycm9yOiBcIjxtZXNzYWdlIDE+XCIsIC4uLn0sIHtlcnJvcjogXCI8bWVzc2FnZSAyPlwiLCAuLi59XVxuICAgIC8vIE91dDpcbiAgICAvLyBbXCI8bWVzc2FnZSAxPlwiLCBcIjxtZXNzYWdlIDI+XCJdXG4gICAgZmxhdHRlbkVycm9yc1RvQXJyYXk6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgcmV0dXJuIGVycm9yc1xuICAgICAgICAubWFwKGZ1bmN0aW9uKGVycm9yKSB7IHJldHVybiBlcnJvci5lcnJvcjsgfSlcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIHNlbGYpIHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaW5kZXg7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjbGVhbkF0dHJpYnV0ZXM6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMsIHdoaXRlbGlzdCkge1xuICAgICAgZnVuY3Rpb24gd2hpdGVsaXN0Q3JlYXRvcihvYmosIGtleSwgbGFzdCkge1xuICAgICAgICBpZiAodi5pc09iamVjdChvYmpba2V5XSkpIHtcbiAgICAgICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChvYmpba2V5XSA9IGxhc3QgPyB0cnVlIDoge30pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBidWlsZE9iamVjdFdoaXRlbGlzdCh3aGl0ZWxpc3QpIHtcbiAgICAgICAgdmFyIG93ID0ge31cbiAgICAgICAgICAsIGxhc3RPYmplY3RcbiAgICAgICAgICAsIGF0dHI7XG4gICAgICAgIGZvciAoYXR0ciBpbiB3aGl0ZWxpc3QpIHtcbiAgICAgICAgICBpZiAoIXdoaXRlbGlzdFthdHRyXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHYuZm9yRWFjaEtleUluS2V5cGF0aChvdywgYXR0ciwgd2hpdGVsaXN0Q3JlYXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG93O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjbGVhblJlY3Vyc2l2ZShhdHRyaWJ1dGVzLCB3aGl0ZWxpc3QpIHtcbiAgICAgICAgaWYgKCF2LmlzT2JqZWN0KGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmV0ID0gdi5leHRlbmQoe30sIGF0dHJpYnV0ZXMpXG4gICAgICAgICAgLCB3XG4gICAgICAgICAgLCBhdHRyaWJ1dGU7XG5cbiAgICAgICAgZm9yIChhdHRyaWJ1dGUgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgIHcgPSB3aGl0ZWxpc3RbYXR0cmlidXRlXTtcblxuICAgICAgICAgIGlmICh2LmlzT2JqZWN0KHcpKSB7XG4gICAgICAgICAgICByZXRbYXR0cmlidXRlXSA9IGNsZWFuUmVjdXJzaXZlKHJldFthdHRyaWJ1dGVdLCB3KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCF3KSB7XG4gICAgICAgICAgICBkZWxldGUgcmV0W2F0dHJpYnV0ZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghdi5pc09iamVjdCh3aGl0ZWxpc3QpIHx8ICF2LmlzT2JqZWN0KGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cblxuICAgICAgd2hpdGVsaXN0ID0gYnVpbGRPYmplY3RXaGl0ZWxpc3Qod2hpdGVsaXN0KTtcbiAgICAgIHJldHVybiBjbGVhblJlY3Vyc2l2ZShhdHRyaWJ1dGVzLCB3aGl0ZWxpc3QpO1xuICAgIH0sXG5cbiAgICBleHBvc2VNb2R1bGU6IGZ1bmN0aW9uKHZhbGlkYXRlLCByb290LCBleHBvcnRzLCBtb2R1bGUsIGRlZmluZSkge1xuICAgICAgaWYgKGV4cG9ydHMpIHtcbiAgICAgICAgaWYgKG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHZhbGlkYXRlO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydHMudmFsaWRhdGUgPSB2YWxpZGF0ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QudmFsaWRhdGUgPSB2YWxpZGF0ZTtcbiAgICAgICAgaWYgKHZhbGlkYXRlLmlzRnVuY3Rpb24oZGVmaW5lKSAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiB2YWxpZGF0ZTsgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgd2FybjogZnVuY3Rpb24obXNnKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIlt2YWxpZGF0ZS5qc10gXCIgKyBtc2cpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBlcnJvcjogZnVuY3Rpb24obXNnKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiW3ZhbGlkYXRlLmpzXSBcIiArIG1zZyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB2YWxpZGF0ZS52YWxpZGF0b3JzID0ge1xuICAgIC8vIFByZXNlbmNlIHZhbGlkYXRlcyB0aGF0IHRoZSB2YWx1ZSBpc24ndCBlbXB0eVxuICAgIHByZXNlbmNlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKG9wdGlvbnMuYWxsb3dFbXB0eSAhPT0gZmFsc2UgPyAhdi5pc0RlZmluZWQodmFsdWUpIDogdi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImNhbid0IGJlIGJsYW5rXCI7XG4gICAgICB9XG4gICAgfSxcbiAgICBsZW5ndGg6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgYWxsb3dlZFxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBpcyA9IG9wdGlvbnMuaXNcbiAgICAgICAgLCBtYXhpbXVtID0gb3B0aW9ucy5tYXhpbXVtXG4gICAgICAgICwgbWluaW11bSA9IG9wdGlvbnMubWluaW11bVxuICAgICAgICAsIHRva2VuaXplciA9IG9wdGlvbnMudG9rZW5pemVyIHx8IGZ1bmN0aW9uKHZhbCkgeyByZXR1cm4gdmFsOyB9XG4gICAgICAgICwgZXJyXG4gICAgICAgICwgZXJyb3JzID0gW107XG5cbiAgICAgIHZhbHVlID0gdG9rZW5pemVyKHZhbHVlKTtcbiAgICAgIHZhciBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG4gICAgICBpZighdi5pc051bWJlcihsZW5ndGgpKSB7XG4gICAgICAgIHYuZXJyb3Iodi5mb3JtYXQoXCJBdHRyaWJ1dGUgJXthdHRyfSBoYXMgYSBub24gbnVtZXJpYyB2YWx1ZSBmb3IgYGxlbmd0aGBcIiwge2F0dHI6IGF0dHJpYnV0ZX0pKTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm5vdFZhbGlkIHx8IFwiaGFzIGFuIGluY29ycmVjdCBsZW5ndGhcIjtcbiAgICAgIH1cblxuICAgICAgLy8gSXMgY2hlY2tzXG4gICAgICBpZiAodi5pc051bWJlcihpcykgJiYgbGVuZ3RoICE9PSBpcykge1xuICAgICAgICBlcnIgPSBvcHRpb25zLndyb25nTGVuZ3RoIHx8XG4gICAgICAgICAgdGhpcy53cm9uZ0xlbmd0aCB8fFxuICAgICAgICAgIFwiaXMgdGhlIHdyb25nIGxlbmd0aCAoc2hvdWxkIGJlICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBpc30pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNOdW1iZXIobWluaW11bSkgJiYgbGVuZ3RoIDwgbWluaW11bSkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLnRvb1Nob3J0IHx8XG4gICAgICAgICAgdGhpcy50b29TaG9ydCB8fFxuICAgICAgICAgIFwiaXMgdG9vIHNob3J0IChtaW5pbXVtIGlzICV7Y291bnR9IGNoYXJhY3RlcnMpXCI7XG4gICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KGVyciwge2NvdW50OiBtaW5pbXVtfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc051bWJlcihtYXhpbXVtKSAmJiBsZW5ndGggPiBtYXhpbXVtKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMudG9vTG9uZyB8fFxuICAgICAgICAgIHRoaXMudG9vTG9uZyB8fFxuICAgICAgICAgIFwiaXMgdG9vIGxvbmcgKG1heGltdW0gaXMgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IG1heGltdW19KSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LFxuICAgIG51bWVyaWNhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSwgYXR0cmlidXRlcywgZ2xvYmFsT3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGVycm9ycyA9IFtdXG4gICAgICAgICwgbmFtZVxuICAgICAgICAsIGNvdW50XG4gICAgICAgICwgY2hlY2tzID0ge1xuICAgICAgICAgICAgZ3JlYXRlclRoYW46ICAgICAgICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPiBjOyB9LFxuICAgICAgICAgICAgZ3JlYXRlclRoYW5PckVxdWFsVG86IGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPj0gYzsgfSxcbiAgICAgICAgICAgIGVxdWFsVG86ICAgICAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ID09PSBjOyB9LFxuICAgICAgICAgICAgbGVzc1RoYW46ICAgICAgICAgICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPCBjOyB9LFxuICAgICAgICAgICAgbGVzc1RoYW5PckVxdWFsVG86ICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPD0gYzsgfSxcbiAgICAgICAgICAgIGRpdmlzaWJsZUJ5OiAgICAgICAgICBmdW5jdGlvbih2LCBjKSB7IHJldHVybiB2ICUgYyA9PT0gMDsgfVxuICAgICAgICAgIH1cbiAgICAgICAgLCBwcmV0dGlmeSA9IG9wdGlvbnMucHJldHRpZnkgfHxcbiAgICAgICAgICAoZ2xvYmFsT3B0aW9ucyAmJiBnbG9iYWxPcHRpb25zLnByZXR0aWZ5KSB8fFxuICAgICAgICAgIHYucHJldHRpZnk7XG5cbiAgICAgIC8vIFN0cmljdCB3aWxsIGNoZWNrIHRoYXQgaXQgaXMgYSB2YWxpZCBsb29raW5nIG51bWJlclxuICAgICAgaWYgKHYuaXNTdHJpbmcodmFsdWUpICYmIG9wdGlvbnMuc3RyaWN0KSB7XG4gICAgICAgIHZhciBwYXR0ZXJuID0gXCJeLT8oMHxbMS05XVxcXFxkKilcIjtcbiAgICAgICAgaWYgKCFvcHRpb25zLm9ubHlJbnRlZ2VyKSB7XG4gICAgICAgICAgcGF0dGVybiArPSBcIihcXFxcLlxcXFxkKyk/XCI7XG4gICAgICAgIH1cbiAgICAgICAgcGF0dGVybiArPSBcIiRcIjtcblxuICAgICAgICBpZiAoIShuZXcgUmVnRXhwKHBhdHRlcm4pLnRlc3QodmFsdWUpKSkge1xuICAgICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgICAgIG9wdGlvbnMubm90VmFsaWQgfHxcbiAgICAgICAgICAgIHRoaXMubm90VmFsaWQgfHxcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICAgICAgXCJtdXN0IGJlIGEgdmFsaWQgbnVtYmVyXCI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQ29lcmNlIHRoZSB2YWx1ZSB0byBhIG51bWJlciB1bmxlc3Mgd2UncmUgYmVpbmcgc3RyaWN0LlxuICAgICAgaWYgKG9wdGlvbnMubm9TdHJpbmdzICE9PSB0cnVlICYmIHYuaXNTdHJpbmcodmFsdWUpICYmICF2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gK3ZhbHVlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBpdCdzIG5vdCBhIG51bWJlciB3ZSBzaG91bGRuJ3QgY29udGludWUgc2luY2UgaXQgd2lsbCBjb21wYXJlIGl0LlxuICAgICAgaWYgKCF2LmlzTnVtYmVyKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgICAgb3B0aW9ucy5ub3RWYWxpZCB8fFxuICAgICAgICAgIHRoaXMubm90VmFsaWQgfHxcbiAgICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgICBcImlzIG5vdCBhIG51bWJlclwiO1xuICAgICAgfVxuXG4gICAgICAvLyBTYW1lIGxvZ2ljIGFzIGFib3ZlLCBzb3J0IG9mLiBEb24ndCBib3RoZXIgd2l0aCBjb21wYXJpc29ucyBpZiB0aGlzXG4gICAgICAvLyBkb2Vzbid0IHBhc3MuXG4gICAgICBpZiAob3B0aW9ucy5vbmx5SW50ZWdlciAmJiAhdi5pc0ludGVnZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgICBvcHRpb25zLm5vdEludGVnZXIgfHxcbiAgICAgICAgICB0aGlzLm5vdEludGVnZXIgfHxcbiAgICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgICBcIm11c3QgYmUgYW4gaW50ZWdlclwiO1xuICAgICAgfVxuXG4gICAgICBmb3IgKG5hbWUgaW4gY2hlY2tzKSB7XG4gICAgICAgIGNvdW50ID0gb3B0aW9uc1tuYW1lXTtcbiAgICAgICAgaWYgKHYuaXNOdW1iZXIoY291bnQpICYmICFjaGVja3NbbmFtZV0odmFsdWUsIGNvdW50KSkge1xuICAgICAgICAgIC8vIFRoaXMgcGlja3MgdGhlIGRlZmF1bHQgbWVzc2FnZSBpZiBzcGVjaWZpZWRcbiAgICAgICAgICAvLyBGb3IgZXhhbXBsZSB0aGUgZ3JlYXRlclRoYW4gY2hlY2sgdXNlcyB0aGUgbWVzc2FnZSBmcm9tXG4gICAgICAgICAgLy8gdGhpcy5ub3RHcmVhdGVyVGhhbiBzbyB3ZSBjYXBpdGFsaXplIHRoZSBuYW1lIGFuZCBwcmVwZW5kIFwibm90XCJcbiAgICAgICAgICB2YXIga2V5ID0gXCJub3RcIiArIHYuY2FwaXRhbGl6ZShuYW1lKTtcbiAgICAgICAgICB2YXIgbXNnID0gb3B0aW9uc1trZXldIHx8XG4gICAgICAgICAgICB0aGlzW2tleV0gfHxcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICAgICAgXCJtdXN0IGJlICV7dHlwZX0gJXtjb3VudH1cIjtcblxuICAgICAgICAgIGVycm9ycy5wdXNoKHYuZm9ybWF0KG1zZywge1xuICAgICAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgICAgICAgdHlwZTogcHJldHRpZnkobmFtZSlcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMub2RkICYmIHZhbHVlICUgMiAhPT0gMSkge1xuICAgICAgICBlcnJvcnMucHVzaChvcHRpb25zLm5vdE9kZCB8fFxuICAgICAgICAgICAgdGhpcy5ub3RPZGQgfHxcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICAgICAgXCJtdXN0IGJlIG9kZFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLmV2ZW4gJiYgdmFsdWUgJSAyICE9PSAwKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKG9wdGlvbnMubm90RXZlbiB8fFxuICAgICAgICAgICAgdGhpcy5ub3RFdmVuIHx8XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgICAgIFwibXVzdCBiZSBldmVuXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IGVycm9ycztcbiAgICAgIH1cbiAgICB9LFxuICAgIGRhdGV0aW1lOiB2LmV4dGVuZChmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKCF2LmlzRnVuY3Rpb24odGhpcy5wYXJzZSkgfHwgIXYuaXNGdW5jdGlvbih0aGlzLmZvcm1hdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQm90aCB0aGUgcGFyc2UgYW5kIGZvcm1hdCBmdW5jdGlvbnMgbmVlZHMgdG8gYmUgc2V0IHRvIHVzZSB0aGUgZGF0ZXRpbWUvZGF0ZSB2YWxpZGF0b3JcIik7XG4gICAgICB9XG5cbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBlcnJcbiAgICAgICAgLCBlcnJvcnMgPSBbXVxuICAgICAgICAsIGVhcmxpZXN0ID0gb3B0aW9ucy5lYXJsaWVzdCA/IHRoaXMucGFyc2Uob3B0aW9ucy5lYXJsaWVzdCwgb3B0aW9ucykgOiBOYU5cbiAgICAgICAgLCBsYXRlc3QgPSBvcHRpb25zLmxhdGVzdCA/IHRoaXMucGFyc2Uob3B0aW9ucy5sYXRlc3QsIG9wdGlvbnMpIDogTmFOO1xuXG4gICAgICB2YWx1ZSA9IHRoaXMucGFyc2UodmFsdWUsIG9wdGlvbnMpO1xuXG4gICAgICAvLyA4NjQwMDAwMCBpcyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpbiBhIGRheSwgdGhpcyBpcyB1c2VkIHRvIHJlbW92ZVxuICAgICAgLy8gdGhlIHRpbWUgZnJvbSB0aGUgZGF0ZVxuICAgICAgaWYgKGlzTmFOKHZhbHVlKSB8fCBvcHRpb25zLmRhdGVPbmx5ICYmIHZhbHVlICUgODY0MDAwMDAgIT09IDApIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy5ub3RWYWxpZCB8fFxuICAgICAgICAgIG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICAgIHRoaXMubm90VmFsaWQgfHxcbiAgICAgICAgICBcIm11c3QgYmUgYSB2YWxpZCBkYXRlXCI7XG4gICAgICAgIHJldHVybiB2LmZvcm1hdChlcnIsIHt2YWx1ZTogYXJndW1lbnRzWzBdfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oZWFybGllc3QpICYmIHZhbHVlIDwgZWFybGllc3QpIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy50b29FYXJseSB8fFxuICAgICAgICAgIG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICAgIHRoaXMudG9vRWFybHkgfHxcbiAgICAgICAgICBcIm11c3QgYmUgbm8gZWFybGllciB0aGFuICV7ZGF0ZX1cIjtcbiAgICAgICAgZXJyID0gdi5mb3JtYXQoZXJyLCB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMuZm9ybWF0KHZhbHVlLCBvcHRpb25zKSxcbiAgICAgICAgICBkYXRlOiB0aGlzLmZvcm1hdChlYXJsaWVzdCwgb3B0aW9ucylcbiAgICAgICAgfSk7XG4gICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4obGF0ZXN0KSAmJiB2YWx1ZSA+IGxhdGVzdCkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLnRvb0xhdGUgfHxcbiAgICAgICAgICBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgICB0aGlzLnRvb0xhdGUgfHxcbiAgICAgICAgICBcIm11c3QgYmUgbm8gbGF0ZXIgdGhhbiAle2RhdGV9XCI7XG4gICAgICAgIGVyciA9IHYuZm9ybWF0KGVyciwge1xuICAgICAgICAgIGRhdGU6IHRoaXMuZm9ybWF0KGxhdGVzdCwgb3B0aW9ucyksXG4gICAgICAgICAgdmFsdWU6IHRoaXMuZm9ybWF0KHZhbHVlLCBvcHRpb25zKVxuICAgICAgICB9KTtcbiAgICAgICAgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHYudW5pcXVlKGVycm9ycyk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgcGFyc2U6IG51bGwsXG4gICAgICBmb3JtYXQ6IG51bGxcbiAgICB9KSxcbiAgICBkYXRlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCBvcHRpb25zLCB7ZGF0ZU9ubHk6IHRydWV9KTtcbiAgICAgIHJldHVybiB2LnZhbGlkYXRvcnMuZGF0ZXRpbWUuY2FsbCh2LnZhbGlkYXRvcnMuZGF0ZXRpbWUsIHZhbHVlLCBvcHRpb25zKTtcbiAgICB9LFxuICAgIGZvcm1hdDogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIGlmICh2LmlzU3RyaW5nKG9wdGlvbnMpIHx8IChvcHRpb25zIGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICBvcHRpb25zID0ge3BhdHRlcm46IG9wdGlvbnN9O1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImlzIGludmFsaWRcIlxuICAgICAgICAsIHBhdHRlcm4gPSBvcHRpb25zLnBhdHRlcm5cbiAgICAgICAgLCBtYXRjaDtcblxuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBhbGxvd2VkXG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc1N0cmluZyhwYXR0ZXJuKSkge1xuICAgICAgICBwYXR0ZXJuID0gbmV3IFJlZ0V4cChvcHRpb25zLnBhdHRlcm4sIG9wdGlvbnMuZmxhZ3MpO1xuICAgICAgfVxuICAgICAgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWModmFsdWUpO1xuICAgICAgaWYgKCFtYXRjaCB8fCBtYXRjaFswXS5sZW5ndGggIT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5jbHVzaW9uOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7d2l0aGluOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICh2LmNvbnRhaW5zKG9wdGlvbnMud2l0aGluLCB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgIFwiXiV7dmFsdWV9IGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgbGlzdFwiO1xuICAgICAgcmV0dXJuIHYuZm9ybWF0KG1lc3NhZ2UsIHt2YWx1ZTogdmFsdWV9KTtcbiAgICB9LFxuICAgIGV4Y2x1c2lvbjogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHYuaXNBcnJheShvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge3dpdGhpbjogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAoIXYuY29udGFpbnMob3B0aW9ucy53aXRoaW4sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJeJXt2YWx1ZX0gaXMgcmVzdHJpY3RlZFwiO1xuICAgICAgcmV0dXJuIHYuZm9ybWF0KG1lc3NhZ2UsIHt2YWx1ZTogdmFsdWV9KTtcbiAgICB9LFxuICAgIGVtYWlsOiB2LmV4dGVuZChmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiaXMgbm90IGEgdmFsaWQgZW1haWxcIjtcbiAgICAgIC8vIEVtcHR5IHZhbHVlcyBhcmUgZmluZVxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5QQVRURVJOLmV4ZWModmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIFBBVFRFUk46IC9eW2EtejAtOVxcdTAwN0YtXFx1ZmZmZiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOVxcdTAwN0YtXFx1ZmZmZiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2Etel17Mix9JC9pXG4gICAgfSksXG4gICAgZXF1YWxpdHk6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMsIGdsb2JhbE9wdGlvbnMpIHtcbiAgICAgIGlmICghdi5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHthdHRyaWJ1dGU6IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgIFwiaXMgbm90IGVxdWFsIHRvICV7YXR0cmlidXRlfVwiO1xuXG4gICAgICBpZiAodi5pc0VtcHR5KG9wdGlvbnMuYXR0cmlidXRlKSB8fCAhdi5pc1N0cmluZyhvcHRpb25zLmF0dHJpYnV0ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGF0dHJpYnV0ZSBtdXN0IGJlIGEgbm9uIGVtcHR5IHN0cmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG90aGVyVmFsdWUgPSB2LmdldERlZXBPYmplY3RWYWx1ZShhdHRyaWJ1dGVzLCBvcHRpb25zLmF0dHJpYnV0ZSlcbiAgICAgICAgLCBjb21wYXJhdG9yID0gb3B0aW9ucy5jb21wYXJhdG9yIHx8IGZ1bmN0aW9uKHYxLCB2Mikge1xuICAgICAgICAgIHJldHVybiB2MSA9PT0gdjI7XG4gICAgICAgIH1cbiAgICAgICAgLCBwcmV0dGlmeSA9IG9wdGlvbnMucHJldHRpZnkgfHxcbiAgICAgICAgICAoZ2xvYmFsT3B0aW9ucyAmJiBnbG9iYWxPcHRpb25zLnByZXR0aWZ5KSB8fFxuICAgICAgICAgIHYucHJldHRpZnk7XG5cbiAgICAgIGlmICghY29tcGFyYXRvcih2YWx1ZSwgb3RoZXJWYWx1ZSwgb3B0aW9ucywgYXR0cmlidXRlLCBhdHRyaWJ1dGVzKSkge1xuICAgICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge2F0dHJpYnV0ZTogcHJldHRpZnkob3B0aW9ucy5hdHRyaWJ1dGUpfSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEEgVVJMIHZhbGlkYXRvciB0aGF0IGlzIHVzZWQgdG8gdmFsaWRhdGUgVVJMcyB3aXRoIHRoZSBhYmlsaXR5IHRvXG4gICAgLy8gcmVzdHJpY3Qgc2NoZW1lcyBhbmQgc29tZSBkb21haW5zLlxuICAgIHVybDogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgIGlmICghdi5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJpcyBub3QgYSB2YWxpZCB1cmxcIlxuICAgICAgICAsIHNjaGVtZXMgPSBvcHRpb25zLnNjaGVtZXMgfHwgdGhpcy5zY2hlbWVzIHx8IFsnaHR0cCcsICdodHRwcyddXG4gICAgICAgICwgYWxsb3dMb2NhbCA9IG9wdGlvbnMuYWxsb3dMb2NhbCB8fCB0aGlzLmFsbG93TG9jYWwgfHwgZmFsc2U7XG5cbiAgICAgIGlmICghdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2RwZXJpbmkvNzI5Mjk0XG4gICAgICB2YXIgcmVnZXggPVxuICAgICAgICBcIl5cIiArXG4gICAgICAgIC8vIHByb3RvY29sIGlkZW50aWZpZXJcbiAgICAgICAgXCIoPzooPzpcIiArIHNjaGVtZXMuam9pbihcInxcIikgKyBcIik6Ly8pXCIgK1xuICAgICAgICAvLyB1c2VyOnBhc3MgYXV0aGVudGljYXRpb25cbiAgICAgICAgXCIoPzpcXFxcUysoPzo6XFxcXFMqKT9AKT9cIiArXG4gICAgICAgIFwiKD86XCI7XG5cbiAgICAgIHZhciB0bGQgPSBcIig/OlxcXFwuKD86W2EtelxcXFx1MDBhMS1cXFxcdWZmZmZdezIsfSkpXCI7XG5cbiAgICAgIGlmIChhbGxvd0xvY2FsKSB7XG4gICAgICAgIHRsZCArPSBcIj9cIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZ2V4ICs9XG4gICAgICAgICAgLy8gSVAgYWRkcmVzcyBleGNsdXNpb25cbiAgICAgICAgICAvLyBwcml2YXRlICYgbG9jYWwgbmV0d29ya3NcbiAgICAgICAgICBcIig/ISg/OjEwfDEyNykoPzpcXFxcLlxcXFxkezEsM30pezN9KVwiICtcbiAgICAgICAgICBcIig/ISg/OjE2OVxcXFwuMjU0fDE5MlxcXFwuMTY4KSg/OlxcXFwuXFxcXGR7MSwzfSl7Mn0pXCIgK1xuICAgICAgICAgIFwiKD8hMTcyXFxcXC4oPzoxWzYtOV18MlxcXFxkfDNbMC0xXSkoPzpcXFxcLlxcXFxkezEsM30pezJ9KVwiO1xuICAgICAgfVxuXG4gICAgICByZWdleCArPVxuICAgICAgICAgIC8vIElQIGFkZHJlc3MgZG90dGVkIG5vdGF0aW9uIG9jdGV0c1xuICAgICAgICAgIC8vIGV4Y2x1ZGVzIGxvb3BiYWNrIG5ldHdvcmsgMC4wLjAuMFxuICAgICAgICAgIC8vIGV4Y2x1ZGVzIHJlc2VydmVkIHNwYWNlID49IDIyNC4wLjAuMFxuICAgICAgICAgIC8vIGV4Y2x1ZGVzIG5ldHdvcmsgJiBicm9hY2FzdCBhZGRyZXNzZXNcbiAgICAgICAgICAvLyAoZmlyc3QgJiBsYXN0IElQIGFkZHJlc3Mgb2YgZWFjaCBjbGFzcylcbiAgICAgICAgICBcIig/OlsxLTldXFxcXGQ/fDFcXFxcZFxcXFxkfDJbMDFdXFxcXGR8MjJbMC0zXSlcIiArXG4gICAgICAgICAgXCIoPzpcXFxcLig/OjE/XFxcXGR7MSwyfXwyWzAtNF1cXFxcZHwyNVswLTVdKSl7Mn1cIiArXG4gICAgICAgICAgXCIoPzpcXFxcLig/OlsxLTldXFxcXGQ/fDFcXFxcZFxcXFxkfDJbMC00XVxcXFxkfDI1WzAtNF0pKVwiICtcbiAgICAgICAgXCJ8XCIgK1xuICAgICAgICAgIC8vIGhvc3QgbmFtZVxuICAgICAgICAgIFwiKD86KD86W2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldLSopKlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XSspXCIgK1xuICAgICAgICAgIC8vIGRvbWFpbiBuYW1lXG4gICAgICAgICAgXCIoPzpcXFxcLig/OlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XS0qKSpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0rKSpcIiArXG4gICAgICAgICAgdGxkICtcbiAgICAgICAgXCIpXCIgK1xuICAgICAgICAvLyBwb3J0IG51bWJlclxuICAgICAgICBcIig/OjpcXFxcZHsyLDV9KT9cIiArXG4gICAgICAgIC8vIHJlc291cmNlIHBhdGhcbiAgICAgICAgXCIoPzpbLz8jXVxcXFxTKik/XCIgK1xuICAgICAgXCIkXCI7XG5cbiAgICAgIHZhciBQQVRURVJOID0gbmV3IFJlZ0V4cChyZWdleCwgJ2knKTtcbiAgICAgIGlmICghUEFUVEVSTi5leGVjKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFsaWRhdGUuZm9ybWF0dGVycyA9IHtcbiAgICBkZXRhaWxlZDogZnVuY3Rpb24oZXJyb3JzKSB7cmV0dXJuIGVycm9yczt9LFxuICAgIGZsYXQ6IHYuZmxhdHRlbkVycm9yc1RvQXJyYXksXG4gICAgZ3JvdXBlZDogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICB2YXIgYXR0cjtcblxuICAgICAgZXJyb3JzID0gdi5ncm91cEVycm9yc0J5QXR0cmlidXRlKGVycm9ycyk7XG4gICAgICBmb3IgKGF0dHIgaW4gZXJyb3JzKSB7XG4gICAgICAgIGVycm9yc1thdHRyXSA9IHYuZmxhdHRlbkVycm9yc1RvQXJyYXkoZXJyb3JzW2F0dHJdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlcnJvcnM7XG4gICAgfSxcbiAgICBjb25zdHJhaW50OiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHZhciBhdHRyO1xuICAgICAgZXJyb3JzID0gdi5ncm91cEVycm9yc0J5QXR0cmlidXRlKGVycm9ycyk7XG4gICAgICBmb3IgKGF0dHIgaW4gZXJyb3JzKSB7XG4gICAgICAgIGVycm9yc1thdHRyXSA9IGVycm9yc1thdHRyXS5tYXAoZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC52YWxpZGF0b3I7XG4gICAgICAgIH0pLnNvcnQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlcnJvcnM7XG4gICAgfVxuICB9O1xuXG4gIHZhbGlkYXRlLmV4cG9zZU1vZHVsZSh2YWxpZGF0ZSwgdGhpcywgZXhwb3J0cywgbW9kdWxlLCBkZWZpbmUpO1xufSkuY2FsbCh0aGlzLFxuICAgICAgICB0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBleHBvcnRzIDogbnVsbCxcbiAgICAgICAgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBtb2R1bGUgOiBudWxsLFxuICAgICAgICB0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGRlZmluZSA6IG51bGwpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdmFsaWRhdGUuanMvdmFsaWRhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0aWYoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcblx0XHRpZighbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImxvYWRlZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5sO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiaWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUuaTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcblx0fVxuXHRyZXR1cm4gbW9kdWxlO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIGxvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqXG4gKiBBIGZhc3RlciBhbHRlcm5hdGl2ZSB0byBgRnVuY3Rpb24jYXBwbHlgLCB0aGlzIGZ1bmN0aW9uIGludm9rZXMgYGZ1bmNgXG4gKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBgdGhpc0FyZ2AgYW5kIHRoZSBhcmd1bWVudHMgb2YgYGFyZ3NgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgYGZ1bmNgIHdpdGguXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzdWx0IG9mIGBmdW5jYC5cbiAqL1xuZnVuY3Rpb24gYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncykge1xuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcpO1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICB9XG4gIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KSxcbiAgICBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqIERldGVjdCBpZiBwcm9wZXJ0aWVzIHNoYWRvd2luZyB0aG9zZSBvbiBgT2JqZWN0LnByb3RvdHlwZWAgYXJlIG5vbi1lbnVtZXJhYmxlLiAqL1xudmFyIG5vbkVudW1TaGFkb3dzID0gIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoeyAndmFsdWVPZic6IDEgfSwgJ3ZhbHVlT2YnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIHRoZSBhcnJheS1saWtlIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtib29sZWFufSBpbmhlcml0ZWQgU3BlY2lmeSByZXR1cm5pbmcgaW5oZXJpdGVkIHByb3BlcnR5IG5hbWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlMaWtlS2V5cyh2YWx1ZSwgaW5oZXJpdGVkKSB7XG4gIC8vIFNhZmFyaSA4LjEgbWFrZXMgYGFyZ3VtZW50cy5jYWxsZWVgIGVudW1lcmFibGUgaW4gc3RyaWN0IG1vZGUuXG4gIC8vIFNhZmFyaSA5IG1ha2VzIGBhcmd1bWVudHMubGVuZ3RoYCBlbnVtZXJhYmxlIGluIHN0cmljdCBtb2RlLlxuICB2YXIgcmVzdWx0ID0gKGlzQXJyYXkodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSlcbiAgICA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZylcbiAgICA6IFtdO1xuXG4gIHZhciBsZW5ndGggPSByZXN1bHQubGVuZ3RoLFxuICAgICAgc2tpcEluZGV4ZXMgPSAhIWxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChrZXkgPT0gJ2xlbmd0aCcgfHwgaXNJbmRleChrZXksIGxlbmd0aCkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBc3NpZ25zIGB2YWx1ZWAgdG8gYGtleWAgb2YgYG9iamVjdGAgaWYgdGhlIGV4aXN0aW5nIHZhbHVlIGlzIG5vdCBlcXVpdmFsZW50XG4gKiB1c2luZyBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgaWYgKCEoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYgZXEob2JqVmFsdWUsIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmVzdGAgd2hpY2ggZG9lc24ndCB2YWxpZGF0ZSBvciBjb2VyY2UgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VSZXN0KGZ1bmMsIHN0YXJ0KSB7XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6IHN0YXJ0LCAwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBpbmRleCA9IC0xO1xuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcbiAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICB9XG4gICAgb3RoZXJBcmdzW3N0YXJ0XSA9IGFycmF5O1xuICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG4vKipcbiAqIENvcGllcyBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgaWRlbnRpZmllcnMgdG8gY29weS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyB0by5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvcGllZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5T2JqZWN0KHNvdXJjZSwgcHJvcHMsIG9iamVjdCwgY3VzdG9taXplcikge1xuICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG5cbiAgICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgICA/IGN1c3RvbWl6ZXIob2JqZWN0W2tleV0sIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUgPT09IHVuZGVmaW5lZCA/IHNvdXJjZVtrZXldIDogbmV3VmFsdWUpO1xuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGxpa2UgYF8uYXNzaWduYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgcmV0dXJuIGJhc2VSZXN0KGZ1bmN0aW9uKG9iamVjdCwgc291cmNlcykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBzb3VyY2VzLmxlbmd0aCxcbiAgICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA+IDEgPyBzb3VyY2VzW2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkLFxuICAgICAgICBndWFyZCA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzWzJdIDogdW5kZWZpbmVkO1xuXG4gICAgY3VzdG9taXplciA9IChhc3NpZ25lci5sZW5ndGggPiAzICYmIHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicpXG4gICAgICA/IChsZW5ndGgtLSwgY3VzdG9taXplcilcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGluZGV4LCBjdXN0b21pemVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpXG4gICAgICApIHtcbiAgICByZXR1cm4gZXEob2JqZWN0W2luZGV4XSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcbiAgLy8gU2FmYXJpIDguMSBtYWtlcyBgYXJndW1lbnRzLmNhbGxlZWAgZW51bWVyYWJsZSBpbiBzdHJpY3QgbW9kZS5cbiAgcmV0dXJuIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAoIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKSB8fCBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcmdzVGFnKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uaXNBcnJheUxpa2VgIGV4Y2VwdCB0aGF0IGl0IGFsc28gY2hlY2tzIGlmIGB2YWx1ZWBcbiAqIGlzIGFuIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheS1saWtlIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOC05IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5IGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBpc09iamVjdCh2YWx1ZSkgPyBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3RzIHRvIHRoZVxuICogZGVzdGluYXRpb24gb2JqZWN0LiBTb3VyY2Ugb2JqZWN0cyBhcmUgYXBwbGllZCBmcm9tIGxlZnQgdG8gcmlnaHQuXG4gKiBTdWJzZXF1ZW50IHNvdXJjZXMgb3ZlcndyaXRlIHByb3BlcnR5IGFzc2lnbm1lbnRzIG9mIHByZXZpb3VzIHNvdXJjZXMuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAgYW5kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgT2JqZWN0LmFzc2lnbmBdKGh0dHBzOi8vbWRuLmlvL09iamVjdC9hc3NpZ24pLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAc2VlIF8uYXNzaWduSW5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogfVxuICpcbiAqIGZ1bmN0aW9uIEJhcigpIHtcbiAqICAgdGhpcy5jID0gMztcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmIgPSAyO1xuICogQmFyLnByb3RvdHlwZS5kID0gNDtcbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMCB9LCBuZXcgRm9vLCBuZXcgQmFyKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYyc6IDMgfVxuICovXG52YXIgYXNzaWduID0gY3JlYXRlQXNzaWduZXIoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgaWYgKG5vbkVudW1TaGFkb3dzIHx8IGlzUHJvdG90eXBlKHNvdXJjZSkgfHwgaXNBcnJheUxpa2Uoc291cmNlKSkge1xuICAgIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBzb3VyY2Vba2V5XSk7XG4gICAgfVxuICB9XG59KTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoLmFzc2lnbi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9