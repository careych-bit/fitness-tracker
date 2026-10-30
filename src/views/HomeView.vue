<script setup lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

import { auth } from '@/firebase'

const router = useRouter()

async function logout() {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <main>
    <h1>Fitness Tracker</h1>
    <p>Welcome! Choose an option below.</p>

    <nav>
      <p><router-link to="/workouts">Workouts</router-link></p>
      <p><router-link to="/exercises">Exercise Library</router-link></p>
      <p><router-link to="/goals">Goals</router-link></p>
    </nav>

    <button type="button" @click="logout">Log Out</button>
  </main>
</template>
