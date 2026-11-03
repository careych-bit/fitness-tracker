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

### Firebase Configuration

The application uses environment variables for Firebase configuration.

After cloning the repository, create a local `.env` file from the provided example:

````sh
cp .env.example .env

### Compile and Hot-Reload for Development

```sh
npm run dev
````

## Firebase Project Setup

This project uses a shared Firebase project for authentication and Cloud Firestore.

### Project configuration

- Firebase project: Fitness Tracker
- Cloud Firestore database: `(default)`
- Firestore location: `nam5`
- Billing plan: Spark (no-cost)
- Authentication: Email/Password
- Team members should use their own Google accounts for Firebase Console access. Project roles are managed through Firebase Project Settings under Users and permissions.

### Local development

Firebase client configuration is stored locally in environment variables.

After cloning the repository:

```sh
npm install
cp .env.example .env
```

Add the shared Firebase web-app configuration values to `.env`, then start the development server:

```sh
npm run dev
```

The `.env` file is ignored by Git and should not be committed. Firebase web configuration values should be shared privately with approved team members. Service account keys and other privileged credentials should never be committed to the repository.

The project currently uses the Spark plan, so the team should review Firebase usage and billing requirements before enabling services that require a paid plan.

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
