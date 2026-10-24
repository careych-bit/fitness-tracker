<script setup>
import { computed, ref } from 'vue'

const selectedCategory = ref('All')

const searchQuery = ref('')

const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio']

const exercises = [
  {
    id: 1,
    name: 'Bench Press',
    category: 'Chest',
    muscleGroup: 'Chest',
    description: 'Barbell press focused on the chest, shoulders, and triceps.',
  },
  {
    id: 2,
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    muscleGroup: 'Upper Chest',
    description: 'Incline pressing exercise focused on the upper chest, shoulders, and triceps.',
  },
  {
    id: 3,
    name: 'Push-Up',
    category: 'Chest',
    muscleGroup: 'Chest',
    description: 'Bodyweight pressing exercise focused on the chest, shoulders, and triceps.',
  },
  {
    id: 4,
    name: 'Deadlift',
    category: 'Back',
    muscleGroup: 'Posterior Chain',
    description: 'Compound lift focused on the back, glutes, hamstrings, and core.',
  },
  {
    id: 5,
    name: 'Barbell Row',
    category: 'Back',
    muscleGroup: 'Upper Back',
    description: 'Compound pulling exercise focused on the upper back and biceps.',
  },
  {
    id: 6,
    name: 'Lat Pulldown',
    category: 'Back',
    muscleGroup: 'Lats',
    description: 'Cable pulling exercise focused on the latissimus dorsi and biceps.',
  },
  {
    id: 7,
    name: 'Squat',
    category: 'Legs',
    muscleGroup: 'Quadriceps',
    description: 'Compound lower-body exercise focused on the quads, glutes, and core.',
  },
  {
    id: 8,
    name: 'Leg Press',
    category: 'Legs',
    muscleGroup: 'Quadriceps',
    description: 'Machine-based lower-body exercise focused on the quadriceps and glutes.',
  },
  {
    id: 9,
    name: 'Romanian Deadlift',
    category: 'Legs',
    muscleGroup: 'Hamstrings',
    description: 'Hip-hinge exercise focused on the hamstrings, glutes, and lower back.',
  },
  {
    id: 10,
    name: 'Shoulder Press',
    category: 'Shoulders',
    muscleGroup: 'Shoulders',
    description: 'Overhead pressing movement focused on the shoulders and triceps.',
  },
  {
    id: 11,
    name: 'Lateral Raise',
    category: 'Shoulders',
    muscleGroup: 'Side Delts',
    description: 'Isolation exercise focused on the lateral portion of the shoulders.',
  },
  {
    id: 12,
    name: 'Bicep Curl',
    category: 'Arms',
    muscleGroup: 'Biceps',
    description: 'Isolation exercise focused on the biceps.',
  },
  {
    id: 13,
    name: 'Tricep Pushdown',
    category: 'Arms',
    muscleGroup: 'Triceps',
    description: 'Cable exercise focused on extending the elbow and training the triceps.',
  },
  {
    id: 14,
    name: 'Plank',
    category: 'Core',
    muscleGroup: 'Core',
    description: 'Static core exercise focused on abdominal and trunk stability.',
  },
  {
    id: 15,
    name: 'Crunch',
    category: 'Core',
    muscleGroup: 'Abdominals',
    description: 'Bodyweight exercise focused primarily on the abdominal muscles.',
  },
  {
    id: 16,
    name: 'Running',
    category: 'Cardio',
    muscleGroup: 'Cardiovascular',
    description: 'Cardiovascular exercise that can be tracked by distance, time, or pace.',
  },
  {
    id: 17,
    name: 'Cycling',
    category: 'Cardio',
    muscleGroup: 'Cardiovascular',
    description: 'Low-impact cardiovascular exercise that can be tracked by distance or duration.',
  },
]

const filteredExercises = computed(() => {
  return exercises.filter((exercise) => {
    const matchesCategory =
      selectedCategory.value === 'All' || exercise.category === selectedCategory.value

    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      exercise.muscleGroup.toLowerCase().includes(searchQuery.value.toLowerCase())

    return matchesCategory && matchesSearch
  })
})
</script>

<template>
  <main class="exercise-library">
    <header class="page-header">
      <h1>Exercise Library</h1>
      <p>Browse exercises by category and muscle group.</p>
    </header>

    <section class="exercise-filters">
      <label for="search">Search:</label>

      <input id="search" v-model="searchQuery" type="text" placeholder="Search exercises..." />

      <label for="category">Filter by category:</label>

      <select id="category" v-model="selectedCategory">
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </section>

    <section class="exercise-grid">
      <article v-for="exercise in filteredExercises" :key="exercise.id" class="exercise-card">
        <h2>{{ exercise.name }}</h2>
        <p class="exercise-category">
          {{ exercise.category }}
        </p>
        <p>
          <strong>Muscle Group:</strong>
          {{ exercise.muscleGroup }}
        </p>
        <p>{{ exercise.description }}</p>
      </article>
    </section>
  </main>
</template>
