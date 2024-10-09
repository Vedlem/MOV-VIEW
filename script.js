const TRAKT_API_URL = 'https://api.trakt.tv';
const CLIENT_ID = 'd613533740e45a75ee0b1b84086a2634243093870bff80bd75418fab5c411929';

// Fonction générique pour récupérer les données de l'API Trakt
async function fetchTraktData(endpoint) {
    try {
        const response = await fetch(`${TRAKT_API_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': CLIENT_ID,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur détaillée:', {
            message: error.message,
            stack: error.stack,
            response: error.response
        });
        throw error;
    }
}

// Fonction pour afficher les films récupérés dans une grille donnée
function displayMovies(movies, tmdbApiKey, gridId) {
    const movieGrid = document.getElementById(gridId);
    if (!movieGrid) {
        console.error(`${gridId} element not found`);
        return;
    }
    movieGrid.innerHTML = ''; // Nettoie le contenu actuel

    movies.forEach(item => {
        const movie = item.movie || item;  // "movie" pour vedlem list, ou item pour trending
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
            .catch(error => console.error('Erreur lors du chargement de l\'image:', error));
    });
}

// Fonction pour récupérer l'image du film depuis TMDB
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
            console.error('Erreur TMDB:', error);
            return '';
        });
}

// Fonction pour récupérer la liste des films Vedlem Movies
function getVedlemMoviesList(tmdbApiKey) {
    fetchTraktData('/users/vedlem2/lists/vus/items/movies')
        .then(data => {
            console.log('Vedlem Movies récupérés:', data);
            displayMovies(data, tmdbApiKey, 'vedlemMoviesGrid'); // Affiche dans la grille Vedlem Movies
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des films Vedlem:', error);
        });
}

// Fonction pour récupérer les 10 films trending
function getTrendingMoviesList(tmdbApiKey) {
    fetchTraktData('/movies/trending')
        .then(data => {
            console.log('Films Trending récupérés:', data);
            const trendingMovies = data.slice(0, 10); // Limiter à 10 films
            displayMovies(trendingMovies, tmdbApiKey, 'trendingMoviesGrid'); // Affiche dans la grille Trending Movies
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des films trending:', error);
        });
}

// Exécuter les deux listes lors du chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const tmdbApiKey = 'TA_TMBD_API_KEY'; // Remplace par ta clé TMDB réelle
    getVedlemMoviesList(tmdbApiKey);  // Récupère et affiche les Vedlem Movies
    getTrendingMoviesList(tmdbApiKey);  // Récupère et affiche les Trending Movies
});
