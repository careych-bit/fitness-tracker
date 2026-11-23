<script setup>
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from "pinia"

import { ref, onMounted } from 'vue'
import { db } from "@/firebase"


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
const dataset = ref([])

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

        // add to dataset for graphs
        dataset.value = []
        workoutSnap.forEach((doc) => {
            const workoutData = doc.data()
            dataset.value.push({
                date: workoutData.Date,
                duration: workoutData.Duration,
            })
            console.log(workoutData.Workout_name)
        })

        
    }
    catch(error){
        console.error(error)
        errorMessage.value = 'Unable to load workouts. Please try again.'
    }
}


onMounted( () => {
    loadWorkouts()
    console.log("dataset" + dataset)
})

// create bar chart, x axis time (week, month, start-target of goals)
// y axis minutes spent working out (completion == TRUE)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const linedata = {
    datasets: [{
        label: "Minutes worked out over time",
        data: dataset
    }],
}



// create pie chart workouts/target number of workouts from a specific goal
// color by completion == True, False, and no workouts 

</script>

<template>

    <span>Graphs will appear here</span>
    <Line :data="linedata">Cannot Load Chart</Line>
    
</template>