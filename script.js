// Charger le fichier config.json dynamiquement
async function loadConfig() {
    const response = await fetch('config.json');
    if (!response.ok) {
        throw new Error('Erreur lors du chargement du fichier config.json');
    }
    return await response.json();
}

// Fonction pour récupérer la liste des films vus
async function getWatchedMovies(clientId) {
    const url = 'https://api.trakt.tv/users/vedlem2/lists/vus/items/movies?sort=rank,asc';
  
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': clientId
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des films :', error);
    }
}

function displayMovies(movies) {
    const movieGrid = document.getElementById('movieGrid');

    // Vider le contenu précédent en supprimant tous les enfants
    while (movieGrid.firstChild) {
        movieGrid.removeChild(movieGrid.firstChild);
    }

    movies.forEach(item => {
        const movie = item.movie;

        // Créer un élément div pour chaque film
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';

        // Créer un élément h2 pour le titre
        const title = document.createElement('h2');
        title.textContent = movie.title;
        movieItem.appendChild(title);

        // Créer un élément p pour l'année
        const year = document.createElement('p');
        year.textContent = movie.year;
        movieItem.appendChild(year);

        // Ajouter l'élément movieItem au grid
        movieGrid.appendChild(movieItem);
    });
}
