// Validates the form based on the provided formSelector
function Validator(formSelector, option = {}) {
	// Define the validation rules and their corresponding functions
	var validateRules = {
		// Rule: Required field
		required: function (value) {
			return value ? undefined : 'This field is required';
		},
		// Rule: Email format
		email: function (value) {
			var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			return regex.test(value) ? undefined : 'This field must be an email';
		},
		// Rule: Minimum length
		min: function (min) {
			return function (value) {
				return value.length >= min ? undefined : `This field must contain >= ${min} letters or numbers.`;
			};
		},
		// Rule: Maximum length
		max: function (max) {
			return function (value) {
				return value.length >= max ? undefined : `This field must contain < ${max} letters or numbers.`;
			};
		},
	};

	var formRules = {}; // Stores the collected rules for each input

	// Extracts rule information and generates the rule function for an input element
	function extractRuleInfo(input, rule, validateRules) {
		var ruleInfo;
		var isRuleHasValue = rule.includes(':');
		if (isRuleHasValue) {
			ruleInfo = rule.split(':');
			rule = ruleInfo[0];
		}

		var ruleFunc = validateRules[rule];

		if (isRuleHasValue) {
			ruleFunc = ruleFunc(ruleInfo[1]);
		}

		if (Array.isArray(formRules[input.name])) {
			formRules[input.name].push(ruleFunc);
		} else {
			formRules[input.name] = [ruleFunc];
		}
	}

	// Finds the outermost parent element that matches the given selector
	function getOuterMostParent(childElement, selector) {
		return childElement.closest(selector);
	}

	// Handles the validation of an input field
	function handleValidate(event) {
		var rules = formRules[event.target.name];
		var errorMessage;
		var displayErrorMessage = getOuterMostParent(event.target, '.form-group').querySelector('.form-message');

		for (var rule of rules) {
			errorMessage = rule(event.target.value);
			if (errorMessage) break;
		}

		if (errorMessage) {
			displayErrorMessage.innerText = errorMessage;
			getOuterMostParent(event.target, '.form-group').classList.add('invalid');
		} else {
			displayErrorMessage.innerText = '';
			getOuterMostParent(event.target, '.form-group').classList.remove('invalid');
		}
		return !!errorMessage; // return true if error message exist
	}

	// Handles the validation of an input field on submit
	function handleValidateOnSubmit(event) {
		event.preventDefault();
		var isValid = true;
		var inputs = formElement.querySelectorAll('[name][rules]');
		for (const input of inputs) {
			if (handleValidate({ target: input })) {
				isValid = false;
			}
		}
		if (isValid) {
			if (typeof option.onSubmit === 'function') {
				var inputValues = Array.from(inputs).reduce((values, input) => {
					values[input.name] = input.value;
					return values;
				}, {});
				option.onSubmit(inputValues);
			} else {
				formElement.submit();
			}
		}
	}

	var formElement = document.querySelector(formSelector);

	if (formElement) {
		var inputs = formElement.querySelectorAll('[name][rules]');
		for (var input of inputs) {
			var rules = input.getAttribute('rules').split('|');
			for (var rule of rules) {
				// Extract and add the validation rule for the input
				extractRuleInfo(input, rule, validateRules);
				// Attach the handleValidate function to the input's blur event
				input.onblur = handleValidate;
			}
		}
		// console.log(formRules); // Outputs the collected rules for debugging or further processing
		formElement.onsubmit = handleValidateOnSubmit;
	}
}
