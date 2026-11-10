
<template>
  <main class="home-page">

    <div class="home-container">

      <!-- Welcome Banner -->
      <section class="welcome-section">
        <p class="welcome-label">YOUR FITNESS JOURNEY</p>

        <h1>Welcome to Your Fitness Tracker!</h1>

        <p class="welcome-description">
          Track your workouts, explore exercises, set goals, and monitor your progress
          all in one place.
        </p>
      </section>

      <section class="navigation-section">

        <h2>Explore Your Fitness Tracker</h2>

        <p class="section-description">
          Choose a section below to get started.
        </p>

        <div class="navigation-grid">
          <RouterLink
            :to="{ name: 'dashboard' }"
            class="navigation-card"
          >
            <div class="card-icon">📊</div>
            <h3>Dashboard</h3>
            <p>
              View your fitness overview and keep track
              of your overall progress.
            </p>
            <span class="card-link">Explore Dashboard →</span>
          </RouterLink>
          <RouterLink
            :to="{ name: 'workouts' }"
            class="navigation-card"
          >
            <div class="card-icon">💪</div>
            <h3>Workouts</h3>
            <p>
              Create workouts, record exercises, and
              manage your training sessions.
            </p>
            <span class="card-link">Manage Workouts →</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'exercises' }"
            class="navigation-card"
          >
            <div class="card-icon">🏃</div>
            <h3>Exercises</h3>
            <p>
              Browse available exercises and discover
              activities for your workout routine.
            </p>
            <span class="card-link">Explore Exercises →</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'goals' }"
            class="navigation-card"
          >
            <div class="card-icon">🎯</div>
            <h3>Goals</h3>
            <p>
              Set fitness goals, track your progress,
              and stay motivated.
            </p>
            <span class="card-link">View Goals →</span>
          </RouterLink>

        </div>

      </section>

      <section class="motivation-section">
        <h2>Progress Starts With Consistency.</h2>

        <p>
          Stay committed to your fitness journey, and remember that every small step
          counts towards achieving your goals. Keep pushing forward!
        </p>
      </section>

    </div>

  </main>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 40px 24px;
  background: #f5f7f6;
  color: #26352e;
  font-family: Arial, sans-serif;
}

.home-container {
  max-width: 1100px;
  margin: 0 auto;
}

.welcome-section {
  background: #e5eee7;
  border-radius: 16px;
  padding: 55px 40px;
  margin-bottom: 45px;
}

.welcome-label {
  color: #527b60;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 2px;
}

.welcome-section h1 {
  color: #263d32;
  font-size: 36px;
  margin: 15px 0;
}

.welcome-description {
  color: #66756c;
  font-size: 16px;
  line-height: 1.7;
  max-width: 650px;
  margin-bottom: 25px;
}

.welcome-button {
  display: inline-block;
  background: #527b60;
  color: white;
  padding: 12px 22px;
  border-radius: 7px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}

.welcome-button:hover {
  background: #3d624a;
}

.navigation-section h2 {
  color: #263d32;
  font-size: 24px;
  margin-bottom: 8px;
}

.section-description {
  color: #66756c;
  margin-bottom: 25px;
}

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.navigation-card {
  display: block;
  background: white;
  border: 1px solid #e1e8e3;
  border-radius: 12px;
  padding: 28px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.navigation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 5px 15px rgba(30, 60, 40, 0.08);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: #e5eee7;
  border-radius: 12px;
  font-size: 25px;
  margin-bottom: 18px;
}

.navigation-card h3 {
  color: #263d32;
  font-size: 20px;
  margin-bottom: 10px;
}

.navigation-card p {
  color: #66756c;
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 18px;
}

.card-link {
  color: #527b60;
  font-size: 14px;
  font-weight: bold;
}

.motivation-section {
  background: #527b60;
  color: white;
  padding: 35px;
  border-radius: 12px;
  margin-top: 40px;
  text-align: center;
}

.motivation-section h2 {
  font-size: 23px;
  margin-bottom: 12px;
}

.motivation-section p {
  font-size: 15px;
  line-height: 1.7;
}

@media (max-width: 700px) {
  .home-page {
    padding: 24px 14px;
  }

  .welcome-section {
    padding: 35px 22px;
  }

  .welcome-section h1 {
    font-size: 28px;
  }

  .navigation-grid {
    grid-template-columns: 1fr;
  }

  .motivation-section {
    padding: 25px 18px;
  }
}
</style>
