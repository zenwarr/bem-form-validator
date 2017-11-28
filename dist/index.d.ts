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
export declare class FormValidator {
    protected _root: HTMLFormElement;
    constructor(_root: HTMLFormElement, options?: FormValidatorOptions);
    /**
     * Call this function to validate the all elements of the root block.
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
     * @returns {Element} Form element assotiated with the object
     */
    readonly root: Element;
    /**
     * @returns {string} Block name for a root element
     */
    readonly rootBlock: string;
    /**
     * @returns {string} A class name applied to the root block if all its children are valid
     */
    readonly rootValidClass: string;
    /**
     * @returns {string} A class name applied to the root element if at least one of its children is invalid
     */
    readonly rootInvalidClass: string;
    readonly inputBlock: string;
    readonly inputBlockErrorElement: string;
    readonly inputBlockValidClass: string;
    readonly inputBlockInvalidClass: string;
    readonly options: FormValidatorOptions;
    readonly liveValidation: boolean;
    static fromRoot(root: Element): FormValidator | null;
    static init(rootClass?: string, options?: FormValidatorOptions): void;
    static addConstraintBuilder(name: string, builder: ConstraintBuilder, validator?: CustomValidator): void;
    formatMsg(msg: string, params: FormatParams): string;
    /** Protected area **/
    /**
     * Called to handle form submit event
     * @param {Event} e Event object
     * @returns {boolean} Return true if form should be submitted, false otherwise
     */
    protected onSubmit(e: Event): boolean;
    /**
     * Called to show errors on corresponding elements.
     * @param errors Error object as retrieved from validate.js.
     */
    protected showErrors(errors: any): void;
    protected setError(msg: string, elem: InputData): void;
    protected clearError(elem: InputData): void;
    protected _hasInvalidElems(): boolean;
    protected _buildInputData(elem: Element): InputData;
    protected _getElementMsg(elem: Element, ...msgClasses: string[]): string | null;
    protected _buildConstraints(): void;
    protected _beginLiveValidation(): void;
    protected onElementChange(elemName: string, e: Event): void;
    protected setRootHasErrors(hasErrors: boolean): void;
    protected _getInputValue(elem: Element): string | null;
    private _options;
    private _constraints;
    private _elems;
    private _liveValidation;
    private static _constraintBuilders;
}
export declare function separated(name: string, sep?: string): string;
export declare function camel(name: string): string;
