<script setup>
const steps = [
  "Register with your full name and phone number. Your ZanBus card is created for you right away.",
  "To sign in, enter your phone number, then the 6-digit code we send you. No password to remember.",
  "On the home page, tap your card to flip it. Use the eye icon to show or hide your balance.",
  "Tap Top Up, choose your own card or another card, enter an amount, then proceed to payment.",
  "When you board, open Use Card and scan the code to take the ride.",
  "Open Transaction history in Settings to see your top-ups and rides at any time.",
  "If your card is lost or stolen, tap Report Loss on the home page right away.",
  "Need a hand? Visit Help & Support in Settings to read the help center, contact the team or report a problem.",
];
</script>

<template>
  <main class="auth-page min-vh-100 d-flex flex-column">
    <!-- Image section -->
    <section class="hero position-relative">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>

      <div class="position-relative z-2 h-100 p-3">
        <!-- Top bar: back button (left) + logo (center) -->
        <div
          class="top-bar position-relative d-flex align-items-center justify-content-center"
        >
          <RouterLink
            to="/home"
            class="back-link position-absolute start-0 text-white text-decoration-none fw-bold"
            aria-label="Back"
          >
            <i class="bi bi-arrow-left"></i>
          </RouterLink>

          <img src="/imgs/zanbus_white.png" alt="Bus" class="logo" />
        </div>

        <div class="text-center mt-3">
          <h5 class="fw-semibold mb-1 text-white">User Guide</h5>
          <p class="hero-sub fw-semibold">A complete guide to using ZanBus</p>
        </div>
      </div>
    </section>

    <!-- Details section -->
    <section class="form-section bg-white flex-grow-1 px-4 py-4">
      <!-- Decorative overlay image anchored to the bottom -->
      <div class="form-overlay" aria-hidden="true"></div>

      <div class="form-container position-relative mx-auto">
        <!-- Guide banner -->
        <div class="secure-banner mb-3">
          <span class="secure-icon">
            <i class="bi bi-book-half"></i>
          </span>
          <div>
            <div class="secure-title">Guide</div>
            <div class="secure-text">From account setup to everyday travel</div>
          </div>
        </div>

        <!-- Step cards -->
        <ol class="info-list mb-3">
          <li v-for="(text, i) in steps" :key="i" class="info-card">
            <span class="info-icon">{{ i + 1 }}</span>

            <div class="info-body">
              <span class="info-text">{{ text }}</span>
            </div>
          </li>
        </ol>
      </div>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  background: #fff;
  overflow: hidden;
}

.hero-sub {
  font-size: 0.7rem;
  color: #aaa;
  margin-bottom: 0;
}

.hero {
  height: 28vh;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url("/imgs/topup_bg.png");
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.01);
}

.top-bar {
  min-height: 50px;
}

.logo {
  width: 135px;
  height: 40px;
}

/* ------- Details section ------- */
.form-section {
  border-radius: 30px 30px 0 0;
  margin-top: -40px;
  position: relative;
  z-index: 3;
  overflow: hidden;
}

.form-overlay {
  position: absolute;
  inset: auto 0 0 0;
  height: 55%;
  background-image: url("/imgs/card_buildings2.png");
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: contain;
  opacity: 0.7;
  pointer-events: none;
  z-index: 0;
}

.form-container {
  max-width: 520px;
  z-index: 1;
}

/* ------- Step cards ------- */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.info-card {
  display: flex;
  align-items: stretch;
  border-radius: 0.6rem;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.03);
}

.info-icon {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--blue2);
  background: #fff;
  border: 1px solid #ddd;
  border-right: 0;
  border-radius: 0.5rem 0 0 0.5rem;
}

.info-body {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem 0.75rem 0.25rem;
  background: #fff;
  border: 1px solid #ddd;
  border-left: 0;
  border-radius: 0 0.5rem 0.5rem 0;
}

.info-text {
  font-size: 0.9rem;
  line-height: 1.45;
  font-weight: 500;
  color: #222;
}

/* ------- Banner ------- */
.secure-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  background: #f0f4fc;
  border-radius: 0.75rem;
}

.secure-icon {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1055c9;
  font-size: 1.3rem;
}

.secure-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1055c9;
}

.secure-text {
  font-size: 0.75rem;
  line-height: 1.35;
  color: var(--blue1);
}
</style>
