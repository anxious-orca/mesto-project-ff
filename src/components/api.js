// объект с данными для общения с сервером
const config = {
    baseUrl: 'https://nomoreparties.co/v1',
    cohortId: '/wff-cohort-33',
    headers: {
      authorization: '3f9599d2-cf13-400f-8219-d966b8c8a4cc',
      'Content-Type': 'application/json'
    }
};

// функция проверки ответа
const checkResponse = res => {
    return res.ok ? res.json() : Promise.reject(res.status);
};

// функция поиска карточек на сервере
const searchCards = () => {
    return fetch(`${config.baseUrl}${config.cohortId}/cards`, {
        headers: config.headers
    })
    .then(res => checkResponse(res));
};

// функция отправки своей карточки на сервер
const sendCard = (cardName, cardLink) => {
    return fetch(`${config.baseUrl}${config.cohortId}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
            name: cardName,
            link: cardLink
        })
    })
    .then(res => checkResponse(res));
};

// функция удаления своей карточки с сервера
const deleteCard = cardId => {
    return fetch(`${config.baseUrl}${config.cohortId}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
    .catch((error) => {
        console.log(error);
    });
};

// функция добавления лайка на карточку на сервере
const likeCard = cardId => {
    return fetch(`${config.baseUrl}${config.cohortId}/cards/likes/${cardId}`, {
        method: 'PUT',
        headers: config.headers
    })
    .then(res => checkResponse(res));
};

// функция удаления лайка с карточки на сервере
const unlikeCard = cardId => {
    return fetch(`${config.baseUrl}${config.cohortId}/cards/likes/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
    .then(res => checkResponse(res));
};

// функция поиска информации о себе на сервере
const searchUser = () => {
    return fetch(`${config.baseUrl}${config.cohortId}/users/me`, {
        headers: config.headers
    })
    .then(res => checkResponse(res));
};

// функция изменяющая информацию о себе на сервере
const updateUser = (newName, newAbout) => {
    return fetch(`${config.baseUrl}${config.cohortId}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
          name: newName,
          about: newAbout,
          avatar: "https://i.imgur.com/JSFINoW.jpeg"
        })
    })
    .then(res => checkResponse(res));
};

// функция изменяющая аватарку на сервере
const updateAvatar = newAvatar => {
    return fetch(`${config.baseUrl}${config.cohortId}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
          avatar: newAvatar
        })
    })
    .then(res => checkResponse(res));
};

// экспорт функций в index.js
export { searchCards, sendCard, searchUser, updateUser, updateAvatar, deleteCard, likeCard, unlikeCard };