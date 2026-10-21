<script setup lang="ts">
interface Workout {
  Workout_ID: string;
  User_ID: string;
  Workout_name: string;
  Date: string; // Consider using Date type if needed
  Start_Time: string; // Consider using Date type if needed
  Duration: number; // Duration in minutes or seconds
  Completion: boolean;
  Notes?: string; // Optional field
}

import { ref } from 'vue';
const workoutName = ref("");
const scheduledDate = ref("");
const startTime = ref("");
const duration = ref(0);
const completion = ref(false);
const notes = ref("");

function addWorkout() {
  if (!workoutName.value || !scheduledDate.value || !startTime.value || duration.value <= 0) {
    console.error("Please fill in all required fields.");
    return;
  }

  const newWorkout: Workout = {
    Workout_ID: generateUniqueId(), // Implement a function to generate unique IDs
    User_ID: getCurrentUserId(), // Implement a function to get the current user's ID
    Workout_name: workoutName.value,
    Date: scheduledDate.value,
    Start_Time: startTime.value,
    Duration: duration.value,
    Completion: completion.value,
    Notes: notes.value || undefined
  };
}

// TODO 3 (Create Workout):
// Implement addWorkout().
// - Validate required fields
// - Create a new workout object
// - Associate it with the current user
// - Add it to the workout list
// - Clear the form after submission

// TODO 4 (Read Workouts):
// Implement functionality to retrieve workouts.
// - Load workouts belonging to the current user
// - Display workouts in the workout list

// TODO 5 (Edit Workout):
// Allow users to edit existing workouts.
// - Select a workout
// - Populate the form with its current values
// - Save updated information

// TODO 6 (Delete Workout):
// Implement deleteWorkout().
// - Select a workout to delete
// - Ask for confirmation
// - Remove it if confirmed

// TODO 7 (Workout Completion):
// Allow users to mark workouts as completed.
// - Update the Completion field
// - Reflect changes in the interface

// TODO 8 (Firestore Integration):
// Connect workout CRUD operations to Firestore.
// - Create workout documents
// - Read workout documents
// - Update workout documents
// - Delete workout documents
// - Use Firestore-generated document IDs

// TODO 9 (User Authentication):
// Use Firebase Authentication to identify the user.
// - Associate workouts with the user's UID
// - Only query workouts owned by that user
// - Enforce ownership using Firestore security rules
// - Test with two different accounts

// TODO 10 (Loading and Error Handling):
// - Track loading states during database operations
// - Handle failed operations
// - Display helpful error messages
</script>

<template>
  <main>
    <h1>Workouts</h1>

    <!-- TODO 11 (Workout Form):
        Create inputs for:
        - Workout name
        - Date
        - Start time
        - Duration
        - Completion status
        - Notes

        Use v-model to bind the inputs.
        Handle form submission.
    -->

    <!-- TODO 12 (Workout List):
        Display the current user's workouts.
        - Use v-for
        - Display workout details
        - Include Edit and Delete buttons
        - Allow completion status changes
    -->

    <!-- TODO 13 (Conditional Rendering):
        - Display a message if no workouts exist
        - Show loading feedback
        - Show errors when operations fail
    -->
  </main>
</template>

