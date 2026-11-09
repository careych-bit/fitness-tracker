import { collection, getDocs } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { db } from '../firebase'

export interface Exercise {
  id: string
  name: string
  category: string
  muscleGroup: string
  description: string
  type: string
}

export const useExerciseStore = defineStore('exercises', () => {
  const exercises = ref<Exercise[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const loaded = ref(false)

  async function fetchExercises() {
    if (loaded.value || isLoading.value) {
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      const snapshot = await getDocs(collection(db, 'exercises'))

      exercises.value = snapshot.docs.map((document) => ({
        id: document.id,
        ...(document.data() as Omit<Exercise, 'id'>),
      }))

      loaded.value = true
    } catch (error) {
      console.error('Failed to load exercises:', error)
      errorMessage.value = 'Unable to load the exercise library. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    exercises,
    isLoading,
    errorMessage,
    fetchExercises,
  }
})
