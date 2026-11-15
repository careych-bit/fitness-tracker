import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { db } from '../firebase'
import { useAuthStore } from './authStore'

interface GoalRecord {
  User_ID: string
  Metric: 'workouts'
  Target: number
  Unit: 'workouts'
  Start_Date: string
  Target_Date: string
  Created_At?: Timestamp | null
  Updated_At?: Timestamp | null
}

export interface FitnessGoal extends GoalRecord {
  id: string
  Current_Value: number
}

interface WorkoutRecord {
  Completion?: boolean
  Completed_At?: Timestamp | null
}

export const useGoalStore = defineStore('goals', () => {
  const goals = ref<FitnessGoal[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const errorMessage = ref('')

  const authStore = useAuthStore()

  function calculateProgress(goal: GoalRecord, workouts: WorkoutRecord[]) {
    const startTime = new Date(`${goal.Start_Date}T00:00:00`).getTime()
    const endTime = new Date(`${goal.Target_Date}T23:59:59.999`).getTime()

    if (Number.isNaN(startTime) || Number.isNaN(endTime) || startTime > endTime) {
      return 0
    }

    return workouts.filter((workout) => {
      if (workout.Completion !== true || !workout.Completed_At) {
        return false
      }

      const completedTime = workout.Completed_At.toDate().getTime()

      return completedTime >= startTime && completedTime <= endTime
    }).length
  }

  async function fetchGoals() {
    const user = authStore.user

    if (!user) {
      goals.value = []
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      const [goalSnapshot, workoutSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'goals'), where('User_ID', '==', user.uid))),
        getDocs(query(collection(db, 'workouts'), where('User_ID', '==', user.uid))),
      ])

      if (authStore.user?.uid !== user.uid) {
        return
      }

      const workouts = workoutSnapshot.docs.map((document) => document.data() as WorkoutRecord)

      goals.value = goalSnapshot.docs.map((document) => {
        const data = document.data() as GoalRecord

        return {
          ...data,
          id: document.id,
          Current_Value: calculateProgress(data, workouts),
        }
      })
    } catch (error) {
      console.error('Failed to load goals:', error)
      errorMessage.value = 'Unable to load goals. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  async function createGoal(target: number, startDate: string, targetDate: string) {
    const user = authStore.user

    if (
      !user ||
      !Number.isInteger(target) ||
      target <= 0 ||
      !startDate ||
      !targetDate ||
      startDate > targetDate
    ) {
      errorMessage.value = 'Please enter a valid goal and date range.'
      return false
    }

    isSaving.value = true
    errorMessage.value = ''

    try {
      await addDoc(collection(db, 'goals'), {
        User_ID: user.uid,
        Metric: 'workouts',
        Target: target,
        Unit: 'workouts',
        Start_Date: startDate,
        Target_Date: targetDate,
        Created_At: serverTimestamp(),
        Updated_At: serverTimestamp(),
      })

      await fetchGoals()
      return true
    } catch (error) {
      console.error('Failed to create goal:', error)
      errorMessage.value = 'Unable to create goal. Please try again.'
      return false
    } finally {
      isSaving.value = false
    }
  }

  async function updateGoal(goalId: string, target: number, startDate: string, targetDate: string) {
    const user = authStore.user

    if (
      !user ||
      !Number.isInteger(target) ||
      target <= 0 ||
      !startDate ||
      !targetDate ||
      startDate > targetDate
    ) {
      errorMessage.value = 'Please enter a valid goal and date range.'
      return false
    }

    isSaving.value = true
    errorMessage.value = ''

    try {
      await updateDoc(doc(db, 'goals', goalId), {
        Target: target,
        Start_Date: startDate,
        Target_Date: targetDate,
        Updated_At: serverTimestamp(),
      })

      await fetchGoals()
      return true
    } catch (error) {
      console.error('Failed to update goal:', error)
      errorMessage.value = 'Unable to update goal. Please try again.'
      return false
    } finally {
      isSaving.value = false
    }
  }

  async function deleteGoal(goalId: string) {
    isSaving.value = true
    errorMessage.value = ''

    try {
      await deleteDoc(doc(db, 'goals', goalId))
      await fetchGoals()
      return true
    } catch (error) {
      console.error('Failed to delete goal:', error)
      errorMessage.value = 'Unable to delete goal. Please try again.'
      return false
    } finally {
      isSaving.value = false
    }
  }

  function clearGoals() {
    goals.value = []
    errorMessage.value = ''
  }

  return {
    goals,
    isLoading,
    isSaving,
    errorMessage,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    clearGoals,
  }
})
