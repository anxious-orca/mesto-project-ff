const container = document.querySelector('.content');
const cardTemplate = document.querySelector("#card-template").content.querySelector(".card");
const cardsContainer = container.querySelector('.places__list');

function createCard(cardData, handlers) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardHeading = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    cardHeading.textContent = cardData.name;
    cardImage.src = cardData.link;
    cardImage.alt = `Изображение места: ${cardData.name}`;

    deleteButton.addEventListener('click', () => handlers(cardElement));
    
    return cardElement;
}

function deleteElement(element) {
    element.remove();
}

initialCards.forEach(item => {
    const card = createCard(item, deleteElement);
    cardsContainer.append(card);
});