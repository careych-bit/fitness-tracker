<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/authStore'
import { useGoalStore } from '@/stores/goalStore'

import Graphs from "./Graphs.vue"

const authStore = useAuthStore();
const goalStore = useGoalStore();
const { goals } = goalStore;

const { user: currentUser, ready: authReady } = storeToRefs(authStore)

const selectedGoal = ref(goals[0]);


</script>


<template>
  <main>
    <p v-if="!authReady" class="status-message">Checking your account...</p>
    <p v-else-if="!currentUser" class="status-message">
        Please sign in to view your dashboard.
    </p>

    <h1>Dashboard</h1>
    <p>Your fitness dashboard will eventually appear here.</p>
    <div>
      <label for="selectGoal">
        <select id="selectGoal" v-model="selectedGoal">
          <option v-if="goals.length !== 0" v-for="goal in goals" :key="goal.id" :value="goal"> 
            {{ goal.Target }} Workout, from {{ goal.Start_Date }} to {{ goal.Target_Date }}
          </option>
          <option v-else :value="null">
            No goals to select from
          </option>
        </select>
      </label>
    </div>

    <div>
      <Suspense fallback="Loading Graphs ...">
        <Graphs></Graphs>
      </Suspense>
    </div>
  </main>
</template>

<style scoped></style>
