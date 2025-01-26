const container = document.querySelector('.content');

const cardsContainer = container.querySelector('.places__list');
const editProfileButton = container.querySelector('.profile__edit-button');
const addCardButton = container.querySelector('.profile__add-button');

const cardTemplate = document.querySelector('#card-template').content;
const cardList = cardTemplate.querySelector('.places__item');

function addCard(cardTitle, cardImageSrc, functionDelete) {
    const cardElement = cardList.cloneNode(true);

    cardElement.querySelector('.card__title').textContent = cardTitle;
    cardElement.querySelector('.card__image').src = cardImageSrc;

    cardElement.querySelector('.card__delete-button').addEventListener('click', functionDelete);

    cardElement.querySelector('.card__like-button').addEventListener('click', evt => {
        const likeButton = evt.target;
        likeButton.classList.toggle('card__like-button_is-active');
    });

    cardsContainer.append(cardElement);
}

function deleteCard(evt) {
    const deleteButton = evt.target;
    deleteButton.parentElement.remove();
}

initialCards.forEach(item => {
    addCard(item.name, item.link, deleteCard);
});