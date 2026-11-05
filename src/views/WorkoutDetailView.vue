<script setup>
import { doc, getDoc } from 'firebase/firestore'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { db } from '@/firebase'
import { useAuthStore } from '@/stores/authStore'
import { useExerciseStore } from '@/stores/exerciseStore'

const route = useRoute()
const router = useRouter()

const workoutId = String(route.params.id)

const authStore = useAuthStore()
const { user: currentUser } = storeToRefs(authStore)
const exerciseStore = useExerciseStore()
const { exercises, isLoading: exercisesLoading } = storeToRefs(exerciseStore)
const workout = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const selectedExerciseId = ref('')
const searchQuery = ref('')
const selectedExercises = ref([])

async function loadWorkout() {
  if (!currentUser.value) {
    errorMessage.value = 'Please sign in to view this workout.'
    return
  }

  try {
    const workoutRef = doc(db, 'workouts', workoutId)
    const workoutSnapshot = await getDoc(workoutRef)

    if (!workoutSnapshot.exists()) {
      errorMessage.value = 'Workout not found.'
      return
    }

    const workoutData = workoutSnapshot.data()
    if (workoutData.User_ID !== currentUser.value.uid) {
      errorMessage.value = 'You do not have permission to view this workout.'
      return
    }

    workout.value = {
      Workout_ID: workoutSnapshot.id,
      ...workoutData,
    }
  } catch (error) {
    console.error('Error loading workout:', error)
    errorMessage.value = 'Unable to load workout details.'
  }
}

async function loadPage() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await Promise.all([
      loadWorkout(),
      exerciseStore.fetchExercises(),
    ])
  } finally {
    isLoading.value = false
  }
}

onMounted(loadPage)


const filteredExercises = computed(() => {
  return exercises.value.filter((exercise) => {
    return (
      exercise.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      exercise.muscleGroup.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})
function isCardioExercise(exercise) {
  return (
    exercise.type?.toLowerCase() === 'cardio' ||
    exercise.category?.toLowerCase() === 'cardio'
  )
}
function addExercise() {
  const exercise = exercises.value.find(
    (exercise) => exercise.id === selectedExerciseId.value,
  )

  if (!exercise) {
    return
  }

  const alreadyAdded = selectedExercises.value.some(
    (item) => item.id === exercise.id,
  )

  if (alreadyAdded) {
    errorMessage.value = 'This exercise has already been added.'
    return
  }

  selectedExercises.value.push({
  ...exercise,
  sets: isCardioExercise(exercise)
    ? []
    : [{ reps: '', weight: '' }],
  cardioEntries: isCardioExercise(exercise)
    ? [{ distance: '', duration: '' }]
    : [],
  })

  selectedExerciseId.value = ''
  errorMessage.value = ''
}
function removeExercise(exerciseId) {
  selectedExercises.value = selectedExercises.value.filter(
    (exercise) => exercise.id !== exerciseId,
  )
}

function addSet(exercise) {
  exercise.sets.push({
    reps: '',
    weight: '',
  })
}

function removeSet(exercise, index) {
  exercise.sets.splice(index, 1)
}

function addCardioEntry(exercise) {
  exercise.cardioEntries.push({
    distance: '',
    duration: '',
  })
}

function removeCardioEntry(exercise, index) {
  exercise.cardioEntries.splice(index, 1)
}
</script>

<template>
  <main>
    <h1>Workout Details</h1>

    <p v-if="isLoading">Loading workout...</p>

    <p v-else-if="errorMessage">
      {{ errorMessage }}
    </p>

    <section v-else-if="workout">
      <h2>{{ workout.Workout_name }}</h2>

      <p>Date: {{ workout.Date }}</p>
      <p>Start Time: {{ workout.Start_Time }}</p>
      <p>Duration: {{ workout.Duration }} minutes</p>
      <p>Notes: {{ workout.Notes }}</p>

      <h3>Add Exercises to Workout</h3>
      <input v-model="searchQuery" type="text" placeholder="Search exercises..."/>
      <p v-if="exercisesLoading">Loading exercises...</p>
      <select v-model="selectedExerciseId" :disabled="exercisesLoading">
      <option value="" disabled>Select an exercise</option>
      <option v-for="exercise in filteredExercises" :key="exercise.id" :value="exercise.id">
      {{ exercise.name }} ({{ isCardioExercise(exercise) ? 'Cardio' : 'Strength' }})</option></select>
      <button type="button" @click="addExercise" :disabled="!selectedExerciseId">
      Add Exercise
      </button>

      <h3>Selected Exercises</h3>

      <p v-if="selectedExercises.length === 0">
      No exercises added yet.
      </p>

    <div v-for="exercise in selectedExercises" :key="exercise.id">
  <h4>{{ exercise.name }}</h4>

  <p>Category: {{ exercise.category }}</p>

  <div v-if="!isCardioExercise(exercise)">
  <h5>Strength Sets</h5>

  <div v-for="(set, index) in exercise.sets" :key="index">
    <h6>Set {{ index + 1 }}</h6>

    <label>Reps:</label>
    <input v-model="set.reps" type="number" min="0" />

    <label>Weight (lbs):</label>
    <input v-model="set.weight" type="number" min="0" />

    <button type="button" @click="removeSet(exercise, index)">
      Remove Set
    </button>
  </div>

  <button type="button" @click="addSet(exercise)">
    Add Set
  </button>
</div>

  <div v-else-if="isCardioExercise(exercise)">
  <h5>Cardio Entries</h5>

  <div v-for="(entry, index) in exercise.cardioEntries" :key="index">
    <h6>Entry {{ index + 1 }}</h6>

    <label>Distance (mi):</label>
    <input v-model="entry.distance" type="number" min="0" />

    <label>Duration (min):</label>
    <input v-model="entry.duration" type="number" min="0" />

    <button type="button" @click="removeCardioEntry(exercise, index)">
      Remove Entry
    </button>
  </div>

  <button type="button" @click="addCardioEntry(exercise)">
    Add Cardio Entry
  </button>
</div>

  <button type="button" @click="removeExercise(exercise.id)">
    Remove Exercise
  </button>
</div>

    <hr />

    <button type="button" @click="router.push({ name: 'workouts' })">
    Back to Workouts
  </button>
</section>
  </main>
</template>
