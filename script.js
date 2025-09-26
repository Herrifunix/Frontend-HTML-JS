/**
 * Netflix Clone - Script principal avec intégration API TMDb
 * Intégration complète de l'API The Movie Database
 */

// Variables globales pour le gestionnaire de contenu
let currentContentData = {
    trending: [],
    originals: [],
    topRated: []
};

// Configuration et initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 Netflix Clone - Chargement avec API TMDb');
    initializePage();
});

/**
 * Initialisation de la page selon le contexte
 */
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    console.log(`📄 Page actuelle: ${currentPage}`);
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initializeLoginPage();
            break;
        case 'subscription.html':
            initializeSubscriptionPage();
            break;
        case 'dashboard.html':
            initializeDashboard();
            break;
        default:
            console.log('Page non reconnue, chargement des fonctionnalités de base');
    }
    
    // Initialiser les fonctionnalités communes
    initializeCommonFeatures();
}

/**
 * Initialisation de la page de connexion
 */
function initializeLoginPage() {
    console.log('🔐 Initialisation page de connexion');
    
    // Masquer toutes les erreurs au démarrage
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(error => {
        error.style.display = 'none';
    });
    
    const loginForm = document.getElementById('loginForm');
    const guestLoginBtn = document.getElementById('guestLoginBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        setupValidation();
    }
    
    if (guestLoginBtn) {
        guestLoginBtn.addEventListener('click', handleGuestLogin);
    }
}

/**
 * Gestion de la connexion utilisateur
 */
function handleLogin(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMe = document.getElementById('rememberMe');
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    
    // Validation avec les fonctions spécifiques à la soumission
    if (!validateEmailOnSubmit() || !validatePasswordOnSubmit()) {
        return false;
    }
    
    // Animation du bouton
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Connexion...';
    submitBtn.disabled = true;
    
    // Simuler la connexion
    setTimeout(() => {
        // Stocker les données utilisateur
        const userData = {
            email: emailInput.value,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe.checked
        };
        
        localStorage.setItem('userSession', JSON.stringify(userData));
        
        // Vérifier si c'est un nouvel utilisateur (simulation simple)
        const isNewUser = !localStorage.getItem('hasSubscription');
        
        if (isNewUser) {
            window.location.href = 'subscription.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }, 1500);
}

/**
 * Gestion de la connexion invité
 */
function handleGuestLogin() {
    const guestBtn = document.getElementById('guestLoginBtn');
    if (!guestBtn) {
        console.error('Bouton invité non trouvé');
        return;
    }
    
    // Masquer toutes les erreurs avant la connexion invité
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(error => {
        error.style.display = 'none';
    });
    
    const originalText = guestBtn.textContent;
    guestBtn.textContent = 'Connexion...';
    guestBtn.disabled = true;
    
    // Marquer comme utilisateur invité
    localStorage.setItem('guestUser', 'true');
    localStorage.setItem('hasSubscription', 'true'); // Accès direct pour les invités
    
    // Redirect directly to dashboard (skip subscription for guests)
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Fonctions de validation (conservées de l'original)
function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const email = emailInput.value.trim();
    
    // Ne pas valider si le champ est vide (sauf lors de la soumission)
    if (!email) {
        hideError(emailError);
        return true; // Ne pas bloquer si vide (sera géré par la validation HTML)
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
    
    if (!emailRegex.test(email) && !phoneRegex.test(email)) {
        showError(emailError, 'Veuillez saisir une adresse e-mail ou un numéro de téléphone valide.');
        return false;
    }
    
    hideError(emailError);
    return true;
}

// Fonction de validation pour la soumission du formulaire
function validateEmailOnSubmit() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const email = emailInput.value.trim();
    
    if (!email) {
        showError(emailError, 'Veuillez saisir une adresse e-mail ou un numéro de téléphone valide.');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
    
    if (!emailRegex.test(email) && !phoneRegex.test(email)) {
        showError(emailError, 'Veuillez saisir une adresse e-mail ou un numéro de téléphone valide.');
        return false;
    }
    
    hideError(emailError);
    return true;
}

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const password = passwordInput.value;
    
    // Ne pas valider si le champ est vide (sauf lors de la soumission)
    if (!password) {
        hideError(passwordError);
        return true; // Ne pas bloquer si vide (sera géré par la validation HTML)
    }
    
    if (password.length < 4 || password.length > 60) {
        showError(passwordError, 'Votre mot de passe doit contenir entre 4 et 60 caractères.');
        return false;
    }
    
    hideError(passwordError);
    return true;
}

// Fonction de validation pour la soumission du formulaire
function validatePasswordOnSubmit() {
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const password = passwordInput.value;
    
    if (!password) {
        showError(passwordError, 'Votre mot de passe doit contenir entre 4 et 60 caractères.');
        return false;
    }
    
    if (password.length < 4 || password.length > 60) {
        showError(passwordError, 'Votre mot de passe doit contenir entre 4 et 60 caractères.');
        return false;
    }
    
    hideError(passwordError);
    return true;
}

function showError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.previousElementSibling.style.borderColor = '#e87c03';
    }
}

function hideError(errorElement) {
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.previousElementSibling.style.borderColor = '#333';
    }
}

function setupValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                validateEmail();
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', validatePassword);
        passwordInput.addEventListener('input', function() {
            if (this.value !== '') {
                validatePassword();
            }
        });
    }
}

/**
 * Initialisation de la page d'abonnement
 */
function initializeSubscriptionPage() {
    console.log('💳 Initialisation page abonnement');
    
    const planButtons = document.querySelectorAll('.plan-btn');
    const planCards = document.querySelectorAll('.plan-card');
    
    planButtons.forEach(button => {
        button.addEventListener('click', handlePlanSelection);
    });
    
    planCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            planCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');
        });
    });
}

function handlePlanSelection(e) {
    const planCard = e.target.closest('.plan-card');
    const planName = planCard.querySelector('h3').textContent;
    const planPrice = planCard.querySelector('.price').textContent;
    
    // Stocker les informations d'abonnement
    const subscriptionData = {
        plan: planName,
        price: planPrice,
        subscriptionDate: new Date().toISOString()
    };
    
    localStorage.setItem('subscription', JSON.stringify(subscriptionData));
    localStorage.setItem('hasSubscription', 'true');
    
    // Rediriger vers le dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

/**
 * Initialisation du dashboard avec API TMDb
 */
async function initializeDashboard() {
    console.log('🏠 Initialisation dashboard avec API TMDb');
    
    try {
        // Vérifier que l'API est chargée
        if (typeof contentManager === 'undefined') {
            console.error('❌ API TMDb non chargée');
            return;
        }
        
        // Afficher un indicateur de chargement
        showLoadingIndicator();
        
        // Charger le contenu héro
        await loadHeroContent();
        
        // Charger le contenu depuis l'API
        await loadDashboardContent();
        
        // Initialiser les fonctionnalités interactives
        initializeDashboardFeatures();
        
        // Masquer l'indicateur de chargement
        hideLoadingIndicator();
        
        console.log('✅ Dashboard initialisé avec succès');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation du dashboard:', error);
        showErrorMessage('Erreur de chargement. Veuillez rafraîchir la page.');
    }
}

/**
 * Charger le contenu héro dynamique avec trailer
 */
async function loadHeroContent() {
    console.log('🎭 Chargement du héro dynamique...');
    
    try {
        // Récupérer le contenu populaire pour le héro
        const heroContent = await contentManager.loadTrendingContent();
        
        if (heroContent && heroContent.length > 0) {
            // Prendre le premier élément comme héro et récupérer ses détails avec trailer
            const heroItem = heroContent[0];
            const detailedHero = await contentManager.getContentDetails(heroItem.id, heroItem.type);
            updateHeroSection(detailedHero);
            console.log(`✅ Héro mis à jour: ${detailedHero.title}`);
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement du héro:', error);
        // Garder le héro par défaut en cas d'erreur
    }
}

/**
 * Mettre à jour la section héro avec trailer
 */
function updateHeroSection(item) {
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroBackground = document.querySelector('.hero-background');
    const heroInfoBtn = document.querySelector('.btn-info');
    
    if (heroTitle) {
        heroTitle.textContent = item.title || 'Titre non disponible';
    }
    
    if (heroDescription) {
        heroDescription.textContent = item.description || 'Description non disponible.';
    }
    
    if (heroBackground) {
        // Si on a un trailer, on remplace l'image par une iframe YouTube
        if (item.trailer) {
            heroBackground.innerHTML = `
                <iframe 
                    src="${item.trailer}&controls=0&showinfo=0&rel=0&modestbranding=1&fs=0&disablekb=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;"
                ></iframe>
            `;
        } else {
            // Sinon, on garde l'image
            const backdropUrl = item.backdrop || item.image || 'https://wallpapercave.com/wp/wp4056410.jpg';
            heroBackground.innerHTML = `<img src="${backdropUrl}" alt="${item.title || 'Hero Content'}">`;
        }
    }
    
    // Mettre à jour le bouton info pour ouvrir la modal du bon contenu
    if (heroInfoBtn) {
        heroInfoBtn.onclick = function() {
            showContentModal(item.id, item.type || 'movie');
        };
    }
}

/**
 * Chargement du contenu via l'API TMDb
 */
async function loadDashboardContent() {
    console.log('📡 Chargement du contenu via API TMDb...');
    
    try {
        // Chargement en parallèle pour optimiser les performances
        const [trendingContent, originalsContent, topRatedContent, horrorContent, scifiContent, romanceContent] = await Promise.allSettled([
            contentManager.loadTrendingContent(),
            contentManager.loadNetflixOriginals(),
            contentManager.loadTopRatedContent(),
            contentManager.loadHorrorMovies(),
            contentManager.loadSciFiMovies(),
            contentManager.loadRomanceMovies()
        ]);
        
        // Traitement des résultats
        if (trendingContent.status === 'fulfilled') {
            currentContentData.trending = trendingContent.value;
            populateContentSection('trendingContent', currentContentData.trending);
            console.log(`✅ Contenu tendance chargé: ${trendingContent.value.length} éléments`);
        } else {
            console.error('❌ Erreur chargement contenu tendance:', trendingContent.reason);
        }
        
        if (originalsContent.status === 'fulfilled') {
            currentContentData.originals = originalsContent.value;
            populateContentSection('originalsContent', currentContentData.originals);
            console.log(`✅ Netflix Originals chargé: ${originalsContent.value.length} éléments`);
        } else {
            console.error('❌ Erreur chargement Netflix Originals:', originalsContent.reason);
        }
        
        if (topRatedContent.status === 'fulfilled') {
            currentContentData.topRated = topRatedContent.value;
            populateContentSection('topRatedContent', currentContentData.topRated);
            console.log(`✅ Contenu top rated chargé: ${topRatedContent.value.length} éléments`);
        } else {
            console.error('❌ Erreur chargement contenu top rated:', topRatedContent.reason);
        }
        
        if (horrorContent.status === 'fulfilled') {
            currentContentData.horror = horrorContent.value;
            populateContentSection('horrorContent', currentContentData.horror);
            console.log(`✅ Films d'horreur chargés: ${horrorContent.value.length} éléments`);
        } else {
            console.error('❌ Erreur chargement films d\'horreur:', horrorContent.reason);
        }
        
        if (scifiContent.status === 'fulfilled') {
            currentContentData.scifi = scifiContent.value;
            populateContentSection('scifiContent', currentContentData.scifi);
            console.log(`✅ Films de sci-fi chargés: ${scifiContent.value.length} éléments`);
        } else {
            console.error('❌ Erreur chargement films de sci-fi:', scifiContent.reason);
        }
        
        if (romanceContent.status === 'fulfilled') {
            currentContentData.romance = romanceContent.value;
            populateContentSection('romanceContent', currentContentData.romance);
            console.log(`✅ Films romantiques chargés: ${romanceContent.value.length} éléments`);
        } else {
            console.error('❌ Erreur chargement films romantiques:', romanceContent.reason);
        }
        
    } catch (error) {
        console.error('❌ Erreur générale lors du chargement:', error);
        throw error;
    }
}

/**
 * Peupler une section de contenu avec carousel
 */
function populateContentSection(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container || !data || data.length === 0) {
        console.warn(`⚠️ Container ${containerId} non trouvé ou données vides`);
        return;
    }
    
    // Créer le container avec boutons de navigation
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'content-row-container';
    
    // Bouton précédent
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn prev';
    prevBtn.innerHTML = '&#8249;';
    
    // Bouton suivant  
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn next';
    nextBtn.innerHTML = '&#8250;';
    
    // Container du contenu
    const contentRow = document.createElement('div');
    contentRow.className = 'content-row';
    
    // Générer le HTML pour les éléments de contenu
    const html = data.map(item => createContentItem(item)).join('');
    contentRow.innerHTML = html;
    
    // Assembler le carousel
    carouselContainer.appendChild(prevBtn);
    carouselContainer.appendChild(contentRow);
    carouselContainer.appendChild(nextBtn);
    
    // Remplacer le contenu du container
    container.innerHTML = '';
    container.appendChild(carouselContainer);
    
    // Ajouter les event listeners pour les nouveaux éléments
    addContentItemListeners(contentRow);
    
    // Ajouter les event listeners pour la navigation
    addCarouselNavigation(contentRow, prevBtn, nextBtn);
}

/**
 * Ajouter la navigation du carousel
 */
function addCarouselNavigation(contentRow, prevBtn, nextBtn) {
    const scrollAmount = 400; // Pixels à faire défiler
    
    prevBtn.addEventListener('click', () => {
        contentRow.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        contentRow.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Gestion de l'état des boutons
    function updateButtonStates() {
        const isAtStart = contentRow.scrollLeft <= 0;
        const isAtEnd = contentRow.scrollLeft >= contentRow.scrollWidth - contentRow.clientWidth - 10;
        
        prevBtn.style.opacity = isAtStart ? '0.5' : '1';
        nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
    }
    
    contentRow.addEventListener('scroll', updateButtonStates);
    updateButtonStates(); // Initial check
}

/**
 * Créer un élément de contenu HTML
 */
function createContentItem(item) {
    const imageUrl = item.image || 'https://via.placeholder.com/300x450?text=Image+non+disponible';
    const title = item.title || 'Titre non disponible';
    const year = item.year || 'N/A';
    const type = item.type || 'movie';
    
    return `
        <div class="content-item" data-id="${item.id}" data-type="${type}">
            <img src="${imageUrl}" alt="${title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x450?text=Image+Indisponible'">
            <div class="content-item-info">
                <div class="content-item-title">${title}</div>
                <div class="content-item-year">${year}</div>
            </div>
        </div>
    `;
}

/**
 * Ajouter les event listeners aux éléments de contenu
 */
function addContentItemListeners(container) {
    const items = container.querySelectorAll('.content-item');
    items.forEach(item => {
        item.addEventListener('click', async function() {
            const itemId = parseInt(this.dataset.id);
            const itemType = this.dataset.type;
            await showContentModal(itemId, itemType);
        });
    });
}

/**
 * Initialiser les fonctionnalités du dashboard
 */
function initializeDashboardFeatures() {
    console.log('🔧 Initialisation des fonctionnalités dashboard');
    
    // Fonctionnalités de recherche
    initializeSearch();
    
    // Menu profil
    initializeProfileMenu();
    
    // Boutons héro
    initializeHeroButtons();
    
    // Modal
    initializeModal();
}

/**
 * Initialiser la recherche avec API
 */
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    const searchResults = document.getElementById('searchResults');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    // Recherche en temps réel
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Débounce pour optimiser les requêtes API
        clearTimeout(searchTimeout);
        
        if (query.length === 0) {
            hideSearchResults();
            return;
        }
        
        if (query.length < 3) {
            return; // Attendre au moins 3 caractères
        }
        
        searchTimeout = setTimeout(async () => {
            await performSearch(query);
        }, 500);
    });
    
    // Recherche au clic sur le bouton
    if (searchBtn) {
        searchBtn.addEventListener('click', async function() {
            const query = searchInput.value.trim();
            if (query.length >= 3) {
                await performSearch(query);
            }
        });
    }
    
    // Masquer les résultats en cliquant ailleurs
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container') && !e.target.closest('.search-results')) {
            hideSearchResults();
        }
    });
}

/**
 * Effectuer une recherche via l'API
 */
async function performSearch(query) {
    console.log(`🔍 Recherche: "${query}"`);
    
    const searchResults = document.getElementById('searchResults');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    
    if (!searchResults || !searchResultsContainer) return;
    
    try {
        // Afficher l'indicateur de chargement
        searchResultsContainer.innerHTML = '<div class="search-loading">🔍 Recherche en cours...</div>';
        searchResults.style.display = 'block';
        
        // Effectuer la recherche via l'API
        const results = await contentManager.searchContent(query);
        
        if (results.length === 0) {
            searchResultsContainer.innerHTML = `
                <div class="no-results">
                    <p>Aucun résultat trouvé pour "${query}"</p>
                </div>
            `;
        } else {
            const html = results.slice(0, 20).map(item => createContentItem(item)).join('');
            searchResultsContainer.innerHTML = html;
            addContentItemListeners(searchResultsContainer);
            
            console.log(`✅ ${results.length} résultats trouvés pour "${query}"`);
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de la recherche:', error);
        searchResultsContainer.innerHTML = `
            <div class="search-error">
                <p>Erreur lors de la recherche. Veuillez réessayer.</p>
            </div>
        `;
    }
}

/**
 * Masquer les résultats de recherche
 */
function hideSearchResults() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

/**
 * Initialiser le menu profil
 */
function initializeProfileMenu() {
    const profileMenu = document.querySelector('.profile-menu');
    if (!profileMenu) return;
    
    profileMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
    });
    
    // Fermer le menu en cliquant ailleurs
    document.addEventListener('click', function() {
        profileMenu.classList.remove('active');
    });
}

/**
 * Initialiser les boutons de la section héro
 */
function initializeHeroButtons() {
    const playBtn = document.querySelector('.btn-play');
    const infoBtn = document.querySelector('.btn-info');
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            // Redirect to video player
            window.location.href = 'player.html';
        });
    }
    
    if (infoBtn) {
        infoBtn.addEventListener('click', function() {
            // Show info for Stranger Things (assuming it's the hero content)
            showContentModal(1399, 'tv'); // Stranger Things ID sur TMDb
        });
    }
}

/**
 * Initialiser la modal
 */
function initializeModal() {
    const modal = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    
    if (!modal || !closeBtn) return;
    
    // Fermer la modal
    closeBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideModal();
        }
    });
}

/**
 * Afficher la modal avec les détails du contenu
 */
async function showContentModal(id, type = 'movie') {
    console.log(`📋 Ouverture modal pour ${type} ID: ${id}`);
    
    const modal = document.getElementById('modalOverlay');
    const modalBody = document.querySelector('.modal-body');
    
    if (!modal || !modalBody) return;
    
    try {
        // Afficher la modal avec un indicateur de chargement
        modalBody.innerHTML = '<div class="modal-loading">Chargement des détails...</div>';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Récupérer les détails via l'API
        const details = await contentManager.getContentDetails(id, type);
        
        if (!details) {
            modalBody.innerHTML = '<div class="modal-error">Erreur lors du chargement des détails.</div>';
            return;
        }
        
        // Afficher le contenu
        modalBody.innerHTML = createModalContent(details);
        
        // Ajouter les event listeners pour les boutons de la modal
        addModalEventListeners(details);
        
        console.log(`✅ Modal ouverte pour: ${details.title}`);
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des détails:', error);
        modalBody.innerHTML = '<div class="modal-error">Erreur lors du chargement. Veuillez réessayer.</div>';
    }
}

/**
 * Créer le contenu HTML de la modal (sans trailer, seulement l'image)
 */
function createModalContent(item) {
    const backdropUrl = item.backdrop || item.image || 'https://via.placeholder.com/1280x720?text=Image+non+disponible';
    const title = item.title || 'Titre non disponible';
    const rating = item.rating || 'N/A';
    const year = item.year || 'N/A';
    const duration = item.duration || 'Durée inconnue';
    const description = item.description || 'Description non disponible.';
    const cast = Array.isArray(item.cast) ? item.cast.join(', ') : 'Distribution inconnue';
    const director = item.director || 'Réalisateur inconnu';
    const creators = Array.isArray(item.creators) ? item.creators.join(', ') : 'Créateurs inconnus';
    const genre = item.genres || item.genre || 'Genre non spécifié';
    
    return `
        <div class="modal-hero">
            <img src="${backdropUrl}" alt="${title}" onerror="this.src='https://via.placeholder.com/1280x720?text=Image+Indisponible'">
            <div class="modal-hero-content">
                <h2 class="modal-title">${title}</h2>
                <div class="modal-actions">
                    <button class="btn-play">▶ Lecture</button>
                    <button class="btn-add-list">+ Ma liste</button>
                </div>
                <div class="modal-meta">
                    <span class="rating">${rating}</span>
                    <span class="year">${year}</span>
                    <span class="duration">${duration}</span>
                </div>
            </div>
        </div>
        <div class="modal-info">
            <p class="modal-description">${description}</p>
            <div class="modal-details">
                <div class="modal-detail-item">
                    <span class="modal-detail-label">Distribution :</span>
                    <span class="modal-detail-value">${cast}</span>
                </div>
                <div class="modal-detail-item">
                    <span class="modal-detail-label">Réalisateur :</span>
                    <span class="modal-detail-value">${director}</span>
                </div>
                <div class="modal-detail-item">
                    <span class="modal-detail-label">Genre :</span>
                    <span class="modal-detail-value">${genre}</span>
                </div>
                <div class="modal-detail-item">
                    <span class="modal-detail-label">Créateurs :</span>
                    <span class="modal-detail-value">${creators}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Ajouter les event listeners aux boutons de la modal
 */
function addModalEventListeners(itemDetails) {
    const playBtn = document.querySelector('.modal-body .btn-play');
    const addListBtn = document.querySelector('.modal-body .btn-add-list');
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            window.location.href = 'player.html';
        });
    }
    
    if (addListBtn) {
        addListBtn.addEventListener('click', function() {
            this.textContent = '✓ Ajouté';
            this.style.background = '#46d369';
            
            // Sauvegarder dans le localStorage (simulation)
            saveToMyList(itemDetails);
            
            // Proposer de voir la liste
            setTimeout(() => {
                if (confirm('Contenu ajouté à votre liste ! Voulez-vous voir votre liste ?')) {
                    window.location.href = 'my-list.html';
                } else {
                    this.textContent = '+ Ma liste';
                    this.style.background = '';
                }
            }, 1000);
        });
    }
}

/**
 * Sauvegarder un élément dans "Ma liste"
 */
function saveToMyList(item) {
    try {
        let myList = JSON.parse(localStorage.getItem('myList') || '[]');
        
        // Éviter les doublons
        const exists = myList.some(listItem => listItem.id === item.id && listItem.type === item.type);
        if (!exists) {
            myList.push({
                ...item,
                addedDate: new Date().toISOString()
            });
            localStorage.setItem('myList', JSON.stringify(myList));
            console.log(`✅ Ajouté à Ma liste: ${item.title}`);
        }
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
    }
}

/**
 * Masquer la modal
 */
function hideModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Afficher l'indicateur de chargement
 */
function showLoadingIndicator() {
    const indicators = ['trendingContent', 'originalsContent', 'topRatedContent', 'horrorContent', 'scifiContent', 'romanceContent'];
    indicators.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = '<div class="loading-placeholder">🎬 Chargement du contenu...</div>';
        }
    });
}

/**
 * Masquer l'indicateur de chargement
 */
function hideLoadingIndicator() {
    // Les indicateurs seront remplacés par le contenu réel
    console.log('📱 Chargement terminé');
}

/**
 * Afficher un message d'erreur
 */
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'global-error-overlay';
    errorDiv.innerHTML = `
        <div class="error-content">
            <h3>❌ Erreur</h3>
            <p>${message}</p>
            <button onclick="location.reload()">Rafraîchir</button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 10000);
}

/**
 * Initialiser les fonctionnalités communes à toutes les pages
 */
function initializeCommonFeatures() {
    console.log('🔧 Initialisation des fonctionnalités communes');
    
    // Vérification du support des API modernes
    if (!window.fetch) {
        console.error('❌ Fetch API non supportée');
        showErrorMessage('Votre navigateur ne supporte pas toutes les fonctionnalités. Veuillez le mettre à jour.');
        return;
    }
    
    // Gestion des erreurs globales
    window.addEventListener('unhandledrejection', function(event) {
        console.error('❌ Promise rejetée:', event.reason);
        event.preventDefault();
    });
    
    // Gestion des erreurs JavaScript
    window.addEventListener('error', function(event) {
        console.error('❌ Erreur JavaScript:', event.error);
    });
}

/**
 * Utilitaires pour les autres pages
 */

// Fonction pour récupérer les données de "Ma liste"
function getMyListData() {
    try {
        return JSON.parse(localStorage.getItem('myList') || '[]');
    } catch (error) {
        console.error('❌ Erreur lecture Ma liste:', error);
        return [];
    }
}

// Fonction pour supprimer un élément de "Ma liste"
function removeFromMyList(itemId, itemType) {
    try {
        let myList = getMyListData();
        myList = myList.filter(item => !(item.id === itemId && item.type === itemType));
        localStorage.setItem('myList', JSON.stringify(myList));
        return true;
    } catch (error) {
        console.error('❌ Erreur suppression Ma liste:', error);
        return false;
    }
}

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializePage,
        loadDashboardContent,
        performSearch,
        showContentModal,
        getMyListData,
        removeFromMyList,
        saveToMyList
    };
}

// Rendre disponible globalement
window.NetflixApp = {
    initializePage,
    loadDashboardContent,
    performSearch,
    showContentModal,
    getMyListData,
    removeFromMyList,
    saveToMyList
};