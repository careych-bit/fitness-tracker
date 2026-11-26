<script setup>
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from "pinia"

import { ref, onMounted } from 'vue'
import { db } from "@/firebase"


import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
} from 'firebase/firestore'

const authStore = useAuthStore();
const { user: currentUser, ready: authReady } = storeToRefs(authStore)

const errorMessage = ref('')
const isLoading = ref(false)
const workoutFullData = ref([])


// const props = defineProps([selectedGoal]);
// console.log("goal " + selectedGoal)

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

        
    }
    catch(error){
        console.error(error)
        errorMessage.value = 'Unable to load workouts. Please try again.'
    }
    finally {
        isLoading.value = false
    }
}


onMounted( () => {
    loadWorkouts()
    // console.log("workoutFullData.value " + workoutFullData.value)
    console.log(typeof workoutFullData, workoutFullData)
    // console.log("Object.valu(obj): ", Object.values(workoutFullData)[3])

    const linedata = getLineData(workoutFullData)
    console.log("Mounted linedata: ", typeof linedata, linedata)
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


async function getLineData (data) {
    const linedata = await Promise.resolve([])
    

    // workoutFullData.value.forEach((work) => {
    //     console.log(work)
    // })

    // for (const k in workoutFullData) {
    //     console.log("workoutFullData[k]: " +  workoutFullData[k])
    //     // linedata.push({
    //     //     date: Object.values(workoutFullData)[k].Date,
    //     //     duration: Object.values(workoutFullData)[k].Duration
    //     // })
    //     console.log("date: " + workoutFullData[k].Date + " duration: " +  workoutFullData[k].Duration )
    // }
    try {
    console.log("in linedata, data: ", data.value)
    for(let i in data.value) {
        console.log(i)
    }

    return linedata
    }
    finally {
        console.log("done")
    }
}



// create pie chart workouts/target number of workouts from a specific goal
// color by completion == True, False, and no workouts 

</script>

<template>

    <span>Graphs will appear here</span>
   <!--- <Line :data="linedata">Cannot Load Chart</Line> -->
    
</template>