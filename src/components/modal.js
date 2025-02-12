// импорт для функции создания карточки
import { createCard, deleteElement, likeElement } from './card';

// работа открытия и закрытия попапов
// функция открытия попапа
function openPopup(popup) {
    popup.classList.add('popup_is-opened');
}

// функция закрытия попапа
function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
}

// обработчик открытия попапа (открываем попап и вешаем слушатели закрытия)
function handleOpen(popup) {
    openPopup(popup);
    popup.addEventListener('click', (evt) => handleClose(evt, popup));
    document.addEventListener('keydown', (evt) => handleClose(evt, popup));
}

// обработчик закрытия попапа (закрываем попап и удаляем слушатели закрытия)
function handleClose(evt, popup) {
    const targetClasses = evt.target.classList;
    if (targetClasses.contains('popup') || targetClasses.contains('popup__close') || evt.key === 'Escape') {
        closePopup(popup);
        popup.removeEventListener('click', (evt) => handleClose(evt, popup));
        document.removeEventListener('keydown', (evt) => handleClose(evt, popup));
    }
}

// обработчик открытия попапа с изображением 
// (добавляем в попап изображение и описание карточки из evt.target, открываем попап и вешаем слушатели закрытия)
function handleCardImageEnlarge(evt, popup, imageContainer, descripitionContainer) {
    if (evt.target.classList.contains('card__image')) {
        const cardSrc = evt.target.src;
        const cardTitle = evt.currentTarget.querySelector('.card__title').textContent;
        imageContainer.src = cardSrc;
        descripitionContainer.textContent = cardTitle;
        handleOpen(popup)
    }
}

// обработчик изменения профиля
// (добавляем данные из input в профиль и закрываем попап)
function handleEditFormSubmit(evt, popup, titleContainer, descripitionContainer, customTitle, customJob) {
    evt.preventDefault();
    titleContainer.textContent = customTitle.value;
    descripitionContainer.textContent = customJob.value;
    closePopup(popup);
}

// обработчик добавления кастомной карточки
// (создаем объект с данными карточки, добавляем карточку, закрываем попап, очищаем форму)
function handleCardFormSubmit(evt, form, popup, cardName, cardLink, cardList) {
    evt.preventDefault();
    const customCardInfo = {
        name: cardName.value, 
        link: cardLink.value
    }
    const customCard = createCard(customCardInfo, deleteElement, likeElement);
    cardList.prepend(customCard);
    closePopup(popup);
    form.reset();
}

// экспорт функций для слушателей в index.js
export { handleOpen, handleCardImageEnlarge, handleEditFormSubmit, handleCardFormSubmit };