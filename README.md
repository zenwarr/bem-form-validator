This is a helper library for validating forms in a browser with help of validate.js.
Of course, you can validate forms just with validate.js, but you do not need to write much JS code to do similar things with this library.
All you need is to add regular HTML5 validation attributes (like 'required', 'min', 'max') and give correct 'type' attribute to your 'input' elements.
Everything else is done by this library.

## Installing:

Run:

```javascript
npm i --save zw-form-validator
```

If you love TypeScript, you can use it out-of-box, type definition files are already included in the package.

## Usage

First, you need to import the library into your module.

```javascript
const v = require('zw-form-validator');
```

In all examples below, it is assumed that you have imported the module into constant named `v`.

For each form that needs to be validated, a FormValidator object should be created.
You can do it either manually:

```javascript
let validator = new v.FormValidator(document.getElementById('form'));
```

Or take advantage of static member function that automatically creates FormValidator instances for all elements that have a specific class.
By default, it creates validators for elements with class `js-validate`.

```javascript
FormValidator.init();
```

The first argument to this function is a class name, the second one is options that validator objects should take.
FormValidator constructor takes an options object as an argument.

## HTML markup

You can use regular HTML attributes to create validation rules.
This library understands them.
Refer to MDN documentation or specification on information about these attributes.
For example:

```html
<form class="js-validate">
  <label class="ib">
    <input type="text" name="name" required />
  </label>
  <label class="ib">
    <input type="number" name="age" min="18" required />
  </label>
  <button type="submit">Auth</button>
</form>
```

Additionally, you can use extra validators that are supported by validate.js but not supported by native in-browser validation.

### Check equality of two fields

Just add `data-validate-equality` attribute to your element.
The value of the attribute should be equal to the name of an input whose value should equal to the value of the current element.

```html
<input type="password" name="password" />
<input type="password" name="password_repeat" data-validate-equality="password" />
```

### Allow only specific values

If your input can be only one of a list of predefined values, you can add `data-validate-include` attribute and list all allowed values here.
The value of the attribute should be either a valid JSON (which is passed to validate.js `inclusion` constraint) or a single value.
In the latter case, only this value will be allowed.

```html
<input type="number" name="number" data-validate-include="[1, 5, 7]" />
```

### Blacklist values

If your input value should not have some values, add `data-validate-exclude` attribute to it:

```html
<input type="number" name="number" data-validate-exclude="[1, 4, 5]" />
```

### Extra number validation

Add the following attributes that match to corresponding validate.js validators:

```
data-validate-integer (onlyInteger)
data-validate-divisible (divisibleBy)
data-validate-odd (odd)
data-validate-even (even)
```

### Extra length validation

In addition to `minlength` attribute supported by this library, you can use extra validations that check the length of the value:

```html
data-validate-length-equal
data-validate-length-max
```

### Extra url validation

Set `data-validate-url-schemes` to a list of schemes that should be allowed.
Set `data-validate-url-allow-local` if you want validator to allow local URLs.
These attributes require `type` attribute to be set to `url`.

## Custom validators and constraint builders

If you need more, you can register your own validators.
First, you will need a function called 'constraint builder' that will take a constraint object (see validate.js docs for details) and transform it.
If you target can be achieved with built-in validate.js features, it is all you need.

```javascript
FormValidator.addConstraintBuilder('extra', (constraint, input, option, msg, validator) => {
    if (constraint.url) {
        constraint.url.allowLocal = true;
    } else {
        constraint.url = {
            allowLocal: true
        }
    }
});
```

You can use this custom validator by adding an attribute to your input in the following form:

```html
<input type="text" name="input" data-validate-extra="some value" />
```

This function will be called each time validator needs to rebuild constraints for each input that has the corresponding attribute.

The constraint builder function takes the following arguments:
`constraint` is the constraint object (see validate.js docs) for an input you are building constraints for.
You should either update the properties of this object or return a new object that will replace the old one.
`input` is the input you are building constraints for.
`option` is the value of `data-validate-...` attribute (`some value` in our example).
`msg` is the message for this validation.
See next section for details.
`validator` is the FormValidator object.

If you need to register your own validate.js validator, you can pass a function as the third argument to `addConstraintBuilder` function.
This function will be registered as a custom validator for validate.js, and its name will be equal to the value of the first argument.

## Localization and changing error messages

You can change default messages that validator adds to the elements by passing it as options to the constructor:

```javascript
FormValidator.init('js-validate', {
    messages: {
        required: 'You should not skip this input!',
        email: 'Input email here!'
    }
});
```

See documentation or source code for the full list of supported keys.
You can change error message for a specific input too:

```html
<input type="email" name="name" required data-msg-required="You should not skip this input!" data-msg-email="Input email here!" />
```

It works even with custom constraint builders or validators:

```html
<input type="text" name="input" data-validate-extra data-msg-extra="The value does not pass extra check!" />
```

## Building documentation

Install typedoc:

```
npm i -g typedoc
typedoc index.ts --out ./docs
```

Now open `docs/index.html` file.

