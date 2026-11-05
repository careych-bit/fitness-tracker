<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useExerciseStore } from '../stores/exerciseStore'

const exerciseStore = useExerciseStore()
const { exercises, isLoading, errorMessage } = storeToRefs(exerciseStore)

const selectedCategory = ref('All')
const searchQuery = ref('')

const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio']

const filteredExercises = computed(() => {
  return exercises.value.filter((exercise) => {
    const matchesCategory =
      selectedCategory.value === 'All' || exercise.category === selectedCategory.value

    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      exercise.muscleGroup.toLowerCase().includes(searchQuery.value.toLowerCase())

    return matchesCategory && matchesSearch
  })
})

onMounted(() => {
  exerciseStore.fetchExercises()
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

    <p v-if="isLoading" class="exercise-status">Loading exercises...</p>

    <p v-else-if="errorMessage" class="exercise-status">
      {{ errorMessage }}
    </p>

    <p v-else-if="filteredExercises.length === 0" class="no-results">
      No exercises match your search.
    </p>

    <section v-else class="exercise-grid">
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

<style scoped>
.exercise-library {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
}

.exercise-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}

.exercise-filters input,
.exercise-filters select {
  padding: 0.65rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font: inherit;
}

.exercise-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.exercise-card {
  padding: 1.25rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.exercise-card h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.exercise-category {
  display: inline-block;
  margin: 0 0 0.75rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

.no-results {
  margin-top: 2rem;
}

@media (max-width: 900px) {
  .exercise-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .exercise-grid {
    grid-template-columns: 1fr;
  }

  .exercise-filters {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
