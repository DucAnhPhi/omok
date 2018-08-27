# Omok

- Omok or 'Five in a Row' is a 1v1 multiplayer game.

- Play Store: https://play.google.com/store/apps/details?id=com.omokfiveinarow

## architecture outline

### app

- react-native
- redux
  - redux-thunk
  - redux-persist

## TypeScript

TypeScript is used in favor of Flow (via react-native-typescript-transformer) for the following reasons:

- Superior linting, e.g. automatic fixing of import ordering and grouping
- Superior code completion, e.g. automatic creation of import statements
- Superior typings ecosystem
- Better error messages

## external dependencies

- XCode 9
- Android Studio
- Node 8

## work environment

- It is recommended to use VS Code

Required Plugins:

- TSLint
- Prettier Javascript Formatter

- Copy the following in your workspace settings:

```
{
  "editor.formatOnSave": true,
  "tslint.autoFixOnSave": true,
  "javascript.format.enable": false
}
```

## quick start

- Open emulator of choice (iOS or Android)

```
npm install
npm start
```

- then run

```
npm run android
```

- or

```
npm run ios
```
