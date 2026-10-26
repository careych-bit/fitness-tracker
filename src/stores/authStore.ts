import { defineStore } from 'pinia'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { ref } from 'vue'

import { auth } from '../firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const ready = ref(false)

  let initializationPromise: Promise<void> | null = null

  function initializeAuth() {
    if (initializationPromise) {
      return initializationPromise
    }

    initializationPromise = new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser

        if (!ready.value) {
          ready.value = true
          resolve()
        }
      })
    })

    return initializationPromise
  }

  return {
    user,
    ready,
    initializeAuth,
  }
})
