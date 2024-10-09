const TRAKT_API_URL = 'https://api.trakt.tv';
const CLIENT_ID = 'd613533740e45a75ee0b1b84086a2634243093870bff80bd75418fab5c411929';

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

// Fonction pour récupérer la liste des films
function getMoviesList() {
    fetchTraktData('/users/vedlem2/lists/vus/items/movies')
        .then(data => {
            console.log('Films récupérés:', data);
            // Traitement des données ici
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des films:', error);
        });
}

// Test de la connexion à l'API
function testApiConnection() {
    fetchTraktData('/movies/trending')
        .then(data => {
            console.log('Test de connexion réussi:', data);
        })
        .catch(error => {
            console.error('Erreur de connexion:', error);
        });
}

// Exécuter le test de connexion
testApiConnection();