<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import AppNav from './components/AppNav.vue'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const route = useRoute()

const showNavigation = computed(() => {
  return (
    user.value &&
    !['login', 'register'].includes(route.name)
  )
})
</script>

<template>
  <AppNav v-if="showNavigation" />

  <RouterView />
</template>
