const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const traktUrl = 'https://trakt.tv/users/vedlem2/lists/vus';

fetch(proxyUrl + traktUrl, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': config.clientId
    }
})
.then(response => response.json())
.then(data => {
    displayMovies(data);
})
.catch(error => console.error('Erreur lors de la récupération des données via le proxy :', error));
