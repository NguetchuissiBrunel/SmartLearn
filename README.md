# SMARTLearn – Système d’apprentissage adaptatif hors ligne

**SMARTLearn** est une application mobile éducative conçue pour transformer l'apprentissage des mathématiques pour les élèves de 6ème, particulièrement dans les régions septentrionales du Cameroun. Elle intègre des technologies d'IA avancées pour fonctionner entièrement sans connexion internet.

## 🌟 Caractéristiques Principales

- **IA Adaptative (BKT)** : Un algorithme *Bayesian Knowledge Tracing* suit la maîtrise des compétences de l'élève en temps réel et adapte la difficulté des exercices.
- **Support en Langue Peulh** : 
  - **Explications IA** : Génération dynamique de consignes en Peulh via un LLM léger (`SmolLM2-135M`) tournant localement.
  - **Audio TTS** : 90 fichiers audio pré-générés pour accompagner chaque exercice.
- **Fonctionnement 100% Hors Ligne** : Aucune donnée n'est requise pour l'apprentissage, les explications ou le suivi.
- **Design Bogolan** : Une interface moderne et épurée inspirée du patrimoine culturel africain.
- **Synchronisation Différée** : Envoi automatique des logs de progression dès qu'une connexion internet est détectée.

## 🛠️ Stack Technique

- **Framework** : React Native (Expo SDK 54)
- **Base de données** : SQLite (expo-sqlite)
- **Moteur LLM** : `llama.rn` (bindings llama.cpp)
- **Algorithme BKT** : Implémentation JavaScript personnalisée
- **Design** : Lucide React Native & Custom SVG Patterns

## 🚀 Installation et Lancement

### 1. Prérequis
- Node.js (v18+)
- Android Studio (pour le simulateur Android ou le déploiement APK)
- Expo Go (uniquement pour les parties non-IA) ou **Development Build** (recommandé).

### 2. Installation
```bash
# Cloner le projet
# cd smartlearn

# Installer les dépendances
npm install

# Installer les modules natifs (nécessaire pour llama.rn)
npx expo prebuild
```

### 3. Téléchargement du Modèle IA
Au premier lancement, l'application vous proposera de télécharger le modèle `smollm2-135m-q4_k_m.gguf` (~70 Mo).
Si vous souhaitez l'ajouter manuellement :
1. Téléchargez le modèle depuis Hugging Face.
2. Placez-le dans le dossier `Documents/models/` de l'application sur votre appareil.

### 4. Lancement
```bash
# Démarrer le serveur Expo
npx expo start

# Lancer sur Android
npx expo run:android
```

## 📚 Structure pédagogique
Le MVP contient **3 chapitres** de mathématiques :
1. **Numération** (30 exercices)
2. **Opérations** (30 exercices)
3. **Fractions** (30 exercices)

---
**SMARTLearn** – *L'éducation sans limites, même sans réseau.*
Developed by NGUETCHUISSI Brunel & FOFACK Henri Joel.
ACIAI Challenge 2026.
