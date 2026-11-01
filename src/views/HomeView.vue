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
    <p>Welcome to your fitness tracker.</p>
  </main>
</template>
