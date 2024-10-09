fetch('config.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du chargement de la configuration');
        }
        return response.json();
    })
    .then(config => {
        // Utiliser la configuration pour accéder à l'API de Trakt
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const traktUrl = 'https://api.trakt.tv/users/vedlem2/lists/vus/items/movies'; // Modifié pour accéder aux éléments de la liste

        fetch(proxyUrl + traktUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': config.clientId
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données de Trakt');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Pour voir la structure des données
            displayMovies(data);
        })
        .catch(error => console.error('Erreur lors de la récupération des données via le proxy :', error));
    })
    .catch(error => console.error('Erreur lors du chargement de la configuration :', error));

function displayMovies(data) {
    // On suppose maintenant que les films se trouvent directement dans 'data'
    const movies = data;

    if (!Array.isArray(movies)) {
        console.error('Les données récupérées ne sont pas un tableau.');
        return;
    }

    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = '';

    movies.forEach(item => {
        const movie = item.movie;
        if (!movie) return;

        // Récupère les images du film depuis les données renvoyées par Trakt
        const posterImage = movie.images && movie.images.poster ? movie.images.poster.thumb : '';

        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        movieDiv.innerHTML = `
            <img src="${posterImage}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Année : ${movie.year}</p>
        `;

        movieGrid.appendChild(movieDiv);
    });
}
