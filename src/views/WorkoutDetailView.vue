<script setup>
import { doc, getDoc, updateDoc } from 'firebase/firestore'
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
const isSavingExercises = ref(false)

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
    selectedExercises.value = (workoutData.Exercises || []).map((exercise) => ({
    ...exercise,

    sets: (exercise.sets || []).map((set) => ({
      reps: set.reps ?? '',
      weight: set.weight ?? '',
    })),

    cardioEntries: (exercise.cardioEntries || []).map((entry) => ({
      distance: entry.distance ?? '',
      duration: entry.duration ?? '',
    })),
  }))
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
function isValidMeasurement(value) {
  return (
    value !== '' &&
    value !== null &&
    value !== undefined &&
    Number.isFinite(Number(value)) &&
    Number(value) >= 0
  )
}

function validateExercises() {
  if (selectedExercises.value.length === 0) {
    errorMessage.value = 'Please add at least one exercise before saving.'
    return false
  }
  for (const exercise of selectedExercises.value) {
    if (isCardioExercise(exercise)) {
      if (exercise.cardioEntries.length === 0) {
        errorMessage.value = `${exercise.name} needs at least one cardio entry.`
        return false
      }

      for (const entry of exercise.cardioEntries) {
        const hasDistance =
          entry.distance !== '' &&
          entry.distance !== null &&
          entry.distance !== undefined

        const hasDuration =
          entry.duration !== '' &&
          entry.duration !== null &&
          entry.duration !== undefined

        if (!hasDistance && !hasDuration) {
          errorMessage.value = 'Enter a distance or duration for cardio.'
          return false
        }

        if (
          (hasDistance && !isValidMeasurement(entry.distance)) ||
          (hasDuration && !isValidMeasurement(entry.duration))
        ) {
          errorMessage.value = 'Cardio measurements must be nonnegative numbers.'
          return false
        }
      }
    } else {
      if (exercise.sets.length === 0) {
        errorMessage.value = `${exercise.name} needs at least one set.`
        return false
      }

      for (const set of exercise.sets) {
        if (!isValidMeasurement(set.reps)) {
          errorMessage.value = 'Reps are required and must be nonnegative numbers.'
          return false
        }

        if (
          set.weight !== '' &&
          set.weight !== null &&
          set.weight !== undefined &&
          !isValidMeasurement(set.weight)
        ) {
          errorMessage.value = 'Weight must be a nonnegative number.'
          return false
        }
      }
    }
  }

  return true
}
async function saveWorkoutExercises() {
  console.log('Save Exercises button clicked!')
  if (isSavingExercises.value) {
    return
  }

  errorMessage.value = ''

  if (!currentUser.value || !workout.value) {
    errorMessage.value = 'Unable to save workout. Please sign in.'
    return
  }

  if (workout.value.User_ID !== currentUser.value.uid) {
    errorMessage.value = 'You do not have permission to edit this workout.'
    return
  }

  if (!validateExercises()) {
    return
  }

  isSavingExercises.value = true

  try {
    const exercisesToSave = selectedExercises.value.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      category: exercise.category || '',
      type: isCardioExercise(exercise) ? 'cardio' : 'strength',

      sets: isCardioExercise(exercise)
        ? []
        : exercise.sets.map((set) => ({
            reps: Number(set.reps),
            weight:
              set.weight === '' || set.weight === null
                ? null
                : Number(set.weight),
          })),

      cardioEntries: isCardioExercise(exercise)
        ? exercise.cardioEntries.map((entry) => ({
            distance:
              entry.distance === '' || entry.distance === null
                ? null
                : Number(entry.distance),

            duration:
              entry.duration === '' || entry.duration === null
                ? null
                : Number(entry.duration),
          }))
        : [],
    }))

    await updateDoc(doc(db, 'workouts', workoutId), {
      Exercises: exercisesToSave,
    })

    workout.value.Exercises = exercisesToSave

    errorMessage.value = ''
  } catch (error) {
    console.error('Error saving workout exercises:', error)
    errorMessage.value = 'Unable to save exercises. Please try again.'
  } finally {
    isSavingExercises.value = false
  }
}
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
  <main class="workout-page">
    <h1>Workout Details</h1>

    <p v-if="isLoading">Loading workout...</p>

    <p v-else-if="errorMessage && !workout">
      {{ errorMessage }}
    </p>

    <section v-else-if="workout" class="workout-container">

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <div class="workout-header">
        <h2>{{ workout.Workout_name }}</h2>

        <p>Date: {{ workout.Date }}</p>
        <p>Start Time: {{ workout.Start_Time }}</p>
        <p>Duration: {{ workout.Duration }} minutes</p>
        <p>Notes: {{ workout.Notes }}</p>
      </div>

      <section class="add-exercise-section">

        <h3>Add Exercises to Workout</h3>

        <div class="exercise-search">

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search exercises..."
          />

          <select
            v-model="selectedExerciseId"
            :disabled="exercisesLoading"
          >
            <option value="" disabled>Select an exercise</option>

            <option
              v-for="exercise in filteredExercises"
              :key="exercise.id"
              :value="exercise.id"
            >
              {{ exercise.name }}
              ({{ isCardioExercise(exercise) ? 'Cardio' : 'Strength' }})
            </option>
          </select>

          <button
            type="button"
            @click="addExercise"
            :disabled="!selectedExerciseId"
          >
            Add Exercise
          </button>

        </div>

        <p v-if="exercisesLoading">Loading exercises...</p>

      </section>

    <section class="selected-exercises-section">

  <h3>Selected Exercises</h3>

  <p v-if="selectedExercises.length === 0">
    No exercises added yet.
  </p>

  <div
    v-for="exercise in selectedExercises"
    :key="exercise.id"
    class="exercise-card"
  >

    <h4>{{ exercise.name }}</h4>

    <p class="exercise-category">
      Category: {{ exercise.category }}
    </p>
    <div v-if="!isCardioExercise(exercise)" class="strength-section">

      <h5>Strength Sets</h5>

      <div
        v-for="(set, index) in exercise.sets"
        :key="index"
        class="measurement-row"
      >

        <h6>Set {{ index + 1 }}</h6>

        <div class="measurement-inputs">

          <label>
            Reps (reps):
            <input
              v-model.number="set.reps"
              type="number"
              min="0"
              step="any"
            />
          </label>

          <label>
            Weight (lbs, optional):
            <input
              v-model.number="set.weight"
              type="number"
              min="0"
              step="any"
            />
          </label>

          <button
            type="button"
            @click="removeSet(exercise, index)"
            class="remove-button"
          >
            Remove Set
          </button>

        </div>
      </div>

      <button
        type="button"
        @click="addSet(exercise)"
        class="add-button"
      >
        + Add Set
      </button>

    </div>
    <div v-else-if="isCardioExercise(exercise)" class="cardio-section">

      <h5>Cardio Entries</h5>

      <div
        v-for="(entry, index) in exercise.cardioEntries"
        :key="index"
        class="measurement-row"
      >

        <h6>Entry {{ index + 1 }}</h6>

        <div class="measurement-inputs">

          <label>
            Distance (mi):
            <input
              v-model.number="entry.distance"
              type="number"
              min="0"
              step="any"
            />
          </label>

          <label>
            Duration (min):
            <input
              v-model.number="entry.duration"
              type="number"
              min="0"
              step="any"
            />
          </label>

          <button
            type="button"
            @click="removeCardioEntry(exercise, index)"
            class="remove-button"
          >
            Remove Entry
          </button>

        </div>
      </div>

      <button
        type="button"
        @click="addCardioEntry(exercise)"
        class="add-button"
      >
        + Add Cardio Entry
      </button>

    </div>

    <button
      type="button"
      @click="removeExercise(exercise.id)"
      class="remove-exercise-button"
    >
      Remove Exercise
    </button>

  </div>

</section>

    <hr />
<div class="workout-actions">

        <button
          type="button"
          @click="saveWorkoutExercises"
          :disabled="isSavingExercises"
          class="save-button"
        >
          {{ isSavingExercises ? 'Saving Exercises...' : 'Save Exercises' }}
        </button>

        <button
          type="button"
          @click="router.push({ name: 'workouts' })"
          class="back-button"
        >
          Back to Workouts
        </button>

      </div>

    </section>
  </main>
</template>

<style scoped>
.workout-page {
  min-height: 100vh;
  padding: 40px 24px;
  background: #f5f7f6;
  color: #26352e;
  font-family: Arial, sans-serif;
}

.workout-container {
  max-width: 1000px;
  margin: 0 auto;
}

.workout-page h1 {
  font-size: 32px;
  margin-bottom: 30px;
  color: #263d32;
}

.workout-page h2 {
  font-size: 25px;
  margin-bottom: 12px;
}

.workout-page h3 {
  font-size: 20px;
  margin-top: 32px;
  margin-bottom: 16px;
}

.workout-page h4 {
  font-size: 19px;
  margin-top: 0;
}

.workout-container > p {
  color: #66756c;
  margin: 8px 0;
  line-height: 1.6;
}

.exercise-search {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.exercise-search input,
.exercise-search select {
  padding: 11px 14px;
  border: 1px solid #d5ded8;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.exercise-search input {
  flex: 2;
  min-width: 180px;
}

.exercise-search select {
  flex: 1;
  min-width: 180px;
}

.exercise-card {
  background: white;
  border: 1px solid #e1e8e3;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(30, 60, 40, 0.04);
}

.exercise-card h5 {
  color: #52745e;
  font-size: 15px;
  margin-top: 22px;
}

.workout-page input[type="number"] {
  padding: 9px 12px;
  border: 1px solid #d5ded8;
  border-radius: 7px;
  font-size: 14px;
  width: 110px;
}

.workout-page input:focus,
.workout-page select:focus {
  outline: 2px solid #91b69b;
  border-color: #668f70;
}

.workout-page button {
  padding: 10px 16px;
  border: none;
  border-radius: 7px;
  background: #527b60;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.workout-page button:hover {
  background: #3d624a;
}

.workout-page button:disabled {
  background: #c5cec8;
  cursor: not-allowed;
}

.exercise-card button {
  margin: 5px;
}

.workout-page hr {
  border: none;
  border-top: 1px solid #dce4de;
  margin: 30px 0;
}

.workout-page > button,
.workout-container > button {
  margin-right: 10px;
}

@media (max-width: 600px) {
  .workout-page {
    padding: 24px 14px;
  }

  .exercise-search {
    flex-direction: column;
  }

  .exercise-search input,
  .exercise-search select {
    width: 100%;
    box-sizing: border-box;
  }

  .exercise-card {
    padding: 16px;
  }

  .workout-page input[type="number"] {
    max-width: 100%;
    box-sizing: border-box;
  }
}
.workout-header {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e1e8e3;
  margin-bottom: 30px;
}

.add-exercise-section {
  margin-bottom: 30px;
}

.selected-exercises-section {
  margin-top: 30px;
}

.exercise-category {
  color: #718078;
  font-size: 14px;
}

.measurement-row {
  background: #f7f9f7;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.measurement-inputs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.measurement-inputs label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}

.add-button {
  margin-top: 8px;
}

.remove-button,
.remove-exercise-button {
  background: #f1e6e4 !important;
  color: #9b4940 !important;
}

.remove-button:hover,
.remove-exercise-button:hover {
  background: #e8d2ce !important;
}

.remove-exercise-button {
  margin-top: 18px;
}

.workout-actions {
  display: flex;
  gap: 12px;
  margin-top: 25px;
  flex-wrap: wrap;
}

.save-button {
  background: #527b60 !important;
}

.back-button {
  background: #e5ebe6 !important;
  color: #344b3a !important;
}

.error-message {
  color: #b33d35;
  background: #fbeeed;
  padding: 12px;
  border-radius: 8px;
}
</style>
