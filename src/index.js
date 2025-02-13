// импорт CSS
import './pages/index.css';
// импорт массива с изображениями
import initialCards from './components/cards';
// импорт функций
import { openPopup, closePopup, setModalWindowEventListeners } from './components/modal';
import { createCard, deleteElement, likeElement } from './components/card';


// перменные

// находим главный контейнер контента страницы и массив с карточками
const container = document.querySelector('.content');
const cardsContainer = container.querySelector('.places__list');
// находим попап увеличения картинки и его контейнеры для изображения и описания
const popupEnlarge = document.querySelector('.popup_type_image');
const popupEnlargeImage = popupEnlarge.querySelector('.popup__image');
const popupEnlargeCaption = popupEnlarge.querySelector('.popup__caption');
// находим попап изменения профиля и его кнопку
const popupEditProfile = document.querySelector('.popup_type_edit');
const buttonEdit = container.querySelector('.profile__edit-button');
// находим форму изменения профиля, данные из формы и контейнеры профиля на странице
const formProfileEdit = document.forms.editProfile;
const nameInput = formProfileEdit.name;
const jobInput = formProfileEdit.description;
const profileTitle = container.querySelector('.profile__title');
const profileDescription = container.querySelector('.profile__description');
// находим попап добавления карточки и его кнопку
const popupNewCard = document.querySelector('.popup_type_new-card');
const buttonAdd = container.querySelector('.profile__add-button');
// находим форму добавления карточки, данные из формы
const formNewCard = document.forms.newPlace;
const inputPlaceName = formNewCard.placeName;
const inputLink = formNewCard.link;


//функции

// обработчик открытия попапа увеличения картинки
// (добавляем в попап изображение, описание карточки и alt, открываем попап)
const handleCardImageEnlarge = (imageSrc, imageDescripition) => {
    popupEnlargeImage.src = imageSrc;
    popupEnlargeImage.alt = `Изображение места: ${imageDescripition}`;
    popupEnlargeCaption.textContent = imageDescripition;
    openPopup(popupEnlarge);
}
// обработчик открытия попапа изменения профиля
// (добавляем данные из профиля в input и открываем попап)
const handleEditFormOpen = ({popup, titleContainer, descripitionContainer, customTitle, customJob}) => {
    customTitle.value = titleContainer.textContent;
    customJob.value = descripitionContainer.textContent;
    openPopup(popup);
}
// обработчик закрытия по Submit попапа изменения профиля
// (добавляем данные из input в профиль на странице и закрываем попап)
const handleEditFormSubmit = (evt, {popup, titleContainer, descripitionContainer, customTitle, customJob}) => {
    evt.preventDefault();
    titleContainer.textContent = customTitle.value;
    descripitionContainer.textContent = customJob.value;
    closePopup(popup);
}
// обработчик добавления кастомной карточки
// (создаем объект с данными карточки, добавляем карточку, закрываем попап, очищаем форму)
const handleCardFormSubmit = (evt, {form, popup, cardName, cardLink, cardList}) => {
    evt.preventDefault();
    const customCardInfo = {
        name: cardName.value, 
        link: cardLink.value
    }
    const customCard = createCard({
        cardData: customCardInfo, 
        deleteCardFunction: deleteElement, 
        likeCardFunction: likeElement, 
        openCardFunction: handleCardImageEnlarge
    });
    cardList.prepend(customCard);
    closePopup(popup);
    form.reset();
}


// обработчики

// добавляем слушатели на попап увеличения картинки
setModalWindowEventListeners(popupEnlarge);
// добавляем слушатели на попап изменения профиля
setModalWindowEventListeners(popupEditProfile);
// добавляем слушатели на попап добавления карточки
setModalWindowEventListeners(popupNewCard);
// добавляем слушатель на кнопку изменения профиля
buttonEdit.addEventListener('click', () => handleEditFormOpen({
    popup: popupEditProfile, 
    titleContainer: profileTitle, 
    descripitionContainer: profileDescription, 
    customTitle: nameInput, 
    customJob: jobInput
}));
// добавляем слушатель на submit, измененяя профиль
formProfileEdit.addEventListener('submit', evt => handleEditFormSubmit(evt, {
    popup: popupEditProfile, 
    titleContainer: profileTitle, 
    descripitionContainer: profileDescription, 
    customTitle: nameInput, 
    customJob: jobInput
}));
// добавляем слушатель на кнопку добавления карточки
buttonAdd.addEventListener('click', () => openPopup(popupNewCard));
// добавляем слушатель на submit, добавляя карточку
formNewCard.addEventListener('submit', evt => handleCardFormSubmit(evt, {
    form: formNewCard, 
    popup: popupNewCard, 
    cardName: inputPlaceName, 
    cardLink: inputLink, 
    cardList: cardsContainer
}));

// добавляем стоковые карточки на страницу
initialCards.forEach(item => {
    const card = createCard({
        cardData: item, 
        deleteCardFunction: deleteElement, 
        likeCardFunction: likeElement, 
        openCardFunction: handleCardImageEnlarge
    });
    cardsContainer.append(card);
});