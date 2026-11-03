# Fitness Tracker

CIS 371 term project.

A Vue and Firebase web application for creating workouts, recording exercise activity, tracking fitness goals, and viewing workout progress.

## State Management Architecture

The application uses Pinia for shared client-side state while Firebase handles authentication and persistent data.

### State Responsibilities

- Use local `ref` and `computed` values for state that belongs to a single view or component, such as form inputs, search fields, filters, and temporary UI controls.
- Use Pinia when the same reactive state needs to be shared across multiple views or components.
- Firebase Authentication is the source of truth for the current user and login session.
- Cloud Firestore is the source of truth for persisted application data such as workouts, exercises, goals, and workout history.

### Current Stores

`src/stores/authStore.ts` manages the shared authenticated-user state and Firebase authentication initialization.

The application should use a single Firebase `onAuthStateChanged` listener through this store rather than creating separate authentication listeners inside individual views.

Additional feature stores should only be added when their data is shared across multiple parts of the application. For example, the shared Firestore exercise library may use an exercise store because the same exercise data will be used by both the Exercise Library and workout-building features.

### Async State Conventions

When a shared store performs asynchronous work:

- use `async` / `await`
- expose loading state when users need feedback
- expose useful error state instead of relying only on console messages
- avoid duplicate Firebase listeners or unnecessary repeated Firestore requests
- clear user-specific state when the authenticated user signs out or changes

Views should remain focused on presentation and user interaction while shared application state and reusable data operations are kept in the appropriate store.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) and disable Vetur if installed.

## Recommended Browser Setup

Chromium-based browsers such as Chrome, Edge, or Brave:

- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)

Firefox:

- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize Configuration

See the [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

Install project dependencies:

```sh
npm install
```

### Firebase Configuration

The application uses environment variables for Firebase configuration.

After cloning the repository, create a local `.env` file from the provided example:

```sh
cp .env.example .env
```

Add the shared Firebase project configuration values to `.env` before starting the application.

The `.env` file is ignored by Git and should not be committed.

Start the development server with:

```sh
npm run dev
```

## Firebase Project Setup

This project uses a shared Firebase project for authentication and Cloud Firestore.

### Project Configuration

- Firebase project: Fitness Tracker
- Cloud Firestore database: `(default)`
- Firestore location: `nam5`
- Billing plan: Spark
- Authentication provider: Email/Password
- Team members use their own Google accounts for Firebase Console access.
- Project roles are managed through Firebase Project Settings under Users and permissions.

Firebase web configuration values should be shared privately with approved team members.

Service account keys and other privileged credentials should never be committed to the repository.

The project currently uses the Spark plan, so Firebase usage and billing requirements should be reviewed before enabling services that require a paid plan.

## Firestore Data Model

Cloud Firestore stores the application's persistent data.

The existing workout schema is being preserved so the current workout CRUD functionality and existing Firestore records do not need to be migrated.

### Ownership Model

Private user data uses `User_ID` as the Firebase Authentication UID of the document owner.

Private collections must be queried using the authenticated user's UID.

Firestore Security Rules must independently enforce ownership and must not rely only on client-side queries or Vue Router protection.

The shared exercise library is not owned by an individual user.

## Workouts Collection

Collection:

```text
workouts
```

The `workouts` collection stores private workout records.

### Current Fields

- `User_ID` — Firebase UID of the workout owner
- `Workout_name` — workout name
- `Date` — scheduled workout date stored as `YYYY-MM-DD`
- `Start_Time` — scheduled start time stored as `HH:MM`
- `Duration` — workout duration in minutes
- `Completion` — boolean indicating whether the workout is complete
- `Notes` — optional workout notes

### Planned Workout Fields

Additional fields may be added as workout logging features are implemented:

- `Exercises` — ordered list of exercises included in the workout
- `Created_At` — Firestore timestamp
- `Updated_At` — Firestore timestamp
- `Completed_At` — Firestore timestamp written when the workout is completed

Workout exercise entries should preserve enough information to display historical workout records even if the shared exercise library changes later.

Example strength exercise entry:

```js
{
  Exercise_ID: "exercise-document-id",
  Name: "Bench Press",
  Category: "Chest",
  Type: "strength",
  Order: 0,
  Entries: [
    {
      reps: 8,
      weight: 135
    }
  ]
}
```

Example cardio entry:

```js
{
  distance: 3.1,
  duration: 30
}
```

## Exercises Collection

Collection:

```text
exercises
```

The `exercises` collection will provide a shared exercise library.

### Fields

- `name` — exercise name
- `category` — exercise category
- `muscleGroup` — primary muscle group
- `description` — short exercise description
- `type` — exercise type such as `strength` or `cardio`

These field names align with the existing Exercise Library frontend so its current filtering and search behavior can be preserved when the library moves to Firestore.

Authenticated users may read the shared exercise library.

Normal users should not directly create, update, or delete shared exercise documents. Exercise data should instead be managed through a controlled seed or administrative process.

## Goals Collection

Collection:

```text
goals
```

The `goals` collection will store private fitness goals.

### Fields

- `User_ID` — Firebase UID of the goal owner
- `Metric` — metric being tracked
- `Target` — numeric target value
- `Current_Value` — current progress value
- `Unit` — unit associated with the metric
- `Target_Date` — target completion date
- `Created_At` — Firestore timestamp
- `Updated_At` — Firestore timestamp

Goal documents are private to the authenticated owner.

## Workout History

A separate workout-history collection is not currently required.

Completed workouts will remain in the `workouts` collection with:

- `Completion` set to `true`
- `Completed_At` containing the completion timestamp
- recorded exercise activity remaining on the workout document

This allows completed workout history to reuse the same ownership model and workout structure.

## Measurement and Date Conventions

The project uses the following conventions:

- workout duration: minutes
- exercise or cardio duration: minutes
- weight: pounds
- distance: miles
- scheduled workout date: `YYYY-MM-DD`
- scheduled start time: `HH:MM`
- creation, update, and completion times: Firestore timestamps

## Firestore Queries

Private workout queries use the authenticated Firebase UID:

```js
where('User_ID', '==', currentUser.uid)
```

Private goal queries will use the same ownership pattern.

The shared exercise library can be loaded from Firestore and reused through a Pinia exercise store.

The current owner-only workout query does not require a custom composite index.

If future history or progress queries combine ownership, completion status, and timestamp ordering, the required Firestore composite indexes will be added when those queries are implemented.

## Firestore Security Rules

Firestore Security Rules must match the ownership model documented above.

Private collections such as `workouts` and `goals` should:

- require authentication
- allow private CRUD only when the authenticated UID matches `User_ID`
- prevent users from changing document ownership
- deny unauthenticated access
- deny cross-user access

The shared `exercises` collection should:

- allow authenticated users to read exercise data
- prevent normal users from modifying shared exercise data

Firestore Security Rules provide the actual database security boundary. Client-side filtering, Pinia state, and Vue Router guards are not substitutes for database authorization.

## Build for Production

```sh
npm run build
```

## Lint

```sh
npm run lint
```
