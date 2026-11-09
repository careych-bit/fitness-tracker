<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '@/firebase'
import { useAuthStore } from '@/stores/authStore'

const workoutName = ref('')
const scheduledDate = ref('')
const startTime = ref('')
const duration = ref(0)
const completion = ref(false)
const notes = ref('')
const workouts = ref([])
const editingWorkoutId = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const isSaving = ref(false)
const deletingWorkoutId = ref(null)

const authStore = useAuthStore()
const { user: currentUser } = storeToRefs(authStore)

watch(
  currentUser,
  (user) => {
    if (user) {
      loadWorkouts()
    } else {
      workouts.value = []
    }
  },
  { immediate: true },
)

async function loadWorkouts() {
  if (!currentUser.value) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  workouts.value = []

  try {
    const q = query(collection(db, 'workouts'), where('User_ID', '==', currentUser.value.uid))

    const qs = await getDocs(q)

    qs.forEach((qd) => {
      const workoutData = qd.data()

      workouts.value.push({
        Workout_ID: qd.id,
        User_ID: workoutData.User_ID,
        Workout_name: workoutData.Workout_name,
        Date: workoutData.Date,
        Start_Time: workoutData.Start_Time,
        Duration: workoutData.Duration,
        Completion: workoutData.Completion,
        Notes: workoutData.Notes,
      })
    })
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Unable to load workouts. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function validateWorkout() {
  if (workoutName.value.trim() === '') {
    alert('Please enter a workout name.')
    return false
  }

  if (workoutName.value.length > 50) {
    alert('Workout name must be 50 characters or fewer.')
    return false
  }

  if (scheduledDate.value.trim() === '') {
    alert('Please select a date.')
    return false
  }

  if (startTime.value.trim() === '') {
    alert('Please select a start time.')
    return false
  }

  if (duration.value <= 0) {
    alert('Please enter a valid duration.')
    return false
  }

  return true
}
async function addWorkout() {
  if (!validateWorkout()) {
    return
  }
  if (!currentUser.value) {
    alert('Please sign in.')
    return
  }

  errorMessage.value = ''
  isSaving.value = true
  try {
    await addDoc(collection(db, 'workouts'), {
      User_ID: currentUser.value.uid,
      Workout_name: workoutName.value,
      Date: scheduledDate.value,
      Start_Time: startTime.value,
      Duration: duration.value,
      Completion: completion.value,
      Notes: notes.value,
    })

    workoutName.value = ''
    scheduledDate.value = ''
    startTime.value = ''
    duration.value = 0
    completion.value = false
    notes.value = ''

    await loadWorkouts()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Unable to create the workout. Please try again.'
  } finally {
    isSaving.value = false
  }
}

function editWorkout(workout) {
  editingWorkoutId.value = workout.Workout_ID
  workoutName.value = workout.Workout_name
  scheduledDate.value = workout.Date
  startTime.value = workout.Start_Time
  duration.value = workout.Duration
  completion.value = workout.Completion
  notes.value = workout.Notes || ''
}

async function updateWorkout() {
  if (!validateWorkout()) {
    return
  }

  if (!editingWorkoutId.value) {
    return
  }

  errorMessage.value = ''
  isSaving.value = true
  try {
    await updateDoc(doc(db, 'workouts', editingWorkoutId.value), {
      Workout_name: workoutName.value,
      Date: scheduledDate.value,
      Start_Time: startTime.value,
      Duration: duration.value,
      Completion: completion.value,
      Notes: notes.value,
    })

    editingWorkoutId.value = null

    workoutName.value = ''
    scheduledDate.value = ''
    startTime.value = ''
    duration.value = 0
    completion.value = false
    notes.value = ''

    await loadWorkouts()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Unable to update the workout. Please try again.'
  } finally {
    isSaving.value = false
  }
}

async function deleteWorkout(workoutId) {
  const confirmed = confirm('Are you sure you want to delete this workout?')

  if (!confirmed) {
    return
  }

  errorMessage.value = ''
  deletingWorkoutId.value = workoutId

  try {
    await deleteDoc(doc(db, 'workouts', workoutId))

    await loadWorkouts()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Unable to delete the workout. Please try again.'
  } finally {
    deletingWorkoutId.value = null
  }
}
</script>

<template>
  <main>
    <h1>Workouts</h1>

    <form @submit.prevent="editingWorkoutId ? updateWorkout() : addWorkout()">
      <label for="workoutName">Workout Name:</label>
      <input id="workoutName" v-model="workoutName" type="text" required maxlength="50" />

      <label for="scheduledDate">Date:</label>
      <input id="scheduledDate" v-model="scheduledDate" type="date" required />

      <label for="startTime">Start Time:</label>
      <input id="startTime" v-model="startTime" type="time" required />

      <label for="duration">Duration (minutes):</label>
      <input id="duration" v-model.number="duration" type="number" min="1" max="180" required />

      <label for="completion">Completed:</label>
      <input id="completion" v-model="completion" type="checkbox" />

      <label for="notes">Notes:</label>
      <textarea id="notes" v-model="notes" maxlength="200"></textarea>

      <button type="submit" :disabled="isSaving">
        {{
          isSaving
            ? editingWorkoutId
              ? 'Saving Changes...'
              : 'Adding Workout...'
            : editingWorkoutId
              ? 'Save Changes'
              : 'Add Workout'
        }}
      </button>
    </form>

    <p v-if="isLoading">Loading workouts...</p>

    <p v-else-if="errorMessage">
      {{ errorMessage }}
    </p>

    <p v-else-if="workouts.length === 0">No workouts yet. Create your first workout above.</p>

    <div v-else v-for="workout in workouts" :key="workout.Workout_ID">
      <h3>{{ workout.Workout_name }}</h3>
      <p>Date: {{ workout.Date }}</p>
      <p>Start Time: {{ workout.Start_Time }}</p>
      <p>Duration: {{ workout.Duration }} minutes</p>
      <p>Completed: {{ workout.Completion ? 'Yes' : 'No' }}</p>
      <p>Notes: {{ workout.Notes }}</p>

      <RouterLink :to="`/workout/${workout.Workout_ID}`"> View Workout </RouterLink>

      <button type="button" @click="editWorkout(workout)">Edit</button>

      <button
        type="button"
        :disabled="deletingWorkoutId === workout.Workout_ID"
        @click="deleteWorkout(workout.Workout_ID)"
      >
        {{ deletingWorkoutId === workout.Workout_ID ? 'Deleting...' : 'Delete' }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.workouts-page {
  min-height: 100vh;
  padding: 40px 24px;
  background: #f5f7f6;
  color: #26352e;
  font-family: Arial, sans-serif;
}

.workouts-container {
  max-width: 1100px;
  margin: 0 auto;
}

.workouts-page h1 {
  font-size: 32px;
  color: #263d32;
  margin-bottom: 30px;
}

.workouts-page h2 {
  font-size: 21px;
  margin-bottom: 20px;
}

/* Workout form */
.workout-form-section {
  background: white;
  padding: 28px;
  border: 1px solid #e1e8e3;
  border-radius: 12px;
  margin-bottom: 35px;
}

.workout-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field label,
.completion-field label {
  font-size: 14px;
  font-weight: 600;
}

.form-field input,
.form-field textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 11px;
  border: 1px solid #d5ded8;
  border-radius: 7px;
  font-size: 14px;
  font-family: Arial, sans-serif;
}

.form-field textarea {
  min-height: 80px;
  resize: vertical;
}

.notes-field,
.form-actions {
  grid-column: span 2;
}

.completion-field {
  display: flex;
  align-items: center;
  gap: 9px;
}

.completion-field input {
  accent-color: #527b60;
}

.form-actions button {
  padding: 11px 20px;
  background: #527b60;
  color: white;
  border: none;
  border-radius: 7px;
  font-weight: 600;
  cursor: pointer;
}

.form-actions button:hover {
  background: #3d624a;
}

.form-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Workout cards */
.workout-list-section {
  margin-top: 30px;
}

.workout-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.workout-card {
  background: white;
  border: 1px solid #e1e8e3;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 2px 8px rgba(30, 60, 40, 0.04);
}

.workout-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.workout-card-header h3 {
  font-size: 19px;
}

.completed-badge,
.pending-badge {
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.completed-badge {
  background: #e3f0e5;
  color: #3d7049;
}

.pending-badge {
  background: #f1eee2;
  color: #89743d;
}

.workout-card-details {
  color: #66756c;
  font-size: 14px;
  line-height: 1.6;
}

.workout-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.workout-card-actions button {
  padding: 9px 13px;
  border: none;
  border-radius: 7px;
  font-weight: 600;
  cursor: pointer;
}

.details-button {
  background: #527b60;
  color: white;
}

.edit-button {
  background: #e5ebe6;
  color: #344b3a;
}

.delete-button {
  background: #f1e6e4;
  color: #9b4940;
}

.workout-card-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Messages */
.empty-message,
.status-message {
  background: white;
  padding: 20px;
  border-radius: 10px;
  color: #66756c;
}

.error-message {
  background: #fbeeed;
  color: #b33d35;
  padding: 12px;
  border-radius: 8px;
}

.workouts-page input:focus,
.workouts-page textarea:focus {
  outline: 2px solid #91b69b;
  border-color: #668f70;
}

@media (max-width: 700px) {
  .workouts-page {
    padding: 24px 14px;
  }

  .workout-form {
    grid-template-columns: 1fr;
  }

  .notes-field,
  .form-actions {
    grid-column: span 1;
  }

  .workout-grid {
    grid-template-columns: 1fr;
  }

  .workout-form-section {
    padding: 18px;
  }
}
</style>
