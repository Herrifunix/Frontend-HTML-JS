# Structure CSS Modulaire

Le CSS a été séparé en fichiers spécialisés pour améliorer la maintenabilité et l'organisation du code.

## Structure des fichiers CSS

```
css/
├── base.css           # Styles communs à toutes les pages (reset, body, boutons)
├── index.css          # Styles spécifiques à la page de connexion (index.html)
├── subscription.css   # Styles pour la page de souscription (si elle existe)
├── dashboard.css      # Styles pour le dashboard et les catalogues (dashboard.html, films.html, series.html, nouveautes.html) + modales
├── profile.css        # Styles spécifiques à la page des profils (profile.html)
├── player.css         # Styles pour le lecteur vidéo (player.html)
├── account.css        # Styles pour la page de compte (account.html)
├── my-list.css        # Styles pour la page "Ma liste" (future page)
└── responsive.css     # Styles responsive communs à toutes les pages
```

## Association fichiers HTML → CSS

### index.html (Page de connexion)
```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/index.css">
<link rel="stylesheet" href="css/responsive.css">
```

### dashboard.html, films.html, series.html, nouveautes.html
```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/dashboard.css">
<link rel="stylesheet" href="css/responsive.css">
```

### profile.html (Gestion des profils)
```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/profile.css">
<link rel="stylesheet" href="css/responsive.css">
```

### player.html (Lecteur vidéo)
```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/player.css">
<link rel="stylesheet" href="css/responsive.css">
```

### account.html (Page de compte)
```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/account.css">
<link rel="stylesheet" href="css/responsive.css">
```

## Contenu de chaque fichier

### base.css (66 lignes)
- Reset CSS universel
- Styles du body
- Classes de boutons communes (.btn-primary, .btn-guest)
- Conteneur principal

### index.css (151 lignes)
- Styles de la page de connexion
- Background avec overlay
- Formulaire de connexion
- Animations et transitions
- États hover et focus

### dashboard.css (613 lignes)
- Header de navigation avec recherche
- Section héro avec vidéo/image
- Carrousels de contenu
- Modales d'informations
- Styles de recherche en temps réel

### profile.css (127 lignes)
- Page de sélection des profils
- Grille d'avatars
- Formulaires d'édition
- Boutons d'actions

### player.css (333 lignes)
- Lecteur vidéo full-screen
- Contrôles de lecture personnalisés
- Sidebar des épisodes
- Menu de qualité
- Barre de progression

### account.css (279 lignes)
- Interface de gestion de compte
- Cartes d'informations
- Comparaison des plans
- Paramètres utilisateur
- Section de résiliation

### responsive.css (129 lignes)
- Media queries pour mobile/tablette
- Adaptations pour tous les composants
- Optimisations tactiles

## Avantages de cette architecture

✅ **Maintenabilité** : Code organisé par fonctionnalité
✅ **Performance** : Chargement sélectif selon la page
✅ **Clarté** : Séparation claire des responsabilités
✅ **Réutilisabilité** : Styles communs centralisés dans base.css
✅ **Debugging** : Problèmes isolés par page

## Commandes pour tester

```bash
# Démarrer le serveur de développement
python -m http.server 8080

# Ou avec Node.js
npx live-server --port=8080

# Accéder à l'application
http://localhost:8080
```

Tous les fichiers HTML ont été mis à jour pour utiliser la nouvelle structure CSS modulaire.