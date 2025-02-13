// функция поиска шаблона карточки
const getTemplate = () => {
    return document
      .querySelector("#card-template")
      .content.querySelector(".card")
      .cloneNode(true);
  };
// функция создания карточки
const createCard = ({cardData, deleteCardFunction, likeCardFunction, openCardFunction}) => {
    const cardElement = getTemplate();
    const cardHeading = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    cardHeading.textContent = cardData.name;
    cardImage.src = cardData.link;
    cardImage.alt = `Изображение места: ${cardData.name}`;

    deleteButton.addEventListener('click', () => deleteCardFunction(cardElement));
    likeButton.addEventListener('click', () => likeCardFunction(likeButton));
    cardImage.addEventListener('click', () => openCardFunction(cardImage.src, cardHeading.textContent));

    
    return cardElement;
}

// функция удаления
const deleteElement = element => {
    element.remove();
}

// функция лайка
const likeElement = element => {
    element.classList.toggle('card__like-button_is-active');
}

// экспорт функций для добавления карточек
export { createCard, deleteElement, likeElement };