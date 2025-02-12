// импорт CSS
import './pages/index.css';
// импорт массива с изображениями
import initialCards from './components/cards';

// импорт функций
import { handleOpen, handleCardImageEnlarge, handleEditFormSubmit, handleCardFormSubmit } from './components/modal';
import { createCard, deleteElement, likeElement } from './components/card';

// добавляем стоковые карточки на страницу
const container = document.querySelector('.content');
const cardsContainer = container.querySelector('.places__list');
initialCards.forEach(item => {
    const card = createCard(item, deleteElement, likeElement);
    cardsContainer.append(card);
});


// добавляем слушатель для попапа на контейнер с карточками
// (находим попап, его контейнеры, вешаем слушатель передав ему все значения)
const popupEnlarge = document.querySelector('.popup_type_image');
const popupEnlargeImage = popupEnlarge.querySelector('.popup__image');
const popupEnlargeCaption = popupEnlarge.querySelector('.popup__caption');
cardsContainer.addEventListener('click', (evt) => handleCardImageEnlarge(evt, popupEnlarge, popupEnlargeImage, popupEnlargeCaption));


// добавляем слушатель на кнопку изменения профиля
const popupEditProfile = document.querySelector('.popup_type_edit');
const buttonEdit = container.querySelector('.profile__edit-button');
buttonEdit.addEventListener('click', () => handleOpen(popupEditProfile));

// добавляем слушатель на submit, измененяя профиль
// (находим данные из формы, находим контейнеры профиля, вешаем слушатель передав ему все значения)
const formProfileEdit = document.forms.editProfile;
const nameInput = formProfileEdit.name;
const jobInput = formProfileEdit.description;
const profileTitle = container.querySelector('.profile__title');
const profileDescription = container.querySelector('.profile__description');
formProfileEdit.addEventListener('submit', (evt) => handleEditFormSubmit(evt, popupEditProfile, profileTitle, profileDescription, nameInput, jobInput));


// добавляем слушатель на кнопку добавления карточки
const popupNewCard = document.querySelector('.popup_type_new-card');
const buttonAdd = container.querySelector('.profile__add-button');
buttonAdd.addEventListener('click', () => handleOpen(popupNewCard));

// добавляем слушатель на submit, добавляя карточку
// (находим данные из формы, вешаем слушатель передав ему все значения)
const formNewCard = document.forms.newPlace;
const inputPlaceName = formNewCard.placeName;
const inputLink = formNewCard.link;
formNewCard.addEventListener('submit', (evt) => handleCardFormSubmit(evt, formNewCard, popupNewCard, inputPlaceName, inputLink, cardsContainer));