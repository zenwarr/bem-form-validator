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
    /**
     * Creates a validator attached to the given root element.
     * It is not required for the root element to be a form.
     * But if it is a form, its native validation is disabled and validation is implemented by this class.
     * @param {HTMLFormElement} _root
     * @param {FormValidatorOptions} options
     */
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
     * Call this function to validate the all elements inside the root block.
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
        /**
         * @returns {boolean} True if the validator is currently in live mode, false otherwise
         */
        get: function () {
            return this._liveValidation;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get validator object for the given root element.
     * @param {Element} root
     * @returns {FormValidator | null}
     */
    FormValidator.fromRoot = function (root) {
        if (!root) {
            return null;
        }
        return root.__hidden_validator;
    };
    /**
     * Call this function to automatically create and initialize validators for all elements with given class in the current DOM.
     * @param {string} rootClass Class of root element
     * @param {FormValidatorOptions} options Options for validator objects
     */
    FormValidator.init = function (rootClass, options) {
        if (rootClass === void 0) { rootClass = 'js-validate'; }
        var forms = document.querySelectorAll('.' + rootClass);
        for (var q = 0; q < forms.length; ++q) {
            new FormValidator(forms[q], options);
        }
    };
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
    /**
     * Formats a message, replacing placeholders in form $name with values from `params` object.
     * @param {string} msg Message string to be formatted.
     * @param {FormatParams} params Object holding parameters to be replaced
     * @returns {string} Formatted string
     */
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
     * It is guaranteed that after successfully calling this functions constraints are up-to date with DOM values.
     * @private
     */
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
    /**
     * Called to set error state for the element in DOM.
     * @param {string} msg Error message for the element
     * @param {InputData} elem Element data
     */
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
    /**
     * Called to set valid state for the element in DOM
     * @param {InputData} elem Element data
     */
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
    /**
     * @returns {boolean} True if the root has at least validated and invalid element.
     * @private
     */
    FormValidator.prototype._hasInvalidElems = function () {
        var _this = this;
        if (this._elems) {
            return Object.keys(this._elems).map(function (x) { return _this._elems[x]; }).some(function (x) { return !x.valid; });
        }
        return false;
    };
    /**
     * Updates input element data, getting its state from DOM.
     * Validity state is not resetted.
     * @param {InputData} data Element data
     * @param {Element} elem Element node in DOM
     * @private
     */
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
    /**
     * Creates data entry for element inside the root.
     * @param {Element} elem Element node in DOM
     * @returns {InputData} Element data
     * @private
     */
    FormValidator.prototype._buildInputData = function (elem) {
        var result = { valid: null };
        this._updateInputData(result, elem);
        return result;
    };
    /**
     * Get unformatted message of the given class text for an element
     * @param {Element} elem Element node
     * @param {string} msgClasses List of message classes.
     * @returns {string | null}
     * @private
     */
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
    /**
     * Update element data.
     * It synchronizes element data with DOM, removing data entries for element that has been removed from DOM, adding data for elements added to DOM and updating data for updated nodes.
     * @private
     */
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
    /**
     * Rebuilds constraint data from DOM data.
     * Constraints are automatilly rebuilded when DOM is changed.
     * @private
     */
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
    /**
     * Enter live validation mode
     * @private
     */
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
    /**
     * Called when value of an element has been changed.
     * @param {string} elemName
     * @param {Event} e
     */
    FormValidator.prototype.onElementChange = function (elemName, e) {
        this.validateSingle(elemName);
    };
    /**
     * Updates root node to reflect its validity state.
     * @param {boolean} hasErrors
     */
    FormValidator.prototype.setRootHasErrors = function (hasErrors) {
        toggleClass(this._root, this.rootValidClass, !hasErrors);
        toggleClass(this._root, this.rootInvalidClass, hasErrors);
    };
    /**
     * Helper function to get value of an element.
     * @param {Element} elem
     * @returns {string | null}
     * @private
     */
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
/**
 * Helper function that converts a name into a name in underscore-separated format (in fact, you can replace an underscore with a character of your choice)
 * @param {string} name Name in camel-case format (or mixed with underscores and dashes)
 * @param {string} sep Separator to use instead of underscore
 * @returns {string} Formatted name
 */
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
/**
 * Converts name where parts are separated with underscores or dashes to camel-case format
 * @param {string} name
 * @returns {string} Camel-case formatted name
 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmI1ZWVkZThlOTY3ZTkyZjIzODEiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3ZhbGlkYXRlLmpzL3ZhbGlkYXRlLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC5hc3NpZ24vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNGQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsVUFBVTtBQUNyQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsU0FBUztBQUN0QixVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMmI1ZWVkZThlOTY3ZTkyZjIzODEiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHR0aHJvdyBuZXcgRXJyb3IoXCJkZWZpbmUgY2Fubm90IGJlIHVzZWQgaW5kaXJlY3RcIik7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vYW1kLWRlZmluZS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKFwidmFsaWRhdGUuanNcIik7XHJcbnZhciBsb2Rhc2hfYXNzaWduID0gcmVxdWlyZShcImxvZGFzaC5hc3NpZ25cIik7XHJcbnZhciBSdXNzaWFuRm9ybU1lc3NhZ2VzID0ge1xyXG4gICAgcmVxdWlyZWQ6ICfQktCy0LXQtNC40YLQtSDQt9C90LDRh9C10L3QuNC1JyxcclxuICAgIG1pbmxlbmd0aDogJ9CS0LLQtdC00LjRgtC1INC30L3QsNGH0LXQvdC40LUg0L3QtSDQutC+0YDQvtGH0LUgJG1pbmxlbmd0aCDRgdC40LzQstC+0LvQvtCyJyxcclxuICAgIHBhdHRlcm46ICfQktCy0LXQtNC40YLQtSDQt9C90LDRh9C10L3QuNC1INCyINC90YPQttC90L7QvCDRhNC+0YDQvNCw0YLQtScsXHJcbiAgICBlbWFpbDogJ9CS0LLQtdC00LjRgtC1INC60L7RgNGA0LXQutGC0L3Ri9C5IGUtbWFpbCcsXHJcbiAgICBudW1iZXI6ICfQktCy0LXQtNC40YLQtSDRh9C40YHQu9C+JyxcclxuICAgIG51bWJlck1pbk1heDogJ9CS0LLQtdC00LjRgtC1INGH0LjRgdC70L4g0LIg0LTQuNCw0L/QsNC30L7QvdC1INC+0YIgJG1pbiDQtNC+ICRtYXgnLFxyXG4gICAgbnVtYmVyTWluOiAn0JLQstC10LTQuNGC0LUg0YfQuNGB0LvQviDQvdC1INC80LXQvdGM0YjQtSAkbWluJyxcclxuICAgIG51bWJlck1heDogJ9CS0LLQtdC00LjRgtC1INGH0LjRgdC70L4g0L3QtSDQsdC+0LvRjNGI0LUgJG1heCcsXHJcbiAgICBzdGVwOiAn0KfQuNGB0LvQviDQtNC+0LvQttC90L4g0LHRi9GC0Ywg0YEg0YjQsNCz0L7QvCDQsiAkc3RlcCdcclxufTtcclxudmFyIE9QVElPTl9ERUZBVUxUUyA9IHtcclxuICAgIHJvb3RCbG9jazogJ2Zvcm0nLFxyXG4gICAgcm9vdFZhbGlkTW9kOiAndmFsaWQnLFxyXG4gICAgcm9vdEludmFsaWRNb2Q6ICdpbnZhbGlkJyxcclxuICAgIGlucHV0QmxvY2s6ICdpYicsXHJcbiAgICBpbnB1dEJsb2NrVmFsaWRNb2Q6ICd2YWxpZCcsXHJcbiAgICBpbnB1dEJsb2NrSW52YWxpZE1vZDogJ2ludmFsaWQnLFxyXG4gICAgaW5wdXRCbG9ja0Vycm9yRWxlbTogJ2Vycm9yJyxcclxuICAgIGlucHV0VmFsaWRDbGFzczogJ2lucHV0LS12YWxpZCcsXHJcbiAgICBpbnB1dEludmFsaWRDbGFzczogJ2lucHV0LS1pbnZhbGlkJyxcclxuICAgIHJldmFsaWRhdGVPbkNoYW5nZTogZmFsc2UsXHJcbiAgICByZXZhbGlkYXRlT25JbnB1dDogZmFsc2UsXHJcbn07XHJcbnZhciBfY3VzdG9tVmFsaWRhdG9yc0NyZWF0ZWQgPSBmYWxzZTtcclxuZnVuY3Rpb24gY3JlYXRlQ3VzdG9tVmFsaWRhdG9ycygpIHtcclxuICAgIGlmIChfY3VzdG9tVmFsaWRhdG9yc0NyZWF0ZWQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBfY3VzdG9tVmFsaWRhdG9yc0NyZWF0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgdmFsaWRhdGUudmFsaWRhdG9ycy5zdGVwID0gZnVuY3Rpb24gKHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbnVtVmFsdWUgPSArdmFsdWU7XHJcbiAgICAgICAgdmFyIGlzT3B0aW9uc051bWJlciA9IHR5cGVvZiBvcHRpb25zID09PSAnbnVtYmVyJztcclxuICAgICAgICB2YXIgc3RlcCA9IGlzT3B0aW9uc051bWJlciA/IG9wdGlvbnMgOiAoK29wdGlvbnMuc3RlcCB8fCAwKTtcclxuICAgICAgICBpZiAoc3RlcCA8PSAwIHx8IGlzTmFOKHN0ZXApKSB7XHJcbiAgICAgICAgICAgIHN0ZXAgPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbWluVmFsdWUgPSBpc09wdGlvbnNOdW1iZXIgPyAwIDogKCtvcHRpb25zLm1pbiB8fCAwKTtcclxuICAgICAgICBpZiAoaXNOYU4obWluVmFsdWUpKSB7XHJcbiAgICAgICAgICAgIG1pblZhbHVlID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRlZk1zZyA9IFwidmFsdWUgaGFzIGludmFsaWQgc3RlcCAoc2hvdWxkIGhhdmUgc3RlcCBcIiArIHN0ZXAgKyBcIilcIjtcclxuICAgICAgICB2YXIgbXNnID0gaXNPcHRpb25zTnVtYmVyID8gZGVmTXNnIDogKG9wdGlvbnMubWVzc2FnZSB8fCBkZWZNc2cpO1xyXG4gICAgICAgIGlmICgobnVtVmFsdWUgLSBtaW5WYWx1ZSkgJSBzdGVwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtc2c7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIEZvcm1WYWxpZGF0b3IuYWRkQ29uc3RyYWludEJ1aWxkZXIoJ2VxdWFsaXR5JywgZnVuY3Rpb24gKGNvbnN0cmFpbnQsIGlucHV0LCBvcHRpb24sIG1lc3NhZ2UsIHZhbGlkYXRvcikge1xyXG4gICAgICAgIGlmIChtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0cmFpbnQuZXF1YWxpdHkgPSB7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGU6IG9wdGlvbixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHZhbGlkYXRvci5mb3JtYXRNc2cobWVzc2FnZSwge1xyXG4gICAgICAgICAgICAgICAgICAgIG90aGVyOiBvcHRpb25cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdHJhaW50LmVxdWFsaXR5ID0gb3B0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgRm9ybVZhbGlkYXRvci5hZGRDb25zdHJhaW50QnVpbGRlcignZXhjbHVkZScsIGZ1bmN0aW9uIChjb25zdHJhaW50LCBpbnB1dCwgb3B0aW9uLCBtZXNzYWdlLCB2YWxpZGF0b3IpIHtcclxuICAgICAgICB2YXIgZGF0YTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShvcHRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBbb3B0aW9uXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3RyYWludC5leGNsdXNpb24gPSB7XHJcbiAgICAgICAgICAgIHdpdGhpbjogZGF0YVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgY29uc3RyYWludC5leGNsdXNpb24ubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBGb3JtVmFsaWRhdG9yLmFkZENvbnN0cmFpbnRCdWlsZGVyKCdpbmNsdWRlJywgZnVuY3Rpb24gKGNvbnN0cmFpbnQsIGlucHV0LCBvcHRpb24sIG1lc3NhZ2UsIHZhbGlkYXRvcikge1xyXG4gICAgICAgIHZhciBkYXRhO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgZGF0YSA9IFtvcHRpb25dO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdHJhaW50LmluY2x1c2lvbiA9IHtcclxuICAgICAgICAgICAgd2l0aGluOiBkYXRhXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAobWVzc2FnZSkge1xyXG4gICAgICAgICAgICBjb25zdHJhaW50LmluY2x1c2lvbi5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGZ1bmN0aW9uIHNldENvbnN0cmFpbnRQcm9wKGNvbnN0cmFpbnQsIHByb3AsIG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAoY29uc3RyYWludFtwcm9wXSkge1xyXG4gICAgICAgICAgICBhc3NpZ24oY29uc3RyYWludFtwcm9wXSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdHJhaW50W3Byb3BdID0gb3B0aW9ucztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBGb3JtVmFsaWRhdG9yLmFkZENvbnN0cmFpbnRCdWlsZGVyKCdpbnRlZ2VyJywgZnVuY3Rpb24gKGNvbnN0cmFpbnQsIGlucHV0LCBvcHRpb24sIG1lc3NhZ2UpIHtcclxuICAgICAgICBzZXRDb25zdHJhaW50UHJvcChjb25zdHJhaW50LCAnbnVtZXJpY2FsaXR5Jywge1xyXG4gICAgICAgICAgICBvbmx5SW50ZWdlcjogbWVzc2FnZSA/IHsgbWVzc2FnZTogbWVzc2FnZSB9IDogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBGb3JtVmFsaWRhdG9yLmFkZENvbnN0cmFpbnRCdWlsZGVyKCdkaXZpc2libGUnLCBmdW5jdGlvbiAoY29uc3RyYWludCwgaW5wdXQsIG9wdGlvbiwgbWVzc2FnZSkge1xyXG4gICAgICAgIHZhciBkaXZpc29yID0gK29wdGlvbjtcclxuICAgICAgICBpZiAoaXNOYU4oZGl2aXNvcikgfHwgZGl2aXNvciA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdpbnZhbGlkIHZhbGlkYXRpb24gYXR0cmlidXRlIGRpdmlzYmxlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0Q29uc3RyYWludFByb3AoY29uc3RyYWludCwgJ251bWVyaWNhbGl0eScsIHtcclxuICAgICAgICAgICAgZGl2aXNpYmxlQnk6IG1lc3NhZ2UgPyB7IG1lc3NhZ2U6IG1lc3NhZ2UsIGNvdW50OiBkaXZpc29yIH0gOiBkaXZpc29yXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIEZvcm1WYWxpZGF0b3IuYWRkQ29uc3RyYWludEJ1aWxkZXIoJ29kZCcsIGZ1bmN0aW9uIChjb25zdHJhaW50LCBpbnB1dCwgb3B0aW9uLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgc2V0Q29uc3RyYWludFByb3AoY29uc3RyYWludCwgJ251bWVyaWNhbGl0eScsIHtcclxuICAgICAgICAgICAgb2RkOiBtZXNzYWdlID8geyBtZXNzYWdlOiBtZXNzYWdlIH0gOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIEZvcm1WYWxpZGF0b3IuYWRkQ29uc3RyYWludEJ1aWxkZXIoJ2V2ZW4nLCBmdW5jdGlvbiAoY29uc3RyYWludCwgaW5wdXQsIG9wdGlvbiwgbWVzc2FnZSkge1xyXG4gICAgICAgIHNldENvbnN0cmFpbnRQcm9wKGNvbnN0cmFpbnQsICdudW1lcmljYWxpdHknLCB7XHJcbiAgICAgICAgICAgIGV2ZW46IG1lc3NhZ2UgPyB7IG1lc3NhZ2U6IG1lc3NhZ2UgfSA6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgRm9ybVZhbGlkYXRvci5hZGRDb25zdHJhaW50QnVpbGRlcignbGVuZ3RoLWVxdWFsJywgZnVuY3Rpb24gKGNvbnN0cmFpbnQsIGlucHV0LCBvcHRpb24sIG1lc3NhZ2UpIHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gK29wdGlvbjtcclxuICAgICAgICBpZiAoaXNOYU4obGVuZ3RoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdpbnZhbGlkIHZhbGlkYXRpb24gYXR0cmlidXRlIGxlbmd0aC1lcXVhbCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldENvbnN0cmFpbnRQcm9wKGNvbnN0cmFpbnQsICdsZW5ndGgnLCB7XHJcbiAgICAgICAgICAgIGlzOiBtZXNzYWdlID8geyBtZXNzYWdlOiBtZXNzYWdlLCBjb3VudDogbGVuZ3RoIH0gOiBsZW5ndGhcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgRm9ybVZhbGlkYXRvci5hZGRDb25zdHJhaW50QnVpbGRlcignbGVuZ3RoLW1heCcsIGZ1bmN0aW9uIChjb25zdHJhaW50LCBpbnB1dCwgb3B0aW9uLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9ICtvcHRpb247XHJcbiAgICAgICAgaWYgKGlzTmFOKGxlbmd0aCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignaW52YWxpZCB2YWxpZGF0aW9uIGF0dHJpYnV0ZSBsZW5ndGgtbWF4Jyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0Q29uc3RyYWludFByb3AoY29uc3RyYWludCwgJ2xlbmd0aCcsIHtcclxuICAgICAgICAgICAgbWF4aW11bTogbWVzc2FnZSA/IHsgbWVzc2FnZTogbWVzc2FnZSwgY291bnQ6IGxlbmd0aCB9IDogbGVuZ3RoXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG52YXIgQVRUUlNfVE9fSU5WQUxJREFURV9DT05TVFJBSU5UUyA9IFsndHlwZScsICdyZXF1aXJlZCcsICdtaW4nLCAnbWF4JywgJ3N0ZXAnLCAncGF0dGVybicsICdtaW5sZW5ndGgnLCAnZm9ybW5vdmFsaWRhdGUnXTtcclxudmFyIEZvcm1WYWxpZGF0b3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSB2YWxpZGF0b3IgYXR0YWNoZWQgdG8gdGhlIGdpdmVuIHJvb3QgZWxlbWVudC5cclxuICAgICAqIEl0IGlzIG5vdCByZXF1aXJlZCBmb3IgdGhlIHJvb3QgZWxlbWVudCB0byBiZSBhIGZvcm0uXHJcbiAgICAgKiBCdXQgaWYgaXQgaXMgYSBmb3JtLCBpdHMgbmF0aXZlIHZhbGlkYXRpb24gaXMgZGlzYWJsZWQgYW5kIHZhbGlkYXRpb24gaXMgaW1wbGVtZW50ZWQgYnkgdGhpcyBjbGFzcy5cclxuICAgICAqIEBwYXJhbSB7SFRNTEZvcm1FbGVtZW50fSBfcm9vdFxyXG4gICAgICogQHBhcmFtIHtGb3JtVmFsaWRhdG9yT3B0aW9uc30gb3B0aW9uc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBGb3JtVmFsaWRhdG9yKF9yb290LCBvcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLl9yb290ID0gX3Jvb3Q7XHJcbiAgICAgICAgdGhpcy5fY29uc3RyYWludHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2VsZW1zID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9saXZlVmFsaWRhdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2F1dG9JbnZhbGlkYXRlQ29uc3RyYWludHMgPSBmYWxzZTtcclxuICAgICAgICBjcmVhdGVDdXN0b21WYWxpZGF0b3JzKCk7XHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IGFzc2lnbih7fSwgT1BUSU9OX0RFRkFVTFRTLCBvcHRpb25zIHx8IHt9KTtcclxuICAgICAgICBpZiAodGhpcy5fcm9vdC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdmb3JtJykge1xyXG4gICAgICAgICAgICB0aGlzLl9yb290LnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICcnKTtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB0aGlzLm9uU3VibWl0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yb290Ll9faGlkZGVuX3ZhbGlkYXRvciA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMucm9vdEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3QuY2xhc3NMaXN0LmFkZCh0aGlzLl9vcHRpb25zLnJvb3RCbG9jayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHJlYWN0IG9uIGNoYW5nZXMgaW4gRE9NIHRoYXQgY2FuIHRyaWdnZXIgY2hhbmdlcyBpbiBjb25zdHJhaW50c1xyXG4gICAgICAgIGlmICh3aW5kb3cuTXV0YXRpb25PYnNlcnZlcikge1xyXG4gICAgICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBxID0gMDsgcSA8IG11dGF0aW9ucy5sZW5ndGg7ICsrcSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtdXQgPSBtdXRhdGlvbnNbcV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG11dC50eXBlICE9PSAnYXR0cmlidXRlcycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2NvbnN0cmFpbnRzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9IG11dC5hdHRyaWJ1dGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghYXR0cikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0ciA9IGF0dHIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0ci5pbmRleE9mKCdkYXRhLScpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb25zdHJhaW50cyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoQVRUUlNfVE9fSU5WQUxJREFURV9DT05TVFJBSU5UUy5pbmRleE9mKGF0dHIpID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2NvbnN0cmFpbnRzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUodGhpcy5fcm9vdCwge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBubyBNdXRhdGlvbk9ic2VydmVyIHN1cHBvcnRcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0ludmFsaWRhdGVDb25zdHJhaW50cyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsIHRoaXMgZnVuY3Rpb24gdG8gdmFsaWRhdGUgdGhlIGFsbCBlbGVtZW50cyBpbnNpZGUgdGhlIHJvb3QgYmxvY2suXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNpbGVudCBTaWxlbnQgdmFsaWRhdGlvbiBtZWFucyB0aGF0IERPTSBpcyBub3QgYWx0ZXJlZCBpbiBhbnkgd2F5LlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgYWxsIGVsZW1lbnRzIGFyZSB2YWxpZCwgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAgICAgKi9cclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24gKHNpbGVudCkge1xyXG4gICAgICAgIGlmIChzaWxlbnQgPT09IHZvaWQgMCkgeyBzaWxlbnQgPSBmYWxzZTsgfVxyXG4gICAgICAgIHZhciBlcnJvcnMgPSB2YWxpZGF0ZSh0aGlzLl9yb290LCB0aGlzLmNvbnN0cmFpbnRzLCB7XHJcbiAgICAgICAgICAgIGZ1bGxNZXNzYWdlczogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgaGFzRXJyb3JzID0gZXJyb3JzICE9IG51bGw7XHJcbiAgICAgICAgaWYgKCFzaWxlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5zaG93RXJyb3JzKGVycm9ycyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2JlZ2luTGl2ZVZhbGlkYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICFoYXNFcnJvcnM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsIHRoaXMgZnVuY3Rpb24gdG8gdmFsaWRhdGUgYSBzaW5nbGUgZWxlbWVudCB3aXRoIGdpdmVuIG5hbWUuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZWxlbU5hbWUgTmFtZSBvZiB0aGUgZWxlbWVudCB0byB2YWxpZGF0ZVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzaWxlbnQgU2lsZW50IHZhbGlkYXRpb24gbWVhbnMgdGhhdCBET00gaXMgbm90IGFsdGVyZWQgaW4gYW55IHdheS5cclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBlbGVtZW50IGlzIHZhbGlkLCBmYWxzZSBvdGhlcndpc2VcclxuICAgICAqL1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUudmFsaWRhdGVTaW5nbGUgPSBmdW5jdGlvbiAoZWxlbU5hbWUsIHNpbGVudCkge1xyXG4gICAgICAgIGlmIChzaWxlbnQgPT09IHZvaWQgMCkgeyBzaWxlbnQgPSBmYWxzZTsgfVxyXG4gICAgICAgIHRoaXMuX2Vuc3VyZUNvbnN0cmFpbnRzQXJlQnVpbHQoKTtcclxuICAgICAgICB2YXIgZWxlbURhdGEgPSB0aGlzLl9lbGVtcyA/IHRoaXMuX2VsZW1zW2VsZW1OYW1lXSA6IG51bGw7XHJcbiAgICAgICAgaWYgKCFlbGVtRGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJlbGVtZW50IHdpdGggbmFtZSBcIiArIGVsZW1OYW1lICsgXCIgaGFzIG5vdCBiZWVuIGZvdW5kIHdoaWxlIHZhbGlkYXRpbmcgYSBzaW5nbGUgZWxlbWVudFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb25zdHJhaW50ID0gdGhpcy5fY29uc3RyYWludHMgPyB0aGlzLl9jb25zdHJhaW50c1tlbGVtTmFtZV0gOiBudWxsO1xyXG4gICAgICAgIHZhciBlcnJvciA9IG51bGw7XHJcbiAgICAgICAgaWYgKGNvbnN0cmFpbnQpIHtcclxuICAgICAgICAgICAgZXJyb3IgPSB2YWxpZGF0ZS5zaW5nbGUodGhpcy5fZ2V0SW5wdXRWYWx1ZShlbGVtRGF0YS5lbGVtKSwgY29uc3RyYWludCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc2lsZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFcnJvcihlcnJvciwgZWxlbURhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhckVycm9yKGVsZW1EYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZXJyb3IgPT0gbnVsbDtcclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRm9ybVZhbGlkYXRvci5wcm90b3R5cGUsIFwiY29uc3RyYWludHNcIiwge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtWYWxpZGF0aW9uQ29uc3RyYWludHN9IExpc3Qgb2YgY29uc3RyYWludHMgY29sbGVjdGVkIGZyb20gSFRNTDUgdmFsaWRhdGlvbiBhdHRyaWJ1dGVzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Vuc3VyZUNvbnN0cmFpbnRzQXJlQnVpbHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnN0cmFpbnRzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLCBcInJvb3RcIiwge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtFbGVtZW50fSBGb3JtIGVsZW1lbnQgYXNzb3RpYXRlZCB3aXRoIHRoZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRm9ybVZhbGlkYXRvci5wcm90b3R5cGUsIFwicm9vdEJsb2NrXCIsIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBCbG9jayBuYW1lIGZvciBhIHJvb3QgZWxlbWVudFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucy5yb290QmxvY2sgfHwgT1BUSU9OX0RFRkFVTFRTLnJvb3RCbG9jaztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJyb290VmFsaWRDbGFzc1wiLCB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ30gQSBjbGFzcyBuYW1lIGFwcGxpZWQgdG8gdGhlIHJvb3QgYmxvY2sgaWYgYWxsIGl0cyBjaGlsZHJlbiBhcmUgdmFsaWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ha2VNb2QodGhpcy5yb290QmxvY2ssIHRoaXMuX29wdGlvbnMucm9vdFZhbGlkTW9kKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJyb290SW52YWxpZENsYXNzXCIsIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBBIGNsYXNzIG5hbWUgYXBwbGllZCB0byB0aGUgcm9vdCBlbGVtZW50IGlmIGF0IGxlYXN0IG9uZSBvZiBpdHMgY2hpbGRyZW4gaXMgaW52YWxpZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWFrZU1vZCh0aGlzLnJvb3RCbG9jaywgdGhpcy5fb3B0aW9ucy5yb290SW52YWxpZE1vZCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRm9ybVZhbGlkYXRvci5wcm90b3R5cGUsIFwiaW5wdXRCbG9ja1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJyArIHRoaXMuX29wdGlvbnMuaW5wdXRCbG9jaztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJpbnB1dEJsb2NrRXJyb3JFbGVtZW50XCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ha2VFbGVtKHRoaXMuaW5wdXRCbG9jaywgJycgKyB0aGlzLl9vcHRpb25zLmlucHV0QmxvY2tFcnJvckVsZW0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLCBcImlucHV0QmxvY2tWYWxpZENsYXNzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ha2VNb2QodGhpcy5pbnB1dEJsb2NrLCAnJyArIHRoaXMuX29wdGlvbnMuaW5wdXRCbG9ja1ZhbGlkTW9kKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJpbnB1dEJsb2NrSW52YWxpZENsYXNzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ha2VNb2QodGhpcy5pbnB1dEJsb2NrLCAnJyArIHRoaXMuX29wdGlvbnMuaW5wdXRCbG9ja0ludmFsaWRNb2QpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLCBcIm9wdGlvbnNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXNzaWduKHt9LCB0aGlzLl9vcHRpb25zKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGb3JtVmFsaWRhdG9yLnByb3RvdHlwZSwgXCJsaXZlVmFsaWRhdGlvblwiLCB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbGlkYXRvciBpcyBjdXJyZW50bHkgaW4gbGl2ZSBtb2RlLCBmYWxzZSBvdGhlcndpc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xpdmVWYWxpZGF0aW9uO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdmFsaWRhdG9yIG9iamVjdCBmb3IgdGhlIGdpdmVuIHJvb3QgZWxlbWVudC5cclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gcm9vdFxyXG4gICAgICogQHJldHVybnMge0Zvcm1WYWxpZGF0b3IgfCBudWxsfVxyXG4gICAgICovXHJcbiAgICBGb3JtVmFsaWRhdG9yLmZyb21Sb290ID0gZnVuY3Rpb24gKHJvb3QpIHtcclxuICAgICAgICBpZiAoIXJvb3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByb290Ll9faGlkZGVuX3ZhbGlkYXRvcjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENhbGwgdGhpcyBmdW5jdGlvbiB0byBhdXRvbWF0aWNhbGx5IGNyZWF0ZSBhbmQgaW5pdGlhbGl6ZSB2YWxpZGF0b3JzIGZvciBhbGwgZWxlbWVudHMgd2l0aCBnaXZlbiBjbGFzcyBpbiB0aGUgY3VycmVudCBET00uXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm9vdENsYXNzIENsYXNzIG9mIHJvb3QgZWxlbWVudFxyXG4gICAgICogQHBhcmFtIHtGb3JtVmFsaWRhdG9yT3B0aW9uc30gb3B0aW9ucyBPcHRpb25zIGZvciB2YWxpZGF0b3Igb2JqZWN0c1xyXG4gICAgICovXHJcbiAgICBGb3JtVmFsaWRhdG9yLmluaXQgPSBmdW5jdGlvbiAocm9vdENsYXNzLCBvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHJvb3RDbGFzcyA9PT0gdm9pZCAwKSB7IHJvb3RDbGFzcyA9ICdqcy12YWxpZGF0ZSc7IH1cclxuICAgICAgICB2YXIgZm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHJvb3RDbGFzcyk7XHJcbiAgICAgICAgZm9yICh2YXIgcSA9IDA7IHEgPCBmb3Jtcy5sZW5ndGg7ICsrcSkge1xyXG4gICAgICAgICAgICBuZXcgRm9ybVZhbGlkYXRvcihmb3Jtc1txXSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogWW91IGNhbiBjcmVhdGUgY3VzdG9tIHZhbGlkYXRvcnMgdGhhdCBjYW4gYmUgYXR0YWNoZWQgdG8geW91ciBpbnB1dHMgYW5kIG1hbmlwdWxhdGVkIGJ5IERPTS5cclxuICAgICAqIEJ1dCB5b3Ugc2hvdWxkIHJlZ2lzdGVyIHRoZSBjb25zdHJhaW50IGJ1aWxkZXIgZmlyc3QuXHJcbiAgICAgKiBBIGNvbnN0cmFpbnQgYnVpbGRlciBhY3RzIGxpa2UgYSBmaWx0ZXIgZm9yIGNvbnN0cmFpbnRzIG9iamVjdCBhbmQgaXMgY2FsbGVkIGVhY2ggdGltZSB2YWxpZGF0b3IgcmVidWlsZHMgY29uc3RyYWludHMuXHJcbiAgICAgKiBFYWNoIGNvbnN0cmFpbnQgYnVpbGRlciBoYXMgYSBuYW1lLlxyXG4gICAgICogSWYgYW4gaW5wdXQgaGFzIGEgZGF0YSBhdHRyaWJ1dGUgaW4gZm9ybSBvZiBgZGF0YS12YWxpZGF0ZS0ke2NvbnN0cmFpbnQtYnVpbGRlci1uYW1lfWAsIHZhbGlkYXRvciB3aWxsIGNhbGwgeW91ciBjb25zdHJhaW50IGJ1aWxkZXIgYW5kIGdpdmUgaXQgY29uc3RyYWludCBvYmplY3QgdG8gcHJvY2Vzcy5cclxuICAgICAqIFlvdSBhcmUgZnJlZSB0byBtb2RpZnkgdGhpcyBvYmplY3QgYXMgeW91IHdpc2guXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gICAgICogQHBhcmFtIHtDb25zdHJhaW50QnVpbGRlcn0gYnVpbGRlclxyXG4gICAgICogQHBhcmFtIHtDdXN0b21WYWxpZGF0b3J9IHZhbGlkYXRvclxyXG4gICAgICovXHJcbiAgICBGb3JtVmFsaWRhdG9yLmFkZENvbnN0cmFpbnRCdWlsZGVyID0gZnVuY3Rpb24gKG5hbWUsIGJ1aWxkZXIsIHZhbGlkYXRvcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb25zdHJhaW50QnVpbGRlcnNbbmFtZV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmVnaXN0ZXIgYSBjdXN0b20gY29uc3RyYWludCBidWlsZGVyOiBuYW1lIFtcIiArIG5hbWUgKyBcIl0gaXMgYWxyZWFkeSBpbiB1c2VcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YWxpZGF0b3IgJiYgdmFsaWRhdGUudmFsaWRhdG9yc1tuYW1lXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZWdpc3RlciBhIGN1c3RvbSB2YWxpZGF0b3I6IG5hbWUgW1wiICsgbmFtZSArIFwiXSBpcyBhbHJlYWR5IGluIHVzZVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29uc3RyYWludEJ1aWxkZXJzW25hbWVdID0gYnVpbGRlcjtcclxuICAgICAgICBpZiAodmFsaWRhdG9yKSB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlLnZhbGlkYXRvcnNbbmFtZV0gPSB2YWxpZGF0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRm9ybWF0cyBhIG1lc3NhZ2UsIHJlcGxhY2luZyBwbGFjZWhvbGRlcnMgaW4gZm9ybSAkbmFtZSB3aXRoIHZhbHVlcyBmcm9tIGBwYXJhbXNgIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtc2cgTWVzc2FnZSBzdHJpbmcgdG8gYmUgZm9ybWF0dGVkLlxyXG4gICAgICogQHBhcmFtIHtGb3JtYXRQYXJhbXN9IHBhcmFtcyBPYmplY3QgaG9sZGluZyBwYXJhbWV0ZXJzIHRvIGJlIHJlcGxhY2VkXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBGb3JtYXR0ZWQgc3RyaW5nXHJcbiAgICAgKi9cclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLmZvcm1hdE1zZyA9IGZ1bmN0aW9uIChtc2csIHBhcmFtcykge1xyXG4gICAgICAgIHZhciBTRVBfQ0hBUkNPREUgPSAnJCcuY2hhckNvZGVBdCgwKSwgTE9XX0FMUEhBX1NUQVJUID0gJ2EnLmNoYXJDb2RlQXQoMCksIEhJR0hfQUxQSEFfRU5EID0gJ3onLmNoYXJDb2RlQXQoMCksIExHX0FMUEhBX1NUQVJUID0gJ0EnLmNoYXJDb2RlQXQoMCksIExHX0FMUEhBX0VORCA9ICdaJy5jaGFyQ29kZUF0KDApLCBESUdJVF9TVEFSVCA9ICcwJy5jaGFyQ29kZUF0KDApLCBESUdJVF9FTkQgPSAnOScuY2hhckNvZGVBdCgwKSwgVU5ERVJTQ09SRSA9ICdfJy5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICB2YXIgdGFpbCA9IDAsIGhlYWQgPSAwO1xyXG4gICAgICAgIHdoaWxlIChoZWFkIDwgbXNnLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBpZiAobXNnLmNoYXJDb2RlQXQoaGVhZCkgPT09IFNFUF9DSEFSQ09ERSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZW50ZXIgcGxhY2Vob2xkZXJcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG1zZy5zbGljZSh0YWlsLCBoZWFkKSk7XHJcbiAgICAgICAgICAgICAgICB0YWlsID0gaGVhZDtcclxuICAgICAgICAgICAgICAgICsraGVhZDtcclxuICAgICAgICAgICAgICAgIHZhciBjaCA9IG1zZy5jaGFyQ29kZUF0KGhlYWQpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKChjaCA+PSBMT1dfQUxQSEFfU1RBUlQgJiYgY2ggPD0gSElHSF9BTFBIQV9FTkQpIHx8IChjaCA+PSBMR19BTFBIQV9TVEFSVCAmJiBjaCA8PSBMR19BTFBIQV9FTkQpXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgKGNoID49IERJR0lUX1NUQVJUICYmIGNoIDw9IERJR0lUX0VORCkgfHwgY2ggPT09IFVOREVSU0NPUkUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaCA9IG1zZy5jaGFyQ29kZUF0KCsraGVhZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgcGxhY2Vob2xkZXIgPSBtc2cuc2xpY2UodGFpbCArIDEsIGhlYWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlaG9sZGVyLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZm9ybWF0IHN0cmluZzogZXJyb3IgYXQgJyArIHBsYWNlaG9sZGVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCcnICsgKHBhcmFtc1twbGFjZWhvbGRlcl0gfHwgJycpKTtcclxuICAgICAgICAgICAgICAgIC0taGVhZDtcclxuICAgICAgICAgICAgICAgIHRhaWwgPSBoZWFkICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICsraGVhZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXN1bHQucHVzaChtc2cuc2xpY2UodGFpbCkpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XHJcbiAgICB9O1xyXG4gICAgLyoqIFByb3RlY3RlZCBhcmVhICoqL1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsZWQgdG8gaGFuZGxlIGZvcm0gc3VibWl0IGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIEV2ZW50IG9iamVjdFxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybiB0cnVlIGlmIGZvcm0gc2hvdWxkIGJlIHN1Ym1pdHRlZCwgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAgICAgKi9cclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLm9uU3VibWl0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZSgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogSXQgaXMgZ3VhcmFudGVlZCB0aGF0IGFmdGVyIHN1Y2Nlc3NmdWxseSBjYWxsaW5nIHRoaXMgZnVuY3Rpb25zIGNvbnN0cmFpbnRzIGFyZSB1cC10byBkYXRlIHdpdGggRE9NIHZhbHVlcy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLl9lbnN1cmVDb25zdHJhaW50c0FyZUJ1aWx0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fY29uc3RyYWludHMgfHwgdGhpcy5fYXV0b0ludmFsaWRhdGVDb25zdHJhaW50cykge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWJ1aWxkRWxlbXMoKTtcclxuICAgICAgICAgICAgdGhpcy5fYnVpbGRDb25zdHJhaW50cygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENhbGxlZCB0byBzaG93IGVycm9ycyBvbiBjb3JyZXNwb25kaW5nIGVsZW1lbnRzLlxyXG4gICAgICogQHBhcmFtIGVycm9ycyBFcnJvciBvYmplY3QgYXMgcmV0cmlldmVkIGZyb20gdmFsaWRhdGUuanMuXHJcbiAgICAgKi9cclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLnNob3dFcnJvcnMgPSBmdW5jdGlvbiAoZXJyb3JzKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9lbGVtcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgc2hvd0Vycm9ycyBjYWxsOiBubyBlbGVtZW50cyBoYXMgYmVlbiBjb2xsZWN0ZWQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gT2JqZWN0LmtleXModGhpcy5fZWxlbXMpOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICB2YXIgZWxlbV9uYW1lID0gX2FbX2ldO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3JzICYmIGVycm9yc1tlbGVtX25hbWVdICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RXJyb3IoZXJyb3JzW2VsZW1fbmFtZV0sIHRoaXMuX2VsZW1zW2VsZW1fbmFtZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhckVycm9yKHRoaXMuX2VsZW1zW2VsZW1fbmFtZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ2FsbGVkIHRvIHNldCBlcnJvciBzdGF0ZSBmb3IgdGhlIGVsZW1lbnQgaW4gRE9NLlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1zZyBFcnJvciBtZXNzYWdlIGZvciB0aGUgZWxlbWVudFxyXG4gICAgICogQHBhcmFtIHtJbnB1dERhdGF9IGVsZW0gRWxlbWVudCBkYXRhXHJcbiAgICAgKi9cclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLnNldEVycm9yID0gZnVuY3Rpb24gKG1zZywgZWxlbSkge1xyXG4gICAgICAgIC8vIHNldCB0aXRsZXNcclxuICAgICAgICBlbGVtLmVsZW0uc2V0QXR0cmlidXRlKCd0aXRsZScsIG1zZyk7XHJcbiAgICAgICAgaWYgKGVsZW0uZXJyb3JFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBtc2dOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobXNnKTtcclxuICAgICAgICAgICAgZWxlbS5lcnJvckVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICAgIGVsZW0uZXJyb3JFbGVtZW50LmFwcGVuZENoaWxkKG1zZ05vZGUpO1xyXG4gICAgICAgICAgICBlbGVtLmVycm9yRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgbXNnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2V0IGNsYXNzZXNcclxuICAgICAgICBpZiAoZWxlbS5pYikge1xyXG4gICAgICAgICAgICBlbGVtLmliLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5pbnB1dEJsb2NrVmFsaWRDbGFzcyk7XHJcbiAgICAgICAgICAgIGVsZW0uaWIuY2xhc3NMaXN0LmFkZCh0aGlzLmlucHV0QmxvY2tJbnZhbGlkQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmlucHV0SW52YWxpZENsYXNzKSB7XHJcbiAgICAgICAgICAgIGVsZW0uZWxlbS5jbGFzc0xpc3QuYWRkKHRoaXMub3B0aW9ucy5pbnB1dEludmFsaWRDbGFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaW5wdXRWYWxpZENsYXNzKSB7XHJcbiAgICAgICAgICAgIGVsZW0uZWxlbS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMub3B0aW9ucy5pbnB1dFZhbGlkQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbGVtLnZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zZXRSb290SGFzRXJyb3JzKHRydWUpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ2FsbGVkIHRvIHNldCB2YWxpZCBzdGF0ZSBmb3IgdGhlIGVsZW1lbnQgaW4gRE9NXHJcbiAgICAgKiBAcGFyYW0ge0lucHV0RGF0YX0gZWxlbSBFbGVtZW50IGRhdGFcclxuICAgICAqL1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuY2xlYXJFcnJvciA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgLy8gY2xlYXIgdGl0bGVzXHJcbiAgICAgICAgZWxlbS5lbGVtLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAnJyk7XHJcbiAgICAgICAgaWYgKGVsZW0uZXJyb3JFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGVsZW0uZXJyb3JFbGVtZW50LmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgICAgICBlbGVtLmVycm9yRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjbGVhciBlcnJvciBjbGFzc2VzXHJcbiAgICAgICAgaWYgKGVsZW0uaWIpIHtcclxuICAgICAgICAgICAgZWxlbS5pYi5jbGFzc0xpc3QuYWRkKHRoaXMuaW5wdXRCbG9ja1ZhbGlkQ2xhc3MpO1xyXG4gICAgICAgICAgICBlbGVtLmliLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5pbnB1dEJsb2NrSW52YWxpZENsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pbnB1dEludmFsaWRDbGFzcykge1xyXG4gICAgICAgICAgICBlbGVtLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLm9wdGlvbnMuaW5wdXRJbnZhbGlkQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmlucHV0VmFsaWRDbGFzcykge1xyXG4gICAgICAgICAgICBlbGVtLmVsZW0uY2xhc3NMaXN0LmFkZCh0aGlzLm9wdGlvbnMuaW5wdXRWYWxpZENsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxlbS52YWxpZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5zZXRSb290SGFzRXJyb3JzKHRoaXMuX2hhc0ludmFsaWRFbGVtcygpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSByb290IGhhcyBhdCBsZWFzdCB2YWxpZGF0ZWQgYW5kIGludmFsaWQgZWxlbWVudC5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIEZvcm1WYWxpZGF0b3IucHJvdG90eXBlLl9oYXNJbnZhbGlkRWxlbXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5fZWxlbXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2VsZW1zKS5tYXAoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIF90aGlzLl9lbGVtc1t4XTsgfSkuc29tZShmdW5jdGlvbiAoeCkgeyByZXR1cm4gIXgudmFsaWQ7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGVzIGlucHV0IGVsZW1lbnQgZGF0YSwgZ2V0dGluZyBpdHMgc3RhdGUgZnJvbSBET00uXHJcbiAgICAgKiBWYWxpZGl0eSBzdGF0ZSBpcyBub3QgcmVzZXR0ZWQuXHJcbiAgICAgKiBAcGFyYW0ge0lucHV0RGF0YX0gZGF0YSBFbGVtZW50IGRhdGFcclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbSBFbGVtZW50IG5vZGUgaW4gRE9NXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5fdXBkYXRlSW5wdXREYXRhID0gZnVuY3Rpb24gKGRhdGEsIGVsZW0pIHtcclxuICAgICAgICB2YXIgaWIgPSBjbG9zZXN0KGVsZW0sICcuJyArIHRoaXMuX29wdGlvbnMuaW5wdXRCbG9jayk7XHJcbiAgICAgICAgaWYgKCFpYikge1xyXG4gICAgICAgICAgICBkYXRhLmVsZW0gPSBlbGVtO1xyXG4gICAgICAgICAgICBkYXRhLmliID0gbnVsbDtcclxuICAgICAgICAgICAgZGF0YS5lcnJvckVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBlcnJDb250YWluZXJDbGFzcyA9IG1ha2VFbGVtKCcnICsgdGhpcy5fb3B0aW9ucy5pbnB1dEJsb2NrLCAnJyArIHRoaXMuX29wdGlvbnMuaW5wdXRCbG9ja0Vycm9yRWxlbSk7XHJcbiAgICAgICAgdmFyIGVycm9yRWxlbWVudCA9IGliLnF1ZXJ5U2VsZWN0b3IoJy4nICsgZXJyQ29udGFpbmVyQ2xhc3MpO1xyXG4gICAgICAgIGlmICghZXJyb3JFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGVycm9yRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBpYi5hcHBlbmRDaGlsZChlcnJvckVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkYXRhLmVsZW0gPSBlbGVtO1xyXG4gICAgICAgIGRhdGEuaWIgPSBpYjtcclxuICAgICAgICBkYXRhLmVycm9yRWxlbWVudCA9IGVycm9yRWxlbWVudDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgZGF0YSBlbnRyeSBmb3IgZWxlbWVudCBpbnNpZGUgdGhlIHJvb3QuXHJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW0gRWxlbWVudCBub2RlIGluIERPTVxyXG4gICAgICogQHJldHVybnMge0lucHV0RGF0YX0gRWxlbWVudCBkYXRhXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5fYnVpbGRJbnB1dERhdGEgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB7IHZhbGlkOiBudWxsIH07XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlSW5wdXREYXRhKHJlc3VsdCwgZWxlbSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldCB1bmZvcm1hdHRlZCBtZXNzYWdlIG9mIHRoZSBnaXZlbiBjbGFzcyB0ZXh0IGZvciBhbiBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW0gRWxlbWVudCBub2RlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnQ2xhc3NlcyBMaXN0IG9mIG1lc3NhZ2UgY2xhc3Nlcy5cclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmcgfCBudWxsfVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuX2dldEVsZW1lbnRNc2cgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICAgIHZhciBtc2dDbGFzc2VzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgbXNnQ2xhc3Nlc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgcSA9IDA7IHEgPCBtc2dDbGFzc2VzLmxlbmd0aDsgKytxKSB7XHJcbiAgICAgICAgICAgIHZhciBtc2dDbGFzc1VuZGVyc2NvcmVkID0gJ2RhdGEtbXNnLScgKyBzZXBhcmF0ZWQobXNnQ2xhc3Nlc1txXSwgJy0nKSwgbXNnQ2xhc3NDYW1lbCA9ICdkYXRhLW1zZy0nICsgY2FtZWwobXNnQ2xhc3Nlc1txXSk7XHJcbiAgICAgICAgICAgIHZhciBhdHRyXzEgPSBlbGVtLmdldEF0dHJpYnV0ZShtc2dDbGFzc1VuZGVyc2NvcmVkKSB8fCBlbGVtLmdldEF0dHJpYnV0ZShtc2dDbGFzc0NhbWVsKTtcclxuICAgICAgICAgICAgaWYgKGF0dHJfMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF0dHJfMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0cnkgZ2VuZXJpYyBtZXNzYWdlXHJcbiAgICAgICAgdmFyIGF0dHIgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1tc2ctZXJyb3InKTtcclxuICAgICAgICBpZiAoYXR0cikge1xyXG4gICAgICAgICAgICByZXR1cm4gYXR0cjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zLm1lc3NhZ2VzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBxID0gMDsgcSA8IG1zZ0NsYXNzZXMubGVuZ3RoOyArK3EpIHtcclxuICAgICAgICAgICAgdmFyIGRlZiA9IHRoaXMuX29wdGlvbnMubWVzc2FnZXNbY2FtZWwobXNnQ2xhc3Nlc1txXSldO1xyXG4gICAgICAgICAgICBpZiAoZGVmKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIGVsZW1lbnQgZGF0YS5cclxuICAgICAqIEl0IHN5bmNocm9uaXplcyBlbGVtZW50IGRhdGEgd2l0aCBET00sIHJlbW92aW5nIGRhdGEgZW50cmllcyBmb3IgZWxlbWVudCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSBET00sIGFkZGluZyBkYXRhIGZvciBlbGVtZW50cyBhZGRlZCB0byBET00gYW5kIHVwZGF0aW5nIGRhdGEgZm9yIHVwZGF0ZWQgbm9kZXMuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5fcmVidWlsZEVsZW1zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZWxlbXMpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbXMgPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGVsZW1zID0gdGhpcy5yb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuYW1lXScpO1xyXG4gICAgICAgIHZhciBub3RVcGRhdGVkID0gT2JqZWN0LmtleXModGhpcy5fZWxlbXMpO1xyXG4gICAgICAgIGZvciAodmFyIHEgPSAwOyBxIDwgZWxlbXMubGVuZ3RoOyArK3EpIHtcclxuICAgICAgICAgICAgdmFyIGVsZW0gPSBlbGVtc1txXSwgZWxlbU5hbWUgPSBlbGVtLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8ICcnO1xyXG4gICAgICAgICAgICBpZiAoIWVsZW1OYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJObyBuYW1lIGZvciBlbGVtZW50XCIsIGVsZW0pO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2VsZW1zW2VsZW1OYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlSW5wdXREYXRhKHRoaXMuX2VsZW1zW2VsZW1OYW1lXSwgZWxlbSk7XHJcbiAgICAgICAgICAgICAgICBub3RVcGRhdGVkLnNwbGljZShub3RVcGRhdGVkLmluZGV4T2YoZWxlbU5hbWUpLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1zW2VsZW1OYW1lXSA9IHRoaXMuX2J1aWxkSW5wdXREYXRhKGVsZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHJlbW92ZSBlbnRyaWVzIHRoYXQgbm8gbW9yZSBleGlzdFxyXG4gICAgICAgIGZvciAodmFyIHEgPSAwOyBxIDwgbm90VXBkYXRlZC5sZW5ndGg7ICsrcSkge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fZWxlbXNbbm90VXBkYXRlZFtxXV07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmVidWlsZHMgY29uc3RyYWludCBkYXRhIGZyb20gRE9NIGRhdGEuXHJcbiAgICAgKiBDb25zdHJhaW50cyBhcmUgYXV0b21hdGlsbHkgcmVidWlsZGVkIHdoZW4gRE9NIGlzIGNoYW5nZWQuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5fYnVpbGRDb25zdHJhaW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9yZWJ1aWxkRWxlbXMoKTtcclxuICAgICAgICBpZiAoIXRoaXMuX2VsZW1zKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGJ1aWxkZXJLZXlzID0gT2JqZWN0LmtleXMoRm9ybVZhbGlkYXRvci5fY29uc3RyYWludEJ1aWxkZXJzKTtcclxuICAgICAgICB2YXIgYnVpbGRlckF0dHJzID0gYnVpbGRlcktleXMubWFwKGZ1bmN0aW9uICh4KSB7IHJldHVybiAnZGF0YS12YWxpZGF0ZS0nICsgeDsgfSk7XHJcbiAgICAgICAgdGhpcy5fY29uc3RyYWludHMgPSB7fTtcclxuICAgICAgICB2YXIgZWxlbU5hbWVzID0gT2JqZWN0LmtleXModGhpcy5fZWxlbXMpO1xyXG4gICAgICAgIGZvciAodmFyIHEgPSAwOyBxIDwgZWxlbU5hbWVzLmxlbmd0aDsgKytxKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtTmFtZSA9IGVsZW1OYW1lc1txXSwgZWxlbURhdGEgPSB0aGlzLl9lbGVtc1tlbGVtTmFtZV0sIGVsZW0gPSBlbGVtRGF0YS5lbGVtO1xyXG4gICAgICAgICAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUoJ2RhdGEtaWdub3JlZCcpIHx8IGVsZW0uaGFzQXR0cmlidXRlKCdmb3Jtbm92YWxpZGF0ZScpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgY29uc3RyYWludCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5fZ2V0RWxlbWVudE1zZyhlbGVtLCAncmVxdWlyZWQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQucHJlc2VuY2UgPSBtZXNzYWdlID8geyBtZXNzYWdlOiBtZXNzYWdlIH0gOiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlbGVtLmhhc0F0dHJpYnV0ZSgnbWlubGVuZ3RoJykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtaW5sZW5ndGggPSArZWxlbS5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLl9nZXRFbGVtZW50TXNnKGVsZW0sICdtaW5sZW5ndGgnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQubGVuZ3RoID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbmltdW06IG1pbmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IHRoaXMuZm9ybWF0TXNnKG1lc3NhZ2UsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWlubGVuZ3RoOiBtaW5sZW5ndGhcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50Lmxlbmd0aC5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUoJ3BhdHRlcm4nKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdHRlcm4gPSBlbGVtLmdldEF0dHJpYnV0ZSgncGF0dGVybicpO1xyXG4gICAgICAgICAgICAgICAgY29uc3RyYWludC5mb3JtYXQgPSB7IHBhdHRlcm46IHBhdHRlcm4gfTtcclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5fZ2V0RWxlbWVudE1zZyhlbGVtLCAncGF0dGVybicpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gdGhpcy5mb3JtYXRNc2cobWVzc2FnZSwgeyBwYXR0ZXJuOiBwYXR0ZXJuIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQuZm9ybWF0Lm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2lucHV0JzpcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoKGVsZW0uZ2V0QXR0cmlidXRlKCd0eXBlJykgfHwgJ3RleHQnKS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdlbWFpbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuX2dldEVsZW1lbnRNc2coZWxlbSwgJ2VtYWlsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQuZW1haWwgPSBtZXNzYWdlID8geyBtZXNzYWdlOiBtZXNzYWdlIH0gOiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3VybCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuX2dldEVsZW1lbnRNc2coZWxlbSwgJ3VybCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50LnVybCA9IG1lc3NhZ2UgPyB7IG1lc3NhZ2U6IG1lc3NhZ2UgfSA6IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtLmhhc0F0dHJpYnV0ZSgnZGF0YS12YWxpZGF0ZS11cmwtYWxsb3ctbG9jYWwnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zdHJhaW50LnVybCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50LnVybC5hbGxvd0xvY2FsID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQudXJsID0geyBhbGxvd0xvY2FsOiB0cnVlIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKCdkYXRhLXZhbGlkYXRlLXVybC1zY2hlbWVzJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY2hlbWVzID0gdm9pZCAwLCBzY2hlbWVzQXR0ciA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXZhbGlkYXRlLXVybC1zY2hlbWVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NoZW1lc0F0dHIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2hlbWVzID0gSlNPTi5wYXJzZShzY2hlbWVzQXR0cik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZW1lcyA9IFtzY2hlbWVzQXR0cl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc3RyYWludC51cmwgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQudXJsLnNjaGVtZXMgPSBzY2hlbWVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludC51cmwgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2hlbWVzOiBzY2hlbWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQubnVtZXJpY2FsaXR5ID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtaW4gPSBudWxsLCBtYXggPSBudWxsLCBzdGVwID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKCdtaW4nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluID0gK2VsZW0uZ2V0QXR0cmlidXRlKCdtaW4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQubnVtZXJpY2FsaXR5LmdyZWF0ZXJUaGFuT3JFcXVhbFRvID0gbWluO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtLmhhc0F0dHJpYnV0ZSgnbWF4JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heCA9ICtlbGVtLmdldEF0dHJpYnV0ZSgnbWF4Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50Lm51bWVyaWNhbGl0eS5sZXNzVGhhbk9yRXF1YWxUbyA9IG1heDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUoJ3N0ZXAnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcCA9ICtlbGVtLmdldEF0dHJpYnV0ZSgnc3RlcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludC5zdGVwID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA6IHN0ZXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWluICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50LnN0ZXAubWluID0gbWluO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1zZyA9IHRoaXMuX2dldEVsZW1lbnRNc2coZWxlbSwgJ3N0ZXAnLCAnbnVtYmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobXNnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludC5zdGVwLm1lc3NhZ2UgPSBtc2c7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlZk1zZ0NsYXNzID0gdm9pZCAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWluID09IG51bGwgJiYgbWF4ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZk1zZ0NsYXNzID0gJ251bWJlcic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobWluICE9IG51bGwgJiYgbWF4ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZk1zZ0NsYXNzID0gJ251bWJlck1pbk1heCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobWluICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZk1zZ0NsYXNzID0gJ251bWJlck1pbic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZNc2dDbGFzcyA9ICdudW1iZXJNYXgnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5fZ2V0RWxlbWVudE1zZyhlbGVtLCBkZWZNc2dDbGFzcywgJ251bWJlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IHRoaXMuZm9ybWF0TXNnKG1lc3NhZ2UsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW46IG1pbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXg6IG1heCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwOiBzdGVwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQubnVtZXJpY2FsaXR5Lm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnc2VsZWN0JzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHRhcmVhJzpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdVbnN1cHBvcnRlZCBlbGVtZW50IHRhZzogJywgZWxlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgcV8xID0gMDsgcV8xIDwgYnVpbGRlcktleXMubGVuZ3RoOyArK3FfMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKGJ1aWxkZXJBdHRyc1txXzFdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtc2cgPSB0aGlzLl9nZXRFbGVtZW50TXNnKGVsZW0sIGJ1aWxkZXJLZXlzW3FfMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdfY29uc3RyYWludCA9IEZvcm1WYWxpZGF0b3IuX2NvbnN0cmFpbnRCdWlsZGVyc1tidWlsZGVyS2V5c1txXzFdXShjb25zdHJhaW50LCBlbGVtLCAnJyArIGVsZW0uZ2V0QXR0cmlidXRlKGJ1aWxkZXJBdHRyc1txXzFdKSwgbXNnLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3X2NvbnN0cmFpbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludCA9IG5ld19jb25zdHJhaW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoY29uc3RyYWludCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29uc3RyYWludHNbZWxlbU5hbWVdID0gY29uc3RyYWludDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEVudGVyIGxpdmUgdmFsaWRhdGlvbiBtb2RlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5fYmVnaW5MaXZlVmFsaWRhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fbGl2ZVZhbGlkYXRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuX29wdGlvbnMucmV2YWxpZGF0ZU9uSW5wdXQgJiYgIXRoaXMuX29wdGlvbnMucmV2YWxpZGF0ZU9uQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl9lbGVtcykge1xyXG4gICAgICAgICAgICB0aGlzLl9idWlsZENvbnN0cmFpbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBPYmplY3Qua2V5cyh0aGlzLl9lbGVtcyk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtTmFtZSA9IF9hW19pXTtcclxuICAgICAgICAgICAgdmFyIGVsZW1EYXRhID0gdGhpcy5fZWxlbXNbZWxlbU5hbWVdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5yZXZhbGlkYXRlT25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1EYXRhLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5vbkVsZW1lbnRDaGFuZ2UuYmluZCh0aGlzLCBlbGVtTmFtZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnJldmFsaWRhdGVPbklucHV0KSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtRGF0YS5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5vbkVsZW1lbnRDaGFuZ2UuYmluZCh0aGlzLCBlbGVtTmFtZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xpdmVWYWxpZGF0aW9uID0gdHJ1ZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENhbGxlZCB3aGVuIHZhbHVlIG9mIGFuIGVsZW1lbnQgaGFzIGJlZW4gY2hhbmdlZC5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbGVtTmFtZVxyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZVxyXG4gICAgICovXHJcbiAgICBGb3JtVmFsaWRhdG9yLnByb3RvdHlwZS5vbkVsZW1lbnRDaGFuZ2UgPSBmdW5jdGlvbiAoZWxlbU5hbWUsIGUpIHtcclxuICAgICAgICB0aGlzLnZhbGlkYXRlU2luZ2xlKGVsZW1OYW1lKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgcm9vdCBub2RlIHRvIHJlZmxlY3QgaXRzIHZhbGlkaXR5IHN0YXRlLlxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBoYXNFcnJvcnNcclxuICAgICAqL1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuc2V0Um9vdEhhc0Vycm9ycyA9IGZ1bmN0aW9uIChoYXNFcnJvcnMpIHtcclxuICAgICAgICB0b2dnbGVDbGFzcyh0aGlzLl9yb290LCB0aGlzLnJvb3RWYWxpZENsYXNzLCAhaGFzRXJyb3JzKTtcclxuICAgICAgICB0b2dnbGVDbGFzcyh0aGlzLl9yb290LCB0aGlzLnJvb3RJbnZhbGlkQ2xhc3MsIGhhc0Vycm9ycyk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gZ2V0IHZhbHVlIG9mIGFuIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1cclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmcgfCBudWxsfVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgRm9ybVZhbGlkYXRvci5wcm90b3R5cGUuX2dldElucHV0VmFsdWUgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IGVsZW0udmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09ICcnID8gbnVsbCA6IHZhbHVlO1xyXG4gICAgfTtcclxuICAgIEZvcm1WYWxpZGF0b3IuX2NvbnN0cmFpbnRCdWlsZGVycyA9IHt9O1xyXG4gICAgcmV0dXJuIEZvcm1WYWxpZGF0b3I7XHJcbn0oKSk7XHJcbmV4cG9ydHMuRm9ybVZhbGlkYXRvciA9IEZvcm1WYWxpZGF0b3I7XHJcbi8qKlxyXG4gKiBFbGVtZW50Lm1hdGNoZXMgbWV0aG9kIHBvbHlmaWxsLlxyXG4gKiBXZSBzaG91bGQgbm90IHRvdWNoIHByb3RvdHlwZSBvZiBFbGVtZW50IHRvIGF2b2lkIG1lc3Npbmcgd2l0aCBhbm90aGVyIGxpYnNcclxuICovXHJcbnZhciBtYXRjaGVzRnVuYyA9IG51bGw7XHJcbmZ1bmN0aW9uIG1hdGNoZXMoZWxlbSwgc2VsZWN0b3IpIHtcclxuICAgIGlmICghbWF0Y2hlc0Z1bmMpIHtcclxuICAgICAgICBtYXRjaGVzRnVuYyA9IEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgfHwgRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1hdGNoZXNGdW5jLmNhbGwoZWxlbSwgc2VsZWN0b3IpO1xyXG59XHJcbi8qKlxyXG4gKiBFbGVtZW50LmNsb3Nlc3QgbWV0aG9kIHBvbHlmaWxsXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9zZXN0KGVsZW0sIHNlbGVjdG9yKSB7XHJcbiAgICBpZiAoZWxlbS5jbG9zZXN0KSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZW0uY2xvc2VzdChzZWxlY3Rvcik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZWwgPSBlbGVtO1xyXG4gICAgICAgIHdoaWxlIChlbCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaGVzKGVsLCBzZWxlY3RvcikpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbDtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBhc3NpZ24oKSB7XHJcbiAgICB2YXIgb2JqcyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBvYmpzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICBpZiAoT2JqZWN0LmFzc2lnbikge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduLmFwcGx5KHRoaXMsIG9ianMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGxvZGFzaF9hc3NpZ24uYXBwbHkodGhpcywgb2Jqcyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gbWFrZU1vZChibG9jaywgbW9kaWZpZXIpIHtcclxuICAgIHJldHVybiBtb2RpZmllciA/IGJsb2NrICsgJy0tJyArIG1vZGlmaWVyIDogYmxvY2s7XHJcbn1cclxuZnVuY3Rpb24gbWFrZUVsZW0oYmxvY2ssIGVsZW0pIHtcclxuICAgIHJldHVybiBibG9jayArICdfXycgKyBlbGVtO1xyXG59XHJcbmZ1bmN0aW9uIHRvZ2dsZUNsYXNzKGVsZW0sIGNsYXNzTmFtZSwgdmFsdWUpIHtcclxuICAgICh2YWx1ZSA/IGVsZW0uY2xhc3NMaXN0LmFkZCA6IGVsZW0uY2xhc3NMaXN0LnJlbW92ZSkuY2FsbChlbGVtLmNsYXNzTGlzdCwgY2xhc3NOYW1lKTtcclxufVxyXG4vKipcclxuICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgY29udmVydHMgYSBuYW1lIGludG8gYSBuYW1lIGluIHVuZGVyc2NvcmUtc2VwYXJhdGVkIGZvcm1hdCAoaW4gZmFjdCwgeW91IGNhbiByZXBsYWNlIGFuIHVuZGVyc2NvcmUgd2l0aCBhIGNoYXJhY3RlciBvZiB5b3VyIGNob2ljZSlcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBpbiBjYW1lbC1jYXNlIGZvcm1hdCAob3IgbWl4ZWQgd2l0aCB1bmRlcnNjb3JlcyBhbmQgZGFzaGVzKVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VwIFNlcGFyYXRvciB0byB1c2UgaW5zdGVhZCBvZiB1bmRlcnNjb3JlXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEZvcm1hdHRlZCBuYW1lXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXBhcmF0ZWQobmFtZSwgc2VwKSB7XHJcbiAgICBpZiAoc2VwID09PSB2b2lkIDApIHsgc2VwID0gJ18nOyB9XHJcbiAgICB2YXIgQ0hfTEdfTE9XRVIgPSAnQScuY2hhckNvZGVBdCgwKSwgQ0hfTEdfSElHSCA9ICdaJy5jaGFyQ29kZUF0KDApO1xyXG4gICAgdmFyIHRhaWwgPSAwLCBoZWFkID0gMDtcclxuICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgIHdoaWxlIChoZWFkIDwgbmFtZS5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgY2ggPSBuYW1lLmNoYXJDb2RlQXQoaGVhZCk7XHJcbiAgICAgICAgaWYgKGNoID49IENIX0xHX0xPV0VSICYmIGNoIDw9IENIX0xHX0hJR0ggJiYgaGVhZCAhPT0gMCkge1xyXG4gICAgICAgICAgICAvLyBzcGxpdCBoZXJlXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5hbWUuc2xpY2UodGFpbCwgaGVhZCkudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgICAgIHRhaWwgPSBoZWFkO1xyXG4gICAgICAgIH1cclxuICAgICAgICArK2hlYWQ7XHJcbiAgICB9XHJcbiAgICBpZiAoaGVhZCAhPSB0YWlsKSB7XHJcbiAgICAgICAgcmVzdWx0LnB1c2gobmFtZS5zbGljZSh0YWlsLCBoZWFkKS50b0xvd2VyQ2FzZSgpKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQuam9pbihzZXApO1xyXG59XHJcbmV4cG9ydHMuc2VwYXJhdGVkID0gc2VwYXJhdGVkO1xyXG4vKipcclxuICogQ29udmVydHMgbmFtZSB3aGVyZSBwYXJ0cyBhcmUgc2VwYXJhdGVkIHdpdGggdW5kZXJzY29yZXMgb3IgZGFzaGVzIHRvIGNhbWVsLWNhc2UgZm9ybWF0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IENhbWVsLWNhc2UgZm9ybWF0dGVkIG5hbWVcclxuICovXHJcbmZ1bmN0aW9uIGNhbWVsKG5hbWUpIHtcclxuICAgIHZhciByZXN1bHQgPSBuYW1lLnNwbGl0KC9bX1xcLV0vKS5maWx0ZXIoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHg7IH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdC5tYXAoZnVuY3Rpb24gKHgsIGkpIHsgcmV0dXJuIGkgPiAwID8gKHguc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIHguc2xpY2UoMSkudG9Mb3dlckNhc2UoKSkgOiB4OyB9KS5qb2luKCcnKTtcclxufVxyXG5leHBvcnRzLmNhbWVsID0gY2FtZWw7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vaW5kZXgudHNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyohXG4gKiB2YWxpZGF0ZS5qcyAwLjEyLjBcbiAqXG4gKiAoYykgMjAxMy0yMDE3IE5pY2tsYXMgQW5zbWFuLCAyMDEzIFdyYXBwXG4gKiBWYWxpZGF0ZS5qcyBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIEZvciBhbGwgZGV0YWlscyBhbmQgZG9jdW1lbnRhdGlvbjpcbiAqIGh0dHA6Ly92YWxpZGF0ZWpzLm9yZy9cbiAqL1xuXG4oZnVuY3Rpb24oZXhwb3J0cywgbW9kdWxlLCBkZWZpbmUpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gVGhlIG1haW4gZnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgdmFsaWRhdG9ycyBzcGVjaWZpZWQgYnkgdGhlIGNvbnN0cmFpbnRzLlxuICAvLyBUaGUgb3B0aW9ucyBhcmUgdGhlIGZvbGxvd2luZzpcbiAgLy8gICAtIGZvcm1hdCAoc3RyaW5nKSAtIEFuIG9wdGlvbiB0aGF0IGNvbnRyb2xzIGhvdyB0aGUgcmV0dXJuZWQgdmFsdWUgaXMgZm9ybWF0dGVkXG4gIC8vICAgICAqIGZsYXQgLSBSZXR1cm5zIGEgZmxhdCBhcnJheSBvZiBqdXN0IHRoZSBlcnJvciBtZXNzYWdlc1xuICAvLyAgICAgKiBncm91cGVkIC0gUmV0dXJucyB0aGUgbWVzc2FnZXMgZ3JvdXBlZCBieSBhdHRyaWJ1dGUgKGRlZmF1bHQpXG4gIC8vICAgICAqIGRldGFpbGVkIC0gUmV0dXJucyBhbiBhcnJheSBvZiB0aGUgcmF3IHZhbGlkYXRpb24gZGF0YVxuICAvLyAgIC0gZnVsbE1lc3NhZ2VzIChib29sZWFuKSAtIElmIGB0cnVlYCAoZGVmYXVsdCkgdGhlIGF0dHJpYnV0ZSBuYW1lIGlzIHByZXBlbmRlZCB0byB0aGUgZXJyb3IuXG4gIC8vXG4gIC8vIFBsZWFzZSBub3RlIHRoYXQgdGhlIG9wdGlvbnMgYXJlIGFsc28gcGFzc2VkIHRvIGVhY2ggdmFsaWRhdG9yLlxuICB2YXIgdmFsaWRhdGUgPSBmdW5jdGlvbihhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgIHZhciByZXN1bHRzID0gdi5ydW5WYWxpZGF0aW9ucyhhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucylcbiAgICAgICwgYXR0clxuICAgICAgLCB2YWxpZGF0b3I7XG5cbiAgICBpZiAocmVzdWx0cy5zb21lKGZ1bmN0aW9uKHIpIHsgcmV0dXJuIHYuaXNQcm9taXNlKHIuZXJyb3IpOyB9KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVXNlIHZhbGlkYXRlLmFzeW5jIGlmIHlvdSB3YW50IHN1cHBvcnQgZm9yIHByb21pc2VzXCIpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsaWRhdGUucHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzKHJlc3VsdHMsIG9wdGlvbnMpO1xuICB9O1xuXG4gIHZhciB2ID0gdmFsaWRhdGU7XG5cbiAgLy8gQ29waWVzIG92ZXIgYXR0cmlidXRlcyBmcm9tIG9uZSBvciBtb3JlIHNvdXJjZXMgdG8gYSBzaW5nbGUgZGVzdGluYXRpb24uXG4gIC8vIFZlcnkgbXVjaCBzaW1pbGFyIHRvIHVuZGVyc2NvcmUncyBleHRlbmQuXG4gIC8vIFRoZSBmaXJzdCBhcmd1bWVudCBpcyB0aGUgdGFyZ2V0IG9iamVjdCBhbmQgdGhlIHJlbWFpbmluZyBhcmd1bWVudHMgd2lsbCBiZVxuICAvLyB1c2VkIGFzIHNvdXJjZXMuXG4gIHYuZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBmb3IgKHZhciBhdHRyIGluIHNvdXJjZSkge1xuICAgICAgICBvYmpbYXR0cl0gPSBzb3VyY2VbYXR0cl07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICB2LmV4dGVuZCh2YWxpZGF0ZSwge1xuICAgIC8vIFRoaXMgaXMgdGhlIHZlcnNpb24gb2YgdGhlIGxpYnJhcnkgYXMgYSBzZW12ZXIuXG4gICAgLy8gVGhlIHRvU3RyaW5nIGZ1bmN0aW9uIHdpbGwgYWxsb3cgaXQgdG8gYmUgY29lcmNlZCBpbnRvIGEgc3RyaW5nXG4gICAgdmVyc2lvbjoge1xuICAgICAgbWFqb3I6IDAsXG4gICAgICBtaW5vcjogMTIsXG4gICAgICBwYXRjaDogMCxcbiAgICAgIG1ldGFkYXRhOiBudWxsLFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmVyc2lvbiA9IHYuZm9ybWF0KFwiJXttYWpvcn0uJXttaW5vcn0uJXtwYXRjaH1cIiwgdi52ZXJzaW9uKTtcbiAgICAgICAgaWYgKCF2LmlzRW1wdHkodi52ZXJzaW9uLm1ldGFkYXRhKSkge1xuICAgICAgICAgIHZlcnNpb24gKz0gXCIrXCIgKyB2LnZlcnNpb24ubWV0YWRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEJlbG93IGlzIHRoZSBkZXBlbmRlbmNpZXMgdGhhdCBhcmUgdXNlZCBpbiB2YWxpZGF0ZS5qc1xuXG4gICAgLy8gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBQcm9taXNlIGltcGxlbWVudGF0aW9uLlxuICAgIC8vIElmIHlvdSBhcmUgdXNpbmcgUS5qcywgUlNWUCBvciBhbnkgb3RoZXIgQSsgY29tcGF0aWJsZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vIG92ZXJyaWRlIHRoaXMgYXR0cmlidXRlIHRvIGJlIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGF0IHByb21pc2UuXG4gICAgLy8gU2luY2UgalF1ZXJ5IHByb21pc2VzIGFyZW4ndCBBKyBjb21wYXRpYmxlIHRoZXkgd29uJ3Qgd29yay5cbiAgICBQcm9taXNlOiB0eXBlb2YgUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIiA/IFByb21pc2UgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBudWxsLFxuXG4gICAgRU1QVFlfU1RSSU5HX1JFR0VYUDogL15cXHMqJC8sXG5cbiAgICAvLyBSdW5zIHRoZSB2YWxpZGF0b3JzIHNwZWNpZmllZCBieSB0aGUgY29uc3RyYWludHMgb2JqZWN0LlxuICAgIC8vIFdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBmb3JtYXQ6XG4gICAgLy8gICAgIFt7YXR0cmlidXRlOiBcIjxhdHRyaWJ1dGUgbmFtZT5cIiwgZXJyb3I6IFwiPHZhbGlkYXRpb24gcmVzdWx0PlwifSwgLi4uXVxuICAgIHJ1blZhbGlkYXRpb25zOiBmdW5jdGlvbihhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgICAgdmFyIHJlc3VsdHMgPSBbXVxuICAgICAgICAsIGF0dHJcbiAgICAgICAgLCB2YWxpZGF0b3JOYW1lXG4gICAgICAgICwgdmFsdWVcbiAgICAgICAgLCB2YWxpZGF0b3JzXG4gICAgICAgICwgdmFsaWRhdG9yXG4gICAgICAgICwgdmFsaWRhdG9yT3B0aW9uc1xuICAgICAgICAsIGVycm9yO1xuXG4gICAgICBpZiAodi5pc0RvbUVsZW1lbnQoYXR0cmlidXRlcykgfHwgdi5pc0pxdWVyeUVsZW1lbnQoYXR0cmlidXRlcykpIHtcbiAgICAgICAgYXR0cmlidXRlcyA9IHYuY29sbGVjdEZvcm1WYWx1ZXMoYXR0cmlidXRlcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIExvb3BzIHRocm91Z2ggZWFjaCBjb25zdHJhaW50cywgZmluZHMgdGhlIGNvcnJlY3QgdmFsaWRhdG9yIGFuZCBydW4gaXQuXG4gICAgICBmb3IgKGF0dHIgaW4gY29uc3RyYWludHMpIHtcbiAgICAgICAgdmFsdWUgPSB2LmdldERlZXBPYmplY3RWYWx1ZShhdHRyaWJ1dGVzLCBhdHRyKTtcbiAgICAgICAgLy8gVGhpcyBhbGxvd3MgdGhlIGNvbnN0cmFpbnRzIGZvciBhbiBhdHRyaWJ1dGUgdG8gYmUgYSBmdW5jdGlvbi5cbiAgICAgICAgLy8gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIHZhbHVlLCBhdHRyaWJ1dGUgbmFtZSwgdGhlIGNvbXBsZXRlIGRpY3Qgb2ZcbiAgICAgICAgLy8gYXR0cmlidXRlcyBhcyB3ZWxsIGFzIHRoZSBvcHRpb25zIGFuZCBjb25zdHJhaW50cyBwYXNzZWQgaW4uXG4gICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gaGF2ZSBkaWZmZXJlbnRcbiAgICAgICAgLy8gdmFsaWRhdGlvbnMgZGVwZW5kaW5nIG9uIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICAgIHZhbGlkYXRvcnMgPSB2LnJlc3VsdChjb25zdHJhaW50c1thdHRyXSwgdmFsdWUsIGF0dHJpYnV0ZXMsIGF0dHIsIG9wdGlvbnMsIGNvbnN0cmFpbnRzKTtcblxuICAgICAgICBmb3IgKHZhbGlkYXRvck5hbWUgaW4gdmFsaWRhdG9ycykge1xuICAgICAgICAgIHZhbGlkYXRvciA9IHYudmFsaWRhdG9yc1t2YWxpZGF0b3JOYW1lXTtcblxuICAgICAgICAgIGlmICghdmFsaWRhdG9yKSB7XG4gICAgICAgICAgICBlcnJvciA9IHYuZm9ybWF0KFwiVW5rbm93biB2YWxpZGF0b3IgJXtuYW1lfVwiLCB7bmFtZTogdmFsaWRhdG9yTmFtZX0pO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YWxpZGF0b3JPcHRpb25zID0gdmFsaWRhdG9yc1t2YWxpZGF0b3JOYW1lXTtcbiAgICAgICAgICAvLyBUaGlzIGFsbG93cyB0aGUgb3B0aW9ucyB0byBiZSBhIGZ1bmN0aW9uLiBUaGUgZnVuY3Rpb24gd2lsbCBiZVxuICAgICAgICAgIC8vIGNhbGxlZCB3aXRoIHRoZSB2YWx1ZSwgYXR0cmlidXRlIG5hbWUsIHRoZSBjb21wbGV0ZSBkaWN0IG9mXG4gICAgICAgICAgLy8gYXR0cmlidXRlcyBhcyB3ZWxsIGFzIHRoZSBvcHRpb25zIGFuZCBjb25zdHJhaW50cyBwYXNzZWQgaW4uXG4gICAgICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0byBoYXZlIGRpZmZlcmVudFxuICAgICAgICAgIC8vIHZhbGlkYXRpb25zIGRlcGVuZGluZyBvbiB0aGUgYXR0cmlidXRlIHZhbHVlLlxuICAgICAgICAgIHZhbGlkYXRvck9wdGlvbnMgPSB2LnJlc3VsdCh2YWxpZGF0b3JPcHRpb25zLCB2YWx1ZSwgYXR0cmlidXRlcywgYXR0ciwgb3B0aW9ucywgY29uc3RyYWludHMpO1xuICAgICAgICAgIGlmICghdmFsaWRhdG9yT3B0aW9ucykge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICBhdHRyaWJ1dGU6IGF0dHIsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICB2YWxpZGF0b3I6IHZhbGlkYXRvck5hbWUsXG4gICAgICAgICAgICBnbG9iYWxPcHRpb25zOiBvcHRpb25zLFxuICAgICAgICAgICAgYXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHZhbGlkYXRvck9wdGlvbnMsXG4gICAgICAgICAgICBlcnJvcjogdmFsaWRhdG9yLmNhbGwodmFsaWRhdG9yLFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRvck9wdGlvbnMsXG4gICAgICAgICAgICAgICAgYXR0cixcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgIG9wdGlvbnMpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfSxcblxuICAgIC8vIFRha2VzIHRoZSBvdXRwdXQgZnJvbSBydW5WYWxpZGF0aW9ucyBhbmQgY29udmVydHMgaXQgdG8gdGhlIGNvcnJlY3RcbiAgICAvLyBvdXRwdXQgZm9ybWF0LlxuICAgIHByb2Nlc3NWYWxpZGF0aW9uUmVzdWx0czogZnVuY3Rpb24oZXJyb3JzLCBvcHRpb25zKSB7XG4gICAgICBlcnJvcnMgPSB2LnBydW5lRW1wdHlFcnJvcnMoZXJyb3JzLCBvcHRpb25zKTtcbiAgICAgIGVycm9ycyA9IHYuZXhwYW5kTXVsdGlwbGVFcnJvcnMoZXJyb3JzLCBvcHRpb25zKTtcbiAgICAgIGVycm9ycyA9IHYuY29udmVydEVycm9yTWVzc2FnZXMoZXJyb3JzLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGZvcm1hdCA9IG9wdGlvbnMuZm9ybWF0IHx8IFwiZ3JvdXBlZFwiO1xuXG4gICAgICBpZiAodHlwZW9mIHYuZm9ybWF0dGVyc1tmb3JtYXRdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGVycm9ycyA9IHYuZm9ybWF0dGVyc1tmb3JtYXRdKGVycm9ycyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3Iodi5mb3JtYXQoXCJVbmtub3duIGZvcm1hdCAle2Zvcm1hdH1cIiwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdi5pc0VtcHR5KGVycm9ycykgPyB1bmRlZmluZWQgOiBlcnJvcnM7XG4gICAgfSxcblxuICAgIC8vIFJ1bnMgdGhlIHZhbGlkYXRpb25zIHdpdGggc3VwcG9ydCBmb3IgcHJvbWlzZXMuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiBhIHByb21pc2UgdGhhdCBpcyBzZXR0bGVkIHdoZW4gYWxsIHRoZVxuICAgIC8vIHZhbGlkYXRpb24gcHJvbWlzZXMgaGF2ZSBiZWVuIGNvbXBsZXRlZC5cbiAgICAvLyBJdCBjYW4gYmUgY2FsbGVkIGV2ZW4gaWYgbm8gdmFsaWRhdGlvbnMgcmV0dXJuZWQgYSBwcm9taXNlLlxuICAgIGFzeW5jOiBmdW5jdGlvbihhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB2LmFzeW5jLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgV3JhcEVycm9ycyA9IG9wdGlvbnMud3JhcEVycm9ycyB8fCBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgICAgcmV0dXJuIGVycm9ycztcbiAgICAgIH07XG5cbiAgICAgIC8vIFJlbW92ZXMgdW5rbm93biBhdHRyaWJ1dGVzXG4gICAgICBpZiAob3B0aW9ucy5jbGVhbkF0dHJpYnV0ZXMgIT09IGZhbHNlKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMgPSB2LmNsZWFuQXR0cmlidXRlcyhhdHRyaWJ1dGVzLCBjb25zdHJhaW50cyk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXN1bHRzID0gdi5ydW5WYWxpZGF0aW9ucyhhdHRyaWJ1dGVzLCBjb25zdHJhaW50cywgb3B0aW9ucyk7XG5cbiAgICAgIHJldHVybiBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2LndhaXRGb3JSZXN1bHRzKHJlc3VsdHMpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGVycm9ycyA9IHYucHJvY2Vzc1ZhbGlkYXRpb25SZXN1bHRzKHJlc3VsdHMsIG9wdGlvbnMpO1xuICAgICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgV3JhcEVycm9ycyhlcnJvcnMsIG9wdGlvbnMsIGF0dHJpYnV0ZXMsIGNvbnN0cmFpbnRzKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmUoYXR0cmlidXRlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2luZ2xlOiBmdW5jdGlvbih2YWx1ZSwgY29uc3RyYWludHMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdi5zaW5nbGUub3B0aW9ucywgb3B0aW9ucywge1xuICAgICAgICBmb3JtYXQ6IFwiZmxhdFwiLFxuICAgICAgICBmdWxsTWVzc2FnZXM6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2KHtzaW5nbGU6IHZhbHVlfSwge3NpbmdsZTogY29uc3RyYWludHN9LCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIGFsbCBwcm9taXNlcyBpbiB0aGUgcmVzdWx0cyBhcnJheVxuICAgIC8vIGFyZSBzZXR0bGVkLiBUaGUgcHJvbWlzZSByZXR1cm5lZCBmcm9tIHRoaXMgZnVuY3Rpb24gaXMgYWx3YXlzIHJlc29sdmVkLFxuICAgIC8vIG5ldmVyIHJlamVjdGVkLlxuICAgIC8vIFRoaXMgZnVuY3Rpb24gbW9kaWZpZXMgdGhlIGlucHV0IGFyZ3VtZW50LCBpdCByZXBsYWNlcyB0aGUgcHJvbWlzZXNcbiAgICAvLyB3aXRoIHRoZSB2YWx1ZSByZXR1cm5lZCBmcm9tIHRoZSBwcm9taXNlLlxuICAgIHdhaXRGb3JSZXN1bHRzOiBmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAvLyBDcmVhdGUgYSBzZXF1ZW5jZSBvZiBhbGwgdGhlIHJlc3VsdHMgc3RhcnRpbmcgd2l0aCBhIHJlc29sdmVkIHByb21pc2UuXG4gICAgICByZXR1cm4gcmVzdWx0cy5yZWR1Y2UoZnVuY3Rpb24obWVtbywgcmVzdWx0KSB7XG4gICAgICAgIC8vIElmIHRoaXMgcmVzdWx0IGlzbid0IGEgcHJvbWlzZSBza2lwIGl0IGluIHRoZSBzZXF1ZW5jZS5cbiAgICAgICAgaWYgKCF2LmlzUHJvbWlzZShyZXN1bHQuZXJyb3IpKSB7XG4gICAgICAgICAgcmV0dXJuIG1lbW87XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWVtby50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZXJyb3IudGhlbihmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gZXJyb3IgfHwgbnVsbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBuZXcgdi5Qcm9taXNlKGZ1bmN0aW9uKHIpIHsgcigpOyB9KSk7IC8vIEEgcmVzb2x2ZWQgcHJvbWlzZVxuICAgIH0sXG5cbiAgICAvLyBJZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBjYWxsOiBmdW5jdGlvbiB0aGUgYW5kOiBmdW5jdGlvbiByZXR1cm4gdGhlIHZhbHVlXG4gICAgLy8gb3RoZXJ3aXNlIGp1c3QgcmV0dXJuIHRoZSB2YWx1ZS4gQWRkaXRpb25hbCBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgYXNcbiAgICAvLyBhcmd1bWVudHMgdG8gdGhlIGZ1bmN0aW9uLlxuICAgIC8vIEV4YW1wbGU6XG4gICAgLy8gYGBgXG4gICAgLy8gcmVzdWx0KCdmb28nKSAvLyAnZm9vJ1xuICAgIC8vIHJlc3VsdChNYXRoLm1heCwgMSwgMikgLy8gMlxuICAgIC8vIGBgYFxuICAgIHJlc3VsdDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIHZhbHVlIGlzIGEgbnVtYmVyLiBUaGlzIGZ1bmN0aW9uIGRvZXMgbm90IGNvbnNpZGVyIE5hTiBhXG4gICAgLy8gbnVtYmVyIGxpa2UgbWFueSBvdGhlciBgaXNOdW1iZXJgIGZ1bmN0aW9ucyBkby5cbiAgICBpc051bWJlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSk7XG4gICAgfSxcblxuICAgIC8vIFJldHVybnMgZmFsc2UgaWYgdGhlIG9iamVjdCBpcyBub3QgYSBmdW5jdGlvblxuICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xuICAgIH0sXG5cbiAgICAvLyBBIHNpbXBsZSBjaGVjayB0byB2ZXJpZnkgdGhhdCB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlci4gVXNlcyBgaXNOdW1iZXJgXG4gICAgLy8gYW5kIGEgc2ltcGxlIG1vZHVsbyBjaGVjay5cbiAgICBpc0ludGVnZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdi5pc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgJSAxID09PSAwO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIHZhbHVlIGlzIGEgYm9vbGVhblxuICAgIGlzQm9vbGVhbjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJztcbiAgICB9LFxuXG4gICAgLy8gVXNlcyB0aGUgYE9iamVjdGAgZnVuY3Rpb24gdG8gY2hlY2sgaWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGFuIG9iamVjdC5cbiAgICBpc09iamVjdDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbiAgICB9LFxuXG4gICAgLy8gU2ltcGx5IGNoZWNrcyBpZiB0aGUgb2JqZWN0IGlzIGFuIGluc3RhbmNlIG9mIGEgZGF0ZVxuICAgIGlzRGF0ZTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRGF0ZTtcbiAgICB9LFxuXG4gICAgLy8gUmV0dXJucyBmYWxzZSBpZiB0aGUgb2JqZWN0IGlzIGBudWxsYCBvZiBgdW5kZWZpbmVkYFxuICAgIGlzRGVmaW5lZDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICE9PSBudWxsICYmIG9iaiAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgcHJvbWlzZS4gQW55dGhpbmcgd2l0aCBhIGB0aGVuYFxuICAgIC8vIGZ1bmN0aW9uIGlzIGNvbnNpZGVyZWQgYSBwcm9taXNlLlxuICAgIGlzUHJvbWlzZTogZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuICEhcCAmJiB2LmlzRnVuY3Rpb24ocC50aGVuKTtcbiAgICB9LFxuXG4gICAgaXNKcXVlcnlFbGVtZW50OiBmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gbyAmJiB2LmlzU3RyaW5nKG8uanF1ZXJ5KTtcbiAgICB9LFxuXG4gICAgaXNEb21FbGVtZW50OiBmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoIW8pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW8ucXVlcnlTZWxlY3RvckFsbCB8fCAhby5xdWVyeVNlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHYuaXNPYmplY3QoZG9jdW1lbnQpICYmIG8gPT09IGRvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zODQzODAvNjk5MzA0XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG8gJiZcbiAgICAgICAgICB0eXBlb2YgbyA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgIG8gIT09IG51bGwgJiZcbiAgICAgICAgICBvLm5vZGVUeXBlID09PSAxICYmXG4gICAgICAgICAgdHlwZW9mIG8ubm9kZU5hbWUgPT09IFwic3RyaW5nXCI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGlzRW1wdHk6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgYXR0cjtcblxuICAgICAgLy8gTnVsbCBhbmQgdW5kZWZpbmVkIGFyZSBlbXB0eVxuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGZ1bmN0aW9ucyBhcmUgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIFdoaXRlc3BhY2Ugb25seSBzdHJpbmdzIGFyZSBlbXB0eVxuICAgICAgaWYgKHYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2LkVNUFRZX1NUUklOR19SRUdFWFAudGVzdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZvciBhcnJheXMgd2UgdXNlIHRoZSBsZW5ndGggcHJvcGVydHlcbiAgICAgIGlmICh2LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPT09IDA7XG4gICAgICB9XG5cbiAgICAgIC8vIERhdGVzIGhhdmUgbm8gYXR0cmlidXRlcyBidXQgYXJlbid0IGVtcHR5XG4gICAgICBpZiAodi5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgZmluZCBhdCBsZWFzdCBvbmUgcHJvcGVydHkgd2UgY29uc2lkZXIgaXQgbm9uIGVtcHR5XG4gICAgICBpZiAodi5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgZm9yIChhdHRyIGluIHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIEZvcm1hdHMgdGhlIHNwZWNpZmllZCBzdHJpbmdzIHdpdGggdGhlIGdpdmVuIHZhbHVlcyBsaWtlIHNvOlxuICAgIC8vIGBgYFxuICAgIC8vIGZvcm1hdChcIkZvbzogJXtmb299XCIsIHtmb286IFwiYmFyXCJ9KSAvLyBcIkZvbyBiYXJcIlxuICAgIC8vIGBgYFxuICAgIC8vIElmIHlvdSB3YW50IHRvIHdyaXRlICV7Li4ufSB3aXRob3V0IGhhdmluZyBpdCByZXBsYWNlZCBzaW1wbHlcbiAgICAvLyBwcmVmaXggaXQgd2l0aCAlIGxpa2UgdGhpcyBgRm9vOiAlJXtmb299YCBhbmQgaXQgd2lsbCBiZSByZXR1cm5lZFxuICAgIC8vIGFzIGBcIkZvbzogJXtmb299XCJgXG4gICAgZm9ybWF0OiB2LmV4dGVuZChmdW5jdGlvbihzdHIsIHZhbHMpIHtcbiAgICAgIGlmICghdi5pc1N0cmluZyhzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2Uodi5mb3JtYXQuRk9STUFUX1JFR0VYUCwgZnVuY3Rpb24obTAsIG0xLCBtMikge1xuICAgICAgICBpZiAobTEgPT09ICclJykge1xuICAgICAgICAgIHJldHVybiBcIiV7XCIgKyBtMiArIFwifVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsc1ttMl0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LCB7XG4gICAgICAvLyBGaW5kcyAle2tleX0gc3R5bGUgcGF0dGVybnMgaW4gdGhlIGdpdmVuIHN0cmluZ1xuICAgICAgRk9STUFUX1JFR0VYUDogLyglPyklXFx7KFteXFx9XSspXFx9L2dcbiAgICB9KSxcblxuICAgIC8vIFwiUHJldHRpZmllc1wiIHRoZSBnaXZlbiBzdHJpbmcuXG4gICAgLy8gUHJldHRpZnlpbmcgbWVhbnMgcmVwbGFjaW5nIFsuXFxfLV0gd2l0aCBzcGFjZXMgYXMgd2VsbCBhcyBzcGxpdHRpbmdcbiAgICAvLyBjYW1lbCBjYXNlIHdvcmRzLlxuICAgIHByZXR0aWZ5OiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGlmICh2LmlzTnVtYmVyKHN0cikpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG1vcmUgdGhhbiAyIGRlY2ltYWxzIHJvdW5kIGl0IHRvIHR3b1xuICAgICAgICBpZiAoKHN0ciAqIDEwMCkgJSAxID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCIgKyBzdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoTWF0aC5yb3VuZChzdHIgKiAxMDApIC8gMTAwKS50b0ZpeGVkKDIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzQXJyYXkoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyLm1hcChmdW5jdGlvbihzKSB7IHJldHVybiB2LnByZXR0aWZ5KHMpOyB9KS5qb2luKFwiLCBcIik7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzT2JqZWN0KHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0ci50b1N0cmluZygpO1xuICAgICAgfVxuXG4gICAgICAvLyBFbnN1cmUgdGhlIHN0cmluZyBpcyBhY3R1YWxseSBhIHN0cmluZ1xuICAgICAgc3RyID0gXCJcIiArIHN0cjtcblxuICAgICAgcmV0dXJuIHN0clxuICAgICAgICAvLyBTcGxpdHMga2V5cyBzZXBhcmF0ZWQgYnkgcGVyaW9kc1xuICAgICAgICAucmVwbGFjZSgvKFteXFxzXSlcXC4oW15cXHNdKS9nLCAnJDEgJDInKVxuICAgICAgICAvLyBSZW1vdmVzIGJhY2tzbGFzaGVzXG4gICAgICAgIC5yZXBsYWNlKC9cXFxcKy9nLCAnJylcbiAgICAgICAgLy8gUmVwbGFjZXMgLSBhbmQgLSB3aXRoIHNwYWNlXG4gICAgICAgIC5yZXBsYWNlKC9bXy1dL2csICcgJylcbiAgICAgICAgLy8gU3BsaXRzIGNhbWVsIGNhc2VkIHdvcmRzXG4gICAgICAgIC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBmdW5jdGlvbihtMCwgbTEsIG0yKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCIgKyBtMSArIFwiIFwiICsgbTIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gICAgfSxcblxuICAgIHN0cmluZ2lmeVZhbHVlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgdmFyIHByZXR0aWZ5ID0gb3B0aW9ucyAmJiBvcHRpb25zLnByZXR0aWZ5IHx8IHYucHJldHRpZnk7XG4gICAgICByZXR1cm4gcHJldHRpZnkodmFsdWUpO1xuICAgIH0sXG5cbiAgICBpc1N0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xuICAgIH0sXG5cbiAgICBpc0FycmF5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHt9LnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH0sXG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIG9iamVjdCBpcyBhIGhhc2gsIHdoaWNoIGlzIGVxdWl2YWxlbnQgdG8gYW4gb2JqZWN0IHRoYXRcbiAgICAvLyBpcyBuZWl0aGVyIGFuIGFycmF5IG5vciBhIGZ1bmN0aW9uLlxuICAgIGlzSGFzaDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2LmlzT2JqZWN0KHZhbHVlKSAmJiAhdi5pc0FycmF5KHZhbHVlKSAmJiAhdi5pc0Z1bmN0aW9uKHZhbHVlKTtcbiAgICB9LFxuXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKG9iaiwgdmFsdWUpIHtcbiAgICAgIGlmICghdi5pc0RlZmluZWQob2JqKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIG9iai5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWUgaW4gb2JqO1xuICAgIH0sXG5cbiAgICB1bmlxdWU6IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgICBpZiAoIXYuaXNBcnJheShhcnJheSkpIHtcbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFycmF5LmZpbHRlcihmdW5jdGlvbihlbCwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgIHJldHVybiBhcnJheS5pbmRleE9mKGVsKSA9PSBpbmRleDtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBmb3JFYWNoS2V5SW5LZXlwYXRoOiBmdW5jdGlvbihvYmplY3QsIGtleXBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoIXYuaXNTdHJpbmcoa2V5cGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgdmFyIGtleSA9IFwiXCJcbiAgICAgICAgLCBpXG4gICAgICAgICwgZXNjYXBlID0gZmFsc2U7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlwYXRoLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN3aXRjaCAoa2V5cGF0aFtpXSkge1xuICAgICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICAgICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAga2V5ICs9ICcuJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG9iamVjdCA9IGNhbGxiYWNrKG9iamVjdCwga2V5LCBmYWxzZSk7XG4gICAgICAgICAgICAgIGtleSA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ1xcXFwnOlxuICAgICAgICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICAgICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAga2V5ICs9ICdcXFxcJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVzY2FwZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBlc2NhcGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGtleSArPSBrZXlwYXRoW2ldO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG9iamVjdCwga2V5LCB0cnVlKTtcbiAgICB9LFxuXG4gICAgZ2V0RGVlcE9iamVjdFZhbHVlOiBmdW5jdGlvbihvYmosIGtleXBhdGgpIHtcbiAgICAgIGlmICghdi5pc09iamVjdChvYmopKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2LmZvckVhY2hLZXlJbktleXBhdGgob2JqLCBrZXlwYXRoLCBmdW5jdGlvbihvYmosIGtleSkge1xuICAgICAgICBpZiAodi5pc09iamVjdChvYmopKSB7XG4gICAgICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8gVGhpcyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGFsbCB0aGUgdmFsdWVzIG9mIHRoZSBmb3JtLlxuICAgIC8vIEl0IHVzZXMgdGhlIGlucHV0IG5hbWUgYXMga2V5IGFuZCB0aGUgdmFsdWUgYXMgdmFsdWVcbiAgICAvLyBTbyBmb3IgZXhhbXBsZSB0aGlzOlxuICAgIC8vIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbWFpbFwiIHZhbHVlPVwiZm9vQGJhci5jb21cIiAvPlxuICAgIC8vIHdvdWxkIHJldHVybjpcbiAgICAvLyB7ZW1haWw6IFwiZm9vQGJhci5jb21cIn1cbiAgICBjb2xsZWN0Rm9ybVZhbHVlczogZnVuY3Rpb24oZm9ybSwgb3B0aW9ucykge1xuICAgICAgdmFyIHZhbHVlcyA9IHt9XG4gICAgICAgICwgaVxuICAgICAgICAsIGpcbiAgICAgICAgLCBpbnB1dFxuICAgICAgICAsIGlucHV0c1xuICAgICAgICAsIG9wdGlvblxuICAgICAgICAsIHZhbHVlO1xuXG4gICAgICBpZiAodi5pc0pxdWVyeUVsZW1lbnQoZm9ybSkpIHtcbiAgICAgICAgZm9ybSA9IGZvcm1bMF07XG4gICAgICB9XG5cbiAgICAgIGlmICghZm9ybSkge1xuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbbmFtZV0sIHRleHRhcmVhW25hbWVdXCIpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpbnB1dCA9IGlucHV0cy5pdGVtKGkpO1xuXG4gICAgICAgIGlmICh2LmlzRGVmaW5lZChpbnB1dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlnbm9yZWRcIikpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBuYW1lID0gaW5wdXQubmFtZS5yZXBsYWNlKC9cXC4vZywgXCJcXFxcXFxcXC5cIik7XG4gICAgICAgIHZhbHVlID0gdi5zYW5pdGl6ZUZvcm1WYWx1ZShpbnB1dC52YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIGlmIChpbnB1dC50eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZSA/ICt2YWx1ZSA6IG51bGw7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICAgICAgaWYgKGlucHV0LmF0dHJpYnV0ZXMudmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlc1tuYW1lXSB8fCBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGlucHV0LmNoZWNrZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnR5cGUgPT09IFwicmFkaW9cIikge1xuICAgICAgICAgIGlmICghaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbbmFtZV0gfHwgbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzW25hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcInNlbGVjdFtuYW1lXVwiKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5wdXQgPSBpbnB1dHMuaXRlbShpKTtcbiAgICAgICAgaWYgKHYuaXNEZWZpbmVkKGlucHV0LmdldEF0dHJpYnV0ZShcImRhdGEtaWdub3JlZFwiKSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnB1dC5tdWx0aXBsZSkge1xuICAgICAgICAgIHZhbHVlID0gW107XG4gICAgICAgICAgZm9yIChqIGluIGlucHV0Lm9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdGlvbiA9IGlucHV0Lm9wdGlvbnNbal07XG4gICAgICAgICAgICAgaWYgKG9wdGlvbiAmJiBvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgdmFsdWUucHVzaCh2LnNhbml0aXplRm9ybVZhbHVlKG9wdGlvbi52YWx1ZSwgb3B0aW9ucykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgX3ZhbCA9IHR5cGVvZiBpbnB1dC5vcHRpb25zW2lucHV0LnNlbGVjdGVkSW5kZXhdICE9PSAndW5kZWZpbmVkJyA/IGlucHV0Lm9wdGlvbnNbaW5wdXQuc2VsZWN0ZWRJbmRleF0udmFsdWUgOiAnJztcbiAgICAgICAgICB2YWx1ZSA9IHYuc2FuaXRpemVGb3JtVmFsdWUoX3ZhbCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzW2lucHV0Lm5hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfSxcblxuICAgIHNhbml0aXplRm9ybVZhbHVlOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMudHJpbSAmJiB2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMubnVsbGlmeSAhPT0gZmFsc2UgJiYgdmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIGNhcGl0YWxpemU6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgaWYgKCF2LmlzU3RyaW5nKHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdHJbMF0udG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbiAgICB9LFxuXG4gICAgLy8gUmVtb3ZlIGFsbCBlcnJvcnMgd2hvJ3MgZXJyb3IgYXR0cmlidXRlIGlzIGVtcHR5IChudWxsIG9yIHVuZGVmaW5lZClcbiAgICBwcnVuZUVtcHR5RXJyb3JzOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHJldHVybiBlcnJvcnMuZmlsdGVyKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHJldHVybiAhdi5pc0VtcHR5KGVycm9yLmVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyBJblxuICAgIC8vIFt7ZXJyb3I6IFtcImVycjFcIiwgXCJlcnIyXCJdLCAuLi59XVxuICAgIC8vIE91dFxuICAgIC8vIFt7ZXJyb3I6IFwiZXJyMVwiLCAuLi59LCB7ZXJyb3I6IFwiZXJyMlwiLCAuLi59XVxuICAgIC8vXG4gICAgLy8gQWxsIGF0dHJpYnV0ZXMgaW4gYW4gZXJyb3Igd2l0aCBtdWx0aXBsZSBtZXNzYWdlcyBhcmUgZHVwbGljYXRlZFxuICAgIC8vIHdoZW4gZXhwYW5kaW5nIHRoZSBlcnJvcnMuXG4gICAgZXhwYW5kTXVsdGlwbGVFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgdmFyIHJldCA9IFtdO1xuICAgICAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgLy8gUmVtb3ZlcyBlcnJvcnMgd2l0aG91dCBhIG1lc3NhZ2VcbiAgICAgICAgaWYgKHYuaXNBcnJheShlcnJvci5lcnJvcikpIHtcbiAgICAgICAgICBlcnJvci5lcnJvci5mb3JFYWNoKGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgICAgcmV0LnB1c2godi5leHRlbmQoe30sIGVycm9yLCB7ZXJyb3I6IG1zZ30pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXQucHVzaChlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydHMgdGhlIGVycm9yIG1lc2FnZXMgYnkgcHJlcGVuZGluZyB0aGUgYXR0cmlidXRlIG5hbWUgdW5sZXNzIHRoZVxuICAgIC8vIG1lc3NhZ2UgaXMgcHJlZml4ZWQgYnkgXlxuICAgIGNvbnZlcnRFcnJvck1lc3NhZ2VzOiBmdW5jdGlvbihlcnJvcnMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB2YXIgcmV0ID0gW11cbiAgICAgICAgLCBwcmV0dGlmeSA9IG9wdGlvbnMucHJldHRpZnkgfHwgdi5wcmV0dGlmeTtcbiAgICAgIGVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uKGVycm9ySW5mbykge1xuICAgICAgICB2YXIgZXJyb3IgPSB2LnJlc3VsdChlcnJvckluZm8uZXJyb3IsXG4gICAgICAgICAgICBlcnJvckluZm8udmFsdWUsXG4gICAgICAgICAgICBlcnJvckluZm8uYXR0cmlidXRlLFxuICAgICAgICAgICAgZXJyb3JJbmZvLm9wdGlvbnMsXG4gICAgICAgICAgICBlcnJvckluZm8uYXR0cmlidXRlcyxcbiAgICAgICAgICAgIGVycm9ySW5mby5nbG9iYWxPcHRpb25zKTtcblxuICAgICAgICBpZiAoIXYuaXNTdHJpbmcoZXJyb3IpKSB7XG4gICAgICAgICAgcmV0LnB1c2goZXJyb3JJbmZvKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3JbMF0gPT09ICdeJykge1xuICAgICAgICAgIGVycm9yID0gZXJyb3Iuc2xpY2UoMSk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5mdWxsTWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgZXJyb3IgPSB2LmNhcGl0YWxpemUocHJldHRpZnkoZXJyb3JJbmZvLmF0dHJpYnV0ZSkpICsgXCIgXCIgKyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBlcnJvciA9IGVycm9yLnJlcGxhY2UoL1xcXFxcXF4vZywgXCJeXCIpO1xuICAgICAgICBlcnJvciA9IHYuZm9ybWF0KGVycm9yLCB7XG4gICAgICAgICAgdmFsdWU6IHYuc3RyaW5naWZ5VmFsdWUoZXJyb3JJbmZvLnZhbHVlLCBvcHRpb25zKVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0LnB1c2godi5leHRlbmQoe30sIGVycm9ySW5mbywge2Vycm9yOiBlcnJvcn0pKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gSW46XG4gICAgLy8gW3thdHRyaWJ1dGU6IFwiPGF0dHJpYnV0ZU5hbWU+XCIsIC4uLn1dXG4gICAgLy8gT3V0OlxuICAgIC8vIHtcIjxhdHRyaWJ1dGVOYW1lPlwiOiBbe2F0dHJpYnV0ZTogXCI8YXR0cmlidXRlTmFtZT5cIiwgLi4ufV19XG4gICAgZ3JvdXBFcnJvcnNCeUF0dHJpYnV0ZTogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICB2YXIgcmV0ID0ge307XG4gICAgICBlcnJvcnMuZm9yRWFjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICB2YXIgbGlzdCA9IHJldFtlcnJvci5hdHRyaWJ1dGVdO1xuICAgICAgICBpZiAobGlzdCkge1xuICAgICAgICAgIGxpc3QucHVzaChlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0W2Vycm9yLmF0dHJpYnV0ZV0gPSBbZXJyb3JdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8vIEluOlxuICAgIC8vIFt7ZXJyb3I6IFwiPG1lc3NhZ2UgMT5cIiwgLi4ufSwge2Vycm9yOiBcIjxtZXNzYWdlIDI+XCIsIC4uLn1dXG4gICAgLy8gT3V0OlxuICAgIC8vIFtcIjxtZXNzYWdlIDE+XCIsIFwiPG1lc3NhZ2UgMj5cIl1cbiAgICBmbGF0dGVuRXJyb3JzVG9BcnJheTogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgICByZXR1cm4gZXJyb3JzXG4gICAgICAgIC5tYXAoZnVuY3Rpb24oZXJyb3IpIHsgcmV0dXJuIGVycm9yLmVycm9yOyB9KVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgc2VsZikge1xuICAgICAgICAgIHJldHVybiBzZWxmLmluZGV4T2YodmFsdWUpID09PSBpbmRleDtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNsZWFuQXR0cmlidXRlczogZnVuY3Rpb24oYXR0cmlidXRlcywgd2hpdGVsaXN0KSB7XG4gICAgICBmdW5jdGlvbiB3aGl0ZWxpc3RDcmVhdG9yKG9iaiwga2V5LCBsYXN0KSB7XG4gICAgICAgIGlmICh2LmlzT2JqZWN0KG9ialtrZXldKSkge1xuICAgICAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKG9ialtrZXldID0gbGFzdCA/IHRydWUgOiB7fSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGJ1aWxkT2JqZWN0V2hpdGVsaXN0KHdoaXRlbGlzdCkge1xuICAgICAgICB2YXIgb3cgPSB7fVxuICAgICAgICAgICwgbGFzdE9iamVjdFxuICAgICAgICAgICwgYXR0cjtcbiAgICAgICAgZm9yIChhdHRyIGluIHdoaXRlbGlzdCkge1xuICAgICAgICAgIGlmICghd2hpdGVsaXN0W2F0dHJdKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdi5mb3JFYWNoS2V5SW5LZXlwYXRoKG93LCBhdHRyLCB3aGl0ZWxpc3RDcmVhdG9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3c7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNsZWFuUmVjdXJzaXZlKGF0dHJpYnV0ZXMsIHdoaXRlbGlzdCkge1xuICAgICAgICBpZiAoIXYuaXNPYmplY3QoYXR0cmlidXRlcykpIHtcbiAgICAgICAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXQgPSB2LmV4dGVuZCh7fSwgYXR0cmlidXRlcylcbiAgICAgICAgICAsIHdcbiAgICAgICAgICAsIGF0dHJpYnV0ZTtcblxuICAgICAgICBmb3IgKGF0dHJpYnV0ZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgdyA9IHdoaXRlbGlzdFthdHRyaWJ1dGVdO1xuXG4gICAgICAgICAgaWYgKHYuaXNPYmplY3QodykpIHtcbiAgICAgICAgICAgIHJldFthdHRyaWJ1dGVdID0gY2xlYW5SZWN1cnNpdmUocmV0W2F0dHJpYnV0ZV0sIHcpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIXcpIHtcbiAgICAgICAgICAgIGRlbGV0ZSByZXRbYXR0cmlidXRlXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH1cblxuICAgICAgaWYgKCF2LmlzT2JqZWN0KHdoaXRlbGlzdCkgfHwgIXYuaXNPYmplY3QoYXR0cmlidXRlcykpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuXG4gICAgICB3aGl0ZWxpc3QgPSBidWlsZE9iamVjdFdoaXRlbGlzdCh3aGl0ZWxpc3QpO1xuICAgICAgcmV0dXJuIGNsZWFuUmVjdXJzaXZlKGF0dHJpYnV0ZXMsIHdoaXRlbGlzdCk7XG4gICAgfSxcblxuICAgIGV4cG9zZU1vZHVsZTogZnVuY3Rpb24odmFsaWRhdGUsIHJvb3QsIGV4cG9ydHMsIG1vZHVsZSwgZGVmaW5lKSB7XG4gICAgICBpZiAoZXhwb3J0cykge1xuICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gdmFsaWRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0cy52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuICAgICAgICBpZiAodmFsaWRhdGUuaXNGdW5jdGlvbihkZWZpbmUpICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbGlkYXRlOyB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB3YXJuOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiW3ZhbGlkYXRlLmpzXSBcIiArIG1zZyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVycm9yOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbdmFsaWRhdGUuanNdIFwiICsgbXNnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHZhbGlkYXRlLnZhbGlkYXRvcnMgPSB7XG4gICAgLy8gUHJlc2VuY2UgdmFsaWRhdGVzIHRoYXQgdGhlIHZhbHVlIGlzbid0IGVtcHR5XG4gICAgcHJlc2VuY2U6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICBpZiAob3B0aW9ucy5hbGxvd0VtcHR5ICE9PSBmYWxzZSA/ICF2LmlzRGVmaW5lZCh2YWx1ZSkgOiB2LmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiY2FuJ3QgYmUgYmxhbmtcIjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGxlbmd0aDogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSkge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBhbGxvd2VkXG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGlzID0gb3B0aW9ucy5pc1xuICAgICAgICAsIG1heGltdW0gPSBvcHRpb25zLm1heGltdW1cbiAgICAgICAgLCBtaW5pbXVtID0gb3B0aW9ucy5taW5pbXVtXG4gICAgICAgICwgdG9rZW5pemVyID0gb3B0aW9ucy50b2tlbml6ZXIgfHwgZnVuY3Rpb24odmFsKSB7IHJldHVybiB2YWw7IH1cbiAgICAgICAgLCBlcnJcbiAgICAgICAgLCBlcnJvcnMgPSBbXTtcblxuICAgICAgdmFsdWUgPSB0b2tlbml6ZXIodmFsdWUpO1xuICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgICAgIGlmKCF2LmlzTnVtYmVyKGxlbmd0aCkpIHtcbiAgICAgICAgdi5lcnJvcih2LmZvcm1hdChcIkF0dHJpYnV0ZSAle2F0dHJ9IGhhcyBhIG5vbiBudW1lcmljIHZhbHVlIGZvciBgbGVuZ3RoYFwiLCB7YXR0cjogYXR0cmlidXRlfSkpO1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubm90VmFsaWQgfHwgXCJoYXMgYW4gaW5jb3JyZWN0IGxlbmd0aFwiO1xuICAgICAgfVxuXG4gICAgICAvLyBJcyBjaGVja3NcbiAgICAgIGlmICh2LmlzTnVtYmVyKGlzKSAmJiBsZW5ndGggIT09IGlzKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMud3JvbmdMZW5ndGggfHxcbiAgICAgICAgICB0aGlzLndyb25nTGVuZ3RoIHx8XG4gICAgICAgICAgXCJpcyB0aGUgd3JvbmcgbGVuZ3RoIChzaG91bGQgYmUgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IGlzfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc051bWJlcihtaW5pbXVtKSAmJiBsZW5ndGggPCBtaW5pbXVtKSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMudG9vU2hvcnQgfHxcbiAgICAgICAgICB0aGlzLnRvb1Nob3J0IHx8XG4gICAgICAgICAgXCJpcyB0b28gc2hvcnQgKG1pbmltdW0gaXMgJXtjb3VudH0gY2hhcmFjdGVycylcIjtcbiAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQoZXJyLCB7Y291bnQ6IG1pbmltdW19KSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzTnVtYmVyKG1heGltdW0pICYmIGxlbmd0aCA+IG1heGltdW0pIHtcbiAgICAgICAgZXJyID0gb3B0aW9ucy50b29Mb25nIHx8XG4gICAgICAgICAgdGhpcy50b29Mb25nIHx8XG4gICAgICAgICAgXCJpcyB0b28gbG9uZyAobWF4aW11bSBpcyAle2NvdW50fSBjaGFyYWN0ZXJzKVwiO1xuICAgICAgICBlcnJvcnMucHVzaCh2LmZvcm1hdChlcnIsIHtjb3VudDogbWF4aW11bX0pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sXG4gICAgbnVtZXJpY2FsaXR5OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucywgYXR0cmlidXRlLCBhdHRyaWJ1dGVzLCBnbG9iYWxPcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICghdi5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICB2YXIgZXJyb3JzID0gW11cbiAgICAgICAgLCBuYW1lXG4gICAgICAgICwgY291bnRcbiAgICAgICAgLCBjaGVja3MgPSB7XG4gICAgICAgICAgICBncmVhdGVyVGhhbjogICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA+IGM7IH0sXG4gICAgICAgICAgICBncmVhdGVyVGhhbk9yRXF1YWxUbzogZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA+PSBjOyB9LFxuICAgICAgICAgICAgZXF1YWxUbzogICAgICAgICAgICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgPT09IGM7IH0sXG4gICAgICAgICAgICBsZXNzVGhhbjogICAgICAgICAgICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA8IGM7IH0sXG4gICAgICAgICAgICBsZXNzVGhhbk9yRXF1YWxUbzogICAgZnVuY3Rpb24odiwgYykgeyByZXR1cm4gdiA8PSBjOyB9LFxuICAgICAgICAgICAgZGl2aXNpYmxlQnk6ICAgICAgICAgIGZ1bmN0aW9uKHYsIGMpIHsgcmV0dXJuIHYgJSBjID09PSAwOyB9XG4gICAgICAgICAgfVxuICAgICAgICAsIHByZXR0aWZ5ID0gb3B0aW9ucy5wcmV0dGlmeSB8fFxuICAgICAgICAgIChnbG9iYWxPcHRpb25zICYmIGdsb2JhbE9wdGlvbnMucHJldHRpZnkpIHx8XG4gICAgICAgICAgdi5wcmV0dGlmeTtcblxuICAgICAgLy8gU3RyaWN0IHdpbGwgY2hlY2sgdGhhdCBpdCBpcyBhIHZhbGlkIGxvb2tpbmcgbnVtYmVyXG4gICAgICBpZiAodi5pc1N0cmluZyh2YWx1ZSkgJiYgb3B0aW9ucy5zdHJpY3QpIHtcbiAgICAgICAgdmFyIHBhdHRlcm4gPSBcIl4tPygwfFsxLTldXFxcXGQqKVwiO1xuICAgICAgICBpZiAoIW9wdGlvbnMub25seUludGVnZXIpIHtcbiAgICAgICAgICBwYXR0ZXJuICs9IFwiKFxcXFwuXFxcXGQrKT9cIjtcbiAgICAgICAgfVxuICAgICAgICBwYXR0ZXJuICs9IFwiJFwiO1xuXG4gICAgICAgIGlmICghKG5ldyBSZWdFeHAocGF0dGVybikudGVzdCh2YWx1ZSkpKSB7XG4gICAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICAgICAgb3B0aW9ucy5ub3RWYWxpZCB8fFxuICAgICAgICAgICAgdGhpcy5ub3RWYWxpZCB8fFxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgICAgICBcIm11c3QgYmUgYSB2YWxpZCBudW1iZXJcIjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDb2VyY2UgdGhlIHZhbHVlIHRvIGEgbnVtYmVyIHVubGVzcyB3ZSdyZSBiZWluZyBzdHJpY3QuXG4gICAgICBpZiAob3B0aW9ucy5ub1N0cmluZ3MgIT09IHRydWUgJiYgdi5pc1N0cmluZyh2YWx1ZSkgJiYgIXYuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSArdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGl0J3Mgbm90IGEgbnVtYmVyIHdlIHNob3VsZG4ndCBjb250aW51ZSBzaW5jZSBpdCB3aWxsIGNvbXBhcmUgaXQuXG4gICAgICBpZiAoIXYuaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHxcbiAgICAgICAgICBvcHRpb25zLm5vdFZhbGlkIHx8XG4gICAgICAgICAgdGhpcy5ub3RWYWxpZCB8fFxuICAgICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICAgIFwiaXMgbm90IGEgbnVtYmVyXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIFNhbWUgbG9naWMgYXMgYWJvdmUsIHNvcnQgb2YuIERvbid0IGJvdGhlciB3aXRoIGNvbXBhcmlzb25zIGlmIHRoaXNcbiAgICAgIC8vIGRvZXNuJ3QgcGFzcy5cbiAgICAgIGlmIChvcHRpb25zLm9ubHlJbnRlZ2VyICYmICF2LmlzSW50ZWdlcih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICAgIG9wdGlvbnMubm90SW50ZWdlciB8fFxuICAgICAgICAgIHRoaXMubm90SW50ZWdlciB8fFxuICAgICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICAgIFwibXVzdCBiZSBhbiBpbnRlZ2VyXCI7XG4gICAgICB9XG5cbiAgICAgIGZvciAobmFtZSBpbiBjaGVja3MpIHtcbiAgICAgICAgY291bnQgPSBvcHRpb25zW25hbWVdO1xuICAgICAgICBpZiAodi5pc051bWJlcihjb3VudCkgJiYgIWNoZWNrc1tuYW1lXSh2YWx1ZSwgY291bnQpKSB7XG4gICAgICAgICAgLy8gVGhpcyBwaWNrcyB0aGUgZGVmYXVsdCBtZXNzYWdlIGlmIHNwZWNpZmllZFxuICAgICAgICAgIC8vIEZvciBleGFtcGxlIHRoZSBncmVhdGVyVGhhbiBjaGVjayB1c2VzIHRoZSBtZXNzYWdlIGZyb21cbiAgICAgICAgICAvLyB0aGlzLm5vdEdyZWF0ZXJUaGFuIHNvIHdlIGNhcGl0YWxpemUgdGhlIG5hbWUgYW5kIHByZXBlbmQgXCJub3RcIlxuICAgICAgICAgIHZhciBrZXkgPSBcIm5vdFwiICsgdi5jYXBpdGFsaXplKG5hbWUpO1xuICAgICAgICAgIHZhciBtc2cgPSBvcHRpb25zW2tleV0gfHxcbiAgICAgICAgICAgIHRoaXNba2V5XSB8fFxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgICAgICBcIm11c3QgYmUgJXt0eXBlfSAle2NvdW50fVwiO1xuXG4gICAgICAgICAgZXJyb3JzLnB1c2godi5mb3JtYXQobXNnLCB7XG4gICAgICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgICAgICB0eXBlOiBwcmV0dGlmeShuYW1lKVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5vZGQgJiYgdmFsdWUgJSAyICE9PSAxKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKG9wdGlvbnMubm90T2RkIHx8XG4gICAgICAgICAgICB0aGlzLm5vdE9kZCB8fFxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlIHx8XG4gICAgICAgICAgICBcIm11c3QgYmUgb2RkXCIpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuZXZlbiAmJiB2YWx1ZSAlIDIgIT09IDApIHtcbiAgICAgICAgZXJyb3JzLnB1c2gob3B0aW9ucy5ub3RFdmVuIHx8XG4gICAgICAgICAgICB0aGlzLm5vdEV2ZW4gfHxcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZSB8fFxuICAgICAgICAgICAgXCJtdXN0IGJlIGV2ZW5cIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm1lc3NhZ2UgfHwgZXJyb3JzO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGF0ZXRpbWU6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAoIXYuaXNGdW5jdGlvbih0aGlzLnBhcnNlKSB8fCAhdi5pc0Z1bmN0aW9uKHRoaXMuZm9ybWF0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCb3RoIHRoZSBwYXJzZSBhbmQgZm9ybWF0IGZ1bmN0aW9ucyBuZWVkcyB0byBiZSBzZXQgdG8gdXNlIHRoZSBkYXRldGltZS9kYXRlIHZhbGlkYXRvclwiKTtcbiAgICAgIH1cblxuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGVyclxuICAgICAgICAsIGVycm9ycyA9IFtdXG4gICAgICAgICwgZWFybGllc3QgPSBvcHRpb25zLmVhcmxpZXN0ID8gdGhpcy5wYXJzZShvcHRpb25zLmVhcmxpZXN0LCBvcHRpb25zKSA6IE5hTlxuICAgICAgICAsIGxhdGVzdCA9IG9wdGlvbnMubGF0ZXN0ID8gdGhpcy5wYXJzZShvcHRpb25zLmxhdGVzdCwgb3B0aW9ucykgOiBOYU47XG5cbiAgICAgIHZhbHVlID0gdGhpcy5wYXJzZSh2YWx1ZSwgb3B0aW9ucyk7XG5cbiAgICAgIC8vIDg2NDAwMDAwIGlzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGluIGEgZGF5LCB0aGlzIGlzIHVzZWQgdG8gcmVtb3ZlXG4gICAgICAvLyB0aGUgdGltZSBmcm9tIHRoZSBkYXRlXG4gICAgICBpZiAoaXNOYU4odmFsdWUpIHx8IG9wdGlvbnMuZGF0ZU9ubHkgJiYgdmFsdWUgJSA4NjQwMDAwMCAhPT0gMCkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLm5vdFZhbGlkIHx8XG4gICAgICAgICAgb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgICAgdGhpcy5ub3RWYWxpZCB8fFxuICAgICAgICAgIFwibXVzdCBiZSBhIHZhbGlkIGRhdGVcIjtcbiAgICAgICAgcmV0dXJuIHYuZm9ybWF0KGVyciwge3ZhbHVlOiBhcmd1bWVudHNbMF19KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihlYXJsaWVzdCkgJiYgdmFsdWUgPCBlYXJsaWVzdCkge1xuICAgICAgICBlcnIgPSBvcHRpb25zLnRvb0Vhcmx5IHx8XG4gICAgICAgICAgb3B0aW9ucy5tZXNzYWdlIHx8XG4gICAgICAgICAgdGhpcy50b29FYXJseSB8fFxuICAgICAgICAgIFwibXVzdCBiZSBubyBlYXJsaWVyIHRoYW4gJXtkYXRlfVwiO1xuICAgICAgICBlcnIgPSB2LmZvcm1hdChlcnIsIHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5mb3JtYXQodmFsdWUsIG9wdGlvbnMpLFxuICAgICAgICAgIGRhdGU6IHRoaXMuZm9ybWF0KGVhcmxpZXN0LCBvcHRpb25zKVxuICAgICAgICB9KTtcbiAgICAgICAgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihsYXRlc3QpICYmIHZhbHVlID4gbGF0ZXN0KSB7XG4gICAgICAgIGVyciA9IG9wdGlvbnMudG9vTGF0ZSB8fFxuICAgICAgICAgIG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICAgIHRoaXMudG9vTGF0ZSB8fFxuICAgICAgICAgIFwibXVzdCBiZSBubyBsYXRlciB0aGFuICV7ZGF0ZX1cIjtcbiAgICAgICAgZXJyID0gdi5mb3JtYXQoZXJyLCB7XG4gICAgICAgICAgZGF0ZTogdGhpcy5mb3JtYXQobGF0ZXN0LCBvcHRpb25zKSxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5mb3JtYXQodmFsdWUsIG9wdGlvbnMpXG4gICAgICAgIH0pO1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdi51bmlxdWUoZXJyb3JzKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBwYXJzZTogbnVsbCxcbiAgICAgIGZvcm1hdDogbnVsbFxuICAgIH0pLFxuICAgIGRhdGU6IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIG9wdGlvbnMsIHtkYXRlT25seTogdHJ1ZX0pO1xuICAgICAgcmV0dXJuIHYudmFsaWRhdG9ycy5kYXRldGltZS5jYWxsKHYudmFsaWRhdG9ycy5kYXRldGltZSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgIH0sXG4gICAgZm9ybWF0OiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKHYuaXNTdHJpbmcob3B0aW9ucykgfHwgKG9wdGlvbnMgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7cGF0dGVybjogb3B0aW9uc307XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgdGhpcy5tZXNzYWdlIHx8IFwiaXMgaW52YWxpZFwiXG4gICAgICAgICwgcGF0dGVybiA9IG9wdGlvbnMucGF0dGVyblxuICAgICAgICAsIG1hdGNoO1xuXG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGFsbG93ZWRcbiAgICAgIGlmICghdi5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdi5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh2LmlzU3RyaW5nKHBhdHRlcm4pKSB7XG4gICAgICAgIHBhdHRlcm4gPSBuZXcgUmVnRXhwKG9wdGlvbnMucGF0dGVybiwgb3B0aW9ucy5mbGFncyk7XG4gICAgICB9XG4gICAgICBtYXRjaCA9IHBhdHRlcm4uZXhlYyh2YWx1ZSk7XG4gICAgICBpZiAoIW1hdGNoIHx8IG1hdGNoWzBdLmxlbmd0aCAhPSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbmNsdXNpb246IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAvLyBFbXB0eSB2YWx1ZXMgYXJlIGZpbmVcbiAgICAgIGlmICghdi5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh2LmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt3aXRoaW46IG9wdGlvbnN9O1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IHYuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgaWYgKHYuY29udGFpbnMob3B0aW9ucy53aXRoaW4sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJeJXt2YWx1ZX0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBsaXN0XCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZXhjbHVzaW9uOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodi5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7d2l0aGluOiBvcHRpb25zfTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSB2LmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIGlmICghdi5jb250YWlucyhvcHRpb25zLndpdGhpbiwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcIl4le3ZhbHVlfSBpcyByZXN0cmljdGVkXCI7XG4gICAgICByZXR1cm4gdi5mb3JtYXQobWVzc2FnZSwge3ZhbHVlOiB2YWx1ZX0pO1xuICAgIH0sXG4gICAgZW1haWw6IHYuZXh0ZW5kKGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCB0aGlzLm1lc3NhZ2UgfHwgXCJpcyBub3QgYSB2YWxpZCBlbWFpbFwiO1xuICAgICAgLy8gRW1wdHkgdmFsdWVzIGFyZSBmaW5lXG4gICAgICBpZiAoIXYuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXYuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLlBBVFRFUk4uZXhlYyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgUEFUVEVSTjogL15bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05XFx1MDA3Ri1cXHVmZmZmISMkJSYnKitcXC89P15fYHt8fX4tXSspKkAoPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16XXsyLH0kL2lcbiAgICB9KSxcbiAgICBlcXVhbGl0eTogZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMsIGF0dHJpYnV0ZSwgYXR0cmlidXRlcywgZ2xvYmFsT3B0aW9ucykge1xuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICBvcHRpb25zID0ge2F0dHJpYnV0ZTogb3B0aW9uc307XG4gICAgICB9XG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fFxuICAgICAgICB0aGlzLm1lc3NhZ2UgfHxcbiAgICAgICAgXCJpcyBub3QgZXF1YWwgdG8gJXthdHRyaWJ1dGV9XCI7XG5cbiAgICAgIGlmICh2LmlzRW1wdHkob3B0aW9ucy5hdHRyaWJ1dGUpIHx8ICF2LmlzU3RyaW5nKG9wdGlvbnMuYXR0cmlidXRlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYXR0cmlidXRlIG11c3QgYmUgYSBub24gZW1wdHkgc3RyaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3RoZXJWYWx1ZSA9IHYuZ2V0RGVlcE9iamVjdFZhbHVlKGF0dHJpYnV0ZXMsIG9wdGlvbnMuYXR0cmlidXRlKVxuICAgICAgICAsIGNvbXBhcmF0b3IgPSBvcHRpb25zLmNvbXBhcmF0b3IgfHwgZnVuY3Rpb24odjEsIHYyKSB7XG4gICAgICAgICAgcmV0dXJuIHYxID09PSB2MjtcbiAgICAgICAgfVxuICAgICAgICAsIHByZXR0aWZ5ID0gb3B0aW9ucy5wcmV0dGlmeSB8fFxuICAgICAgICAgIChnbG9iYWxPcHRpb25zICYmIGdsb2JhbE9wdGlvbnMucHJldHRpZnkpIHx8XG4gICAgICAgICAgdi5wcmV0dGlmeTtcblxuICAgICAgaWYgKCFjb21wYXJhdG9yKHZhbHVlLCBvdGhlclZhbHVlLCBvcHRpb25zLCBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIHJldHVybiB2LmZvcm1hdChtZXNzYWdlLCB7YXR0cmlidXRlOiBwcmV0dGlmeShvcHRpb25zLmF0dHJpYnV0ZSl9KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQSBVUkwgdmFsaWRhdG9yIHRoYXQgaXMgdXNlZCB0byB2YWxpZGF0ZSBVUkxzIHdpdGggdGhlIGFiaWxpdHkgdG9cbiAgICAvLyByZXN0cmljdCBzY2hlbWVzIGFuZCBzb21lIGRvbWFpbnMuXG4gICAgdXJsOiBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKCF2LmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zID0gdi5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSB8fCBcImlzIG5vdCBhIHZhbGlkIHVybFwiXG4gICAgICAgICwgc2NoZW1lcyA9IG9wdGlvbnMuc2NoZW1lcyB8fCB0aGlzLnNjaGVtZXMgfHwgWydodHRwJywgJ2h0dHBzJ11cbiAgICAgICAgLCBhbGxvd0xvY2FsID0gb3B0aW9ucy5hbGxvd0xvY2FsIHx8IHRoaXMuYWxsb3dMb2NhbCB8fCBmYWxzZTtcblxuICAgICAgaWYgKCF2LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgIH1cblxuICAgICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZHBlcmluaS83MjkyOTRcbiAgICAgIHZhciByZWdleCA9XG4gICAgICAgIFwiXlwiICtcbiAgICAgICAgLy8gcHJvdG9jb2wgaWRlbnRpZmllclxuICAgICAgICBcIig/Oig/OlwiICsgc2NoZW1lcy5qb2luKFwifFwiKSArIFwiKTovLylcIiArXG4gICAgICAgIC8vIHVzZXI6cGFzcyBhdXRoZW50aWNhdGlvblxuICAgICAgICBcIig/OlxcXFxTKyg/OjpcXFxcUyopP0ApP1wiICtcbiAgICAgICAgXCIoPzpcIjtcblxuICAgICAgdmFyIHRsZCA9IFwiKD86XFxcXC4oPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZl17Mix9KSlcIjtcblxuICAgICAgaWYgKGFsbG93TG9jYWwpIHtcbiAgICAgICAgdGxkICs9IFwiP1wiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVnZXggKz1cbiAgICAgICAgICAvLyBJUCBhZGRyZXNzIGV4Y2x1c2lvblxuICAgICAgICAgIC8vIHByaXZhdGUgJiBsb2NhbCBuZXR3b3Jrc1xuICAgICAgICAgIFwiKD8hKD86MTB8MTI3KSg/OlxcXFwuXFxcXGR7MSwzfSl7M30pXCIgK1xuICAgICAgICAgIFwiKD8hKD86MTY5XFxcXC4yNTR8MTkyXFxcXC4xNjgpKD86XFxcXC5cXFxcZHsxLDN9KXsyfSlcIiArXG4gICAgICAgICAgXCIoPyExNzJcXFxcLig/OjFbNi05XXwyXFxcXGR8M1swLTFdKSg/OlxcXFwuXFxcXGR7MSwzfSl7Mn0pXCI7XG4gICAgICB9XG5cbiAgICAgIHJlZ2V4ICs9XG4gICAgICAgICAgLy8gSVAgYWRkcmVzcyBkb3R0ZWQgbm90YXRpb24gb2N0ZXRzXG4gICAgICAgICAgLy8gZXhjbHVkZXMgbG9vcGJhY2sgbmV0d29yayAwLjAuMC4wXG4gICAgICAgICAgLy8gZXhjbHVkZXMgcmVzZXJ2ZWQgc3BhY2UgPj0gMjI0LjAuMC4wXG4gICAgICAgICAgLy8gZXhjbHVkZXMgbmV0d29yayAmIGJyb2FjYXN0IGFkZHJlc3Nlc1xuICAgICAgICAgIC8vIChmaXJzdCAmIGxhc3QgSVAgYWRkcmVzcyBvZiBlYWNoIGNsYXNzKVxuICAgICAgICAgIFwiKD86WzEtOV1cXFxcZD98MVxcXFxkXFxcXGR8MlswMV1cXFxcZHwyMlswLTNdKVwiICtcbiAgICAgICAgICBcIig/OlxcXFwuKD86MT9cXFxcZHsxLDJ9fDJbMC00XVxcXFxkfDI1WzAtNV0pKXsyfVwiICtcbiAgICAgICAgICBcIig/OlxcXFwuKD86WzEtOV1cXFxcZD98MVxcXFxkXFxcXGR8MlswLTRdXFxcXGR8MjVbMC00XSkpXCIgK1xuICAgICAgICBcInxcIiArXG4gICAgICAgICAgLy8gaG9zdCBuYW1lXG4gICAgICAgICAgXCIoPzooPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0tKikqW2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKylcIiArXG4gICAgICAgICAgLy8gZG9tYWluIG5hbWVcbiAgICAgICAgICBcIig/OlxcXFwuKD86W2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldLSopKlthLXpcXFxcdTAwYTEtXFxcXHVmZmZmMC05XSspKlwiICtcbiAgICAgICAgICB0bGQgK1xuICAgICAgICBcIilcIiArXG4gICAgICAgIC8vIHBvcnQgbnVtYmVyXG4gICAgICAgIFwiKD86OlxcXFxkezIsNX0pP1wiICtcbiAgICAgICAgLy8gcmVzb3VyY2UgcGF0aFxuICAgICAgICBcIig/OlsvPyNdXFxcXFMqKT9cIiArXG4gICAgICBcIiRcIjtcblxuICAgICAgdmFyIFBBVFRFUk4gPSBuZXcgUmVnRXhwKHJlZ2V4LCAnaScpO1xuICAgICAgaWYgKCFQQVRURVJOLmV4ZWModmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YWxpZGF0ZS5mb3JtYXR0ZXJzID0ge1xuICAgIGRldGFpbGVkOiBmdW5jdGlvbihlcnJvcnMpIHtyZXR1cm4gZXJyb3JzO30sXG4gICAgZmxhdDogdi5mbGF0dGVuRXJyb3JzVG9BcnJheSxcbiAgICBncm91cGVkOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICAgIHZhciBhdHRyO1xuXG4gICAgICBlcnJvcnMgPSB2Lmdyb3VwRXJyb3JzQnlBdHRyaWJ1dGUoZXJyb3JzKTtcbiAgICAgIGZvciAoYXR0ciBpbiBlcnJvcnMpIHtcbiAgICAgICAgZXJyb3JzW2F0dHJdID0gdi5mbGF0dGVuRXJyb3JzVG9BcnJheShlcnJvcnNbYXR0cl0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVycm9ycztcbiAgICB9LFxuICAgIGNvbnN0cmFpbnQ6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgICAgdmFyIGF0dHI7XG4gICAgICBlcnJvcnMgPSB2Lmdyb3VwRXJyb3JzQnlBdHRyaWJ1dGUoZXJyb3JzKTtcbiAgICAgIGZvciAoYXR0ciBpbiBlcnJvcnMpIHtcbiAgICAgICAgZXJyb3JzW2F0dHJdID0gZXJyb3JzW2F0dHJdLm1hcChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnZhbGlkYXRvcjtcbiAgICAgICAgfSkuc29ydCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVycm9ycztcbiAgICB9XG4gIH07XG5cbiAgdmFsaWRhdGUuZXhwb3NlTW9kdWxlKHZhbGlkYXRlLCB0aGlzLCBleHBvcnRzLCBtb2R1bGUsIGRlZmluZSk7XG59KS5jYWxsKHRoaXMsXG4gICAgICAgIHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGV4cG9ydHMgOiBudWxsLFxuICAgICAgICB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIG1vZHVsZSA6IG51bGwsXG4gICAgICAgIHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gZGVmaW5lIDogbnVsbCk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy92YWxpZGF0ZS5qcy92YWxpZGF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHRpZighbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxuXHRcdGlmKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xuXHR9XG5cdHJldHVybiBtb2R1bGU7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuICovXG5mdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpLFxuICAgIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKiogRGV0ZWN0IGlmIHByb3BlcnRpZXMgc2hhZG93aW5nIHRob3NlIG9uIGBPYmplY3QucHJvdG90eXBlYCBhcmUgbm9uLWVudW1lcmFibGUuICovXG52YXIgbm9uRW51bVNoYWRvd3MgPSAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh7ICd2YWx1ZU9mJzogMSB9LCAndmFsdWVPZicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgLy8gU2FmYXJpIDguMSBtYWtlcyBgYXJndW1lbnRzLmNhbGxlZWAgZW51bWVyYWJsZSBpbiBzdHJpY3QgbW9kZS5cbiAgLy8gU2FmYXJpIDkgbWFrZXMgYGFyZ3VtZW50cy5sZW5ndGhgIGVudW1lcmFibGUgaW4gc3RyaWN0IG1vZGUuXG4gIHZhciByZXN1bHQgPSAoaXNBcnJheSh2YWx1ZSkgfHwgaXNBcmd1bWVudHModmFsdWUpKVxuICAgID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKVxuICAgIDogW107XG5cbiAgdmFyIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGgsXG4gICAgICBza2lwSW5kZXhlcyA9ICEhbGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKGtleSA9PSAnbGVuZ3RoJyB8fCBpc0luZGV4KGtleSwgbGVuZ3RoKSkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEFzc2lnbnMgYHZhbHVlYCB0byBga2V5YCBvZiBgb2JqZWN0YCBpZiB0aGUgZXhpc3RpbmcgdmFsdWUgaXMgbm90IGVxdWl2YWxlbnRcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldO1xuICBpZiAoIShoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBlcShvYmpWYWx1ZSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yZXN0YCB3aGljaCBkb2Vzbid0IHZhbGlkYXRlIG9yIGNvZXJjZSBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVJlc3QoZnVuYywgc3RhcnQpIHtcbiAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogc3RhcnQsIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgYXJyYXkgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGFycmF5W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIGluZGV4ID0gLTE7XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gYXJyYXk7XG4gICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29waWVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPYmplY3Qoc291cmNlLCBwcm9wcywgb2JqZWN0LCBjdXN0b21pemVyKSB7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcblxuICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgID8gY3VzdG9taXplcihvYmplY3Rba2V5XSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkID8gc291cmNlW2tleV0gOiBuZXdWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gbGlrZSBgXy5hc3NpZ25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhc3NpZ25lciBUaGUgZnVuY3Rpb24gdG8gYXNzaWduIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFzc2lnbmVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVBc3NpZ25lcihhc3NpZ25lcikge1xuICByZXR1cm4gYmFzZVJlc3QoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2VzKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IHNvdXJjZXMubGVuZ3RoLFxuICAgICAgICBjdXN0b21pemVyID0gbGVuZ3RoID4gMSA/IHNvdXJjZXNbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQsXG4gICAgICAgIGd1YXJkID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbMl0gOiB1bmRlZmluZWQ7XG5cbiAgICBjdXN0b21pemVyID0gKGFzc2lnbmVyLmxlbmd0aCA+IDMgJiYgdHlwZW9mIGN1c3RvbWl6ZXIgPT0gJ2Z1bmN0aW9uJylcbiAgICAgID8gKGxlbmd0aC0tLCBjdXN0b21pemVyKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoZ3VhcmQgJiYgaXNJdGVyYXRlZUNhbGwoc291cmNlc1swXSwgc291cmNlc1sxXSwgZ3VhcmQpKSB7XG4gICAgICBjdXN0b21pemVyID0gbGVuZ3RoIDwgMyA/IHVuZGVmaW5lZCA6IGN1c3RvbWl6ZXI7XG4gICAgICBsZW5ndGggPSAxO1xuICAgIH1cbiAgICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNbaW5kZXhdO1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBhc3NpZ25lcihvYmplY3QsIHNvdXJjZSwgaW5kZXgsIGN1c3RvbWl6ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSAmJlxuICAgICh2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJ1xuICAgICAgICA/IChpc0FycmF5TGlrZShvYmplY3QpICYmIGlzSW5kZXgoaW5kZXgsIG9iamVjdC5sZW5ndGgpKVxuICAgICAgICA6ICh0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdClcbiAgICAgICkge1xuICAgIHJldHVybiBlcShvYmplY3RbaW5kZXhdLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICAvLyBTYWZhcmkgOC4xIG1ha2VzIGBhcmd1bWVudHMuY2FsbGVlYCBlbnVtZXJhYmxlIGluIHN0cmljdCBtb2RlLlxuICByZXR1cm4gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICghcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpIHx8IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFyZ3NUYWcpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pc0FycmF5TGlrZWAgZXhjZXB0IHRoYXQgaXQgYWxzbyBjaGVja3MgaWYgYHZhbHVlYFxuICogaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LWxpa2Ugb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA4LTkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGlzT2JqZWN0KHZhbHVlKSA/IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIEFzc2lnbnMgb3duIGVudW1lcmFibGUgc3RyaW5nIGtleWVkIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdHMgdG8gdGhlXG4gKiBkZXN0aW5hdGlvbiBvYmplY3QuIFNvdXJjZSBvYmplY3RzIGFyZSBhcHBsaWVkIGZyb20gbGVmdCB0byByaWdodC5cbiAqIFN1YnNlcXVlbnQgc291cmNlcyBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YCBhbmQgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BPYmplY3QuYXNzaWduYF0oaHR0cHM6Ly9tZG4uaW8vT2JqZWN0L2Fzc2lnbikuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEwLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBzZWUgXy5hc3NpZ25JblxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogZnVuY3Rpb24gQmFyKCkge1xuICogICB0aGlzLmMgPSAzO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYiA9IDI7XG4gKiBCYXIucHJvdG90eXBlLmQgPSA0O1xuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAwIH0sIG5ldyBGb28sIG5ldyBCYXIpO1xuICogLy8gPT4geyAnYSc6IDEsICdjJzogMyB9XG4gKi9cbnZhciBhc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSkge1xuICBpZiAobm9uRW51bVNoYWRvd3MgfHwgaXNQcm90b3R5cGUoc291cmNlKSB8fCBpc0FycmF5TGlrZShzb3VyY2UpKSB7XG4gICAgY29weU9iamVjdChzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHNvdXJjZVtrZXldKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QpIDogYmFzZUtleXMob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2guYXNzaWduL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=