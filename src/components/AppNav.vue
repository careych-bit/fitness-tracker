<script setup>
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

import { auth } from '@/firebase'

const router = useRouter()

async function logout() {
  try {
    await signOut(auth)
    await router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <nav class="app-nav" aria-label="Primary navigation">
    <RouterLink to="/home" class="nav-brand">
      <span class="brand-icon">F</span>
      FitTrack
    </RouterLink>
    <div class="nav-links">
    <RouterLink to="/dashboard">Dashboard</RouterLink>
    <RouterLink to="/workouts">Workouts</RouterLink>
    <RouterLink to="/exercises">Exercises</RouterLink>
    <RouterLink to="/goals">Goals</RouterLink>
    </div>

    <button type="button" @click="logout">Log Out</button>
  </nav>
</template>


<style scoped>
.app-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 14px 40px;
  background: white;
  border-bottom: 1px solid #e1e8e3;
  font-family: Arial, sans-serif;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #345440;
  font-size: 22px;
  font-weight: bold;
  text-decoration: none;
  white-space: nowrap;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #527b60;
  color: white;
  border-radius: 9px;
  font-size: 20px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-links a {
  color: #66756c;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #527b60;
}

.nav-links a.router-link-active {
  color: #527b60;
  position: relative;
}

.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -20px;
  height: 3px;
  background: #527b60;
  border-radius: 3px;
}

.logout-button {
  background: #e5eee7;
  color: #345440;
  border: none;
  border-radius: 7px;
  padding: 10px 17px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.logout-button:hover {
  background: #d3e2d6;
}

@media (max-width: 700px) {
  .app-nav {
    padding: 14px 16px;
    flex-wrap: wrap;
    gap: 18px;
  }

  .nav-links {
    order: 3;
    width: 100%;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .nav-links a {
    font-size: 13px;
  }

  .nav-links a.router-link-active::after {
    bottom: -8px;
  }
}
</style>
