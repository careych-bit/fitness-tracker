<script setup lang="ts">
import { type UserCredential, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
const email = ref('')
const password = ref('')
const router = useRouter()

function login() {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((cred: UserCredential) => {
      if (cred.user?.emailVerified) {
        console.log('Signed in as', cred.user.email)

        const redirect =
          typeof router.currentRoute.value.query.redirect === 'string'
            ? router.currentRoute.value.query.redirect
            : '/home'

        router.push(redirect)
      } else {
        console.log('Please verify your email first')
        signOut(auth)
      }
    })
    .catch((err: any) => {
      console.error('oops', err)
    })
}
</script>
<template>
  <div>
    <h1>Login</h1>

    <input v-model="email" type="email" placeholder="Email" />

    <input v-model="password" type="password" placeholder="Password" />

    <button @click="login">Login</button>
    <p>Don't have an account? <router-link to="/register">Register here</router-link>.</p>
  </div>
</template>
