# PARC360 - Système de Design
## Côte d'Ivoire PME - Charte Graphique

**Date**: 2025-11-23
**Version**: 2.0
**Auteur**: Design System pour Côte d'Ivoire PME

---

## 🎨 Vue d'ensemble

Ce système de design intègre l'identité visuelle de **Côte d'Ivoire PME** dans l'application PARC360, créant une expérience utilisateur cohérente, moderne et alignée avec les valeurs de l'organisation.

**Tagline**: *"Accompagner l'avenir"*

---

## 🎯 Palette de Couleurs

### Couleurs Principales CI-PME

#### Orange Principal (Brand Color)
```css
--cipme-orange: #ED6D11        /* Couleur principale CI-PME */
--cipme-orange-light: #FF8533  /* Variante claire */
--cipme-orange-dark: #D45D00   /* Variante foncée */
```

**Usage**:
- Call-to-actions principaux
- Éléments actifs dans la navigation
- Boutons primaires
- Accents visuels importants

#### Charcoal (Arrière-plans sombres)
```css
--cipme-charcoal: #32373c       /* Fond sidebar/header */
--cipme-charcoal-light: #4a5158 /* Variante */
```

**Usage**:
- Sidebar background
- Zones sombres
- Typographie sur fonds clairs

#### Gray (Arrière-plans secondaires)
```css
--cipme-gray: #30353a           /* Footer/sections */
--cipme-gray-light: #abb8c3     /* Textes secondaires */
```

**Usage**:
- Footers
- Sections secondaires
- Bordures subtiles

### Couleurs Inspirées du Drapeau Ivoirien

#### Orange Ivoire
```css
--cipme-ivory: #F7931E          /* Orange drapeau CI */
--cipme-ivory-light: #FFB366    /* Variante claire */
--cipme-ivory-dark: #E67E00     /* Variante foncée */
```

#### Vert
```css
--cipme-green: #009E60          /* Vert drapeau CI */
--cipme-green-light: #00C878    /* Variante claire */
--cipme-green-dark: #007A4D     /* Variante foncée */
```

**Usage**:
- Indicateurs de succès
- Statuts positifs (disponible, actif)
- Graphiques de performance positive

---

## 📐 Typographie

### Police Principale
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif
```

### Hiérarchie de Texte

| Élément | Taille | Poids | Usage |
|---------|--------|-------|-------|
| **H1** | 2.25rem (36px) | 900 (Black) | Titres de pages principales |
| **H2** | 1.5rem (24px) | 700 (Bold) | Titres de sections |
| **H3** | 1.25rem (20px) | 600 (Semibold) | Sous-sections |
| **Body** | 1rem (16px) | 400 (Regular) | Texte standard |
| **Small** | 0.875rem (14px) | 500 (Medium) | Labels, métadonnées |
| **Tiny** | 0.75rem (12px) | 400 (Regular) | Annotations |

### Styles de Texte Spéciaux

#### Gradient Text (Titres importants)
```css
.gradient-text {
  background: linear-gradient(to right, #32373c, #30353a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 🧩 Composants

### 1. Cards (Cartes)

#### Stat Card (Carte Statistique)
**Variantes de Gradient**:
- **Orange**: `from-cipme-orange to-cipme-orange-dark`
- **Green**: `from-cipme-green to-cipme-green-dark`
- **Ivory**: `from-cipme-ivory to-cipme-ivory-dark`
- **Charcoal**: `from-cipme-charcoal to-cipme-gray`

**Caractéristiques**:
- Border radius: `1rem` (rounded-2xl)
- Ombres: `shadow-lg` avec effet hover `shadow-xl`
- Padding: `1.5rem` (p-6)
- Transition: `transition-all duration-300`

```tsx
<div className="bg-gradient-to-br from-cipme-orange to-cipme-orange-dark rounded-2xl shadow-lg hover:shadow-xl p-6">
  {/* Éléments décoratifs */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>

  {/* Contenu */}
  <p className="text-sm font-semibold text-white/80 uppercase">Titre</p>
  <p className="text-4xl font-black text-white mt-3">1,234</p>
</div>
```

#### White Card (Carte Blanche)
```tsx
<div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
  {/* Contenu */}
</div>
```

### 2. Boutons

#### Bouton Principal (Primary)
```tsx
<button className="px-4 py-3 bg-gradient-to-r from-cipme-orange to-cipme-orange-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-cipme-lg transition-all duration-200">
  Action
</button>
```

#### Bouton Secondaire
```tsx
<button className="px-4 py-3 bg-white text-cipme-orange border-2 border-cipme-orange font-semibold rounded-xl hover:bg-cipme-orange hover:text-white transition-all">
  Action
</button>
```

#### Bouton Danger
```tsx
<button className="px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all">
  Supprimer
</button>
```

### 3. Navigation (Sidebar)

#### Élément Actif
```tsx
<Link className="flex items-center px-4 py-3.5 text-sm font-medium rounded-xl bg-gradient-to-r from-cipme-orange to-cipme-orange-dark text-white shadow-cipme">
  <Icon className="w-5 h-5 text-white" />
  <span className="ml-4">Tableau de bord</span>
  <div className="w-1.5 h-1.5 ml-auto bg-white rounded-full animate-pulse"></div>
</Link>
```

#### Élément Inactif
```tsx
<Link className="flex items-center px-4 py-3.5 text-sm font-medium rounded-xl text-gray-300 hover:bg-white/5 hover:text-white">
  <Icon className="w-5 h-5 text-gray-400 group-hover:text-cipme-orange" />
  <span className="ml-4">Véhicules</span>
</Link>
```

### 4. Inputs (Champs de Saisie)

```tsx
<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
    <Icon className="h-5 w-5 text-gray-400" />
  </div>
  <input
    className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cipme-orange focus:border-transparent transition-all"
    placeholder="Saisir..."
  />
</div>
```

### 5. Alertes

#### Alerte Erreur
```tsx
<div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
  <ExclamationCircleIcon className="w-5 h-5 text-red-600" />
  <div>
    <p className="font-semibold text-red-800">Titre</p>
    <p className="text-sm text-red-700">Message</p>
  </div>
</div>
```

#### Alerte Succès
```tsx
<div className="p-4 bg-green-50 border-l-4 border-cipme-green rounded-lg">
  <p className="font-semibold text-green-800">Succès!</p>
</div>
```

#### Alerte Warning
```tsx
<div className="p-4 bg-orange-50 border-l-4 border-cipme-orange rounded-lg">
  <p className="font-semibold text-orange-800">Attention</p>
</div>
```

---

## 🎭 Ombres Personnalisées

```css
/* Ombres thématiques CI-PME */
.shadow-cipme {
  box-shadow: 0 4px 6px -1px rgba(237, 109, 17, 0.1),
              0 2px 4px -1px rgba(237, 109, 17, 0.06);
}

.shadow-cipme-lg {
  box-shadow: 0 10px 15px -3px rgba(237, 109, 17, 0.1),
              0 4px 6px -2px rgba(237, 109, 17, 0.05);
}
```

---

## 🌈 Dégradés (Gradients)

### Dégradés d'Arrière-plan

#### Orange Principal
```css
bg-gradient-to-br from-cipme-orange to-cipme-orange-dark
```

#### Vert Success
```css
bg-gradient-to-br from-cipme-green to-cipme-green-dark
```

#### Charcoal Sidebar
```css
bg-gradient-to-b from-cipme-charcoal to-cipme-gray
```

#### Multi-couleurs CI
```css
bg-gradient-to-r from-cipme-orange via-cipme-orange-dark to-cipme-charcoal
```

### Dégradés de Texte
```css
bg-gradient-to-r from-cipme-charcoal to-cipme-gray bg-clip-text text-transparent
```

---

## 📱 Responsive Design

### Breakpoints
```javascript
{
  sm: '640px',   // Mobile large
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
}
```

### Grid System
```tsx
{/* Mobile: 1 colonne, Tablet: 2 colonnes, Desktop: 4 colonnes */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cards */}
</div>
```

---

## ✨ Animations & Transitions

### Transitions Standard
```css
transition-all duration-200   /* Rapide (boutons, hover) */
transition-all duration-300   /* Standard (cards, modals) */
transition-all duration-500   /* Lente (progress bars) */
```

### Animations Spéciales

#### Loading Spinner
```tsx
<div className="w-16 h-16 border-4 border-cipme-orange border-t-transparent rounded-full animate-spin"></div>
```

#### Pulse (Indicateur actif)
```tsx
<div className="w-2 h-2 bg-cipme-orange rounded-full animate-pulse"></div>
```

#### Scale on Hover
```tsx
<button className="transform hover:scale-105 transition-transform">
  Hover moi
</button>
```

---

## 🖼️ Iconographie

### Source
**Heroicons v2** (Outline pour la navigation, Solid pour les actions)

### Tailles Recommandées
```tsx
<Icon className="w-4 h-4" />   {/* Small - 16px */}
<Icon className="w-5 h-5" />   {/* Medium - 20px */}
<Icon className="w-6 h-6" />   {/* Large - 24px */}
<Icon className="w-8 h-8" />   {/* XLarge - 32px */}
```

### Couleurs d'Icônes
- **Active/Primary**: `text-cipme-orange`
- **Inactive**: `text-gray-400`
- **Success**: `text-cipme-green`
- **Warning**: `text-yellow-500`
- **Error**: `text-red-600`

---

## 🎨 Éléments Décoratifs

### Cercles Flous (Backdrop)
```tsx
<div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
<div className="absolute bottom-20 right-20 w-96 h-96 bg-cipme-ivory/20 rounded-full blur-3xl"></div>
```

### Barres Verticales Décoratives
```tsx
<div className="w-1 h-8 bg-gradient-to-b from-cipme-orange to-cipme-ivory rounded-full"></div>
```

### Badges
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cipme-orange text-white">
  Nouveau
</span>
```

---

## 📋 Statuts & Couleurs Sémantiques

| Statut | Couleur | Classe |
|--------|---------|--------|
| **Disponible** | Vert | `bg-cipme-green` |
| **En service** | Orange | `bg-cipme-orange` |
| **En maintenance** | Jaune | `bg-yellow-500` |
| **Hors service** | Rouge | `bg-red-600` |
| **Actif** | Vert | `bg-cipme-green` |
| **Inactif** | Gris | `bg-gray-400` |
| **Suspendu** | Orange | `bg-cipme-orange` |
| **Expiré** | Rouge | `bg-red-600` |

---

## 🚀 Composants Avancés

### Progress Bar
```tsx
<div className="w-full bg-gray-100 rounded-full h-2">
  <div
    className="bg-gradient-to-r from-cipme-orange to-cipme-ivory h-2 rounded-full transition-all duration-500"
    style={{ width: '75%' }}
  ></div>
</div>
```

### Avatar/Initial Circle
```tsx
<div className="w-10 h-10 bg-cipme-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
  JB
</div>
```

### Badge avec Avatar
```tsx
<div className="flex items-center space-x-3 px-3 py-2 bg-white/5 rounded-lg">
  <div className="w-8 h-8 bg-cipme-orange rounded-full text-white font-bold text-sm flex items-center justify-center">
    JB
  </div>
  <div>
    <p className="text-xs font-semibold text-white">Jérémie BEDJE</p>
    <p className="text-xs text-gray-400">Administrateur</p>
  </div>
</div>
```

---

## 📐 Espacements (Spacing)

### Padding/Margin Standard
```css
p-4  /* 1rem = 16px */
p-6  /* 1.5rem = 24px */
p-8  /* 2rem = 32px */

space-y-4  /* Espacement vertical entre enfants */
space-x-4  /* Espacement horizontal entre enfants */
gap-6      /* Gap dans Grid/Flex */
```

### Border Radius
```css
rounded-lg   /* 0.5rem = 8px */
rounded-xl   /* 0.75rem = 12px */
rounded-2xl  /* 1rem = 16px */
rounded-3xl  /* 1.5rem = 24px */
rounded-full /* Cercle complet */
```

---

## 🎯 Logo & Branding

### Logo Simplifié (Utilisé dans l'app)
```tsx
<div className="flex items-center space-x-3">
  <div className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center">
    <span className="text-2xl font-black text-cipme-orange">P</span>
  </div>
  <div>
    <h1 className="text-xl font-black text-white">PARC360</h1>
    <p className="text-xs font-medium text-white/80">Côte d'Ivoire PME</p>
  </div>
</div>
```

### Logo CI-PME Footer
```tsx
<div className="flex items-center space-x-2">
  <div className="w-8 h-8 bg-cipme-orange rounded-lg flex items-center justify-center">
    <span className="text-sm font-bold text-white">CI</span>
  </div>
  <div>
    <p className="text-sm font-semibold">Côte d'Ivoire PME</p>
    <p className="text-xs text-gray-400">Accompagner l'avenir</p>
  </div>
</div>
```

---

## 📱 Layout Structure

### Sidebar Width
- **Ouvert**: `w-72` (288px)
- **Fermé**: `w-20` (80px)

### Header
- **Hauteur**: Variable (auto)
- **Background**: `bg-white/80 backdrop-blur-lg`
- **Position**: `sticky top-0 z-40`

### Main Content
- **Padding**: `p-8` (32px)
- **Margin Left**: Ajusté dynamiquement selon sidebar

---

## 🎨 Tailwind Config (Résumé)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        cipme: {
          orange: '#ED6D11',
          'orange-light': '#FF8533',
          'orange-dark': '#D45D00',
          charcoal: '#32373c',
          'charcoal-light': '#4a5158',
          gray: '#30353a',
          'gray-light': '#abb8c3',
          ivory: {
            DEFAULT: '#F7931E',
            light: '#FFB366',
            dark: '#E67E00',
          },
          green: {
            DEFAULT: '#009E60',
            light: '#00C878',
            dark: '#007A4D',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'cipme': '0 4px 6px -1px rgba(237, 109, 17, 0.1), 0 2px 4px -1px rgba(237, 109, 17, 0.06)',
        'cipme-lg': '0 10px 15px -3px rgba(237, 109, 17, 0.1), 0 4px 6px -2px rgba(237, 109, 17, 0.05)',
      },
    },
  },
}
```

---

## ✅ Checklist d'Implémentation

### Pages Mises à Jour ✅
- [x] **tailwind.config.js** - Configuration des couleurs CI-PME
- [x] **Layout.tsx** - Sidebar et header avec nouvelle charte
- [x] **Dashboard.tsx** - Tableau de bord modernisé
- [x] **Login.tsx** - Page de connexion split-screen

### À Appliquer (Optionnel)
- [ ] **Vehicles.tsx** - Liste des véhicules
- [ ] **Drivers.tsx** - Liste des conducteurs
- [ ] **Maintenance.tsx** - Gestion maintenance
- [ ] **Fuel.tsx** - Gestion carburant
- [ ] **Trips.tsx** - Gestion trajets
- [ ] **Documents.tsx** - Gestion documents
- [ ] **Reports.tsx** - Rapports
- [ ] **Modals** - Tous les modaux

---

## 🎓 Bonnes Pratiques

### Cohérence
1. **Toujours utiliser** les couleurs `cipme-*` pour les éléments de marque
2. **Préférer** les dégradés pour les CTA importants
3. **Maintenir** les border-radius arrondis (xl, 2xl)
4. **Utiliser** Heroicons pour toutes les icônes

### Performance
1. **Limiter** les animations lourdes
2. **Utiliser** `transition-all` avec parcimonie
3. **Préférer** `backdrop-blur` avec modération
4. **Optimiser** les images/SVG

### Accessibilité
1. **Contraste** minimum 4.5:1 pour le texte
2. **Focus states** visibles sur tous les éléments interactifs
3. **Labels** sur tous les inputs
4. **Alt text** sur toutes les images

---

## 📚 Ressources

### Documentation
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Heroicons**: https://heroicons.com/
- **CI-PME Site**: https://cipme.ci/

### Outils
- **Color Picker**: Pour extraire couleurs exactes
- **Figma/Design**: Pour mockups avant implémentation
- **Chrome DevTools**: Pour tester responsive

---

## 📞 Support Design

Pour toute question sur le système de design ou propositions d'amélioration:
- **Repository**: https://github.com/jbedje/parc360
- **Issues**: https://github.com/jbedje/parc360/issues

---

**© 2025 PARC360 - Côte d'Ivoire PME**
*Accompagner l'avenir*
