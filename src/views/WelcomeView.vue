<script setup>
import { useAccount } from "../stores/account";

const { hasAccount } = useAccount();
</script>

<template>
  <main class="landing min-vh-100 d-flex flex-column justify-content-end">
    <!-- Background -->
    <div class="landing-bg"></div>
    <div class="overlay"></div>

    <!-- Content -->
    <section class="content position-relative text-white px-4 pb-4">
      <!-- Logo -->
      <div class="mb-4">
        <div
          class="logo bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 d-flex align-items-center justify-content-center"
        >
          <img src="/icon.svg" alt="Bus" />
        </div>
      </div>

      <!-- Heading -->
      <div class="mb-4">
        <span
          class="badge rounded-pill bg-white bg-opacity-10 border border-white border-opacity-25 px-3 py-2 mb-3"
        >
          <i class="bi bi-bus-front-fill me-2"></i>
          Your ride, your way
        </span>

        <h1 class="display-3 fw-bold lh-1 mb-3">
          Ride smarter.<br />
          <span class="text-warning">Go further.</span>
        </h1>

        <p class="lead text-white-50 mb-0">
          Top up, ride, and manage your bus card right from your phone.
        </p>
      </div>

      <!-- Actions -->
      <div class="d-grid gap-3">
        <RouterLink
          to="/auth/login"
          class="btn btn-warning btn-lg rounded-4 fw-semibold py-3 shadow"
        >
          <i class="bi bi-credit-card me-2"></i>
          I have a physical card
        </RouterLink>

        <RouterLink
          to="/auth/register"
          class="btn btn-light btn-lg rounded-4 fw-semibold py-3"
        >
          I don't have a card,
          <span class="text-secondary"> Register</span>
        </RouterLink>
      </div>

      <!-- Bottom indicator -->
      <div class="text-center mt-4">
        <span class="small text-white-50">
          <!-- <i class="bi bi-shield-check me-1"></i> -->
          Powered by Rahisi
        </span>
      </div>
    </section>
  </main>
</template>

<style scoped>
.landing {
  position: relative;
  overflow: hidden;
  background: #111;
}

.landing-bg {
  position: absolute;
  inset: 0;
  background-image: url("/imgs/bus.jpg");
  background-size: cover;
  background-position: center;
  transform: scale(1.03);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.3) 35%,
    rgba(0, 0, 0, 0.88) 78%,
    rgba(0, 0, 0, 0.96) 100%
  );
}

.content {
  z-index: 2;
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
}

.logo {
  width: 64px;
  height: 64px;
  backdrop-filter: blur(12px);
}

.logo img {
  width: 38px;
  height: 38px;
  border-radius: 10px;
}

.btn {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.btn:active {
  transform: scale(0.98);
}

.badge {
  backdrop-filter: blur(10px);
}
</style>
