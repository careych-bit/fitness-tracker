import { createRouter, createWebHistory } from 'vue-router'
import ExercisesView from '../views/ExercisesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/exercises',
      name: 'exercises',
      component: ExercisesView,
    },
  ],
})

export default router
