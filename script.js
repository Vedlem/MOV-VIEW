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

// Fonction pour afficher les films dans le grid
function displayMovies(movies) {
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = ''; // Vider le contenu précédent s'il existe

    movies.forEach(item => {
        const movie = item.movie;
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';
        movieItem.innerHTML = `
            <h2>${movie.title}</h2>
            <p>${movie.year}</p>
        `;
        movieGrid.appendChild(movieItem);
    });
}

// Charger le config.json et récupérer les films
loadConfig().then(config => {
    getWatchedMovies(config.clientId).then(data => {
        if (data && data.length > 0) {
            displayMovies(data);
        } else {
            console.log('Aucun film trouvé.');
        }
    });
});
