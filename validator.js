function Validator(formSelector) {
	var formElement = document.querySelector(formSelector);
	if (formElement) {
		var inputs = formElement.querySelectorAll('[name][rules]');
	}
}