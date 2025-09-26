# Netflix Clone - Interface Web Complète

Un clone fidèle de Netflix développé en HTML, CSS et JavaScript vanilla, offrant une expérience utilisateur authentique avec toutes les fonctionnalités principales.

## 🎯 Fonctionnalités

### ✅ Authentification
- Connexion utilisateur avec email/mot de passe
- **Accès invité** pour navigation directe
- Redirection automatique selon le type de connexion

### 💳 Gestion des abonnements
- 3 plans d'abonnement : Essentiel, Standard, Premium
- Interface de sélection interactive
- Comparaison des fonctionnalités

### 🎬 Catalogue et navigation
- Interface principale type Netflix
- **Recherche en temps réel** dans le catalogue
- Carrousels de contenu par catégories
- Section héro avec contenu mis en avant

### 📱 Gestion des profils
- Sélection et création de profils
- Interface de gestion des avatars
- Personnalisation des profils

### ❤️ Ma liste personnelle
- Ajout/suppression de contenu favoris
- Filtres par type de contenu
- Tri par date d'ajout, titre, etc.
- Interface vide avec call-to-action

### 📺 Lecteur vidéo
- **Lecteur vidéo complet** avec contrôles
- Barre de progression interactive
- Contrôles de volume et mode plein écran
- **Sidebar d'épisodes** pour les séries
- Sélection de qualité vidéo
- Skip avant/arrière (10 secondes)

### ⚙️ Gestion du compte
- Paramètres de compte détaillés
- Gestion des moyens de paiement
- Comparaison et changement de plans
- Préférences de notification
- Option d'annulation d'abonnement

## 📁 Structure du projet

```
/
├── index.html          # Page de connexion
├── subscription.html   # Sélection d'abonnement
├── dashboard.html      # Interface principale Netflix
├── profile.html        # Gestion des profils
├── my-list.html       # Ma liste personnelle
├── player.html        # Lecteur vidéo
├── account.html       # Paramètres du compte
├── styles.css         # Styles CSS complets
├── script.js          # JavaScript principal
├── pages-script.js    # JavaScript pour pages additionnelles
└── README.md         # Documentation
```

## 🎨 Design et UI/UX

### Palette de couleurs Netflix
- **Rouge Netflix** : #e50914
- **Noir principal** : #141414
- **Gris foncé** : #333333
- **Blanc** : #ffffff
- **Gris texte** : #999999

### Responsive Design
- Design mobile-first
- Breakpoints adaptatifs
- Interface tactile optimisée
- Carrousels swipables sur mobile

## 🚀 Fonctionnalités JavaScript

### Authentification
- Validation des formulaires
- Stockage local des sessions
- Redirection conditionnelle
- Gestion des accès invité

### Interface dynamique
- **Recherche instantanée** avec filtrage
- Modales interactives
- Navigation fluide entre pages
- Animations et transitions

### Lecteur vidéo
- Contrôles personnalisés
- Gestion du temps et progression
- Volume et qualité ajustables
- Sidebar épisodes interactive
- Mode plein écran

### Gestion des données
- LocalStorage pour persistance
- Simulation API backend
- Gestion des préférences utilisateur
- Synchronisation multi-pages

## 📱 Pages et navigation

### 1. **index.html** - Page de connexion
- Formulaire d'authentification
- Option de connexion invité
- Validation en temps réel
- Redirection intelligente

### 2. **subscription.html** - Choix d'abonnement
- 3 plans détaillés avec prix
- Comparaison des fonctionnalités
- Sélection interactive
- Processus de paiement simulé

### 3. **dashboard.html** - Interface principale
- **Section héro** avec contenu featured
- **Carrousels** par catégories
- **Barre de recherche** fonctionnelle
- **Navigation** vers toutes les sections
- Modales d'informations détaillées

### 4. **profile.html** - Gestion des profils
- Grille des profils existants
- Ajout de nouveaux profils
- Sélection d'avatars
- Modification des profils

### 5. **my-list.html** - Ma liste
- Contenu sauvegardé par l'utilisateur
- **Filtres** : Films, Séries, Tout
- **Tri** : Date, Titre, Note
- Actions : Lecture, Suppression, Infos
- État vide avec redirection

### 6. **player.html** - Lecteur vidéo
- **Lecteur vidéo complet** avec overlay
- **Contrôles avancés** : Play/Pause, Skip, Volume
- **Barre de progression** interactive
- **Sidebar épisodes** avec thumbnails
- **Menu qualité** (Auto, HD, 4K)
- Mode plein écran et sortie

### 7. **account.html** - Gestion du compte
- **Informations personnelles** et email
- **Détails d'abonnement** et facturation
- **Comparaison des plans** avec upgrade
- **Profils et paramètres** de contrôle parental
- **Préférences** et notifications
- **Historique** et activité
- **Annulation** d'abonnement

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique et accessibilité
- **CSS3** : Flexbox, Grid, animations, responsive design
- **JavaScript ES6+** : Modules, arrow functions, async/await
- **Font Awesome** : Icônes vectorielles
- **LocalStorage** : Persistance des données côté client

## 🎯 Optimisations

### Performance
- CSS optimisé avec sélecteurs efficaces
- JavaScript modulaire et réutilisable
- Images optimisées et lazy loading
- Animations GPU-accelerées

### Accessibilité
- Navigation au clavier
- Rôles ARIA appropriés
- Contraste des couleurs respecté
- Focus visible pour tous les éléments

### UX/UI
- **Feedback visuel** immédiat
- **States hover** sur tous les éléments interactifs
- **Animations fluides** et naturelles
- **Messages d'erreur** clairs et utiles

## 🔄 Flux utilisateur

1. **Connexion** → Choix entre authentification ou accès invité
2. **Abonnement** → Sélection du plan (si nouvel utilisateur)
3. **Profils** → Choix/création du profil utilisateur
4. **Dashboard** → Navigation dans le catalogue principal
5. **Lecture** → Lecteur vidéo avec contrôles avancés
6. **Gestion** → Ma liste, compte, paramètres

## 📊 Données simulées

Le projet inclut un dataset complet avec :
- **Films** : 50+ titres avec images réelles
- **Séries** : 30+ titres avec épisodes détaillés
- **Genres** : Action, Comédie, Drame, Horreur, etc.
- **Métadonnées** : Descriptions, années, notes, durées

## 🌟 Points forts

- **Design 100% fidèle** à l'interface Netflix 2024
- **Responsive complet** pour tous les appareils
- **Interactions fluides** et naturelles
- **Code modulaire** et maintenable
- **Performance optimisée** avec animations 60fps
- **Fonctionnalités avancées** : recherche, lecteur, profils
- **UX authentique** avec tous les micro-interactions Netflix

## 🎬 Utilisation

1. Ouvrir `index.html` dans un navigateur moderne
2. Utiliser "Connexion invité" pour accès direct
3. Explorer toutes les fonctionnalités
4. Tester le responsive sur mobile

## 📝 Notes techniques

- Aucune dépendance externe (à part Font Awesome)
- Compatible tous navigateurs modernes
- Code JavaScript vanilla (ES6+)
- LocalStorage pour simulation backend
- Images hébergées sur sources stables

---

**Développé avec ❤️ pour reproduire fidèlement l'expérience Netflix**