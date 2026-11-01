# Fitness Tracker

CIS 371 term project.

A Vue and Firebase web application for creating workouts, recording exercise activity, tracking fitness goals, and viewing workout progress.

## State Management Architecture

The application uses Pinia for shared client-side state while Firebase handles authentication and persistent data.

### State responsibilities

- Use local `ref` and `computed` values for state that belongs to a single view or component, such as form inputs, search fields, filters, and temporary UI controls.
- Use Pinia when the same reactive state needs to be shared across multiple views or components.
- Firebase Authentication is the source of truth for the current user and login session.
- Cloud Firestore is the source of truth for persisted application data such as workouts, exercises, goals, and history.

### Current stores

`src/stores/authStore.ts` manages the shared authenticated-user state and Firebase authentication initialization.

The application should use a single Firebase `onAuthStateChanged` listener through this store rather than creating separate authentication listeners inside individual views.

Additional feature stores should only be added when their data is shared across multiple parts of the application. For example, the shared Firestore exercise library may use an exercise store because the same exercise data will be used by both the Exercise Library and workout-building features.

### Async state conventions

When a shared store performs asynchronous work:

- use `async` / `await`
- expose loading state when users need feedback
- expose useful error state instead of relying only on console messages
- avoid duplicate Firebase listeners or unnecessary repeated Firestore requests
- clear user-specific state when the authenticated user signs out or changes

Views should remain focused on presentation and user interaction while shared application state and reusable data operations are kept in the appropriate store.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
