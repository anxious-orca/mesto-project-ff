// работа открытия и закрытия попапов
// функция открытия попапа
const openPopup = popup => {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscClose);
};

// функция закрытия попапа
const closePopup = popup => {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscClose);
};

// функция инициализации обработчиков событий модального окна
const setModalWindowEventListeners = modalWindow => {
    modalWindow.classList.add('popup_is-animated');
    const buttonClose = modalWindow.querySelector('.popup__close');
    buttonClose.addEventListener('click', () => closePopup(modalWindow));
    modalWindow.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('popup')) {
            closePopup(modalWindow);
        }
    });
};

// обработчик закрытия попапа на клавишу 'Esc'
const handleEscClose = evt => {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        closePopup(openedPopup);
    }
};

// функция loader на кнопку submit
function renderLoading(loader, isLoading)  {
    if(isLoading) {
        loader.textContent = 'Сохранение...';
        loader.classList.add('popup__button_text-animated');
    } else {
        loader.textContent = 'Сохранить';
        loader.classList.remove('popup__button_text-animated');
    }
  }

// экспорт функций в index.js
export { openPopup, closePopup, setModalWindowEventListeners, renderLoading };