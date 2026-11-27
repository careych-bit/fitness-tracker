<script setup>
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


// Load data stuff
import { db } from "@/firebase"
import LineGraph from "./LineGraph.vue"


import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
} from 'firebase/firestore'

const errorMessage = ref('')
const isLoading = ref(false)
const workoutFullData = ref([])


async function loadWorkouts() {
    if (!currentUser.value) {
        return
    }

    isLoading.value = true
    errorMessage.value = ''

    try{
        const workoutsQ = query(collection(db, 'workouts'), where('User_ID', '==', currentUser.value.uid))
        const workoutSnap = await getDocs(workoutsQ)


        if (workoutSnap.length == 0){
            console.log("No workouts")
            errorMessage.value = 'You don\'t have any workouts yet'
            return
        }

        workoutSnap.forEach((doc) => {
            const workoutData = doc.data()
            workoutFullData.value.push({
                Workout_ID: doc.id,
                User_ID: workoutData.User_ID,
                Name: workoutData.Workout_name,
                Date: workoutData.Date,
                Duration: workoutData.Duration,
                Start_time: workoutData.Start_time,
                Completion: workoutData.Completion,
                Completed_At: workoutData.Completed_At || null,
                Notes: workoutData.Notes,

            })
        })  
      // console.log("dash load: ", workoutFullData.value)  
    }
    catch(error){
        console.error(error)
        errorMessage.value = 'Unable to load workouts. Please try again.'
    }
    finally {
        isLoading.value = false
    }
}

watch(
  currentUser,
  (user) => {
    if (user) {
      loadWorkouts()
    } else {
      workouts.value = []
    }
  },
  { immediate: true },
)


</script>


<template>
  <main class="dashboard-page">
    <div class="dashboard-container">
      <header class="page-header">
        <h1>Welcome to your Dashboard</h1>
      </header>
      <section class="stats-section">
        <div class="stats-grid">
          <div class="g-stats-input-card">
            <div class="goal-stats-card-header">
              <h2>Goal Statisitics</h2>
            </div>            
          </div>
          <article class="g-stats-output-card">
            <div class="goal-stats-card-graph">
              <LineGraph :data="workoutFullData"></LineGraph>
            </div>
          </article>
        </div>
      </section>
    </div>

    <!-- <h1>Dashboard</h1>
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
    </div> -->

    <!-- <div class="line-graph canvas">
      <Suspense fallback="Loading Graphs ...">
        <LineGraph :data="workoutFullData"></LineGraph>
      </Suspense>
    </div> -->


  </main>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  padding: 40px 12px;
  background: #f5f7f6;
  color: #26352e;
  font-family: Arial, sans-serif;
}

.dashboard-container {
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 32px;
  color: #263d32;
  margin-bottom: 8px;
}

.dashboard-page h2 {
  font-size: 21px;
  margin-bottom: 20px;
}

.stats-section {
  margin-top: 30px;
}

.stats-grid {
  /* display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)); */
  gap: 20px;
}

.g-stats-input-card {
  background: white;
  border: 1px solid #e1e8e3;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 2px 8px rgba(30, 60, 40, 0.04);
}

.g-stats-output-card {
  background: white;
  border: 1px solid #e1e8e3;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 2px 8px rgba(30, 60, 40, 0.04); 
}

.goal-stats-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

</style>
