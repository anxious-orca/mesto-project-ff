// функция поиска шаблона карточки
const getTemplate = () => {
    return document
      .querySelector("#card-template")
      .content.querySelector(".card")
      .cloneNode(true);
};

// функция создания карточки
const createCard = ({cardData, openPopupDeleteFunction, likeCardFunction, openCardFunction, userId}) => {
    const cardElement = getTemplate();
    const cardHeading = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCount = cardElement.querySelector('.like-count');
    const cardId = cardData._id;

    cardHeading.textContent = cardData.name;
    cardImage.src = cardData.link;
    cardImage.alt = `Изображение места: ${cardData.name}`;
    likeCount.textContent = cardData.likes.length;

    if (cardData.owner._id === userId) {
        deleteButton.addEventListener('click', () => openPopupDeleteFunction(cardElement, cardId));
    } else {
        deleteButton.remove();
    };
    
    if (cardData.likes.some(student => {return student._id === userId})) {
        likeButton.classList.add('card__like-button_is-active');
    }

    likeButton.addEventListener('click', () => likeCardFunction(cardId, likeButton, likeCount));
    cardImage.addEventListener('click', () => openCardFunction(cardImage.src, cardHeading.textContent));

    return cardElement;
};

// функция удаления
const deleteElement = element => {
    element.remove();
}

// функция обновления лайка и счетчика лайков
const updateLike = (elementData, elementLikeButton, elementLikeCount) => {
    elementLikeButton.classList.toggle('card__like-button_is-active');
    elementLikeCount.textContent = elementData.likes.length;
}

// проверяет есть ли у кнопки класс активного лайка
const checkStatusLike = elementLikeButton => {
    return elementLikeButton.classList.contains('card__like-button_is-active');
};

// экспорт функций для добавления карточек
export { createCard, deleteElement, updateLike, checkStatusLike };