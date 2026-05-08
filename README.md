# 🧠 SmartLearn : L'IA au Service de l'Éducation Bilingue

SmartLearn est une application éducative innovante conçue pour offrir un tutorat intelligent et personnalisé en **Français** et en **Peulh**. Elle combine des algorithmes de traçage de la connaissance (BKT) avec une interface premium pour maximiser l'engagement des élèves.

## ✨ Fonctionnalités Clés

- **🌍 Tutorat Bilingue Natif** : L'interface et les exercices basculent instantanément entre le Français et le Peulh.
- **🎙️ Synthèse Vocale Adaptative** : Audio IA optimisé pour le Peulh avec une prosodie naturelle (Style Griot).
- **🤖 Intelligence Artificielle Prédictive** : 
  - Utilisation de l'algorithme **Bayesian Knowledge Tracing (BKT)** pour prédire la réussite de l'élève.
  - Génération d'explications détaillées et bilingues par IA.
- **📊 Carte Cognitive IA** : Visualisation radar des compétences dans le profil utilisateur.
- **💎 Design Premium Glassmorphism** : Interface moderne avec effets de flou, motifs Bogolan en relief et retours haptiques (vibrations).

## 🛠️ Stack Technique

- **Framework** : [Expo](https://expo.dev/) (SDK 54) / React Native
- **Base de Données** : [SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) pour la persistance locale et le cache IA.
- **Graphismes** : SVG (react-native-svg) & Linear Gradient.
- **Animations** : React Native Animated API & Expo Blur.
- **Audio** : Expo Speech pour le multilinguisme.
- **Algorithmes** : Moteur BKT personnalisé pour le traçage des compétences.

## 🚀 Installation et Lancement

1. **Cloner le repository** :
   ```bash
   git clone [url-du-repo]
   cd smartlearn
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Lancer l'application** :
   ```bash
   npx expo start
   ```
   *Scannez le QR Code avec l'application **Expo Go** (Android/iOS).*

## 📖 Structure du Projet

- `src/screens/` : Écrans principaux (Exercices, Chapitres, Profil, Splash).
- `src/components/` : Éléments UI réutilisables (Motifs Africains, Cartes).
- `src/utils/` : Algorithmes BKT et Système de traduction (i18n).
- `src/db/` : Schéma de base de données et données initiales (seeds).

---
**Développé avec passion pour l'excellence éducative.** 🏺✨
