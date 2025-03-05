// ипорт промисов для работы функций карточек
import { deleteCard, likeCard, unlikeCard } from './api';
import { closePopup } from './modal';

// функция поиска шаблона карточки
const getTemplate = () => {
    return document
      .querySelector("#card-template")
      .content.querySelector(".card")
      .cloneNode(true);
};

// функция создания карточки
const createCard = ({cardData, openPopupDeleteFunction, likeCardFunction, openCardFunction, userId, isLikedFunction}) => {
    const cardElement = getTemplate();
    const cardHeading = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCount = cardElement.querySelector('.like-count');
    const cardId = cardData._id;

    cardElement.id = `id${cardId}`;
    cardHeading.textContent = cardData.name;
    cardImage.src = cardData.link;
    cardImage.alt = `Изображение места: ${cardData.name}`;
    likeCount.textContent = cardData.likes.length;

    if (cardData.owner._id === userId) {
        deleteButton.addEventListener('click', () => openPopupDeleteFunction(cardId));
    } else {
        deleteButton.remove();
    };

    isLikedFunction(cardData, likeButton, userId);
    likeButton.addEventListener('click', () => likeCardFunction(cardId, likeButton, likeCount));
    cardImage.addEventListener('click', () => openCardFunction(cardImage.src, cardHeading.textContent));

    return cardElement;
};

// обработчик удаления карточки
const handleDeleteCard = (popup, element, elementId) => {
    deleteCard(elementId)
    .then(() => {
        element.remove();
        closePopup(popup);
    })
    .catch(error => {
        console.log(`Ошибка: ${error}`);
    })
};

// функция проверяет лайкнул ли пользователь уже этот элемент на сервере, если да, то возвращает true
const islikedByUser = (elementData, userId) => {
    return elementData.likes.some((student) => {
        return student._id === userId;
    })
};

// обработчик отображения уже лайкнутого ранее элемента
const handleIslikedByUser = (elementData, elementLikeButton, userId) => {
    if (islikedByUser(elementData, userId)) {
        elementLikeButton.classList.add('card__like-button_is-active');
    }
};

// обработчик промиса добавления лайка и изменения счетчика лайков
const handleLikePromise = (elementId, elementLikeCount) => {
    likeCard(elementId)
        .then(data => {
            elementLikeCount.textContent = data.likes.length;
        })
        .catch(error => {
            console.log(`Ошибка: ${error}`);
        })
};

// обработчик промиса удаления лайка и изменения счетчика лайков
const handleUnlikePromise = (elementId, elementLikeCount) => {
    unlikeCard(elementId)
        .then(data => {
            elementLikeCount.textContent = data.likes.length;
        })
        .catch(error => {
            console.log(`Ошибка: ${error}`);
        })
};

// обработчик функции лайка
// (если элемент уже лайкнут пользователем, отправить запрос на unlike и убрать стилизацию кнопки
// если элемент не лайкнут пользователем, отправить запрос на likе и добавить стилизацию кнопки)
const handleLikeFunction = (elementId, elementLikeButton, elementLikeCount) => {
    if (elementLikeButton.classList.contains('card__like-button_is-active')) {
        handleUnlikePromise(elementId, elementLikeCount);
        elementLikeButton.classList.remove('card__like-button_is-active');
    } else {
        handleLikePromise(elementId, elementLikeCount);
        elementLikeButton.classList.add('card__like-button_is-active');
    }
};

// экспорт функций для добавления карточек
export { createCard, handleDeleteCard, handleIslikedByUser, handleLikeFunction };