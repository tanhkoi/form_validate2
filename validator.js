// Define the validation rules and their corresponding functions
var validateRules = {
	required: function (value) {
		return value ? undefined : 'Vui long nhap truong nay';
	},
	email: function (value) {
		// Regular expression for email validation
		var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		return regex.test(value) ? undefined : 'Vui long nhap email';
	},
	min: function (min) {
		// Function to check if the value has minimum length
		return function (value) {
			return value.length >= min ? undefined : `Vui long nhap ${min} ki tu`;
		};
	},
	max: function (max) {
		// Function to check if the value has maximum length
		return function (value) {
			return value.length >= max ? undefined : `Vui long nhap ${max} ki tu`;
		};
	},
};

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

// Handles the validation of an input field on blur event
function handleValidate(event) {
	var rules = formRules[event.target.name];
	var errorMessage;

	rules.find((rule) => {
		errorMessage = rule(event.target.value);
		return errorMessage;
	});
	console.log(errorMessage);
}

// Validates the form based on the provided formSelector
function Validator(formSelector) {
	formRules = {}; // Stores the collected rules for each input

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
		console.log(formRules); // Outputs the collected rules for debugging or further processing
	}
}
