// функция создания карточки
const cardTemplate = document.querySelector("#card-template").content.querySelector(".card");

function createCard(cardData, deleteCard, likeCard) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardHeading = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    cardHeading.textContent = cardData.name;
    cardImage.src = cardData.link;
    cardImage.alt = `Изображение места: ${cardData.name}`;

    deleteButton.addEventListener('click', () => deleteCard(cardElement));
    likeButton.addEventListener('click', () => likeCard(likeButton));
    
    return cardElement;
}

// функция удаления
function deleteElement(element) {
    element.remove();
}

// функция лайка
function likeElement(element) {
    element.classList.toggle('card__like-button_is-active');
}

// экспорт функций для добавления карточек
export { createCard, deleteElement, likeElement };