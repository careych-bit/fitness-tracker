<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/authStore'
import { useGoalStore } from '@/stores/goalStore'

const authStore = useAuthStore()
const goalStore = useGoalStore()

const { user: currentUser, ready: authReady } = storeToRefs(authStore)

const { goals, isLoading, isSaving, errorMessage } = storeToRefs(goalStore)

const target = ref(1)
const startDate = ref('')
const targetDate = ref('')
const editingGoalId = ref(null)
const formError = ref('')

// Load goals whenever the authenticated user changes.
watch(
  currentUser,
  async (user) => {
    if (user) {
      await goalStore.fetchGoals()
    } else {
      goalStore.clearGoals()
    }
  },
  { immediate: true },
)

function resetForm() {
  target.value = 1
  startDate.value = ''
  targetDate.value = ''
  editingGoalId.value = null
  formError.value = ''
  errorMessage.value = ''
}

async function saveGoal() {
  formError.value = ''

  if (!Number.isInteger(target.value) || target.value < 1) {
    formError.value = 'Please enter a valid whole number of workouts.'
    return
  }

  if (!startDate.value || !targetDate.value) {
    formError.value = 'Please select both dates.'
    return
  }

  if (startDate.value > targetDate.value) {
    formError.value = 'The end date must be after the start date.'
    return
  }

  let success

  if (editingGoalId.value) {
    success = await goalStore.updateGoal(
      editingGoalId.value,
      target.value,
      startDate.value,
      targetDate.value,
    )
  } else {
    success = await goalStore.createGoal(target.value, startDate.value, targetDate.value)
  }

  if (success) {
    resetForm()
  }
}

function editGoal(goal) {
  editingGoalId.value = goal.id
  target.value = goal.Target
  startDate.value = goal.Start_Date
  targetDate.value = goal.Target_Date
  formError.value = ''
  errorMessage.value = ''
}

function cancelEdit() {
  resetForm()
}

async function removeGoal(goal) {
  const confirmed = confirm(`Are you sure you want to delete this goal?`)

  if (!confirmed) return

  await goalStore.deleteGoal(goal.id)
}

function progressPercentage(goal) {
  return Math.min(100, Math.round((goal.Current_Value / goal.Target) * 100))
}

function todayString() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function goalStatus(goal) {
  if (goal.Current_Value >= goal.Target) {
    return 'Completed'
  }

  if (goal.Target_Date < todayString()) {
    return 'Past Due'
  }

  return 'In Progress'
}

function formatDate(date) {
  if (!date) return ''

  return new Date(`${date}T00:00:00`).toLocaleDateString()
}
</script>

<template>
  <main class="goals-page">
    <div class="goals-container">
      <header class="page-header">
        <h1>Fitness Goals</h1>
        <p>Set workout targets and track your progress.</p>
      </header>

      <section class="goal-form-section">
        <h2>{{ editingGoalId ? 'Edit Goal' : 'Create a Goal' }}</h2>

        <form class="goal-form" @submit.prevent="saveGoal">
          <div class="form-field">
            <label for="goalTarget">Workout Target</label>
            <input
              id="goalTarget"
              v-model.number="target"
              type="number"
              min="1"
              step="1"
              required
            />
            <span class="field-help">Number of workouts to complete</span>
          </div>

          <div class="form-field">
            <label for="startDate">Start Date</label>
            <input
              id="startDate"
              v-model="startDate"
              type="date"
              :max="targetDate || undefined"
              required
            />
          </div>

          <div class="form-field">
            <label for="targetDate">Target Date</label>
            <input
              id="targetDate"
              v-model="targetDate"
              type="date"
              :min="startDate || undefined"
              required
            />
          </div>

          <p v-if="formError" class="error-message">
            {{ formError }}
          </p>

          <div class="form-actions">
            <button type="submit" :disabled="isSaving || !currentUser">
              {{ isSaving ? 'Saving...' : editingGoalId ? 'Save Changes' : 'Create Goal' }}
            </button>

            <button
              v-if="editingGoalId"
              type="button"
              class="cancel-button"
              :disabled="isSaving"
              @click="cancelEdit"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      <p v-if="!authReady" class="status-message">Checking your account...</p>

      <p v-else-if="!currentUser" class="status-message">
        Please sign in to manage your fitness goals.
      </p>

      <template v-else>
        <p v-if="isLoading" class="status-message">Loading goals...</p>

        <p v-else-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <section v-else-if="goals.length === 0" class="empty-state">
          <h2>No Goals Yet</h2>
          <p>Create your first fitness goal above to start tracking progress.</p>
        </section>

        <section v-else class="goal-list-section">
          <h2>Your Goals</h2>

          <div class="goal-grid">
            <article v-for="goal in goals" :key="goal.id" class="goal-card">
              <div class="goal-card-header">
                <h3>{{ goal.Target }} Workouts</h3>

                <span
                  class="goal-badge"
                  :class="{
                    'status-complete': goalStatus(goal) === 'Completed',
                    'status-overdue': goalStatus(goal) === 'Past Due',
                    'status-active': goalStatus(goal) === 'In Progress',
                  }"
                >
                  {{ goalStatus(goal) }}
                </span>
              </div>

              <div class="goal-details">
                <p>Start: {{ formatDate(goal.Start_Date) }}</p>
                <p>Target: {{ formatDate(goal.Target_Date) }}</p>
              </div>

              <div
                class="progress-track"
                role="progressbar"
                :aria-valuenow="goal.Current_Value"
                :aria-valuemin="0"
                :aria-valuemax="goal.Target"
                :aria-label="`${goal.Current_Value} of ${goal.Target} workouts completed`"
              >
                <div class="progress-fill" :style="{ width: `${progressPercentage(goal)}%` }"></div>
              </div>

              <div class="progress-label">
                <strong> {{ goal.Current_Value }} / {{ goal.Target }} workouts </strong>
                <span>{{ progressPercentage(goal) }}%</span>
              </div>

              <p v-if="goal.Current_Value >= goal.Target" class="completion-message">
                Congratulations! You've reached your goal.
              </p>

              <div class="goal-actions">
                <button
                  type="button"
                  class="edit-button"
                  :disabled="isSaving"
                  @click="editGoal(goal)"
                >
                  Edit
                </button>

                <button
                  type="button"
                  class="delete-button"
                  :disabled="isSaving"
                  @click="removeGoal(goal)"
                >
                  Delete
                </button>
              </div>
            </article>
          </div>
        </section>
      </template>
    </div>
  </main>
</template>

<style scoped>
.goals-page {
  min-height: 100vh;
  padding: 40px 24px;
  background: #f5f7f6;
  color: #26352e;
  font-family: Arial, sans-serif;
}

.goals-container {
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

.page-header p {
  color: #66756c;
}

.goals-page h2 {
  font-size: 21px;
  margin-bottom: 20px;
}

.goal-form-section {
  background: white;
  padding: 28px;
  border: 1px solid #e1e8e3;
  border-radius: 12px;
  margin-bottom: 35px;
}

.goal-form {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field label {
  font-size: 14px;
  font-weight: 600;
}

.form-field input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px;
  border: 1px solid #d5ded8;
  border-radius: 7px;
  font-size: 14px;
}

.field-help {
  font-size: 12px;
  color: #66756c;
}

.form-actions {
  grid-column: span 3;
  display: flex;
  gap: 10px;
}

.form-actions button,
.goal-actions button {
  padding: 10px 16px;
  border: none;
  border-radius: 7px;
  font-weight: 600;
  cursor: pointer;
}

.form-actions button:first-child {
  background: #527b60;
  color: white;
}

.form-actions button:first-child:hover {
  background: #3d624a;
}

.cancel-button {
  background: #e5ebe6;
  color: #344b3a;
}

.form-actions button:disabled,
.goal-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.goal-list-section {
  margin-top: 30px;
}

.goal-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.goal-card {
  background: white;
  border: 1px solid #e1e8e3;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 2px 8px rgba(30, 60, 40, 0.04);
}

.goal-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.goal-card-header h3 {
  font-size: 19px;
}

.goal-badge {
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.status-active {
  background: #f1eee2;
  color: #89743d;
}

.status-complete {
  background: #e3f0e5;
  color: #3d7049;
}

.status-overdue {
  background: #f1e6e4;
  color: #9b4940;
}

.goal-details {
  color: #66756c;
  font-size: 14px;
  line-height: 1.6;
}

.progress-track {
  height: 10px;
  background: #e5ebe6;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 18px;
}

.progress-fill {
  height: 100%;
  background: #527b60;
  border-radius: 20px;
  transition: width 0.3s ease;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
}

.completion-message {
  color: #3d7049;
  font-size: 14px;
  margin-top: 12px;
}

.goal-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.edit-button {
  background: #e5ebe6;
  color: #344b3a;
}

.delete-button {
  background: #f1e6e4;
  color: #9b4940;
}

.empty-state,
.status-message {
  background: white;
  padding: 22px;
  border-radius: 10px;
  color: #66756c;
}

.error-message {
  grid-column: 1 / -1;
  background: #fbeeed;
  color: #b33d35;
  padding: 12px;
  border-radius: 8px;
}

.goals-page input:focus {
  outline: 2px solid #91b69b;
  border-color: #668f70;
}

@media (max-width: 700px) {
  .goals-page {
    padding: 24px 14px;
  }

  .goal-form {
    grid-template-columns: 1fr;
  }

  .form-actions {
    grid-column: span 1;
  }

  .goal-grid {
    grid-template-columns: 1fr;
  }

  .goal-form-section {
    padding: 18px;
  }
}
</style>
