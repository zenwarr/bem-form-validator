import {camel, FormValidator, separated} from "./index";
import { expect } from 'chai';

describe('FormValidator', function() {
  describe("std_form", function () {
    let form: HTMLFormElement;

    beforeEach(function() {
      document.body.innerHTML = `
      <form id="form" method="post" action="http://example.com">
        <div class="form-contents" id="form-contents">
          <label class="ib">
            <input name="name" minlength="3" required>
          </label>
          <label class="ib">
            <input type="email" name="email" required>          
          </label>
          <label class="ib">
            <input type="text" name="pattern" pattern="[0-9]*">
          </label>
          <label class="ib">
            <input type="number" name="number" min="10" max="20" required>
          </label>
        </div>
      </form>
    `;

      form = document.getElementById('form') as HTMLFormElement;
    });

    const putValidValues = () => {
      (form.elements.namedItem('name') as HTMLInputElement).value = '123';
      (form.elements.namedItem('email') as HTMLInputElement).value = 'admin@example.com';
      (form.elements.namedItem('number') as HTMLInputElement).value = '15';
    };

    it('should initialize validator', function () {
      let validator = new FormValidator(form);
      expect(validator.root).to.be.equal(form);
      expect(form.getAttribute('novalidate')).to.be.equal('');
      expect(form.classList.contains('form')).to.be.true;
      expect(FormValidator.fromRoot(form)).to.be.equal(validator);
    });

    it('should calculate classes', function () {
      let validator = new FormValidator(form);
      expect(validator.rootBlock).to.be.equal('form');
      expect(validator.rootValidClass).to.be.equal('form--valid');
      expect(validator.rootInvalidClass).to.be.equal('form--invalid');
    });

    it('should not set novalidate attribute on non-form root', function () {
      let root = document.getElementById('form-contents') as HTMLFormElement;
      let validator = new FormValidator(root);
      expect(validator.root).to.be.equal(root);
      expect(root.getAttribute('novalidate')).to.be.null;
    });

    it('should create correct constraints', function () {
      let validator = new FormValidator(form);
      expect(validator.constraints).to.be.deep.equal({
        name: {
          length: {
            minimum: 3
          },
          presence: true
        },
        email: {
          email: true,
          presence: true
        },
        pattern: {
          format: {
            pattern: '[0-9]*'
          }
        },
        number: {
          presence: true,
          numericality: {
            greaterThanOrEqualTo: 10,
            lessThanOrEqualTo: 20
          }
        }
      });
    });

    it('should set validation classes on an invalid form', function () {
      let validator = new FormValidator(form, {
        rootBlock: 'form'
      });
      validator.validate();
      expect(form.classList.contains('form--valid')).to.be.false;
      expect(form.classList.contains('form--invalid')).to.be.true;
    });

    it('should set validation classes on a valid form', function () {
      let validator = new FormValidator(form);
      putValidValues();
      expect(validator.validate()).to.be.true;
      expect(form.classList.contains('form--valid')).to.be.true;
      expect(form.classList.contains('form--invalid')).to.be.false;
    });

    it('should validate a single element', function () {
      let validator = new FormValidator(form);
      expect(validator.validateSingle('name')).to.be.false;
      expect(form.classList.contains('form--invalid')).to.be.true;
    });

    it('should return true for a validation of non existing element', function () {
      let validator = new FormValidator(form);
      expect(validator.validateSingle('non-existent')).to.be.true;
    });

    it('should start live mode after the first validation', function () {
      let nameInput = (form.elements.namedItem('name') as HTMLInputElement);
      let emailInput = (form.elements.namedItem('email') as HTMLInputElement);

      let validator = new FormValidator(form, {
        revalidateOnInput: true
      });
      putValidValues();
      nameInput.value = '';
      emailInput.value = '';
      expect(validator.liveValidation).to.be.false;
      expect(validator.validate()).to.be.false;
      expect(validator.liveValidation).to.be.true;
      expect(form.classList.contains('form--valid')).to.be.false;

      nameInput.value = 'some_name';
      nameInput.dispatchEvent(new Event('input'));
      expect(form.classList.contains('form--valid')).to.be.false;

      emailInput.value = 'email@example.com';
      emailInput.dispatchEvent(new Event('input'));
      expect(form.classList.contains('form--valid')).to.be.true;
    });

    it('should react only on specified event in live validation mode', function () {
      let nameInput = (form.elements.namedItem('name') as HTMLInputElement);

      let validator = new FormValidator(form, {
        revalidateOnChange: true,
        revalidateOnInput: false
      });
      putValidValues();
      validator.validate();
      expect(form.classList.contains('form--valid')).to.be.true;

      nameInput.value = 'x';
      expect(form.classList.contains('form--valid')).to.be.true;

      nameInput.dispatchEvent(new Event('input'));
      expect(form.classList.contains('form--valid')).to.be.true;

      nameInput.dispatchEvent(new Event('change'));
      expect(form.classList.contains('form--valid')).to.be.false;
    });
  });

  describe("loc_form", function () {
    let form: HTMLFormElement;
    let nameIb: HTMLElement;
    let name: HTMLInputElement, email: HTMLInputElement, number: HTMLInputElement;

    beforeEach(function() {
      document.body.innerHTML = `
        <form id="form">
          <div class="form-contents" id="form-contents">
            <label class="ib" id="name-ib">
              <input name="name" minlength="3" id="name-input" required data-msg-error="SOMETHING_WRONG" data-msg-minlength="OOPS_ERROR">
            </label>
            <label class="ib">
              <input type="email" name="email" id="email-input" required>          
            </label>
            <label class="ib">
              <input type="text" name="pattern" pattern="[0-9]*">
            </label>
            <label class="ib">
              <input type="number" name="number" id="number-input" min="10" max="20" required
                            data-msg-number="not in range from $min to $max">
            </label>
          </div>
        </form>
      `;

      form = document.getElementById('form') as HTMLFormElement;
      nameIb = document.getElementById('name-ib') as HTMLElement;
      name = document.getElementById('name-input') as HTMLInputElement;
      email = document.getElementById('email-input') as HTMLInputElement;
      number = document.getElementById('number-input') as HTMLInputElement;
    });

    it('should get error messages from html', function () {
      let validator = new FormValidator(form, {
        revalidateOnInput: true
      });
      validator.validate();
      expect(name.getAttribute('title')).to.be.equal('SOMETHING_WRONG');

      name.value = 'x';
      name.dispatchEvent(new Event('input'));
      expect(name.getAttribute('title')).to.be.equal('OOPS_ERROR');
    });

    it('should localize messages', function () {
      let validator = new FormValidator(form, {
        messages: {
          required: 'localized error message'
        }
      });
      validator.validate();
      expect(email.getAttribute('title')).to.be.equal('localized error message');
    });

    it('should format messages', function () {
      let validator = new FormValidator(form);
      number.value = '5';

      validator.validate();

      expect(number.getAttribute('title')).to.be.equal('not in range from 10 to 20');
    });
  });

  describe("init_form", function () {
    let form: HTMLFormElement;
    let nameIb: HTMLElement;
    let name: HTMLInputElement, email: HTMLInputElement;

    beforeEach(function() {
      document.body.innerHTML = `
        <form id="form" class="js-validate">
          <div class="form-contents" id="form-contents">
            <label class="ib" id="name-ib">
              <input name="name" minlength="3" id="name-input" required data-msg-error="SOMETHING_WRONG" data-msg-minlength="OOPS_ERROR">
            </label>
            <label class="ib">
              <input type="email" name="email" id="email-input" required>          
            </label>
            <label class="ib">
              <input type="text" name="pattern" pattern="[0-9]*">
            </label>
            <label class="ib">
              <input type="number" name="number" min="10" max="20" required>
            </label>
          </div>
        </form>
      `;

      form = document.getElementById('form') as HTMLFormElement;
      nameIb = document.getElementById('name-ib') as HTMLElement;
      name = document.getElementById('name-input') as HTMLInputElement;
      email = document.getElementById('email-input') as HTMLInputElement;
    });

    it('should initialize forms with validation class', function () {
      FormValidator.init();

      expect(FormValidator.fromRoot(form)).to.not.be.null;
    });
  });

  describe("step", function () {
    let form: HTMLFormElement;
    let numberInput: HTMLInputElement;
    let validator: FormValidator;

    beforeEach(function() {
      document.body.innerHTML = `
      <form id="form" method="post" action="http://example.com">
        <label class="ib">
          <input name="number" type="number" min="13" max="100" step="10" required>
        </label>
      </form>
    `;

      form = document.getElementById('form') as HTMLFormElement;
      numberInput = form.elements.namedItem('number') as HTMLInputElement;
      validator = new FormValidator(form, {
        revalidateOnInput: true
      });
      validator.validate();
    });

    const setValue = (value: number) => {
      numberInput.value = '' + value;
      numberInput.dispatchEvent(new Event('input'));
    };

    it('should understand step attribute', function () {
      expect(form.classList.contains('form--valid')).to.be.false;

      setValue(13);
      expect(form.classList.contains('form--valid')).to.be.true;

      setValue(23);
      expect(form.classList.contains('form--valid')).to.be.true;

      setValue(15);
      expect(form.classList.contains('form--valid')).to.be.false;
    });
  });

  describe("custom constraint builders", function () {
    let form: HTMLFormElement;
    let extended: HTMLInputElement;

    document.body.innerHTML = `
    <form id="form" method="post" action="http://example.com">
      <label class="ib">
        <input name="extended" id="extended" type="text" data-validate-extra="the_allowed_value" data-msg-extra="wrong">
      </label>
    </form>
    `;

    form = document.getElementById('form') as HTMLFormElement;
    extended = document.getElementById('extended') as HTMLInputElement;

    it("should not register validators with same name twice", function () {
      FormValidator.addConstraintBuilder('some_name', () => {});
      expect(() => FormValidator.addConstraintBuilder('some_name', () => {})).to.throw();
    });

    it("should validate with extra validator", function () {
      FormValidator.addConstraintBuilder('extra', (constraint: any, input: HTMLInputElement, option: string, msg: string) => {
        constraint.extra = {
          value: option,
          message: msg
        };
        return constraint;
      }, (value, options, key, attributes) => {
        return value !== options.value ? options.message || 'no error message' : null;
      });

      let validator = new FormValidator(form);
      expect(validator.constraints).to.be.deep.equal({
        extended: {
          extra: {
            value: 'the_allowed_value',
            message: 'wrong'
          }
        }
      });
      expect(validator.validate()).to.be.false;
      expect(extended.getAttribute('title')).to.be.equal('wrong');
    });
  });

  describe("url", function () {
    it("url", function () {
      document.body.innerHTML = `
        <form id="form">
          <input type="url" name="input_name" />        
        </form>
      `;

      let form = document.getElementById('form') as HTMLFormElement;
      let validator = new FormValidator(form);
      expect(validator.constraints).to.be.deep.equal({
        input_name: {
          url: true
        }
      });
    });
  });

  describe("extra validators", function () {
    it("equality validator", function () {
      document.body.innerHTML = `
        <form id="form">
          <input type="text" id="text1" name="text1" data-validate-equality="text2" data-msg-equality="not equal to $other value!" />
          <input type="text" id="text2" name="text2" />
        </form>
      `;

      let form = document.getElementById('form') as HTMLFormElement;
      let text1 = document.getElementById('text1') as HTMLInputElement;
      let text2 = document.getElementById('text2') as HTMLInputElement;

      let validator = new FormValidator(form);
      expect(validator.constraints).to.be.deep.equal({
        text1: {
          equality: {
            attribute: 'text2',
            message: 'not equal to text2 value!'
          }
        }
      });

      text1.value = 'value1';
      text2.value = 'value2';

      expect(validator.validate()).to.be.false;

      text2.value = 'value1';

      expect(validator.validate()).to.be.true;
    });

    it("exclude validator", function () {
      document.body.innerHTML = `
        <form id="form">
          <input type="number" id="input" name="input" data-validate-exclude="[1, 2, 3]" />
        </form>
      `;

      let form = document.getElementById('form') as HTMLFormElement;
      let input = document.getElementById('input') as HTMLInputElement;
      let validator = new FormValidator(form);

      input.value = '2';
      expect(validator.validate()).to.be.false;

      input.value = '4';
      expect(validator.validate()).to.be.true;
    });

    it("extra number validators", function () {
      document.body.innerHTML = `
        <form id="form">
          <input type="text" name="i1" data-validate-integer />
          <input type="text" name="i2" data-validate-integer data-msg-integer="should be integer" />
          <input type="text" name="i3" data-validate-divisible="5">
          <input type="text" name="i4" data-validate-odd />
          <input type="text" name="i5" data-validate-even />
          <input type="number" name="i6" min="10" max="20" data-validate-divisible="3" data-msg-divisible="not divisible!" />
          <input type="text" name="i7" data-validate-length-equal="5" data-validate-length-max="10" data-msg-length-equal="le" data-msg-lengthMax="lm" />
        </form>
      `;

      let form = document.getElementById('form') as HTMLFormElement;
      let validator = new FormValidator(form);

      expect(validator.constraints).to.be.deep.equal({
        i1: {
          numericality: {
            onlyInteger: true
          }
        },
        i2: {
          numericality: {
            onlyInteger: {
              message: 'should be integer'
            }
          }
        },
        i3: {
          numericality: {
            divisibleBy: 5
          }
        },
        i4: {
          numericality: {
            odd: true
          }
        },
        i5: {
          numericality: {
            even: true
          }
        },
        i6: {
          numericality: {
            greaterThanOrEqualTo: 10,
            lessThanOrEqualTo: 20,
            divisibleBy: {
              count: 3,
              message: "not divisible!"
            }
          }
        },
        i7: {
          length: {
            is: {
              count: 5,
              message: 'le'
            },
            maximum: {
              count: 10,
              message: 'lm'
            }
          }
        }
      });
    });
  });

  describe("text transform", function () {
    it("separated", function () {
      expect(separated('someName')).to.be.equal('some_name');
      expect(separated('some_name')).to.be.equal('some_name');
      expect(separated('SomeName')).to.be.equal('some_name');
      expect(separated('B')).to.be.equal('b');
      expect(separated('somenamE')).to.be.equal('somenam_e');
      expect(separated('')).to.be.equal('');
    });

    it("camel", function () {
      expect(camel('some_name')).to.be.equal('someName');
      expect(camel('some-name')).to.be.equal('someName');
      expect(camel('_somename')).to.be.equal('somename');
      expect(camel('somename_')).to.be.equal('somename');
      expect(camel('_')).to.be.equal('');
      expect(camel('')).to.be.equal('');
    });
  });

  describe("should not create constraints for non-validated fields", function () {
    it("subj", function () {
      document.body.innerHTML = `
        <form id="form">
          <input name="name" type="text" />
        </form>
      `;

      let form = document.getElementById('form') as HTMLFormElement;
      let validator = new FormValidator(form);

      expect(validator.constraints).to.be.deep.equal({

      });
    });
  });
});
