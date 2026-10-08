<script setup>
import { computed, ref } from "vue";
import { useAccount } from "../stores/account";
import BottomNav from "../components/BottomNav.vue";

const { user } = useAccount();

const flipped = ref(false);
const showBalance = ref(false);

const owner = computed(() => (user.value?.name || "Card holder").toUpperCase());

// 4829175036481920 -> 4829 1750 3648 1920
const cardNumber = computed(() =>
  (user.value?.cardNo || "0000000000000000").replace(/(\d{4})(?=\d)/g, "$1 "),
);

const balance = computed(() =>
  Number(user.value?.balance ?? 0).toLocaleString("en-US"),
);

const flip = () => (flipped.value = !flipped.value);
const toggleBalance = () => (showBalance.value = !showBalance.value);
</script>

<template>
  <main class="home-page min-vh-100">
    <div class="home-container px-3 pt-4">
      <!-- Header -->
      <header class="d-flex align-items-center justify-content-between mb-2">
        <!-- <button class="profile-btn" type="button" aria-label="Menu">
          <i class="bi bi-list"></i>
        </button> -->
        <RouterLink
          to="/account"
          class="profile-btn"
          type="button"
          aria-label="Menu"
        >
          <i class="bi bi-list"></i>
        </RouterLink>

        <img src="/imgs/zanbus_logo.png" alt="ZanBus" class="logo" />

        <button class="profile-btn" type="button" aria-label="Notifications">
          <i class="bi bi-bell"></i>
        </button>
      </header>

      <!-- Flip card -->
      <section class="mb-3">
        <div
          class="flip-card mx-auto"
          :class="{ flipped }"
          role="button"
          tabindex="0"
          :aria-pressed="flipped"
          aria-label="Bus card. Press to flip."
          @click="flip"
          @keydown.enter.self.prevent="flip"
          @keydown.space.self.prevent="flip"
        >
          <div class="flip-inner">
            <!-- Front -->
            <div class="flip-face front">
              <img
                src="/imgs/adult_card.png"
                alt=""
                class="face-img"
                draggable="false"
              />

              <!-- Card details: each field is positioned on its own -->
              <div class="card-info">
                <!-- Balance + eye -->
                <div class="field balance-field">
                  <div class="d-flex align-items-center gap-2">
                    <span class="balance">
                      <template v-if="showBalance">TZS {{ balance }}</template>
                      <template v-else>TZS ••••••</template>
                    </span>
                    <button
                      type="button"
                      class="eye-btn"
                      :aria-label="
                        showBalance ? 'Hide balance' : 'Show balance'
                      "
                      @click.stop="toggleBalance"
                    >
                      <i
                        class="bi"
                        :class="showBalance ? 'bi-eye-slash' : 'bi-eye'"
                      ></i>
                    </button>
                  </div>
                </div>

                <!-- Card number -->
                <div class="field number-field">{{ cardNumber }}</div>

                <!-- Owner -->
                <div class="field owner-field">
                  <div class="owner">{{ owner }}</div>
                </div>
              </div>
            </div>

            <!-- Back -->
            <div class="flip-face back">
              <img
                src="/imgs/card_back1.png"
                alt=""
                class="face-img"
                draggable="false"
              />
            </div>
          </div>
        </div>

        <p class="text-center small text-secondary mt-2 mb-0">
          <i class="bi bi-arrow-repeat me-1"></i>Tap the card to flip
        </p>
      </section>

      <!-- Quick Actions -->
      <section class="mb-3">
        <h5 class="fw-bold mb-2">Quick actions</h5>

        <div class="actions-grid">
          <!-- Top up -->
          <RouterLink to="/topup" class="action-card text-decoration-none">
            <div class="action-icon green">
              <i class="bi bi-wallet2"></i>
            </div>
            <div>
              <h6 class="fw-bold mb-1">Top Up</h6>
              <p class="action-text text-secondary mb-0">
                Add balance to your card
              </p>
            </div>
            <i class="bi bi-arrow-right action-arrow"></i>
          </RouterLink>

          <!-- Use card -->
          <RouterLink to="/card" class="action-card text-decoration-none">
            <div class="action-icon blue">
              <i class="bi bi-qr-code-scan"></i>
            </div>
            <div>
              <h6 class="fw-bold mb-1">Use Card</h6>
              <p class="action-text text-secondary mb-0">
                Scan code to take the ride
              </p>
            </div>
            <i class="bi bi-arrow-right action-arrow"></i>
          </RouterLink>

          <!-- Report loss -->
          <RouterLink to="/card" class="action-card text-decoration-none">
            <div class="action-icon orange">
              <i class="bi bi-exclamation-triangle"></i>
            </div>
            <div>
              <h6 class="fw-bold mb-1">Report Loss</h6>
              <p class="action-text text-secondary mb-0">
                Report a lost or stolen card
              </p>
            </div>
            <i class="bi bi-arrow-right action-arrow"></i>
          </RouterLink>
        </div>
      </section>

      <!-- Travel banner -->
      <section
        class="travel-banner rounded-4 p-3 d-flex align-items-center gap-3"
      >
        <img src="/imgs/bus_homepage.png" alt="Bus" class="bus" />
        <div class="min-w-0">
          <h6 class="fw-bold text-dark mb-1">Travel Smart, Travel Easy</h6>
          <p class="small text-muted mb-0">
            Use ZanBus for a faster, safer and more convenient journey.
          </p>
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
  padding-bottom: 110px; /* space for the fixed bottom nav */
}

/* ---------- Header ---------- */
.logo {
  height: 35px;
  width: 115px;
}

.profile-btn {
  width: 46px;
  height: 46px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: #444;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
  transition: transform 0.25s ease;
}

.profile-btn:active {
  transform: scale(0.9);
}

/* ---------- Flip card ---------- */
.flip-card {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 400 / 265;
  perspective: 1200px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline-offset: 4px;
}

.flip-inner {
  position: relative;
  width: 100%;
  height: 95%;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.flip-card.flipped .flip-inner {
  transform: rotateY(180deg);
}

.flip-face {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
}

.flip-face.back {
  transform: rotateY(180deg);
}

.face-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
}

/* Details on top of the front image */
.card-info {
  position: absolute;
  inset: 0;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
}

.eye-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: var(--blue1);
  /* background: rgba(255, 255, 255, 0.22); */
  /* backdrop-filter: blur(6px); */
  text-shadow: none;
  transition: background 0.2s ease;
}

.eye-btn:active {
  /* background: rgba(255, 255, 255, 0.4); */
  background-color: var(--blue2);
}

.field {
  position: absolute;
}

.balance-field {
  top: 40%;
  right: 4%;
}

.number-field {
  top: 57%;
  left: 6%;
}

.owner-field {
  top: 43%;
  left: 6%;
  max-width: 50%;
}

.balance {
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  /* font-family: "Orbitron", sans-serif !important; */
}

.number-field {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  font-family: "Orbitron", sans-serif !important;
}

.owner {
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---------- Quick actions (always one row) ---------- */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.action-card {
  position: relative;
  min-height: 160px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border-radius: 14px;
  color: #111;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
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

.action-card h6 {
  font-size: 0.85rem;
}

.action-text {
  font-size: 0.8rem;
  line-height: 1.3;
  padding-bottom: 0.9rem; /* room for the arrow */
}

.action-arrow {
  position: absolute;
  bottom: 4px;
  right: 12px;
  color: #aaa;
  transition:
    transform 0.3s ease,
    color 0.3s ease;
}

.action-card:hover .action-arrow {
  transform: translate(2px, 0px);
  color: #333;
}

/* ---------- Travel banner ---------- */
.travel-banner {
  background: #fff;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
}

.bus {
  flex: 0 0 auto;
  width: 95px;
  height: auto;
}

.min-w-0 {
  min-width: 0;
}

@media (prefers-reduced-motion: reduce) {
  .flip-inner {
    transition-duration: 0.01s;
  }
}
</style>
