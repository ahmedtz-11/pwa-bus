```vue
<script setup>
import BottomNav from "../components/BottomNav.vue";

const balance = "24,500";
const cardNumber = "•••• 4821";

const transactions = [
  {
    title: "Bus fare",
    subtitle: "Today, 10:42 AM",
    amount: "- TSh 1,000",
    icon: "bi-bus-front-fill",
    type: "expense",
  },
  {
    title: "Card top up",
    subtitle: "Yesterday, 4:18 PM",
    amount: "+ TSh 10,000",
    icon: "bi-plus-circle-fill",
    type: "income",
  },
  {
    title: "Bus fare",
    subtitle: "Yesterday, 8:32 AM",
    amount: "- TSh 1,000",
    icon: "bi-bus-front-fill",
    type: "expense",
  },
];
</script>

<template>
  <main class="home-page min-vh-100">
    <div class="home-container px-3 pt-4 pb-5">
      <!-- Header -->
      <header class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <p class="text-secondary small mb-1">Hello,</p>

          <h3 class="fw-bold mb-0">Ahmed</h3>
        </div>

        <button class="profile-btn">
          <i class="bi bi-person-fill"></i>
        </button>
      </header>

      <!-- Balance Card -->
      <section
        class="balance-card position-relative overflow-hidden rounded-4 p-4 mb-4"
      >
        <!-- Decorative circles -->
        <div class="circle circle-one"></div>
        <div class="circle circle-two"></div>

        <div class="position-relative z-2">
          <div class="d-flex justify-content-between align-items-start mb-4">
            <div>
              <span class="small opacity-75"> Available balance </span>
              <h2 class="balance mt-1 mb-0">TSh {{ balance }}</h2>
            </div>

            <div class="card-chip">
              <i class="bi bi-credit-card-2-front-fill"></i>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-end">
            <div>
              <span class="small opacity-75 d-block"> Rahisi Card </span>
              <span class="fw-semibold">
                {{ cardNumber }}
              </span>
            </div>

            <span class="active-status">
              <span></span>
              Active
            </span>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Quick actions</h5>

          <span class="text-secondary small"> What do you need? </span>
        </div>

        <div class="row g-3">
          <!-- Top up -->
          <div class="col-6">
            <RouterLink to="/topup" class="action-card text-decoration-none">
              <div class="action-icon yellow">
                <i class="bi bi-plus-lg"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-1">Top up</h6>
                <p class="small text-secondary mb-0">Add money to your card</p>
              </div>
              <i class="bi bi-arrow-up-right action-arrow"></i>
            </RouterLink>
          </div>

          <!-- Card -->
          <div class="col-6">
            <RouterLink to="/card" class="action-card text-decoration-none">
              <div class="action-icon dark">
                <i class="bi bi-credit-card"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-1">My card</h6>
                <p class="small text-secondary mb-0">View card details</p>
              </div>
              <i class="bi bi-arrow-up-right action-arrow"></i>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Travel Banner -->
      <section
        class="travel-banner rounded-4 p-4 mb-4 position-relative overflow-hidden"
      >
        <div class="position-relative z-2">
          <span class="badge bg-white text-dark rounded-pill px-3 py-2 mb-3">
            <i class="bi bi-stars me-1"></i>
            Ride with Rahisi
          </span>

          <h5 class="fw-bold text-white mb-2">Ready for your next ride?</h5>

          <p class="small text-white-50 mb-0">
            Keep your balance topped up and enjoy a smoother journey.
          </p>
        </div>

        <i class="bi bi-bus-front-fill banner-bus"></i>
      </section>

      <!-- Recent Activity -->
      <section>
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h5 class="fw-bold mb-0">Recent activity</h5>

          <RouterLink
            to="/transactions"
            class="small fw-semibold text-dark text-decoration-none"
          >
            See all
            <i class="bi bi-arrow-right ms-1"></i>
          </RouterLink>
        </div>

        <div class="activity-list">
          <div
            v-for="transaction in transactions"
            :key="transaction.title + transaction.subtitle"
            class="activity-item"
          >
            <div class="transaction-icon" :class="transaction.type">
              <i :class="['bi', transaction.icon]"></i>
            </div>

            <div class="flex-grow-1">
              <h6 class="fw-semibold mb-1">
                {{ transaction.title }}
              </h6>

              <span class="small text-secondary">
                {{ transaction.subtitle }}
              </span>
            </div>

            <span
              class="fw-semibold small"
              :class="
                transaction.type === 'income' ? 'text-success' : 'text-dark'
              "
            >
              {{ transaction.amount }}
            </span>
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

.profile-btn {
  width: 46px;
  height: 46px;
  border: 1px solid #e8e8e8;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.profile-btn:active {
  transform: scale(0.9);
}

/* Balance */

.balance-card {
  min-height: 200px;
  color: #111;
  background: linear-gradient(135deg, #ffc107 0%, #ffd95a 55%, #ffe89a 100%);
  box-shadow:
    0 18px 35px rgba(255, 193, 7, 0.22),
    0 4px 12px rgba(0, 0, 0, 0.06);
}

.balance {
  font-size: 2.2rem;
  letter-spacing: -1px;
}

.card-chip {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 14px;
  backdrop-filter: blur(10px);
  font-size: 1.3rem;
}

.active-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 5px 9px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.35);
}

.active-status span {
  width: 6px;
  height: 6px;
  background: #198754;
  border-radius: 50%;
}

/* Decorative circles */
.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.circle-one {
  width: 180px;
  height: 180px;
  right: -80px;
  top: -80px;
}

.circle-two {
  width: 130px;
  height: 130px;
  right: 50px;
  bottom: -95px;
}

/* Quick actions */

.action-card {
  min-height: 150px;
  position: relative;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #eeeeee;
  border-radius: 20px;
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
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  font-size: 1.1rem;
}

.action-icon.yellow {
  background: #fff3cd;
  color: #b88600;
}

.action-icon.dark {
  background: #111;
  color: #fff;
}

.action-arrow {
  position: absolute;
  top: 16px;
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
  min-height: 145px;
  background: linear-gradient(
    120deg,
    rgba(17, 17, 17, 0.98),
    rgba(35, 35, 35, 0.92)
  );
}

.banner-bus {
  position: absolute;
  right: -10px;
  bottom: -20px;
  font-size: 8rem;
  color: rgba(255, 193, 7, 0.13);
  transform: rotate(-8deg);
}

/* Activity */

.activity-list {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #eeeeee;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem;
  transition: background-color 0.25s ease;
}

.activity-item + .activity-item {
  border-top: 1px solid #f1f1f1;
}

.activity-item:active {
  background: #fafafa;
}

.transaction-icon {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;
}

.transaction-icon.expense {
  background: #f2f2f2;
  color: #111;
}

.transaction-icon.income {
  background: #d1e7dd;
  color: #198754;
}

/* Bottom spacing for fixed nav */

.home-container {
  padding-bottom: 110px !important;
}
</style>
