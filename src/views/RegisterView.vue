<script setup lang="ts">
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth'
import { ref } from 'vue'

import { auth } from '../firebase'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const confirmPassword = ref('')

async function register() {
  if (isLoading.value) {
    return
  }

  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value.trim()) {
    errorMessage.value = 'Please enter an email address.'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  isLoading.value = true

  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value)

    await sendEmailVerification(cred.user)
    await signOut(auth)

    successMessage.value =
      'Account created. Check your email for a verification link before logging in.'

    email.value = ''
    password.value = ''
    confirmPassword.value = ''
  } catch (error) {
    console.error('Registration failed:', error)
    errorMessage.value =
      'Unable to create your account. Check your email and password and try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <h1>Register</h1>

    <input v-model="email" type="email" placeholder="Email" />

    <input v-model="password" type="password" placeholder="Password" />

    <input v-model="confirmPassword" type="password" placeholder="Confirm Password" />

    <button type="button" :disabled="isLoading" @click="register">
      {{ isLoading ? 'Creating account...' : 'Register' }}
    </button>

    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>

    <p v-if="successMessage">
      {{ successMessage }}
    </p>

    <p>After registering, please check your email for a verification link before logging in.</p>
    <p>Already have an account? <router-link to="/login">Login here</router-link>.</p>
  </div>
</template>
