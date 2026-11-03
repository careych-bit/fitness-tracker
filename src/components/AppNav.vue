<script setup>
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

import { auth } from '@/firebase'

const router = useRouter()

async function logout() {
  try {
    await signOut(auth)
    await router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <nav class="app-nav" aria-label="Primary navigation">
    <RouterLink to="/dashboard">Dashboard</RouterLink>
    <RouterLink to="/workouts">Workouts</RouterLink>
    <RouterLink to="/exercises">Exercises</RouterLink>
    <RouterLink to="/goals">Goals</RouterLink>

    <button type="button" @click="logout">Log Out</button>
  </nav>
</template>
