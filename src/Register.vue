<script setup lang="ts">
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  type UserCredential
} from "firebase/auth";
import { ref } from 'vue';
import { auth } from "./firebase";
const email = ref('')
const password = ref('')
function register() {
  console.log("Register button clicked!");
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((cred: UserCredential) => {
      sendEmailVerification(cred.user);
      console.log("Verification email has been sent to", cred.user?.email);
      signOut(auth);
    })
  .catch((err: any) => {
    console.error("Oops", err);
  })
}

</script>
<template>
  <div>
    <h1>Register</h1>

    <input
      v-model="email"
      type="email"
      placeholder="Email"
    />

    <input
      v-model="password"
      type="password"
      placeholder="Password"
    />

    <button @click="register">Register</button>
    <p>After registering, please check your email for a verification link before logging in.</p>
    <p>Already have an account? <router-link to="/login">Login here</router-link>.</p>

  </div>
</template>