<script setup>
import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'

import AppNav from './components/AppNav.vue'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
</script>

<template>
  <AppNav v-if="user" />

  <RouterView />
</template>
