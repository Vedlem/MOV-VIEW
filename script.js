fetch('config.json')
    .then(response => {
        if (!response.ok) throw new Error('Erreur de configuration');
        return response.json();
    })
    .then(config => {
        // Configuration des requêtes TMDB
        const options = {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${config.tmdbApiKey}`
            }
        };

        return fetch('movies.txt')
            .then(response => response.text())
            .then(text => {
                const movieTitles = text.split('\n').filter(line => line.trim());
                return Promise.all(movieTitles.map(title => 
                    searchMovie(title, options)
                ));
            })
            .then(movies => displayMovies(movies.filter(m => m)));
    })
    .catch(error => console.error(error));

function searchMovie(title, options) {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}`;
    return fetch(searchUrl, options)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                return fetchMovieDetails(data.results[0].id, options);
            }
            return null;
        })
        .catch(error => {
            console.error(`Erreur pour ${title}:`, error);
            return null;
        });
}

function fetchMovieDetails(movieId, options) {
    return fetch(`https://api.themoviedb.org/3/movie/${movieId}`, options)
        .then(response => response.json())
        .then(movie => ({
            title: movie.title,
            year: new Date(movie.release_date).getFullYear(),
            posterPath: movie.poster_path ? 
                `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 
                null
        }));
}

function displayMovies(movies) {
    const movieGrid = document.getElementById('movieGrid');
    if (!movieGrid) {
        console.error('movieGrid non trouvé');
        return;
    }

    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
            <img src="${movie.posterPath || 'placeholder.jpg'}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Année : ${movie.year}</p>
        `;
        movieGrid.appendChild(movieDiv);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('modeSwitch');
    const timelineButton = document.getElementById('timelineButton');
    const movieGrid = document.querySelector('.grid');

    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', () => {
            document.body.classList.toggle('night-mode');
        });
    }

    if (timelineButton && movieGrid) {
        timelineButton.addEventListener('click', () => {
            movieGrid.classList.toggle('grid');
            movieGrid.classList.toggle('timeline');
        });
    }
});