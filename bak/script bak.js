fetch('config.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du chargement de la configuration');
        }
        return response.json();
    })
    .then(config => {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const traktUrl = 'https://api.trakt.tv/users/vedlem2/lists/vus/items/movies';

        return fetch(proxyUrl + traktUrl, {
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
            console.log(data);
            displayMovies(data, config.tmdbApiKey);
        });
    })
    .catch(error => console.error('Erreur :', error));

function displayMovies(data, tmdbApiKey) {
    const movies = data;

    if (!Array.isArray(movies)) {
        console.error('Les données récupérées ne sont pas un tableau.');
        return;
    }

    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = '';

    movies.forEach(item => {
        const movie = item.movie;
        if (!movie || !movie.ids || !movie.ids.tmdb) return;

        fetchMovieImage(movie.ids.tmdb, tmdbApiKey)
            .then(posterImage => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('movie');

                movieDiv.innerHTML = `
                    <img src="${posterImage}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                    <p>Année : ${movie.year}</p>
                `;

                movieGrid.appendChild(movieDiv);
            })
            .catch(error => console.error('Erreur lors de la récupération de limage TMDB :', error));
    });
}

function fetchMovieImage(tmdbId, tmdbApiKey) {
    const tmdbBaseUrl = 'https://api.themoviedb.org/3/movie/';
    return fetch(`${tmdbBaseUrl}${tmdbId}?api_key=${tmdbApiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données de TMDB');
            }
            return response.json();
        })
        .then(data => {
            return data.poster_path ? `https://image.tmdb.org/t/p/w200${data.poster_path}` : '';
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de limage TMDB :', error);
            return '';
        });
}