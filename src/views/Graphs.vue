<script setup>
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from "pinia"

import { ref, onMounted } from 'vue'
import { db } from "@/firebase"

import Chart from "chart.js/auto"

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'

const authStore = useAuthStore();
const { user: currentUser, ready: authReady } = storeToRefs(authStore)

const errorMessage = ref('')

// const props = defineProps([selectedGoal]);
// console.log("goal " + selectedGoal)

async function loadWorkouts() {
    try{
        const workoutsQ = query(collection(db, 'workouts'), where('User_ID', '==', currentUser.value.uid))
        const workoutSnap = await getDocs(workoutsQ)


        if (workoutSnap.length == 0){
            console.log("No workouts")
            errorMessage.value = 'You don\'t have any workouts yet'
            return
        }

        // create and return dataset for graphs
        const dataset = ref([])

        workoutSnap.forEach((doc) => {
            const workoutData = doc.data()
            dataset.push({
                date: workoutData.Date,
                duration: workoutData.Duration
            })
        })

        return dataset
        
    }
    catch(error){
        console.error(error)
        errorMessage.value = 'No workouts exist'
    }
}

async function createDataset (workoutSnap) {
    const dataset = ref([])

    workoutSnap.forEach((doc) => {
        const workoutData = doc.data()
        dataset.push({
            date: workoutData.Date,
            duration: workoutData.Duration
        })
    })

    return dataset
}

onMounted( () => {
    const workoutSnap = loadWorkouts()
    const dataset = createDataset(workoutSnap)
    console.log("onMounted: " + typeof(workoutSnap))
    console.log("dataset" + dataset)
})

</script>

<template>

    <span>Graphs will appear here</span>
    
</template>