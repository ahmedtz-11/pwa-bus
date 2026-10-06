<script setup>
import BottomNav from "../components/BottomNav.vue";
</script>

<template>
  <main class="home-page min-vh-100">
    <div class="home-container px-3 pt-4 pb-5">
      <!-- Header -->
      <header class="d-flex align-items-center justify-content-between mb-4">
        <!-- <div>
          <p class="text-secondary small mb-1">Hello,</p>
          <h3 class="fw-bold mb-0">Ahmed</h3>
        </div> -->
        
        <button class="profile-btn">
          <i class="bi bi-list"></i>
        </button>

        <div>
          <img src="/imgs/zanbus_logo.png" alt="Bus" class="logo" />
        </div>

        <button class="profile-btn">
          <i class="bi bi-bell"></i>
        </button>
      </header>

      <!-- Balance Card -->
      <section class="">
        <img src="/imgs/adult_card.png" alt="Bus" class="card" />
        <img src="/imgs/card_back1.png" alt="Bus" class="card" />
      </section>

      <!-- Quick Actions -->
      <section class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Quick actions</h5>

          <!-- <span class="text-secondary small"> What do you need? </span> -->
        </div>

        <div class="row">
          <!-- Top up -->
          <div class="col-4">
            <RouterLink to="/topup" class="action-card text-decoration-none">
              <div class="action-icon green">
                <i class="bi bi-plus-lg"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-1">Top Up</h6>
                <p class="small text-secondary mb-0">
                  Add balance to your card
                </p>
              </div>
              <i class="bi bi-arrow-right action-arrow"></i>
            </RouterLink>
          </div>

          <!-- Use Card -->
          <div class="col-4">
            <RouterLink to="/card" class="action-card text-decoration-none">
              <div class="action-icon blue">
                <i class="bi bi-credit-card"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-1">Use Card</h6>
                <p class="small text-secondary mb-0">
                  Scan code to take the ride
                </p>
              </div>
              <i class="bi bi-arrow-right action-arrow"></i>
            </RouterLink>
          </div>

          <!-- Report Loss Card -->
          <div class="col-4">
            <RouterLink to="/card" class="action-card text-decoration-none">
              <div class="action-icon orange">
                <i class="bi bi-credit-card"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-1">Report Loss</h6>
                <p class="small text-secondary mb-0">
                  Report a loss or stolen card
                </p>
              </div>
              <i class="bi bi-arrow-right action-arrow"></i>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Travel Banner -->
      <section class="travel-banner rounded-4 p-2">
        <div class="row">
          <div class="col-4">
            <img src="/imgs/bus_homepage.png" alt="Bus" class="bus" />
          </div>
          <div class="col-8">
            <h6 class="fw-bold text-dark mb-2">Travel Smart, Travel Easy</h6>
            <p class="small text-muted mb-0">
              Use ZanBus for a faster, safer and more convenient journey.
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- Bottom navigation -->
    <BottomNav />
  </main>
</template>

<style scoped>
.home-page {
  background: #f7f7f5;
  color: #111;
  overflow-x: hidden;
}

.home-container {
  max-width: 520px;
  margin: 0 auto;
}

/* Header */
.logo {
  width: 170px;
  height: 100px;
}

.profile-btn {
  width: 46px;
  height: 46px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #444;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.profile-btn:active {
  transform: scale(0.9);
}

.card {
  width: 400px;
  height: 265px;
}

/* Quick actions */
.action-card {
  min-height: 160px;
  position: relative;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #f7f7f5;
  border-radius: 10px;
  color: #111;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.035);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.action-card:active {
  transform: scale(0.96);
}

.action-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  font-size: 1rem;
}

.action-icon.green {
  background: #eaffeb;
  color: var(--green);
}
.action-icon.blue {
  background: #dae6ff;
  color: var(--blue1);
}
.action-icon.orange {
  background: #fff3cd;
  color: #b88600;
}

.action-arrow {
  position: absolute;
  bottom: 1px;
  right: 16px;
  color: #aaa;
  transition:
    transform 0.3s ease,
    color 0.3s ease;
}

.action-card:hover .action-arrow {
  transform: translate(2px, -2px);
  color: #111;
}

/* Travel banner */
.travel-banner {
  min-height: 125px;
  background: #fff;
}

.bus {
  width: 95px;
  height: 48px;
}

/* Bottom spacing for fixed nav */
.home-container {
  padding-bottom: 110px !important;
}
</style>
