<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const goBack = () => {
  router.go(-1);
};

const items = computed(() => [
  {
    key: "name",
    label: "Card has been deactivated",
    value: "Your card has been deactivated after being reported. Visit near ZanBus agent to get new card.",
  },
  {
    key: "name",
    label: "New card created",
    value: "You have received a new card. The card number is 2230 0001 009 1234. Happy trip with ZanBus.",
  },
]);
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
          <button
            @click="goBack"
            class="back-link position-absolute start-0 text-white text-decoration-none fw-bold border-0 bg-transparent"
            aria-label="Back"
          >
            <i class="bi bi-arrow-left"></i>
          </button>

          <img src="/imgs/zanbus_white.png" alt="Bus" class="logo" />
        </div>

        <div class="text-center mt-3">
          <h5 class="fw-semibold mb-1 text-white">{{ t("user.notification.title") }}</h5>
          <p class="small fw-semibold">
            {{ t("user.notification.subtitle") }}
          </p>
        </div>
      </div>
    </section>

    <!-- Details section -->
    <section class="form-section bg-white flex-grow-1 px-4 py-4">
      <!-- Decorative overlay image anchored to the bottom -->
      <div class="form-overlay" aria-hidden="true"></div>

      <div class="form-container position-relative mx-auto">
        <!-- Info cards -->
        <div class="info-list mb-3">
          <div v-for="item in items" :key="item.key" class="info-card">
            <span class="info-icon">
              <i class="bi bi-bell"></i>
            </span>

            <div class="info-body">
              <span class="info-label">{{ item.label }}</span>
              <span
                class="info-value"
              >
                {{ item.value }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  background: #fff;
  overflow: hidden;
}

.small {
  font-size: 0.7rem !important;
  color: #aaa !important;
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

/* ------- Info cards (same look as the old inputs) ------- */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
  color: var(--blue2);
  border: 1px solid #ddd;
  border-right: 0;
  border-radius: 0.5rem 0 0 0.5rem;
}

.info-body {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.6rem 1rem 0.6rem 0.25rem;
  border: 1px solid #ddd;
  border-left: 0;
  border-radius: 0 0.5rem 0.5rem 0;
}

.info-label {
  font-size: 0.85rem;
  color: var(--blue2);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.info-value {
  font-size: 0.8rem;
  font-weight: 500;
  color: #666;
  overflow: hidden;
  text-align: justify;
  /* text-overflow: ellipsis; */
  /* white-space: nowrap; */
}
</style>
