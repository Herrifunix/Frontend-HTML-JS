/**
 * The Movie Database (TMDb) API Integration
 * Intégration complète de l'API TMDb pour le clone Netflix
 */

// Configuration API TMDb
const TMDB_CONFIG = {
    API_KEY: 'e4b90327227c88daac14c0bd0c1f93cd',
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    BEARER_TOKEN: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNGI5MDMyNzIyN2M4OGRhYWMxNGMwYmQwYzFmOTNjZCIsIm5iZiI6MTc1ODY0ODMyMS43NDg5OTk4LCJzdWIiOiI2OGQyZDgwMTJhNWU3YzBhNDVjZWNmZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.aylEitwtAH0w4XRk8izJNNkF_bet8sxiC9iI-zSdHbU'
};

// Tailles d'images disponibles
const IMAGE_SIZES = {
    poster: {
        small: 'w185',
        medium: 'w342',
        large: 'w500',
        original: 'original'
    },
    backdrop: {
        small: 'w300',
        medium: 'w780',
        large: 'w1280',
        original: 'original'
    }
};

/**
 * Classe principale pour interagir avec l'API TMDb
 */
class TMDbAPI {
    constructor() {
        this.baseURL = TMDB_CONFIG.BASE_URL;
        this.apiKey = TMDB_CONFIG.API_KEY;
        this.bearerToken = TMDB_CONFIG.BEARER_TOKEN;
        this.imageBaseURL = TMDB_CONFIG.IMAGE_BASE_URL;
    }

    /**
     * Méthode générique pour faire des requêtes à l'API
     * @param {string} endpoint - L'endpoint de l'API
     * @param {Object} params - Paramètres de la requête
     * @returns {Promise} Données de la réponse
     */
    async makeRequest(endpoint, params = {}) {
        try {
            // Ajouter la clé API aux paramètres
            const urlParams = new URLSearchParams({
                api_key: this.apiKey,
                language: 'fr-FR', // Interface en français
                ...params
            });

            const url = `${this.baseURL}${endpoint}?${urlParams}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.bearerToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la requête API:', error);
            throw error;
        }
    }

    /**
     * Obtenir l'URL complète d'une image
     * @param {string} path - Chemin de l'image
     * @param {string} size - Taille de l'image
     * @param {string} type - Type d'image (poster ou backdrop)
     * @returns {string} URL complète de l'image
     */
    getImageURL(path, size = 'medium', type = 'poster') {
        if (!path) return null;
        const imageSize = IMAGE_SIZES[type][size] || IMAGE_SIZES[type].medium;
        return `${this.imageBaseURL}/${imageSize}${path}`;
    }

    /**
     * Récupérer les films tendances
     * @param {string} timeWindow - 'day' ou 'week'
     * @returns {Promise<Array>} Liste des films tendances
     */
    async getTrendingMovies(timeWindow = 'week') {
        const data = await this.makeRequest(`/trending/movie/${timeWindow}`);
        return this.formatMovies(data.results);
    }

    /**
     * Récupérer les séries tendances
     * @param {string} timeWindow - 'day' ou 'week'
     * @returns {Promise<Array>} Liste des séries tendances
     */
    async getTrendingTVShows(timeWindow = 'week') {
        const data = await this.makeRequest(`/trending/tv/${timeWindow}`);
        return this.formatTVShows(data.results);
    }

    /**
     * Récupérer les films populaires
     * @param {number} page - Numéro de page
     * @returns {Promise<Array>} Liste des films populaires
     */
    async getPopularMovies(page = 1) {
        const data = await this.makeRequest('/movie/popular', { page });
        return this.formatMovies(data.results);
    }

    /**
     * Récupérer les séries populaires
     * @param {number} page - Numéro de page
     * @returns {Promise<Array>} Liste des séries populaires
     */
    async getPopularTVShows(page = 1) {
        const data = await this.makeRequest('/tv/popular', { page });
        return this.formatTVShows(data.results);
    }

    /**
     * Récupérer les films les mieux notés
     * @param {number} page - Numéro de page
     * @returns {Promise<Array>} Liste des films les mieux notés
     */
    async getTopRatedMovies(page = 1) {
        const data = await this.makeRequest('/movie/top_rated', { page });
        return this.formatMovies(data.results);
    }

    /**
     * Récupérer les séries les mieux notées
     * @param {number} page - Numéro de page
     * @returns {Promise<Array>} Liste des séries les mieux notées
     */
    async getTopRatedTVShows(page = 1) {
        const data = await this.makeRequest('/tv/top_rated', { page });
        return this.formatTVShows(data.results);
    }

    /**
     * Récupérer les films Netflix Originals (simulé avec des films de Netflix)
     * @returns {Promise<Array>} Liste des films Netflix Originals
     */
    async getNetflixOriginals() {
        const data = await this.makeRequest('/discover/movie', {
            with_companies: '213', // Netflix company ID
            sort_by: 'popularity.desc'
        });
        return this.formatMovies(data.results);
    }

    /**
     * Rechercher des films et séries
     * @param {string} query - Terme de recherche
     * @param {number} page - Numéro de page
     * @returns {Promise<Array>} Résultats de recherche
     */
    async searchMulti(query, page = 1) {
        if (!query.trim()) return [];
        
        const data = await this.makeRequest('/search/multi', { query, page });
        
        return data.results.map(item => {
            if (item.media_type === 'movie') {
                return this.formatMovie(item);
            } else if (item.media_type === 'tv') {
                return this.formatTVShow(item);
            }
            return null;
        }).filter(Boolean);
    }

    /**
     * Récupérer les détails d'un film
     * @param {number} movieId - ID du film
     * @returns {Promise<Object>} Détails du film
     */
    async getMovieDetails(movieId) {
        const [movie, credits, videos] = await Promise.all([
            this.makeRequest(`/movie/${movieId}`),
            this.makeRequest(`/movie/${movieId}/credits`),
            this.makeRequest(`/movie/${movieId}/videos`)
        ]);

        return this.formatMovieDetails(movie, credits, videos);
    }

    /**
     * Récupérer les détails d'une série TV
     * @param {number} tvId - ID de la série
     * @returns {Promise<Object>} Détails de la série
     */
    async getTVShowDetails(tvId) {
        const [tv, credits, videos] = await Promise.all([
            this.makeRequest(`/tv/${tvId}`),
            this.makeRequest(`/tv/${tvId}/credits`),
            this.makeRequest(`/tv/${tvId}/videos`)
        ]);

        return this.formatTVShowDetails(tv, credits, videos);
    }

    /**
     * Formatter les données d'un film pour le projet
     * @param {Object} movie - Données brutes du film
     * @returns {Object} Données formatées
     */
    formatMovie(movie) {
        return {
            id: movie.id,
            title: movie.title,
            type: 'movie',
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
            rating: movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : 'N/A',
            description: movie.overview || 'Aucune description disponible.',
            image: this.getImageURL(movie.poster_path, 'medium', 'poster'),
            backdrop: this.getImageURL(movie.backdrop_path, 'large', 'backdrop'),
            genre: movie.genre_ids?.join(', ') || 'Non spécifié',
            duration: '120 min', // Sera récupéré avec les détails
            popularity: movie.popularity,
            voteAverage: movie.vote_average
        };
    }

    /**
     * Formatter les données d'une série TV pour le projet
     * @param {Object} tv - Données brutes de la série
     * @returns {Object} Données formatées
     */
    formatTVShow(tv) {
        return {
            id: tv.id,
            title: tv.name,
            type: 'tv',
            year: tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : 'N/A',
            rating: tv.vote_average ? `${tv.vote_average.toFixed(1)}/10` : 'N/A',
            description: tv.overview || 'Aucune description disponible.',
            image: this.getImageURL(tv.poster_path, 'medium', 'poster'),
            backdrop: this.getImageURL(tv.backdrop_path, 'large', 'backdrop'),
            genre: tv.genre_ids?.join(', ') || 'Non spécifié',
            duration: `${tv.number_of_seasons || 1} saison${tv.number_of_seasons > 1 ? 's' : ''}`,
            popularity: tv.popularity,
            voteAverage: tv.vote_average
        };
    }

    /**
     * Formatter les listes de films
     * @param {Array} movies - Liste des films
     * @returns {Array} Films formatés
     */
    formatMovies(movies) {
        return movies.map(movie => this.formatMovie(movie));
    }

    /**
     * Formatter les listes de séries TV
     * @param {Array} tvShows - Liste des séries
     * @returns {Array} Séries formatées
     */
    formatTVShows(tvShows) {
        return tvShows.map(tv => this.formatTVShow(tv));
    }

    /**
     * Formatter les détails complets d'un film
     * @param {Object} movie - Données du film
     * @param {Object} credits - Crédits du film
     * @param {Object} videos - Videos du film
     * @returns {Object} Détails formatés
     */
    formatMovieDetails(movie, credits, videos) {
        const director = credits.crew?.find(person => person.job === 'Director');
        const cast = credits.cast?.slice(0, 5).map(actor => actor.name) || [];
        const trailer = videos.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );

        return {
            ...this.formatMovie(movie),
            duration: movie.runtime ? `${movie.runtime} min` : 'Durée inconnue',
            genres: movie.genres?.map(g => g.name).join(', ') || 'Non spécifié',
            director: director?.name || 'Réalisateur inconnu',
            cast: cast,
            creators: [director?.name || 'Inconnu'], // Pour compatibilité avec le code existant
            releaseDate: movie.release_date,
            budget: movie.budget,
            revenue: movie.revenue,
            trailerKey: trailer?.key,
            homepage: movie.homepage
        };
    }

    /**
     * Formatter les détails complets d'une série TV
     * @param {Object} tv - Données de la série
     * @param {Object} credits - Crédits de la série
     * @param {Object} videos - Videos de la série
     * @returns {Object} Détails formatés
     */
    formatTVShowDetails(tv, credits, videos) {
        const creators = tv.created_by?.map(creator => creator.name) || [];
        const cast = credits.cast?.slice(0, 5).map(actor => actor.name) || [];
        const trailer = videos.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );

        return {
            ...this.formatTVShow(tv),
            genres: tv.genres?.map(g => g.name).join(', ') || 'Non spécifié',
            creators: creators.length > 0 ? creators : ['Créateur inconnu'],
            cast: cast,
            director: creators[0] || 'Créateur inconnu', // Pour compatibilité
            numberOfSeasons: tv.number_of_seasons,
            numberOfEpisodes: tv.number_of_episodes,
            episodeRunTime: tv.episode_run_time?.[0] ? `${tv.episode_run_time[0]} min` : 'Durée inconnue',
            firstAirDate: tv.first_air_date,
            lastAirDate: tv.last_air_date,
            status: tv.status,
            networks: tv.networks?.map(network => network.name).join(', '),
            trailerKey: trailer?.key,
            homepage: tv.homepage
        };
    }
}

/**
 * Classe pour gérer le cache et optimiser les performances
 */
class TMDbCache {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
    }

    /**
     * Obtenir une valeur du cache
     * @param {string} key - Clé du cache
     * @returns {any|null} Valeur ou null si expirée/inexistante
     */
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        const now = Date.now();
        if (now > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    /**
     * Stocker une valeur dans le cache
     * @param {string} key - Clé du cache
     * @param {any} data - Données à stocker
     */
    set(key, data) {
        this.cache.set(key, {
            data,
            expiry: Date.now() + this.cacheTimeout
        });
    }

    /**
     * Vider le cache
     */
    clear() {
        this.cache.clear();
    }
}

// Instance globale de l'API et du cache
const tmdbAPI = new TMDbAPI();
const tmdbCache = new TMDbCache();

/**
 * Gestionnaire de contenu avec API
 */
class NetflixContentManager {
    constructor() {
        this.api = tmdbAPI;
        this.cache = tmdbCache;
    }

    /**
     * Charger le contenu tendance avec cache
     * @returns {Promise<Array>} Contenu tendance
     */
    async loadTrendingContent() {
        const cacheKey = 'trending_content';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const [movies, tvShows] = await Promise.all([
                this.api.getTrendingMovies(),
                this.api.getTrendingTVShows()
            ]);

            // Mélanger les films et séries
            const mixed = [...movies.slice(0, 10), ...tvShows.slice(0, 10)]
                .sort(() => Math.random() - 0.5)
                .slice(0, 15);

            this.cache.set(cacheKey, mixed);
            return mixed;
        } catch (error) {
            console.error('Erreur lors du chargement du contenu tendance:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les Netflix Originals avec cache
     * @returns {Promise<Array>} Netflix Originals
     */
    async loadNetflixOriginals() {
        const cacheKey = 'netflix_originals';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const originals = await this.api.getNetflixOriginals();
            this.cache.set(cacheKey, originals.slice(0, 15));
            return originals.slice(0, 15);
        } catch (error) {
            console.error('Erreur lors du chargement des Netflix Originals:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les films les mieux notés avec cache
     * @returns {Promise<Array>} Films les mieux notés
     */
    async loadTopRatedContent() {
        const cacheKey = 'top_rated_content';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const [movies, tvShows] = await Promise.all([
                this.api.getTopRatedMovies(),
                this.api.getTopRatedTVShows()
            ]);

            const mixed = [...movies.slice(0, 12), ...tvShows.slice(0, 13)]
                .sort((a, b) => b.voteAverage - a.voteAverage)
                .slice(0, 25);

            this.cache.set(cacheKey, mixed);
            return mixed;
        } catch (error) {
            console.error('Erreur lors du chargement du contenu top rated:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les films d'horreur
     */
    async loadHorrorMovies() {
        const cacheKey = 'horror_movies';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.api.makeRequest('/discover/movie', {
                with_genres: 27, // Horror genre ID
                sort_by: 'popularity.desc',
                page: 1
            });

            const horrorMovies = response.results.slice(0, 20).map(movie => 
                this.api.formatMovie(movie)
            );

            this.cache.set(cacheKey, horrorMovies);
            return horrorMovies;
        } catch (error) {
            console.error('Erreur lors du chargement des films d\'horreur:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les films de science-fiction
     */
    async loadSciFiMovies() {
        const cacheKey = 'scifi_movies';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.api.makeRequest('/discover/movie', {
                with_genres: 878, // Sci-Fi genre ID
                sort_by: 'popularity.desc',
                page: 1
            });

            const scifiMovies = response.results.slice(0, 20).map(movie => 
                this.api.formatMovie(movie)
            );

            this.cache.set(cacheKey, scifiMovies);
            return scifiMovies;
        } catch (error) {
            console.error('Erreur lors du chargement des films de sci-fi:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les films romantiques
     */
    async loadRomanceMovies() {
        const cacheKey = 'romance_movies';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.api.makeRequest('/discover/movie', {
                with_genres: 10749, // Romance genre ID
                sort_by: 'popularity.desc',
                page: 1
            });

            const romanceMovies = response.results.slice(0, 20).map(movie => 
                this.api.formatMovie(movie)
            );

            this.cache.set(cacheKey, romanceMovies);
            return romanceMovies;
        } catch (error) {
            console.error('Erreur lors du chargement des films romantiques:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les séries populaires
     */
    async loadPopularTVShows() {
        const cacheKey = 'popular_tv_shows';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const tvShows = await this.api.getPopularTVShows();
            this.cache.set(cacheKey, tvShows.slice(0, 20));
            return tvShows.slice(0, 20);
        } catch (error) {
            console.error('Erreur lors du chargement des séries populaires:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les films populaires
     */
    async loadPopularMovies() {
        const cacheKey = 'popular_movies';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const movies = await this.api.getPopularMovies();
            this.cache.set(cacheKey, movies.slice(0, 20));
            return movies.slice(0, 20);
        } catch (error) {
            console.error('Erreur lors du chargement des films populaires:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les films Netflix originaux
     */
    async loadNetflixOriginalsMovies() {
        const cacheKey = 'netflix_original_movies';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.api.makeRequest('/discover/movie', {
                with_companies: 213, // Netflix company ID
                sort_by: 'release_date.desc',
                page: 1
            });

            const netflixMovies = response.results.slice(0, 20).map(movie => 
                this.api.formatMovie(movie)
            );

            this.cache.set(cacheKey, netflixMovies);
            return netflixMovies;
        } catch (error) {
            console.error('Erreur lors du chargement des films Netflix originaux:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les séries Netflix originales
     */
    async loadNetflixOriginalsTV() {
        const cacheKey = 'netflix_original_tv';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.api.makeRequest('/discover/tv', {
                with_companies: 213, // Netflix company ID
                sort_by: 'first_air_date.desc',
                page: 1
            });

            const netflixTVShows = response.results.slice(0, 20).map(tv => 
                this.api.formatTVShow(tv)
            );

            this.cache.set(cacheKey, netflixTVShows);
            return netflixTVShows;
        } catch (error) {
            console.error('Erreur lors du chargement des séries Netflix originales:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les films les mieux notés
     */
    async loadTopRatedMovies() {
        const cacheKey = 'top_rated_movies';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const movies = await this.api.getTopRatedMovies();
            this.cache.set(cacheKey, movies.slice(0, 20));
            return movies.slice(0, 20);
        } catch (error) {
            console.error('Erreur lors du chargement des films les mieux notés:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les séries les mieux notées
     */
    async loadTopRatedTVShows() {
        const cacheKey = 'top_rated_tv_shows';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const tvShows = await this.api.getTopRatedTVShows();
            this.cache.set(cacheKey, tvShows.slice(0, 20));
            return tvShows.slice(0, 20);
        } catch (error) {
            console.error('Erreur lors du chargement des séries les mieux notées:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les films d'action
     */
    async loadActionMovies() {
        const cacheKey = 'action_movies';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.api.makeRequest('/discover/movie', {
                with_genres: 28, // Action genre ID
                sort_by: 'popularity.desc',
                page: 1
            });

            const actionMovies = response.results.slice(0, 20).map(movie => 
                this.api.formatMovie(movie)
            );

            this.cache.set(cacheKey, actionMovies);
            return actionMovies;
        } catch (error) {
            console.error('Erreur lors du chargement des films d\'action:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les films de comédie
     */
    async loadComedyMovies() {
        const cacheKey = 'comedy_movies';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.api.makeRequest('/discover/movie', {
                with_genres: 35, // Comedy genre ID
                sort_by: 'popularity.desc',
                page: 1
            });

            const comedyMovies = response.results.slice(0, 20).map(movie => 
                this.api.formatMovie(movie)
            );

            this.cache.set(cacheKey, comedyMovies);
            return comedyMovies;
        } catch (error) {
            console.error('Erreur lors du chargement des films de comédie:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les films dramatiques
     */
    async loadDramaMovies() {
        const cacheKey = 'drama_movies';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.api.makeRequest('/discover/movie', {
                with_genres: 18, // Drama genre ID
                sort_by: 'vote_average.desc',
                'vote_count.gte': 100,
                page: 1
            });

            const dramaMovies = response.results.slice(0, 20).map(movie => 
                this.api.formatMovie(movie)
            );

            this.cache.set(cacheKey, dramaMovies);
            return dramaMovies;
        } catch (error) {
            console.error('Erreur lors du chargement des films dramatiques:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les séries dramatiques
     */
    async loadDramaTVShows() {
        const cacheKey = 'drama_tv_shows';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.api.makeRequest('/discover/tv', {
                with_genres: 18, // Drama genre ID
                sort_by: 'vote_average.desc',
                page: 1
            });

            const dramaTVShows = response.results.slice(0, 20).map(tv => 
                this.api.formatTVShow(tv)
            );

            this.cache.set(cacheKey, dramaTVShows);
            return dramaTVShows;
        } catch (error) {
            console.error('Erreur lors du chargement des séries dramatiques:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les séries comiques
     */
    async loadComedyTVShows() {
        const cacheKey = 'comedy_tv_shows';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.api.makeRequest('/discover/tv', {
                with_genres: 35, // Comedy genre ID
                sort_by: 'popularity.desc',
                page: 1
            });

            const comedyTVShows = response.results.slice(0, 20).map(tv => 
                this.api.formatTVShow(tv)
            );

            this.cache.set(cacheKey, comedyTVShows);
            return comedyTVShows;
        } catch (error) {
            console.error('Erreur lors du chargement des séries comiques:', error);
            return this.getFallbackContent();
        }
    }

    // Méthodes pour la page Nouveautés

    /**
     * Charger les nouveautés de cette semaine
     */
    async loadNewThisWeek() {
        const cacheKey = 'new_this_week';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const [movies, tvShows] = await Promise.all([
                this.api.getTrendingMovies('week'),
                this.api.getTrendingTVShows('week')
            ]);

            // Mélanger les films et séries récents
            const mixed = [...movies.slice(0, 10), ...tvShows.slice(0, 10)]
                .sort(() => Math.random() - 0.5)
                .slice(0, 15);

            this.cache.set(cacheKey, mixed);
            return mixed;
        } catch (error) {
            console.error('Erreur lors du chargement des nouveautés de la semaine:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les films à venir
     */
    async loadUpcomingMovies() {
        const cacheKey = 'upcoming_movies';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.api.makeRequest('/movie/upcoming', {
                page: 1
            });

            const upcomingMovies = response.results.slice(0, 20).map(movie => 
                this.api.formatMovie(movie)
            );

            this.cache.set(cacheKey, upcomingMovies);
            return upcomingMovies;
        } catch (error) {
            console.error('Erreur lors du chargement des films à venir:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les nouvelles séries
     */
    async loadNewTVShows() {
        const cacheKey = 'new_tv_shows';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await this.api.makeRequest('/tv/airing_today', {
                page: 1
            });

            const newTVShows = response.results.slice(0, 20).map(tv => 
                this.api.formatTVShow(tv)
            );

            this.cache.set(cacheKey, newTVShows);
            return newTVShows;
        } catch (error) {
            console.error('Erreur lors du chargement des nouvelles séries:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les contenus récemment ajoutés
     */
    async loadRecentlyAdded() {
        const cacheKey = 'recently_added';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const [nowPlayingMovies, onTheAirTV] = await Promise.all([
                this.api.makeRequest('/movie/now_playing'),
                this.api.makeRequest('/tv/on_the_air')
            ]);

            const recentMovies = nowPlayingMovies.results.slice(0, 10).map(movie => 
                this.api.formatMovie(movie)
            );

            const recentTV = onTheAirTV.results.slice(0, 10).map(tv => 
                this.api.formatTVShow(tv)
            );

            const mixed = [...recentMovies, ...recentTV]
                .sort(() => Math.random() - 0.5)
                .slice(0, 20);

            this.cache.set(cacheKey, mixed);
            return mixed;
        } catch (error) {
            console.error('Erreur lors du chargement des contenus récemment ajoutés:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les tendances du jour
     */
    async loadTrendingToday() {
        const cacheKey = 'trending_today';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const [movies, tvShows] = await Promise.all([
                this.api.getTrendingMovies('day'),
                this.api.getTrendingTVShows('day')
            ]);

            // Mélanger les films et séries du jour
            const mixed = [...movies.slice(0, 12), ...tvShows.slice(0, 8)]
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, 20);

            this.cache.set(cacheKey, mixed);
            return mixed;
        } catch (error) {
            console.error('Erreur lors du chargement des tendances du jour:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Charger les nouveaux Netflix Originals
     */
    async loadNewNetflixOriginals() {
        const cacheKey = 'new_netflix_originals';
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const [movies, tvShows] = await Promise.all([
                this.api.makeRequest('/discover/movie', {
                    with_companies: 213, // Netflix company ID
                    sort_by: 'release_date.desc',
                    'primary_release_date.gte': '2024-01-01',
                    page: 1
                }),
                this.api.makeRequest('/discover/tv', {
                    with_companies: 213, // Netflix company ID
                    sort_by: 'first_air_date.desc',
                    'first_air_date.gte': '2024-01-01',
                    page: 1
                })
            ]);

            const recentNetflixMovies = movies.results.slice(0, 10).map(movie => 
                this.api.formatMovie(movie)
            );

            const recentNetflixTV = tvShows.results.slice(0, 10).map(tv => 
                this.api.formatTVShow(tv)
            );

            const mixed = [...recentNetflixMovies, ...recentNetflixTV]
                .sort((a, b) => new Date(b.year) - new Date(a.year))
                .slice(0, 20);

            this.cache.set(cacheKey, mixed);
            return mixed;
        } catch (error) {
            console.error('Erreur lors du chargement des nouveaux Netflix Originals:', error);
            return this.getFallbackContent();
        }
    }

    /**
     * Rechercher du contenu
     * @param {string} query - Terme de recherche
     * @returns {Promise<Array>} Résultats de recherche
     */
    async searchContent(query) {
        if (!query.trim()) return [];

        const cacheKey = `search_${query.toLowerCase()}`;
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const results = await this.api.searchMulti(query);
            this.cache.set(cacheKey, results);
            return results;
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            return [];
        }
    }

    /**
     * Obtenir les détails complets d'un contenu avec trailers
     * @param {number} id - ID du contenu
     * @param {string} type - Type (movie ou tv)
     * @returns {Promise<Object>} Détails du contenu
     */
    async getContentDetails(id, type = 'movie') {
        const cacheKey = `details_${type}_${id}`;
        let cached = this.cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            // Récupérer les détails et les vidéos en parallèle
            const [details, videos] = await Promise.all([
                type === 'movie' ? this.api.getMovieDetails(id) : this.api.getTVShowDetails(id),
                this.api.makeRequest(`/${type}/${id}/videos`)
            ]);

            // Ajouter les trailers aux détails
            const trailers = videos.results.filter(video => 
                video.type === 'Trailer' && video.site === 'YouTube'
            );
            
            if (trailers.length > 0) {
                details.trailer = `https://www.youtube.com/embed/${trailers[0].key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailers[0].key}`;
                details.trailerKey = trailers[0].key;
            }

            this.cache.set(cacheKey, details);
            return details;
        } catch (error) {
            console.error('Erreur lors du chargement des détails:', error);
            return null;
        }
    }

    /**
     * Contenu de fallback en cas d'erreur API
     * @returns {Array} Contenu de base
     */
    getFallbackContent() {
        return [
            {
                id: 1,
                title: 'Film d\'exemple',
                type: 'movie',
                year: '2023',
                rating: '8.5/10',
                description: 'Contenu de secours en cas d\'erreur API.',
                image: 'https://via.placeholder.com/300x450?text=Film',
                backdrop: 'https://via.placeholder.com/1280x720?text=Backdrop',
                genre: 'Action',
                duration: '120 min'
            }
        ];
    }
}

// Instance globale du gestionnaire de contenu
const contentManager = new NetflixContentManager();

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TMDbAPI,
        TMDbCache,
        NetflixContentManager,
        tmdbAPI,
        tmdbCache,
        contentManager
    };
}

// Rendre disponible globalement pour les autres scripts
window.TMDbAPI = TMDbAPI;
window.tmdbAPI = tmdbAPI;
window.contentManager = contentManager;