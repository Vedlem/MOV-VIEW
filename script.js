fetch('config.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du chargement de la configuration');
        }
        return response.json();
    })
    .then(config => {
        const traktUrl = 'https://api.trakt.tv/users/vedlem2/lists/vus/items/movies';

        return fetch(traktUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': config.clientId,
                'Authorization': `Bearer ${config.accessToken}` // S'assurer que le token est bien présent
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
        })
        .catch(error => {
            console.error('Erreur lors de la requête Trakt:', error);
        });
    })
    .catch(error => {
        console.error('Erreur lors de la configuration:', error);
    });


function displayMovies(data, tmdbApiKey) {
    const movies = data;

    if (!Array.isArray(movies)) {
        console.error('Les données récupérées ne sont pas un tableau');
        return;
    }

    const movieGrid = document.getElementById('movieGrid');
    if (!movieGrid) {
        console.error('movieGrid element not found');
        return;
    }
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
            .catch(error => console.error(error));
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
            console.error(error);
            return '';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('modeSwitch');
    const timelineButton = document.getElementById('timelineButton');
    const movieGrid = document.querySelector('.grid');

    if (toggleSwitch) {
        // Toggle Day/Night Mode
        toggleSwitch.addEventListener('change', () => {
            document.body.classList.toggle('night-mode');
        });
    } else {
        console.error('modeSwitch element not found');
    }

    if (timelineButton) {
        // Toggle Timeline Mode
        timelineButton.addEventListener('click', () => {
            if (movieGrid) {
                if (movieGrid.classList.contains('grid')) {
                    movieGrid.classList.remove('grid');
                    movieGrid.classList.add('timeline');
                } else {
                    movieGrid.classList.remove('timeline');
                    movieGrid.classList.add('grid');
                }
            } else {
                console.error('movieGrid element not found');
            }
        });
    } else {
        console.error('timelineButton element not found');
    }
});