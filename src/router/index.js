import { createRouter, createWebHistory } from 'vue-router'

import ExercisesView from '../views/ExercisesView.vue'
import Login from '../Login.vue'
import Register from '../Register.vue'
import Goals from '../views/GoalsView.vue'
import Home from '../views/HomeView.vue'
import Workout from '../views/WorkoutsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/register',
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/workouts',
      name: 'workouts',
      component: Workout,
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: ExercisesView,
    },
    {
      path: '/goals',
      name: 'goals',
      component: Goals,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
  ],
})

export default router
