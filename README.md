# Dream App

Application mobile Expo/React Native pour enregistrer, consulter, supprimer et rechercher des reves.

## Objectif

Dream App permet de journaliser des reves avec des metadonnees utiles:

- texte du reve
- lucidite
- type de reve
- date et heure
- personnes presentes
- lieu
- etat emotionnel
- intensite emotionnelle
- clarte du reve
- qualite du sommeil
- signification personnelle
- hashtags

Les donnees sont stockees localement dans AsyncStorage (pas de backend).

## Prerequis

- Node.js 18+ (recommande: version LTS)
- npm
- Android Studio (emulateur Android) ou Expo Go sur smartphone
- (Optionnel) Xcode pour iOS sur macOS

## Lancement rapide (sans ambiguite)

1. Installer les dependances:

```bash
npm install
```

2. Lancer le serveur Expo:

```bash
npx expo start
```

3. Ouvrir l'application:

- Android emule: taper `a` dans le terminal Expo
- Web: taper `w` dans le terminal Expo
- Smartphone: scanner le QR code avec Expo Go

## Commandes npx

```bash
npx expo start          # lance Expo
npx expo start --android  # ouvre sur Android
npx expo start --ios      # ouvre sur iOS (macOS)
npx expo start --web      # ouvre en web
```

## Structure du projet

```text
dream-app/
  app/
    _layout.tsx
    (tabs)/
      _layout.tsx         # navigation par onglets (expo-router)
      index.tsx           # ecran formulaire
      two.tsx             # ecran liste des reves
      three.tsx           # ecran recherche
      insomnia.tsx        # ecran video ambiance insomnie
  components/
    DreamForm.tsx         # orchestration formulaire + logique de soumission
    EditDream.tsx         # encapsulation du composant d'edition
    DreamList.tsx         # liste + actions de gestion
    DreamSearch.tsx       # recherche multi-criteres
    DeleteDream.tsx       # suppression d'un reve
    Insomnia.tsx          # lecture video (expo-video)
    dream-form/
      BasicsSection.tsx   # section texte/date/lucidite/type
      PeopleSection.tsx   # section personnes + lieu
      EmotionSection.tsx  # section emotion + notes
      HashtagsSection.tsx # section hashtags
  constants/
    DreamTheme.ts         # theme visuel centralise
  assets/images/
    icon.png
    splash-icon.png
    adaptive-icon.png
    favicon.png
```

## Architecture technique

- Framework: Expo + React Native + Expo Router
- Navigation: onglets via `app/(tabs)/_layout.tsx`
- UI: `react-native-paper`, `@expo/vector-icons`
- Persistance locale: `@react-native-async-storage/async-storage`
- Date/heure: `@react-native-community/datetimepicker`
- Notation emotionnelle: `react-native-ratings`
- Video insomnie: `expo-video`

### Flux principal de donnees

1. Le formulaire construit un objet reve.
2. L'objet est ajoute a `dreamFormDataArray` dans AsyncStorage.
3. La liste recharge les donnees a l'ouverture d'onglet (`useFocusEffect`).
4. La recherche filtre localement les reves sur plusieurs champs.

## Choix de conception

- Stockage local: simple et rapide pour un usage personnel/offline.
- Architecture composee du formulaire: DreamForm delegue l'UI en sections (`components/dream-form`) pour alleger le fichier principal.
- Theme centralise: `constants/DreamTheme.ts` evite la duplication des couleurs/espacements.
- Navigation par onglets: acces direct aux parcours principaux (creer, lister, rechercher, insomnie).

## Fonctionnalites implementees

- Creation de reve complete (texte + metadonnees)
- Gestion dynamique des personnes (ajout via virgule, suppression)
- Selection date/heure dans le formulaire
- Ajout de hashtags et reutilisation d'ID hashtag existants
- Liste detaillee des reves sauvegardes
- Suppression d'un reve
- Recherche multicritere (hashtags, personnes, type, emotion, texte)
- Ecran insomnie avec video en boucle
