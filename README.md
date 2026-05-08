# 🧠 SmartLearn : L'Intelligence Artificielle Pédagogique Bilingue

SmartLearn est un système expert d'apprentissage conçu pour briser les barrières linguistiques et cognitives en Afrique subsaharienne. En combinant **Inférence Bayésienne** et **NLP Multilingue**, l'application offre une expérience de tutorat sur mesure en Français et en Peulh.

---

## 🚀 Vision et Impact
L'éducation inclusive nécessite des outils qui parlent la langue de l'enfant. SmartLearn utilise l'IA pour :
- **Réduire la charge cognitive** en proposant des concepts complexes dans la langue maternelle (Peulh).
- **Prédire le succès académique** grâce à un traçage précis de l'acquisition des compétences.
- **Démocratiser le tutorat privé** grâce à un moteur de remédiation intelligent.

## 🛠️ Architecture Technique Avancée

### 1. Moteur IA de Traçage (BKT)
L'application utilise le modèle **Bayesian Knowledge Tracing**. 
- **Fichier** : `src/utils/bkt.ts`
- **Fonctionnement** : Analyse chaque interaction (réussite/échec) pour mettre à jour le vecteur de compétence de l'élève via des calculs de probabilités conditionnelles.

### 2. Synthèse Vocale Adaptative (Neural TTS)
La synthèse vocale n'est pas qu'un lecteur de texte.
- **Prosodie** : Ajustée spécifiquement pour le Peulh (Pitch: 0.75, Rate: 0.55).
- **Logique** : Basculement séquentiel intelligent entre FR et FUL pour une immersion totale.

### 3. Design Système : Glassmorphism Culturel
- **Philosophie** : Utiliser la transparence (`BlurView`) pour superposer la modernité de l'IA sur l'héritage culturel (motifs Bogolan).
- **Composant** : `src/components/AfricanPattern.tsx` (SVG haute performance).

## 📂 Structure du Code
- `App.tsx` : Point d'entrée et navigation sécurisée.
- `src/screens/` :
  - `ExerciseScreen.tsx` : Gestionnaire de quiz et audio.
  - `ProfileScreen.tsx` : Visualisation des données IA (Radar Chart).
- `src/db/` : Schéma SQLite pour le fonctionnement offline.

## 🛠️ Développement et Contribution

### Prérequis
- Node.js & npm
- Expo CLI
- Un compte Expo pour les builds EAS.

### Installation
```bash
npm install
npx expo start
```

## 🏆 Atouts pour la Compétition
1. **Offline-First** : IA embarquée fonctionnant sans internet.
2. **Identité Culturelle** : Design et langue Peulh intégrés nativement.
3. **Rigueur Scientifique** : Base algorithmique BKT documentée.

---
**Équipe SmartLearn** | *L'excellence au service de l'inclusion.* 🏺✨
