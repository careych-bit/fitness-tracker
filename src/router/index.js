import { createRouter, createWebHistory } from 'vue-router'
import ExercisesView from '../views/ExercisesView.vue'

import Login from '../Login.vue'
import Register from '../Register.vue'
import Exercise from '../views/ExercisesView.vue'
import Workout from '../views/WorkoutsView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/register'
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/workouts',
      name: 'workouts',
      component: Workout
    },
    {
      path: '/exercise',
      name: 'exercise',
      component: Exercise
    }
  ]
})

export default router
