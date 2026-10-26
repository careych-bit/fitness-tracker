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

  workouts.value = []

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
  }
}

async function deleteWorkout(workoutId) {
  const confirmed = confirm('Are you sure you want to delete this workout?')

  if (!confirmed) {
    return
  }

  try {
    await deleteDoc(doc(db, 'workouts', workoutId))

    await loadWorkouts()
  } catch (error) {
    console.error(error)
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

      <button type="submit">
        {{ editingWorkoutId ? 'Save Changes' : 'Add Workout' }}
      </button>
    </form>

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
