// импорт CSS
import './pages/index.css';
// импорт функций
import { openPopup, closePopup, setModalWindowEventListeners, renderLoading } from './components/modal';
import { createCard, handleDeleteCard, handleLikeFunction, handleIslikedByUser } from './components/card';
import { enableValidation, clearValidation } from './components/validation';
import { searchCards, sendCard, searchUser, updateUser, updateAvatar } from './components/api';


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
const popupDeleteCardId = popupDelete.querySelector('#cardId');
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
// обработчик открытия попапа изменения профиля
// (добавляем данные из профиля в input, очищаем поля ввода от ошибок и открываем попап)
const handleOpenFormEditProfile = ({popup, form, titleContainer, descripitionContainer, customTitle, customDescripition}) => {
    customTitle.value = titleContainer.textContent;
    customDescripition.value = descripitionContainer.textContent;
    clearValidation(form, validationConfig);
    openPopup(popup);
};
// обработчик изменения профиля
// (отправляем PATCH запрос с данными из input, добавляем ответ в профиль на странице и закрываем попап)
const handleSubmitFormEditProfile = (evt, {popup, titleContainer, descripitionContainer, customTitle, customDescripition, buttonText}) => {
    evt.preventDefault();
    renderLoading(buttonText, true);
    updateUser(customTitle.value, customDescripition.value)
    .then(data => {
        titleContainer.textContent = data.name;
        descripitionContainer.textContent = data.about;
        closePopup(popup);
    })
    .catch(error => {
        console.log(`Ошибка: ${error}`);
    })
    .finally(() => {
        renderLoading(buttonText, false);
    });
};
// обработчик открытия попапа изменения аватарки
// (очищаем поля ввода от ошибок и открываем попап)
const handleOpenFormEditAvatar = (popup, form) => {
    clearValidation(form, validationConfig);
    openPopup(popup);
};
// обработчик изменения аватарки
// (отправляем PATCH запрос с данными из input, добавляем ответ в профиль на странице и закрываем попап)
const handleSubmitFormEditAvatar = (evt, {form, popup, avatarContainer, avatarLink, buttonText}) => {
    evt.preventDefault();
    renderLoading(buttonText, true);
    updateAvatar(avatarLink.value)
    .then(data => {
        avatarContainer.src = data.avatar;
        avatarContainer.alt = `Аватарка пользователя: ${data.name}`;
        closePopup(popup);
    })
    .catch(error => {
        console.log(`Ошибка: ${error}`);
    })
    .finally(() => {
        renderLoading(buttonText, false);
        form.reset();
    });
};
// обработчик открытия попапа добавления кастомной карточки
// (очищаем поля ввода от ошибок и открываем попап)
const handleOpenFormNewCard = (popup, form) => {
    clearValidation(form, validationConfig);
    openPopup(popup);
};
// обработчик добавления кастомной карточки
// (отправляем POST запрос с данными из input, создаем карточку с данными из ответа, добавляем карточку, закрываем попап, очищаем форму)
const handleSubmitFormNewCard = (evt, {form, popup, cardName, cardLink, cardList, buttonText}) => {
    evt.preventDefault();
    renderLoading(buttonText, true);
    sendCard(cardName.value, cardLink.value)
    .then(data => {
        const customCard = createCard({
            cardData: data, 
            openPopupDeleteFunction: handleOpenPopupDelete,
            likeCardFunction: handleLikeFunction, 
            openCardFunction: handleEnlargeCardImage,
            isLikedFunction: handleIslikedByUser,
            userId: data.owner._id
        });
        cardList.prepend(customCard);
        closePopup(popup);
    })
    .catch(error => {
        console.log(`Ошибка: ${error}`);
    })
    .finally(() => {
        renderLoading(buttonText, false);
        form.reset();
    });
};
// обработчик открытия попапа удаления карточки
// (добавляем элемент карточки и ее id для удаления и открываем попап)
const handleOpenPopupDelete = elementId => {
    popupDeleteCardId.textContent = elementId;
    openPopup(popupDelete);
};
// обработчик кнопки удаления карточки
// (вешаем слушатель и передаем элемент карточки и ее id)
const handleSubmitPopupDelete = () => {
    const cardId = popupDeleteCardId.textContent;
    const cardElement = container.querySelector(`#id${cardId}`);
    handleDeleteCard(popupDelete, cardElement, cardId);
}
// функция добавления данных о себе с сервера в профиль на странице
const uploadProfileData = () => {
    searchUser()
    .then(data => {
        profileTitle.textContent = data.name;
        profileDescription.textContent = data.about;
        profileAvatarImage.src = data.avatar;
    })
    .catch(error => {
        console.log(`Ошибка: ${error}`);
    })
};


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
buttonEditProfile.addEventListener('click', () => handleOpenFormEditProfile({
    popup: popupEditProfile, 
    form: formEditProfile,
    titleContainer: profileTitle, 
    descripitionContainer: profileDescription, 
    customTitle: inputName, 
    customDescripition: inputJob
}));
// добавляем слушатель на submit, измененяя профиль
formEditProfile.addEventListener('submit', evt => handleSubmitFormEditProfile(evt, {
    popup: popupEditProfile, 
    titleContainer: profileTitle, 
    descripitionContainer: profileDescription, 
    customTitle: inputName, 
    customDescripition: inputJob,
    buttonText: buttonTextFormEditProfile
}));
// добавляем слушатель на кнопку изменения аватарки
buttonEditAvatar.addEventListener('click', () => handleOpenFormEditAvatar(popupEditAvatar, formAvatarEdit));
// добавляем слушатель на submit, измененяя аватарку
formAvatarEdit.addEventListener('submit', evt => handleSubmitFormEditAvatar(evt, {
    form: formAvatarEdit,
    popup: popupEditAvatar, 
    avatarContainer: profileAvatarImage,
    avatarLink: inputAvatarLink,
    buttonText: buttonTextFormAvatarEdit
}));
// добавляем слушатель на кнопку добавления карточки
buttonNewCard.addEventListener('click', () => handleOpenFormNewCard(popupNewCard, formNewCard));
// добавляем слушатель на submit, добавляя карточку
formNewCard.addEventListener('submit', evt => handleSubmitFormNewCard(evt, {
    form: formNewCard, 
    popup: popupNewCard, 
    cardName: inputPlaceName, 
    cardLink: inputLink, 
    cardList: cardsContainer,
    buttonText: buttonTextFormNewCard
}));
buttonConfirmDelete.addEventListener('click', handleSubmitPopupDelete);
// добавляем карточки с сервера на страницу
Promise.all([searchCards(), searchUser()])
    .then(results => {
        results[0].forEach(item => {
            const card = createCard({
                cardData: item, 
                openPopupDeleteFunction: handleOpenPopupDelete,
                likeCardFunction: handleLikeFunction,
                openCardFunction: handleEnlargeCardImage,
                isLikedFunction: handleIslikedByUser,
                userId: results[1]._id
            });
            cardsContainer.append(card);
        });
    })
    .catch(error => {
        console.log(`Ошибка: ${error}`);
    });
// вызываем валидацию всех форм на странице
enableValidation(validationConfig);
// добавляем данные о себе с сервера в профиль на странице
uploadProfileData();