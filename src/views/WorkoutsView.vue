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
const workouts = ref<Workout[]>([]);
const editingWorkoutId = ref<string | null>(null);

function addWorkout() {
  if (workoutName.value.trim() === "") {
  alert("Please enter a workout name.");
  return;
}
if (workoutName.value.length > 50) {
  alert("Workout name must be 50 characters or fewer.");
  return;
}
  if (scheduledDate.value.trim() === "") {
    alert("Please select a date.");
    return;
  }
  if (startTime.value.trim() === "") {
    alert("Please select a start time.");
    return;
  }
  if (duration.value <= 0) {
    alert("Please enter a valid duration.");
    return;
  }
  const newWorkout: Workout = {
    Workout_ID: "temporary-id", // This should be generated uniquely
    User_ID: "temporary-user",
    Workout_name: workoutName.value,
    Date: scheduledDate.value,
    Start_Time: startTime.value,
    Duration: duration.value,
    Completion: completion.value,
    Notes: notes.value
  };
  workouts.value.push(newWorkout);

  workoutName.value = "";
  scheduledDate.value = "";
  startTime.value = "";
  duration.value = 0;
  completion.value = false;
  notes.value = "";
}



// TODO 4 (Read Workouts):
// Implement functionality to retrieve workouts.
// - Load workouts belonging to the current user
// - Display workouts in the workout list


function editWorkout(workout: Workout) {
  editingWorkoutId.value = workout.Workout_ID;
  workoutName.value = workout.Workout_name;
  scheduledDate.value = workout.Date;
  startTime.value = workout.Start_Time;
  duration.value = workout.Duration;
  completion.value = workout.Completion;
  notes.value = workout.Notes || "";
}
// TODO 5 (Edit Workout):
// Allow users to edit existing workouts.
// - Select a workout
// - Populate the form with its current values
// - Save updated information

function updateWorkout() {
  if (editingWorkoutId.value) {
    const workoutIndex = workouts.value.findIndex(
      (w) => w.Workout_ID === editingWorkoutId.value
    );
    if (workoutIndex !== -1) {
      workouts.value[workoutIndex] = {
        Workout_ID: editingWorkoutId.value,
        User_ID: "temporary-user", // This should be the actual user ID
        Workout_name: workoutName.value,
        Date: scheduledDate.value,
        Start_Time: startTime.value,
        Duration: duration.value,
        Completion: completion.value,
        Notes: notes.value
      };
      editingWorkoutId.value = null;
      workoutName.value = "";
      scheduledDate.value = "";
      startTime.value = "";
      duration.value = 0;
      completion.value = false;
      notes.value = "";
    }
  }
}

function deleteWorkout(workoutId: string) {
  const confirmed = confirm("Are you sure you want to delete this workout?");
  if (confirmed) {
    workouts.value = workouts.value.filter(
      (workout) => workout.Workout_ID !== workoutId
    );
  }
}
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

    <form @submit.prevent="editingWorkoutId ? updateWorkout() : addWorkout()">

      <label for="workoutName">Workout Name:</label>
      <input
        id="workoutName"
        v-model="workoutName"
        type="text"
        required
        maxlength="50"
      />

      <label for="scheduledDate">Date:</label>
      <input
        id="scheduledDate"
        v-model="scheduledDate"
        type="date"
        required
      />

      <label for="startTime">Start Time:</label>
      <input
        id="startTime"
        v-model="startTime"
        type="time"
        required
      />

      <label for="duration">Duration (minutes):</label>
      <input
        id="duration"
        v-model.number="duration"
        type="number"
        min="1"
        max="180"
        required
      />

      <label for="completion">Completed:</label>
      <input
        id="completion"
        v-model="completion"
        type="checkbox"
      />

      <label for="notes">Notes:</label>
      <textarea
        id="notes"
        v-model="notes"
        maxlength="200"
      ></textarea>

      // Submit button for adding OR editing
      <button type="submit">
        {{ editingWorkoutId ? 'Save Changes' : 'Add Workout' }}
      </button>

    </form>

    // Display existing workouts
    <div v-for="workout in workouts" :key="workout.Workout_ID">
      <h3>{{ workout.Workout_name }}</h3>
      <p>Date: {{ workout.Date }}</p>
      <p>Start Time: {{ workout.Start_Time }}</p>
      <p>Duration: {{ workout.Duration }} minutes</p>
      <p>Completed: {{ workout.Completion ? 'Yes' : 'No' }}</p>
      <p>Notes: {{ workout.Notes }}</p>

      <button type="button" @click="editWorkout(workout)">Edit</button>
      <button type="button" @click="deleteWorkout(workout.Workout_ID)">Delete</button>
    </div>

  </main>
</template>
