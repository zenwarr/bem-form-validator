import * as base from '@zcomp/base';
export declare type ValidationConstraints = {
    [name: string]: any;
};
export declare type FormatParams = {
    [name: string]: any;
};
export declare type ConstraintBuilder = (constraint: any, input: Element, option: string, msg: string | null, validator: FormValidator) => any;
export declare type CustomValidator = (value: string, options: any, key: string, attributes: string) => string | null | void;
export interface InputData {
    elem: Element;
    ib: Element | null;
    errorElement: Element | null;
    valid: boolean | null;
}
export interface FormValidatorOptions extends base.ComponentOptions {
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
    [name: string]: string | undefined;
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
export declare const DefaultOptions: FormValidatorOptions;
export declare class FormValidator extends base.Component<FormValidatorOptions> {
    /**
     * Creates a validator attached to the given root element.
     * It is not required for the root element to be a form.
     * But if it is a form, its native validation is disabled and validation is implemented by this class.
     * @param {HTMLFormElement} _root
     * @param {FormValidatorOptions} options
     */
    constructor(_root: HTMLFormElement, options: FormValidatorOptions);
    /**
     * Call this function to validate the all elements inside the root block.
     * @param {boolean} silent Silent validation means that DOM is not altered in any way.
     * @returns {boolean} True if all elements are valid, false otherwise
     */
    validate(silent?: boolean): boolean;
    /**
     * Call this function to validate a single element with given name.
     * @param {string} elemName Name of the element to validate
     * @param {boolean} silent Silent validation means that DOM is not altered in any way.
     * @returns {boolean} True if the element is valid, false otherwise
     */
    validateSingle(elemName: string, silent?: boolean): boolean;
    /**
     * @returns {ValidationConstraints} List of constraints collected from HTML5 validation attributes
     */
    readonly constraints: ValidationConstraints;
    /**
     * @returns {boolean} True if the validator is currently in live mode, false otherwise
     */
    readonly liveValidation: boolean;
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
    static addConstraintBuilder(name: string, builder: ConstraintBuilder, validator?: CustomValidator): void;
    /**
     * Formats a message, replacing placeholders in form $name with values from `params` object.
     * @param {string} msg Message string to be formatted.
     * @param {FormatParams} params Object holding parameters to be replaced
     * @returns {string} Formatted string
     */
    formatMsg(msg: string, params: FormatParams): string;
    /** Protected area **/
    /**
     * Called to handle form submit event
     * @param {Event} e Event object
     * @returns {boolean} Return true if form should be submitted, false otherwise
     */
    protected onSubmit(e: Event): boolean;
    /**
     * It is guaranteed that after successfully calling this functions constraints are up-to date with DOM values.
     * @private
     */
    protected _ensureConstraintsAreBuilt(): void;
    /**
     * Called to show errors on corresponding elements.
     * @param errors Error object as retrieved from validate.js.
     */
    protected showErrors(errors: any): void;
    /**
     * Called to set error state for the element in DOM.
     * @param {string} msg Error message for the element
     * @param {InputData} elem Element data
     */
    protected setError(msg: string, elem: InputData): void;
    /**
     * Called to set valid state for the element in DOM
     * @param {InputData} elem Element data
     */
    protected clearError(elem: InputData): void;
    /**
     * @returns {boolean} True if the root has at least validated and invalid element.
     * @private
     */
    protected _hasInvalidElems(): boolean;
    /**
     * Updates input element data, getting its state from DOM.
     * Validity state is not resetted.
     * @param {InputData} data Element data
     * @param {Element} elem Element node in DOM
     * @private
     */
    protected _updateInputData(data: InputData, elem: Element): void;
    /**
     * Creates data entry for element inside the root.
     * @param {Element} elem Element node in DOM
     * @returns {InputData} Element data
     * @private
     */
    protected _buildInputData(elem: Element): InputData;
    /**
     * Get unformatted message of the given class text for an element
     * @param {Element} elem Element node
     * @param {string} msgClasses List of message classes.
     * @returns {string | null}
     * @private
     */
    protected _getElementMsg(elem: Element, ...msgClasses: string[]): string | null;
    /**
     * Update element data.
     * It synchronizes element data with DOM, removing data entries for element that has been removed from DOM, adding data for elements added to DOM and updating data for updated nodes.
     * @private
     */
    protected _rebuildElems(): void;
    /**
     * Rebuilds constraint data from DOM data.
     * Constraints are automatilly rebuilded when DOM is changed.
     * @private
     */
    protected _buildConstraints(): void;
    /**
     * Enter live validation mode
     * @private
     */
    protected _beginLiveValidation(): void;
    /**
     * Called when value of an element has been changed.
     * @param {string} elemName
     * @param {Event} e
     */
    protected onElementChange(elemName: string, e: Event): void;
    /**
     * Updates root node to reflect its validity state.
     * @param {boolean} hasErrors
     */
    protected setRootHasErrors(hasErrors: boolean): void;
    /**
     * Helper function to get value of an element.
     * @param {Element} elem
     * @returns {string | null}
     * @private
     */
    protected _getInputValue(elem: Element): string | null;
    private _constraints;
    private _elems;
    private _liveValidation;
    private _autoInvalidateConstraints;
    private static _constraintBuilders;
}
/**
 * Helper function that converts a name into a name in underscore-separated format (in fact, you can replace an underscore with a character of your choice)
 * @param {string} name Name in camel-case format (or mixed with underscores and dashes)
 * @param {string} sep Separator to use instead of underscore
 * @returns {string} Formatted name
 */
export declare function separated(name: string, sep?: string): string;
/**
 * Converts name where parts are separated with underscores or dashes to camel-case format
 * @param {string} name
 * @returns {string} Camel-case formatted name
 */
export declare function camel(name: string): string;
export declare const FormValidatorFactory: base.ComponentFactory<FormValidator, FormValidatorOptions>;
