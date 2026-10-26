<script setup lang="ts">
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { auth } from '../firebase'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const router = useRouter()

async function login() {
  if (isLoading.value) {
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  try {
    const cred = await signInWithEmailAndPassword(auth, email.value, password.value)

    if (!cred.user.emailVerified) {
      await signOut(auth)
      errorMessage.value = 'Please verify your email before logging in.'
      return
    }

    const redirect =
      typeof router.currentRoute.value.query.redirect === 'string'
        ? router.currentRoute.value.query.redirect
        : '/home'

    await router.push(redirect)
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = 'Unable to log in. Check your email and password and try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <h1>Login</h1>

    <input v-model="email" type="email" placeholder="Email" />

    <input v-model="password" type="password" placeholder="Password" />

    <button type="button" :disabled="isLoading" @click="login">
      {{ isLoading ? 'Logging in...' : 'Login' }}
    </button>
    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>
    <p>Don't have an account? <router-link to="/register">Register here</router-link>.</p>
  </div>
</template>
