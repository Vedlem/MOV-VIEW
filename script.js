fetch('config.json')
    .then(response => response.json())
    .then(config => {
        fetchMovies(config);
    })
    .catch(error => console.error('Erreur lors du chargement de la configuration:', error));

async function fetchMovies(config) {
    try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const traktUrl = config.listUrl;

        const response = await fetch(proxyUrl + traktUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': config.clientId
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        const data = await response.json();
        displayMovies(data);
    } catch (error) {
        console.error('Erreur :', error);
    }
}

function displayMovies(movies) {
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = '';

    movies.forEach(item => {
        const movie = item.movie;
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        movieDiv.innerHTML = `
            <img src="${movie.images.poster.thumb}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Année : ${movie.year}</p>
        `;

        movieGrid.appendChild(movieDiv);
    });
}