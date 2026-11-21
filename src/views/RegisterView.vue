<script setup lang="ts">
import { FirebaseError } from 'firebase/app'
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

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage.value = 'An account already exists with this email address.'
          break

        case 'auth/weak-password':
          errorMessage.value = 'Your password does not meet the required security requirements.'
          break

        case 'auth/invalid-email':
          errorMessage.value = 'Please enter a valid email address.'
          break

        case 'auth/network-request-failed':
          errorMessage.value = 'Unable to connect. Check your internet connection and try again.'
          break

        case 'auth/too-many-requests':
          errorMessage.value = 'Too many attempts. Please try again later.'
          break

        default:
          errorMessage.value = 'Unable to create your account. Please try again.'
      }
    } else {
      errorMessage.value = 'Unable to create your account. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

// source: https://stackoverflow.com/questions/63281566/best-way-for-center-v-card-horizontally-and-vertically-with-vuetify

</script>

<template>
  <v-container class="h-screen d-flex justify-center align-center flex-column bg-red">
    <v-card id="regcard">
      <v-card-title class="d-flex justify-center">Register</v-card-title>
    
        <v-card-actions class="d-flex justify-start flex-column">
          <v-text-field v-model="email" type="email" placeholder="Email" min-width="25"/>

          <v-text-field v-model="password" type="password" placeholder="Password" />

          <v-text-field v-model="confirmPassword" type="password" placeholder="Confirm Password" />

          <v-btn type="button" :disabled="isLoading" @click="register">
            {{ isLoading ? 'Creating account...' : 'Register' }}
          </v-btn>

          <p v-if="errorMessage">
            {{ errorMessage }}
          </p>

          <p v-if="successMessage">
            {{ successMessage }}
          </p>
        </v-card-actions>

        <v-card-text>
          <span>After registering, please check your email for a verification link before logging in.</span>
          <br>
          <span>Already have an account? <router-link to="/login">Login here</router-link>.</span>
        </v-card-text>

      </v-card>
    </v-container>
   
</template>

<style scoped>

div.card-div {
  /* display: flex;
  flex-direction: column;   */
  width: 100%;
  height: 100vh;
}

#regcard {
  background: lightblue;
  color: black;
}

</style>