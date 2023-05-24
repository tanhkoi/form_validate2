function Validator(formSelector) {
	formRules = {};
	//
	var validateRules = {
		required: function (value) {
			return value ? undefined : 'Vui long nhap truong nay';
		},
		email: function (value) {
			var regex =
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			return regex.test(value) ? undefined : 'Vui long nhap email';
		},
		min: function (min) {
			return function (value) {
				return value.length >= min ? undefined : `Vui long nhap ${min} ki tu`;
			};
		},
		max: function (max) {
			return function (value) {
				return value.length >= max ? undefined : `Vui long nhap ${max} ki tu`;
			};
		},
	};
	//
	var formElement = document.querySelector(formSelector);
	//
	if (formElement) {
		var inputs = formElement.querySelectorAll('[name][rules]');
		for (var input of inputs) {
			// console.log(input);
			var rules = input.getAttribute('rules').split('|');
			for (var rule of rules) {
				// console.log(rule);
				var ruleInfo;
				var isRuleHasValue = rule.includes(':');
				if (isRuleHasValue) {
					ruleInfo = rule.split(':');
					rule = ruleInfo[0];
					// console.log(rule);
					// console.log(validateRules[rule](ruleInfo[1]));
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
		}
		console.log(formRules);
	}
}
