/**
 * Netflix Clone - Gestionnaire de recherche avec liste déroulante
 * Recherche en temps réel avec affichage dynamique
 */

class NetflixSearchManager {
    constructor() {
        this.searchInput = null;
        this.searchBtn = null;
        this.searchDropdown = null;
        this.searchTimeout = null;
        this.isSearching = false;
        this.currentResults = [];
        this.init();
    }
    
    init() {
        console.log('🔍 Initialisation du gestionnaire de recherche Netflix');
        
        // Récupérer les éléments DOM
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchDropdown = document.getElementById('searchDropdown');
        
        if (!this.searchInput || !this.searchDropdown) {
            console.warn('⚠️ Éléments de recherche non trouvés');
            return;
        }
        
        this.setupEventListeners();
        this.setupSearchToggle();
    }
    
    setupEventListeners() {
        // Recherche en temps réel avec debounce
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Annuler la recherche précédente
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            
            if (query.length === 0) {
                this.hideDropdown();
                return;
            }
            
            if (query.length >= 2) {
                this.searchTimeout = setTimeout(() => {
                    this.performSearch(query);
                }, 300);
            }
        });
        
        // Recherche sur Enter
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    if (this.searchTimeout) {
                        clearTimeout(this.searchTimeout);
                    }
                    this.performSearch(query);
                }
            }
        });
        
        // Clic sur le bouton de recherche
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => {
                const query = this.searchInput.value.trim();
                if (query.length >= 2) {
                    if (this.searchTimeout) {
                        clearTimeout(this.searchTimeout);
                    }
                    this.performSearch(query);
                } else {
                    this.toggleSearch();
                }
            });
        }
        
        // Fermer la dropdown en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideDropdown();
            }
        });
        
        // Garder le focus sur l'input
        this.searchInput.addEventListener('blur', (e) => {
            // Délai pour permettre le clic sur les résultats
            setTimeout(() => {
                if (!e.target.closest('.search-container')) {
                    this.hideDropdown();
                }
            }, 200);
        });
    }
    
    setupSearchToggle() {
        // Toggle de l'input de recherche
        const searchContainer = document.querySelector('.search-container');
        
        if (searchContainer) {
            this.searchBtn.addEventListener('click', () => {
                if (!this.searchInput.classList.contains('active')) {
                    this.showSearchInput();
                }
            });
        }
    }
    
    showSearchInput() {
        this.searchInput.classList.add('active');
        setTimeout(() => {
            this.searchInput.focus();
        }, 100);
    }
    
    hideSearchInput() {
        this.searchInput.classList.remove('active');
        this.hideDropdown();
    }
    
    toggleSearch() {
        if (this.searchInput.classList.contains('active')) {
            this.hideSearchInput();
        } else {
            this.showSearchInput();
        }
    }
    
    async performSearch(query) {
        if (this.isSearching) return;
        
        this.isSearching = true;
        console.log(`🔍 Recherche: "${query}"`);
        
        try {
            this.showSearchLoading();
            
            // Test avec une recherche simple d'abord
            console.log('🧪 Début de la recherche...');
            
            // Utiliser l'API existante pour chercher
            const results = await this.searchContent(query);
            console.log('📊 Résultats obtenus:', results);
            this.currentResults = results;
            
            if (results.length > 0) {
                console.log(`✅ ${results.length} résultats trouvés, affichage...`);
                this.displayResults(results, query);
            } else {
                console.log('⚠️ Aucun résultat, affichage du message');
                this.showNoResults(query);
            }
            
        } catch (error) {
            console.error('❌ Erreur de recherche:', error);
            this.showSearchError();
        } finally {
            this.isSearching = false;
        }
    }
    
    async searchContent(query) {
        try {
            console.log('🔍 Recherche API pour:', query);
            
            // D'abord essayer d'utiliser l'API existante si disponible
            if (typeof contentManager !== 'undefined' && contentManager.searchMultiContent) {
                console.log('📡 Utilisation de l\'API existante');
                const results = await contentManager.searchMultiContent(query);
                console.log('✅ Résultats API existante:', results.length);
                return results.slice(0, 8); // Limiter à 8 résultats
            }
            
            // Sinon, utiliser l'API TMDb directement
            const apiKey = 'e4b90327227c88daac14c0bd0c1f93cd';  // Vraie clé API TMDb
            const baseUrl = 'https://api.themoviedb.org/3';
            
            console.log('📡 Requête directe à TMDb API');
            const response = await fetch(
                `${baseUrl}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=fr&page=1`
            );
            
            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📊 Données brutes API:', data);
            
            if (!data.results || data.results.length === 0) {
                console.log('⚠️ Aucun résultat dans la réponse API');
                return [];
            }
            
            const processedResults = data.results
                .filter(item => item.media_type !== 'person') // Filtrer les personnes
                .slice(0, 8) // Limiter à 8 résultats
                .map(item => ({
                    id: item.id,
                    title: item.title || item.name,
                    type: item.media_type,
                    description: item.overview,
                    image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
                    backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : null,
                    rating: item.vote_average,
                    year: item.release_date ? new Date(item.release_date).getFullYear() : 
                          (item.first_air_date ? new Date(item.first_air_date).getFullYear() : null)
                }));
                
            console.log('✅ Résultats traités:', processedResults.length);
            return processedResults;
                
        } catch (error) {
            console.error('❌ Erreur API de recherche:', error);
            return [];
        }
    }
    
    displayResults(results, query) {
        let html = '';
        
        results.forEach(item => {
            const posterUrl = item.image || 'https://via.placeholder.com/40x60/333333/ffffff?text=?';
            const typeLabel = item.type === 'movie' ? 'Film' : 'Série';
            const typeClass = item.type === 'movie' ? 'movie' : 'tv';
            const rating = item.rating ? `★ ${item.rating.toFixed(1)}` : '';
            const year = item.year || '';
            
            html += `
                <div class="search-result-item" data-id="${item.id}" data-type="${item.type}" onclick="netflixSearch.selectResult(${item.id}, '${item.type}')">
                    <img src="${posterUrl}" alt="${item.title}" class="search-result-poster" onerror="this.src='https://via.placeholder.com/40x60/333333/ffffff?text=?'">
                    <div class="search-result-info">
                        <h4 class="search-result-title">${item.title}</h4>
                        <div class="search-result-meta">
                            <span class="search-result-type ${typeClass}">${typeLabel}</span>
                            ${year ? `<span class="search-result-year">${year}</span>` : ''}
                            ${rating ? `<span class="search-result-rating">${rating}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        this.searchDropdown.innerHTML = html;
        this.showDropdown();
    }
    
    showSearchLoading() {
        this.searchDropdown.innerHTML = `
            <div class="search-loading">
                🔍 Recherche en cours...
            </div>
        `;
        this.showDropdown();
    }
    
    showNoResults(query) {
        this.searchDropdown.innerHTML = `
            <div class="search-no-results">
                <div class="search-no-results-icon">😔</div>
                <div>Aucun résultat pour "${query}"</div>
                <small>Essayez avec d'autres mots-clés</small>
            </div>
        `;
        this.showDropdown();
    }
    
    showSearchError() {
        this.searchDropdown.innerHTML = `
            <div class="search-no-results">
                <div class="search-no-results-icon">⚠️</div>
                <div>Erreur de recherche</div>
                <small>Veuillez réessayer</small>
            </div>
        `;
        this.showDropdown();
    }
    
    showDropdown() {
        this.searchDropdown.classList.add('active');
    }
    
    hideDropdown() {
        this.searchDropdown.classList.remove('active');
    }
    
    selectResult(id, type) {
        console.log(`🎬 Sélection: ${type} ${id}`);
        
        // Fermer la dropdown
        this.hideDropdown();
        
        // Effacer la recherche
        this.searchInput.value = '';
        
        // Ouvrir le modal avec les détails du contenu
        this.openMovieModal(id, type);
    }

    async openMovieModal(id, type = 'movie') {
        try {
            console.log(`🎬 Ouverture du modal pour ${type} ${id}`);
            
            // Vérifier si le modal existe
            const modal = document.getElementById('modalOverlay') || 
                         document.getElementById('movieModal') ||
                         document.querySelector('.modal-overlay');
                         
            console.log('🔍 Modal trouvé:', modal);
                         
            if (!modal) {
                console.error('❌ Aucun modal trouvé sur cette page');
                // Rediriger vers le dashboard avec les paramètres
                window.location.href = `dashboard.html?id=${id}&type=${type}`;
                return;
            }

            // Afficher un indicateur de chargement
            this.showModalLoading(modal);
            
            // Récupérer les détails du contenu
            console.log('📡 Récupération des détails...');
            let details;
            if (typeof api !== 'undefined' && api.getMovieDetails) {
                details = await api.getMovieDetails(id, type);
            } else {
                details = await this.getContentDetails(id, type);
            }

            console.log('📊 Détails reçus:', details);

            if (!details) {
                console.error('❌ Impossible de récupérer les détails');
                return;
            }

            // Populer le modal
            this.populateModal(modal, details, type);
            
            // Afficher le modal
            modal.classList.add('active');
            console.log('✅ Modal affiché');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'ouverture du modal:', error);
            this.showModalError(modal, error);
        }
    }

    showModalLoading(modal) {
        const modalBody = modal.querySelector('.modal-body, #modalBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="modal-loading">
                    <div class="loading-spinner"></div>
                    <p>Chargement des détails...</p>
                </div>
            `;
        }
        modal.classList.add('active');
    }

    showModalError(modal, error) {
        const modalBody = modal.querySelector('.modal-body, #modalBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="modal-error">
                    <h2>Erreur de chargement</h2>
                    <p>Impossible de charger les détails du contenu.</p>
                    <button class="btn-primary" onclick="this.closest('.modal-overlay').classList.remove('active')">Fermer</button>
                </div>
            `;
        }
        modal.classList.add('active');
    }

    async getContentDetails(id, type = 'movie') {
        const apiKey = 'e4b90327227c88daac14c0bd0c1f93cd';
        const baseUrl = 'https://api.themoviedb.org/3';
        
        try {
            const response = await fetch(
                `${baseUrl}/${type}/${id}?api_key=${apiKey}&language=fr&append_to_response=videos,credits`
            );
            
            if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des détails:', error);
            return null;
        }
    }

    populateModal(modal, details, type) {
        console.log('🎨 Population du modal avec:', details);
        
        const title = details.title || details.name;
        const year = new Date(details.release_date || details.first_air_date).getFullYear();
        const backdropUrl = details.backdrop_path ? 
            `https://image.tmdb.org/t/p/w1280${details.backdrop_path}` :
            `https://image.tmdb.org/t/p/w1280${details.poster_path}`;

        // Chercher le conteneur principal du modal
        let modalBody = modal.querySelector('.modal-body, #modalBody');
        
        if (!modalBody) {
            console.warn('⚠️ Aucun conteneur modal-body trouvé, utilisation du modal-content');
            modalBody = modal.querySelector('.modal-content');
        }

        if (!modalBody) {
            console.error('❌ Aucun conteneur modal trouvé');
            return;
        }

        // Préserver le bouton de fermeture existant ou le créer
        let closeBtn = modal.querySelector('.modal-close, #modalClose');
        const existingCloseBtn = closeBtn ? closeBtn.outerHTML : 
            '<button class="modal-close" onclick="this.closest(\'.modal-overlay\').classList.remove(\'active\')">&times;</button>';

        // Créer le contenu HTML complet du modal
        const modalHTML = `
            ${existingCloseBtn}
            
            <div class="modal-hero" style="position: relative; height: 400px; background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('${backdropUrl}'); background-size: cover; background-position: center;">
                <div class="modal-hero-overlay" style="position: absolute; bottom: 0; left: 0; right: 0; padding: 40px; background: linear-gradient(transparent, rgba(0,0,0,0.8));">
                    <div class="modal-hero-content">
                        <h2 class="modal-title" style="color: white; font-size: 2.5rem; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">${title}</h2>
                        <div class="modal-actions" style="display: flex; gap: 15px; margin-bottom: 20px;">
                            <button class="btn-play" style="background: white; color: black; border: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; cursor: pointer;">
                                <span>▶</span> Lecture
                            </button>
                            <button class="btn-icon add-to-list-btn" title="Ajouter à ma liste" style="background: rgba(109, 109, 110, 0.7); color: white; border: none; width: 48px; height: 48px; border-radius: 50%; cursor: pointer;" data-id="${details.id}" data-type="${type}">
                                <span>+</span>
                            </button>
                            <button class="btn-icon" title="J'aime" style="background: rgba(109, 109, 110, 0.7); color: white; border: none; width: 48px; height: 48px; border-radius: 50%; cursor: pointer;">
                                <span>👍</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-info" style="padding: 30px; background: #181818;">
                <div class="modal-description" style="margin-bottom: 30px;">
                    <p style="color: white; font-size: 16px; line-height: 1.6; margin: 0;">${details.overview || 'Aucune description disponible.'}</p>
                </div>
                
                <div class="modal-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <div class="modal-detail-item">
                        <span class="modal-detail-label" style="color: #999; font-size: 14px; display: block; margin-bottom: 5px;">Genre :</span>
                        <span class="modal-detail-value" style="color: white; font-size: 16px;">${details.genres?.map(g => g.name).join(', ') || 'Non spécifié'}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="modal-detail-label" style="color: #999; font-size: 14px; display: block; margin-bottom: 5px;">Durée :</span>
                        <span class="modal-detail-value" style="color: white; font-size: 16px;">${this.getFormattedDuration(details)}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="modal-detail-label" style="color: #999; font-size: 14px; display: block; margin-bottom: 5px;">Année :</span>
                        <span class="modal-detail-value" style="color: white; font-size: 16px;">${year || 'N/A'}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="modal-detail-label" style="color: #999; font-size: 14px; display: block; margin-bottom: 5px;">Classification :</span>
                        <span class="modal-detail-value" style="color: white; font-size: 16px;">${details.adult ? '18+' : '13+'}</span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="modal-detail-label" style="color: #999; font-size: 14px; display: block; margin-bottom: 5px;">Note :</span>
                        <span class="modal-detail-value" style="color: white; font-size: 16px;">⭐ ${details.vote_average?.toFixed(1) || 'N/A'}/10</span>
                    </div>
                    <div class="modal-detail-item">
                        <span class="modal-detail-label" style="color: #999; font-size: 14px; display: block; margin-bottom: 5px;">Type :</span>
                        <span class="modal-detail-value" style="color: white; font-size: 16px;">${type === 'tv' ? 'Série TV' : 'Film'}</span>
                    </div>
                </div>
            </div>
        `;

        // Injecter le contenu dans le bon conteneur
        if (modalBody.classList.contains('modal-body') || modalBody.id === 'modalBody') {
            modalBody.innerHTML = modalHTML;
        } else {
            // Si c'est le modal-content, on remplace tout en gardant la structure
            modalBody.innerHTML = modalHTML;
        }

        // Ajouter les event listeners pour les nouveaux éléments
        this.addModalEventListeners(modal);

        // Stocker l'ID pour d'autres actions
        modal.dataset.movieId = details.id;
        modal.dataset.movieType = type;
        
        console.log('✅ Modal populé avec succès');
    }

    addModalEventListeners(modal) {
        // Event listener pour ajouter à la liste
        const addToListBtn = modal.querySelector('.add-to-list-btn');
        if (addToListBtn) {
            addToListBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const movieId = parseInt(e.target.dataset.id);
                const movieType = e.target.dataset.type;
                this.addToMyList(movieId, movieType);
            });
        }

        // Préserver les event listeners existants pour fermer le modal
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                // Restaurer la fonctionnalité pour les cartes normales après fermeture
                this.restoreOriginalModalHandlers();
            });
        }
    }

    addToMyList(movieId, movieType) {
        try {
            // Récupérer la liste existante
            let myList = JSON.parse(localStorage.getItem('netflixMyList') || '[]');
            
            // Vérifier si déjà dans la liste
            if (myList.some(item => item.id === movieId)) {
                this.showNotification('Déjà dans votre liste', 'info');
                return;
            }

            // Trouver l'item dans les résultats de recherche
            const item = this.currentResults.find(result => result.id === movieId);
            if (item) {
                item.addedAt = Date.now();
                myList.push(item);
                localStorage.setItem('netflixMyList', JSON.stringify(myList));
                this.showNotification('Ajouté à votre liste', 'success');
                
                // Changer le bouton visuellement
                const btn = document.querySelector('.add-to-list-btn');
                if (btn) {
                    btn.innerHTML = '<span>✓</span>';
                    btn.title = 'Dans votre liste';
                    btn.style.background = '#46d369';
                }
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout à la liste:', error);
            this.showNotification('Erreur lors de l\'ajout', 'error');
        }
    }

    restoreOriginalModalHandlers() {
        // Réinitialiser les event listeners pour les cartes après fermeture du modal de recherche
        setTimeout(() => {
            if (typeof addContentItemListeners === 'function') {
                const containers = document.querySelectorAll('.content-row, .content-grid');
                containers.forEach(container => {
                    addContentItemListeners(container);
                });
                console.log('🔄 Event listeners des cartes restaurés');
            }
        }, 100);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `search-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#46d369' : type === 'error' ? '#e50914' : '#333'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getFormattedDuration(details) {
        const runtime = details.runtime;
        const episodeRuntime = details.episode_run_time && details.episode_run_time[0];
        
        if (runtime) {
            const hours = Math.floor(runtime / 60);
            const minutes = runtime % 60;
            return hours > 0 ? `${hours}h ${minutes}min` : `${runtime} min`;
        } else if (episodeRuntime) {
            return `${episodeRuntime} min/épisode`;
        } else {
            return 'N/A';
        }
    }
    
    // Méthode publique pour nettoyer la recherche
    clearSearch() {
        this.searchInput.value = '';
        this.hideDropdown();
        this.currentResults = [];
    }
}

// Instance globale
let netflixSearch = null;

// Fonction globale pour ouvrir un modal depuis n'importe où
window.openMovieModalFromSearch = function(id, type = 'movie') {
    if (netflixSearch) {
        netflixSearch.openMovieModal(id, type);
    } else {
        console.warn('⚠️ Gestionnaire de recherche non initialisé');
        window.location.href = `dashboard.html?id=${id}&type=${type}`;
    }
};

// Initialisation automatique quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    // Attendre un peu pour s'assurer que tous les éléments sont présents
    setTimeout(() => {
        netflixSearch = new NetflixSearchManager();
        
        // Ajouter les event listeners pour fermer le modal
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close, #modalClose, #closeModal');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                });
            }
            
            // Fermer en cliquant à l'extérieur
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }, 100);
});

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NetflixSearchManager;
}

// Rendre disponible globalement
window.NetflixSearchManager = NetflixSearchManager;