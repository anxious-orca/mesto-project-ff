// импорт CSS
import './pages/index.css';
// импорт функций
import { openPopup, closePopup, setModalWindowEventListeners } from './components/modal';
import { createCard, deleteElement, updateLike, checkStatusLike } from './components/card';
import { enableValidation, clearValidation } from './components/validation';
import { searchCards, sendCard, searchUser, updateUser, updateAvatar, deleteCard, likeCard, unlikeCard } from './components/api';


// перменные

// находим главный контейнер контента страницы и список карточек
const container = document.querySelector('.content');
const cardsContainer = container.querySelector('.places__list');
// находим попап увеличения картинки и его контейнеры для изображения и описания
const popupEnlarge = document.querySelector('.popup_type_image');
const popupEnlargeImage = popupEnlarge.querySelector('.popup__image');
const popupEnlargeCaption = popupEnlarge.querySelector('.popup__caption');
// находим попап изменения профиля и его кнопку
const popupEditProfile = document.querySelector('.popup_type_edit');
const buttonEditProfile = container.querySelector('.profile__edit-button');
// находим форму изменения профиля, данные из формы и контейнеры профиля на странице
const formEditProfile = document.forms.editProfile;
const buttonTextFormEditProfile = popupEditProfile.querySelector('.popup__button_text');
const inputName = formEditProfile.name;
const inputJob = formEditProfile.description;
const profileTitle = container.querySelector('.profile__title');
const profileDescription = container.querySelector('.profile__description');
// находим попап изменения аватарки и его кнопку
const popupEditAvatar = document.querySelector('.popup_type_edit-avatar');
const buttonEditAvatar = container.querySelector('.avatar__edit-button');
// находим форму изменения аватарки, данные из формы и элемент аватарки на странице
const formAvatarEdit = document.forms.editAvatar;
const buttonTextFormAvatarEdit = popupEditAvatar.querySelector('.popup__button_text');
const inputAvatarLink = formAvatarEdit.avatarLink;
const profileAvatarImage = container.querySelector('.profile__image');
// находим попап добавления карточки и его кнопку
const popupNewCard = document.querySelector('.popup_type_new-card');
const buttonNewCard = container.querySelector('.profile__add-button');
// находим форму добавления карточки, данные из формы
const formNewCard = document.forms.newPlace;
const buttonTextFormNewCard = popupNewCard.querySelector('.popup__button_text');
const inputPlaceName = formNewCard.placeName;
const inputLink = formNewCard.link;
// находим попап подтверждения удаления карточки и его кнопку
const popupDelete = document.querySelector('.popup_type_delete');
const buttonConfirmDelete = popupDelete.querySelector('.popup__button-delete');
// создаем пустые переменные для id карточки и ее элемента
let cardId;
let cardElement;
// объект с классами для валидации
const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__input-error_active'
};


//функции

// обработчик открытия попапа увеличения картинки
// (добавляем в попап изображение, описание карточки и alt, открываем попап)
const handleEnlargeCardImage = (imageSrc, imageDescripition) => {
    popupEnlargeImage.src = imageSrc;
    popupEnlargeImage.alt = `Изображение места: ${imageDescripition}`;
    popupEnlargeCaption.textContent = imageDescripition;
    openPopup(popupEnlarge);
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
};
// обработчик открытия попапа изменения профиля
// (добавляем данные из профиля в input, очищаем поля ввода от ошибок и открываем попап)
const handleOpenFormEditProfile = () => {
    inputName.value = profileTitle.textContent;
    inputJob.value = profileDescription.textContent;
    clearValidation(formEditProfile, validationConfig);
    openPopup(popupEditProfile);
};
// обработчик изменения профиля
// (отправляем PATCH запрос с данными из input, добавляем ответ в профиль на странице и закрываем попап)
const handleSubmitFormEditProfile = evt => {
    evt.preventDefault();
    renderLoading(buttonTextFormEditProfile, true);
    updateUser(inputName.value, inputJob.value)
    .then(data => {
        profileTitle.textContent = data.name;
        profileDescription.textContent = data.about;
        closePopup(popupEditProfile);
    })
    .catch(error => {
        console.log(`Ошибка: ${error}`);
    })
    .finally(() => {
        renderLoading(buttonTextFormEditProfile, false);
    });
};
// обработчик открытия попапа изменения аватарки
// (очищаем поля ввода от ошибок и открываем попап)
const handleOpenFormEditAvatar = () => {
    clearValidation(formAvatarEdit, validationConfig);
    openPopup(popupEditAvatar);
};
// обработчик изменения аватарки
// (отправляем PATCH запрос с данными из input, добавляем ответ в профиль на странице и закрываем попап, очищаем форму)
const handleSubmitFormEditAvatar = evt => {
    evt.preventDefault();
    renderLoading(buttonTextFormAvatarEdit, true);
    updateAvatar(inputAvatarLink.value)
    .then(data => {
        profileAvatarImage.src = data.avatar;
        profileAvatarImage.alt = `Аватарка пользователя: ${data.name}`;
        closePopup(popupEditAvatar);
        formAvatarEdit.reset();
    })
    .catch(error => {
        console.log(`Ошибка: ${error}`);
    })
    .finally(() => {
        renderLoading(buttonTextFormAvatarEdit, false);
    });
};
// обработчик открытия попапа добавления кастомной карточки
// (очищаем поля ввода от ошибок и открываем попап)
const handleOpenFormNewCard = () => {
    clearValidation(formNewCard, validationConfig);
    openPopup(popupNewCard);
};
// обработчик добавления кастомной карточки
// (отправляем POST запрос с данными из input, создаем карточку с данными из ответа, добавляем карточку, закрываем попап, очищаем форму)
const handleSubmitFormNewCard = evt => {
    evt.preventDefault();
    renderLoading(buttonTextFormNewCard, true);
    sendCard(inputPlaceName.value, inputLink.value)
    .then(data => {
        const customCard = createCard({
            cardData: data, 
            openPopupDeleteFunction: handleOpenPopupDelete,
            likeCardFunction: handleLikeFunction, 
            openCardFunction: handleEnlargeCardImage,
            userId: data.owner._id
        });
        cardsContainer.prepend(customCard);
        closePopup(popupNewCard);
        formNewCard.reset();
    })
    .catch(error => {
        console.log(`Ошибка: ${error}`);
    })
    .finally(() => {
        renderLoading(buttonTextFormNewCard, false);
    });
};
// обработчик открытия попапа удаления карточки
// (добавляем в переменные элемент карточки и ее id и открываем попап)
const handleOpenPopupDelete = (element, elementId) => {
    cardId = elementId;
    cardElement = element;
    openPopup(popupDelete);
};
// обработчик удаления карточки
// (передаем в функцию удаления: попап, элемент карточки и ее id)
const handleDeleteCard = () => {
    deleteCard(cardId)
    .then(() => {
        deleteElement(cardElement);
        closePopup(popupDelete);
    })
    .catch(error => {
        console.log(`Ошибка: ${error}`);
    })
};
// обработчик лайка карточки
// (передаем id карточки, елемент кнопки лайка и счетчик лайка)
const handleLikeFunction = (elementId, elementLikeButton, elementLikeCount) => {
    const req = checkStatusLike(elementLikeButton) ? unlikeCard(elementId) : likeCard(elementId)
    req.then(data => {
        updateLike(data, elementLikeButton, elementLikeCount);
    })
    .catch(error => {
        console.log(`Ошибка: ${error}`);
    })
} 


// обработчики

// добавляем слушатели на попап увеличения картинки
setModalWindowEventListeners(popupEnlarge);
// добавляем слушатели на попап изменения профиля
setModalWindowEventListeners(popupEditProfile);
// добавляем слушатели на попап изменения аватарки
setModalWindowEventListeners(popupEditAvatar);
// добавляем слушатели на попап добавления карточки
setModalWindowEventListeners(popupNewCard);
// добавляем слушатели на попап подтверждения удаления карточки
setModalWindowEventListeners(popupDelete);
// добавляем слушатель на кнопку изменения профиля
buttonEditProfile.addEventListener('click', handleOpenFormEditProfile);
// добавляем слушатель на submit, измененяя профиль
formEditProfile.addEventListener('submit', handleSubmitFormEditProfile);
// добавляем слушатель на кнопку изменения аватарки
buttonEditAvatar.addEventListener('click', handleOpenFormEditAvatar);
// добавляем слушатель на submit, измененяя аватарку
formAvatarEdit.addEventListener('submit', handleSubmitFormEditAvatar);
// добавляем слушатель на кнопку добавления карточки
buttonNewCard.addEventListener('click', handleOpenFormNewCard);
// добавляем слушатель на submit, добавляя карточку
formNewCard.addEventListener('submit', handleSubmitFormNewCard);
// добавляем слушатель на кнопку попапа подтверждающего удаление карточки
buttonConfirmDelete.addEventListener('click', handleDeleteCard);
// добавляем данные о себе с сервера в профиль на страницу
// добавляем карточки с сервера на страницу
Promise.all([searchCards(), searchUser()])
    .then(res => {
        profileTitle.textContent = res[1].name;
        profileDescription.textContent = res[1].about;
        profileAvatarImage.src = res[1].avatar;

        res[0].forEach(item => {
            const card = createCard({
                cardData: item, 
                openPopupDeleteFunction: handleOpenPopupDelete,
                likeCardFunction: handleLikeFunction,
                openCardFunction: handleEnlargeCardImage,
                userId: res[1]._id
            });
            cardsContainer.append(card);
        });
    })
    .catch(error => {
        console.log(`Ошибка: ${error}`);
    });
// вызываем валидацию всех форм на странице
enableValidation(validationConfig);