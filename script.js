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

// Fonction pour afficher les films récupérés
function displayMovies(movies, tmdbApiKey) {
    const movieGrid = document.getElementById('movieGrid');
    if (!movieGrid) {
        console.error('movieGrid element not found');
        return;
    }
    movieGrid.innerHTML = ''; // Nettoie le contenu actuel

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

// Fonction pour récupérer la liste des films
function getMoviesList(tmdbApiKey) {
    fetchTraktData('/users/vedlem2/lists/vus/items/movies')
        .then(data => {
            console.log('Films récupérés:', data);
            displayMovies(data, tmdbApiKey); // Appelle la fonction pour afficher les films
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des films:', error);
        });
}

// Test de la connexion à l'API Trakt
function testApiConnection() {
    fetchTraktData('/movies/trending')
        .then(data => {
            console.log('Test de connexion réussi:', data);
        })
        .catch(error => {
            console.error('Erreur de connexion:', error);
        });
}

// Exécuter le test de connexion lors du chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const tmdbApiKey = '65324c4619d7c9fbe7ebe9467e16d8eb'; // Remplace par ta clé TMDB réelle
    testApiConnection(); // Test de la connexion à Trakt
    getMoviesList(tmdbApiKey); // Récupère la liste des films
});
