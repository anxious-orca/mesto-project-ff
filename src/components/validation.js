// функция стилизации input при ошибке, добавления текста ошибки и его отображения
const showError = (inputElement, errorElement, errorMessage, validationConfig) => {
    inputElement.classList.add(validationConfig.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(validationConfig.errorClass);
};

// функция скрытия стилизации input при ошибке и текста ошибки
const hideError = (inputElement, errorElement, validationConfig) => {
    inputElement.classList.remove(validationConfig.inputErrorClass);
    errorElement.classList.remove(validationConfig.errorClass);
    errorElement.textContent = '';
};

// функция проверки валидации поля ввода, которая показывает или скрывает заметку об ошибке
const checkInputValidity = (inputElement, errorElement, validationConfig) => {
    if (inputElement.validity.patternMismatch) {
        inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
        inputElement.setCustomValidity('');
    }
    if (!inputElement.validity.valid) {
        showError(inputElement, errorElement, inputElement.validationMessage, validationConfig);
    } else {
        hideError(inputElement, errorElement, validationConfig);
    }
};

// функция проверки: есть ли хотя бы одно невалидное поле, если да, тогда возвращаяет true
const hasInvalidInput = inputList => {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    })
};

// функция которая деактивирует кнопку или активирует ее в зависимости от валидности полей
const toggleButtonActivation = (inputList, buttonElement, validationConfig) => {
    if (hasInvalidInput(inputList)) {
        buttonElement.disabled = true;
        buttonElement.classList.add(validationConfig.inactiveButtonClass);
    } else {
        buttonElement.disabled = false;
        buttonElement.classList.remove(validationConfig.inactiveButtonClass);
    }
};

// функция очистки формы от ошибок
const clearValidation = (formElement, validationConfig) => {
    const submitButton = formElement.querySelector(validationConfig.submitButtonSelector);
    const listOfInputs = formElement.querySelectorAll(validationConfig.inputSelector);
    listOfInputs.forEach((inputElement) => {
        const inputError = formElement.querySelector(`.${inputElement.id}-error`);
        hideError(inputElement, inputError, validationConfig);
    });
    submitButton.disabled = true;
    submitButton.classList.add(validationConfig.inactiveButtonClass);
};

// фукнция вешает слушатель на все поля ввода формы и от их валидности обрабатыввает ошибки и кнопку submit
const setValidationEventListeners = (formElement, validationConfig) => {
    const listOfInputs = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
    const submitButton = formElement.querySelector(validationConfig.submitButtonSelector);
    toggleButtonActivation(listOfInputs, submitButton, validationConfig);
    listOfInputs.forEach((inputElement) => {
        const inputError = formElement.querySelector(`.${inputElement.id}-error`);
        inputElement.addEventListener('input', () => {
            checkInputValidity(inputElement, inputError, validationConfig);
            toggleButtonActivation(listOfInputs, submitButton, validationConfig);
        });
    });
};

// функция находит и вешает слушатели на все формы
const enableValidation = validationConfig => {
    const listOfForms = Array.from(document.querySelectorAll(validationConfig.formSelector));
    listOfForms.forEach((formElement) => {
        setValidationEventListeners(formElement, validationConfig);
    });
};

// экспорт функций в index.js
export { enableValidation, clearValidation };