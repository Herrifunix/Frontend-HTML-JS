// Additional JavaScript for Netflix clone pages

// Profile page functionality
function initializeProfilePage() {
    // Profile selection
    const profileItems = document.querySelectorAll('.profile-item');
    profileItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('add-profile')) {
                openModal('addProfileModal');
            } else {
                const profileName = item.querySelector('h3').textContent;
                localStorage.setItem('currentProfile', profileName);
                window.location.href = 'dashboard.html';
            }
        });
    });

    // Add profile modal
    const addProfileForm = document.getElementById('addProfileForm');
    if (addProfileForm) {
        addProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const profileName = document.getElementById('profileName').value;
            if (profileName.trim()) {
                // In a real app, this would save to backend
                alert(`Profile "${profileName}" created successfully!`);
                closeModal('addProfileModal');
                // Redirect to dashboard with new profile
                localStorage.setItem('currentProfile', profileName);
                window.location.href = 'dashboard.html';
            }
        });
    }

    // Character count for profile name
    const profileNameInput = document.getElementById('profileName');
    if (profileNameInput) {
        profileNameInput.addEventListener('input', (e) => {
            const count = e.target.value.length;
            const countElement = document.querySelector('.character-count');
            if (countElement) {
                countElement.textContent = `${count}/15`;
            }
        });
    }
}

// My List page functionality with API integration
function initializeMyListPage() {
    // Load data from localStorage
    loadMyListFromStorage();
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Filter content
            const filter = btn.dataset.filter;
            filterMyListContent(filter);
        });
    });

    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            sortMyListContent(sortBy);
        });
    }

    // Remove from list functionality
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const listItem = btn.closest('.list-item');
            const itemId = parseInt(listItem.dataset.id);
            const itemType = listItem.dataset.type;
            
            if (confirm('Supprimer cet élément de votre liste ?')) {
                removeFromMyListStorage(itemId, itemType);
                listItem.remove();
                
                // Check if list is empty
                const remainingItems = document.querySelectorAll('.list-item');
                if (remainingItems.length === 0) {
                    showEmptyState();
                }
            }
        });
    });
}

/**
 * Load My List data from localStorage and display
 */
function loadMyListFromStorage() {
    try {
        const myListData = JSON.parse(localStorage.getItem('myList') || '[]');
        
        if (myListData.length === 0) {
            showEmptyState();
            return;
        }
        
        displayMyListContent(myListData);
        
        // Update membership date if exists
        const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
        if (userSession.loginTime) {
            const loginDate = new Date(userSession.loginTime);
            const membershipDate = document.querySelector('.membership-date');
            if (membershipDate) {
                membershipDate.textContent = `Membre depuis ${loginDate.toLocaleDateString('fr-FR')}`;
            }
        }
        
    } catch (error) {
        console.error('Erreur lors du chargement de Ma liste:', error);
        showEmptyState();
    }
}

/**
 * Display My List content
 */
function displayMyListContent(items) {
    const myListContent = document.querySelector('.my-list-content');
    if (!myListContent) return;
    
    const html = items.map(item => createMyListItem(item)).join('');
    myListContent.innerHTML = html;
    
    // Add event listeners to new elements
    addMyListEventListeners();
}

/**
 * Create My List item HTML
 */
function createMyListItem(item) {
    const imageUrl = item.image || 'https://via.placeholder.com/150x225?text=Image+non+disponible';
    const title = item.title || 'Titre non disponible';
    const year = item.year || 'N/A';
    const rating = item.rating || 'N/A';
    const description = (item.description || 'Description non disponible.').substring(0, 200) + '...';
    const type = item.type || 'movie';
    
    return `
        <div class="list-item" data-id="${item.id}" data-type="${type}">
            <div class="list-item-poster">
                <img src="${imageUrl}" alt="${title}" loading="lazy" onerror="this.src='https://via.placeholder.com/150x225?text=Image+Indisponible'">
            </div>
            <div class="list-item-info">
                <h3>${title}</h3>
                <div class="list-item-meta">
                    <span class="item-year">${year}</span>
                    <span class="item-rating">${rating}</span>
                    <span class="item-type">${type === 'movie' ? 'Film' : 'Série'}</span>
                </div>
                <p class="description">${description}</p>
                <div class="list-item-actions">
                    <button class="btn-play" onclick="window.location.href='player.html'">
                        <i class="fas fa-play"></i> Lecture
                    </button>
                    <button class="btn-remove">
                        <i class="fas fa-times"></i> Supprimer
                    </button>
                    <button class="btn-info" onclick="showContentDetails(${item.id}, '${type}')">
                        <i class="fas fa-info-circle"></i> Infos
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Add event listeners to My List items
 */
function addMyListEventListeners() {
    // Remove buttons
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const listItem = btn.closest('.list-item');
            const itemId = parseInt(listItem.dataset.id);
            const itemType = listItem.dataset.type;
            const title = listItem.querySelector('h3').textContent;
            
            if (confirm(`Supprimer "${title}" de votre liste ?`)) {
                removeFromMyListStorage(itemId, itemType);
                listItem.remove();
                
                // Check if list is empty
                const remainingItems = document.querySelectorAll('.list-item');
                if (remainingItems.length === 0) {
                    showEmptyState();
                }
            }
        });
    });
}

/**
 * Filter My List content
 */
function filterMyListContent(filter) {
    const listItems = document.querySelectorAll('.list-item');
    
    listItems.forEach(item => {
        const itemType = item.dataset.type;
        
        if (filter === 'all') {
            item.style.display = 'flex';
        } else if (filter === 'movies' && itemType === 'movie') {
            item.style.display = 'flex';
        } else if (filter === 'tv' && itemType === 'tv') {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Sort My List content
 */
function sortMyListContent(sortBy) {
    const myListContent = document.querySelector('.my-list-content');
    const listItems = Array.from(document.querySelectorAll('.list-item'));
    
    listItems.sort((a, b) => {
        const aTitle = a.querySelector('h3').textContent;
        const bTitle = b.querySelector('h3').textContent;
        const aYear = parseInt(a.querySelector('.item-year').textContent) || 0;
        const bYear = parseInt(b.querySelector('.item-year').textContent) || 0;
        
        switch(sortBy) {
            case 'title':
                return aTitle.localeCompare(bTitle);
            case 'year':
                return bYear - aYear; // Plus récent en premier
            case 'added':
            default:
                return 0; // Garde l'ordre d'ajout
        }
    });
    
    // Re-append sorted items
    listItems.forEach(item => myListContent.appendChild(item));
}

/**
 * Remove item from localStorage
 */
function removeFromMyListStorage(itemId, itemType) {
    try {
        let myList = JSON.parse(localStorage.getItem('myList') || '[]');
        myList = myList.filter(item => !(item.id === itemId && item.type === itemType));
        localStorage.setItem('myList', JSON.stringify(myList));
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
}

/**
 * Show content details (call API if available)
 */
async function showContentDetails(id, type) {
    if (typeof window.NetflixApp !== 'undefined' && window.NetflixApp.showContentModal) {
        await window.NetflixApp.showContentModal(id, type);
    } else {
        alert('Détails non disponibles actuellement.');
    }
}

function showEmptyState() {
    const myListContent = document.querySelector('.my-list-content');
    if (myListContent) {
        myListContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-list" style="font-size: 48px;"></i>
                </div>
                <h2>Votre liste est vide</h2>
                <p>Ajoutez des films et séries à votre liste pour les regarder plus tard.</p>
                <button class="btn-primary" onclick="window.location.href='dashboard.html'">
                    <i class="fas fa-search"></i> Parcourir le contenu
                </button>
            </div>
        `;
    }
}

// Video Player functionality
function initializeVideoPlayer() {
    // Play/Pause functionality
    const playPauseBtn = document.getElementById('playPauseBtn');
    const bigPlayBtn = document.querySelector('.big-play-btn');
    const playOverlay = document.querySelector('.play-overlay');
    let isPlaying = false;

    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playOverlay.style.display = 'none';
            document.querySelector('.video-loading').style.display = 'block';
            
            // Simulate loading
            setTimeout(() => {
                document.querySelector('.video-loading').style.display = 'none';
            }, 2000);
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playOverlay.style.display = 'flex';
        }
    }

    if (bigPlayBtn) {
        bigPlayBtn.addEventListener('click', togglePlay);
    }
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlay);
    }

    // Skip controls
    const skipBackBtn = document.getElementById('skipBackBtn');
    const skipForwardBtn = document.getElementById('skipForwardBtn');
    
    if (skipBackBtn) {
        skipBackBtn.addEventListener('click', () => {
            console.log('Skip back 10 seconds');
            // In a real app, this would control video playback
        });
    }
    
    if (skipForwardBtn) {
        skipForwardBtn.addEventListener('click', () => {
            console.log('Skip forward 10 seconds');
            // In a real app, this would control video playback
        });
    }

    // Volume controls
    const muteBtn = document.getElementById('muteBtn');
    const volumeTrack = document.querySelector('.volume-track');
    const volumeFilled = document.querySelector('.volume-filled');
    let isMuted = false;
    let currentVolume = 100;

    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            if (isMuted) {
                muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                volumeFilled.style.width = '0%';
            } else {
                muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                volumeFilled.style.width = currentVolume + '%';
            }
        });
    }

    if (volumeTrack) {
        volumeTrack.addEventListener('click', (e) => {
            const rect = volumeTrack.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            currentVolume = Math.max(0, Math.min(100, percentage));
            volumeFilled.style.width = currentVolume + '%';
            
            if (currentVolume === 0) {
                muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                isMuted = true;
            } else {
                muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                isMuted = false;
            }
        });
    }

    // Progress bar
    const progressTrack = document.querySelector('.progress-track');
    const progressFilled = document.querySelector('.progress-filled');
    const progressThumb = document.querySelector('.progress-thumb');
    const currentTimeSpan = document.getElementById('currentTime');
    const totalTimeSpan = document.getElementById('totalTime');
    
    if (progressTrack) {
        progressTrack.addEventListener('click', (e) => {
            const rect = progressTrack.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            progressFilled.style.width = percentage + '%';
            progressThumb.style.left = percentage + '%';
            
            // Update time (mock calculation)
            const totalMinutes = 45; // Example total time
            const currentMinutes = Math.floor((percentage / 100) * totalMinutes);
            const currentSeconds = Math.floor(((percentage / 100) * totalMinutes * 60) % 60);
            
            if (currentTimeSpan) {
                currentTimeSpan.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
            }
        });
    }

    // Fullscreen
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            } else {
                document.exitFullscreen();
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            }
        });
    }

    // Quality menu
    const qualityBtn = document.getElementById('qualityBtn');
    const qualityMenu = document.querySelector('.quality-menu');
    
    if (qualityBtn && qualityMenu) {
        qualityBtn.addEventListener('click', () => {
            qualityMenu.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!qualityBtn.contains(e.target) && !qualityMenu.contains(e.target)) {
                qualityMenu.classList.remove('open');
            }
        });

        // Quality selection
        const qualityOptions = document.querySelectorAll('input[name="quality"]');
        qualityOptions.forEach(option => {
            option.addEventListener('change', () => {
                console.log(`Quality changed to: ${option.value}`);
                qualityMenu.classList.remove('open');
            });
        });
    }

    // Episode sidebar
    const episodeBtn = document.getElementById('episodeBtn');
    const episodeSidebar = document.querySelector('.episode-sidebar');
    const sidebarClose = document.querySelector('.sidebar-close');
    
    if (episodeBtn && episodeSidebar) {
        episodeBtn.addEventListener('click', () => {
            episodeSidebar.classList.toggle('open');
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            episodeSidebar.classList.remove('open');
        });
    }

    // Episode selection
    const episodeItems = document.querySelectorAll('.episode-item');
    episodeItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all episodes
            episodeItems.forEach(ep => ep.classList.remove('active'));
            // Add active to clicked episode
            item.classList.add('active');
            
            // Update episode info in player
            const episodeTitle = item.querySelector('h4').textContent;
            const episodeInfo = document.querySelector('.episode-info');
            if (episodeInfo) {
                episodeInfo.textContent = episodeTitle;
            }
            
            console.log(`Playing: ${episodeTitle}`);
        });
    });

    // Exit player
    const exitBtn = document.getElementById('exitBtn');
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }

    // Show/hide controls
    let controlsTimeout;
    const videoPlayerContainer = document.querySelector('.video-player-container');
    const videoControls = document.querySelector('.video-controls');
    
    if (videoPlayerContainer && videoControls) {
        function showControls() {
            videoControls.classList.add('visible');
            clearTimeout(controlsTimeout);
            controlsTimeout = setTimeout(() => {
                if (isPlaying) {
                    videoControls.classList.remove('visible');
                }
            }, 3000);
        }

        videoPlayerContainer.addEventListener('mousemove', showControls);
        videoPlayerContainer.addEventListener('click', showControls);
    }
}

// Account page functionality
function initializeAccountPage() {
    // Toggle switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const settingName = e.target.id;
            const isEnabled = e.target.checked;
            console.log(`${settingName}: ${isEnabled ? 'enabled' : 'disabled'}`);
            // In a real app, this would save to backend
        });
    });

    // Select elements
    const selects = document.querySelectorAll('.setting-select');
    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            const settingName = e.target.id;
            const value = e.target.value;
            console.log(`${settingName} changed to: ${value}`);
            // In a real app, this would save to backend
        });
    });

    // Plan upgrade buttons
    const upgradeButtons = document.querySelectorAll('.btn-upgrade');
    upgradeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planCard = btn.closest('.plan-card');
            const planName = planCard.querySelector('h3').textContent;
            
            if (confirm(`Upgrade to ${planName} plan?`)) {
                alert(`Upgrading to ${planName}... You will be redirected to payment.`);
                // In a real app, this would redirect to payment flow
            }
        });
    });

    // Cancel membership
    const cancelBtn = document.querySelector('.btn-danger');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel your Netflix membership? You will lose access to all content.')) {
                alert('Your membership cancellation request has been submitted. You will receive a confirmation email shortly.');
                // In a real app, this would process the cancellation
            }
        });
    }
}

// Utility functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'profile.html':
            initializeProfilePage();
            break;
        case 'my-list.html':
            initializeMyListPage();
            break;
        case 'player.html':
            initializeVideoPlayer();
            break;
        case 'account.html':
            initializeAccountPage();
            break;
    }

    // Common modal functionality for all pages
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });

    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
});

// Export functions for use in other scripts
window.NetflixPages = {
    openModal,
    closeModal,
    initializeProfilePage,
    initializeMyListPage,
    initializeVideoPlayer,
    initializeAccountPage
};