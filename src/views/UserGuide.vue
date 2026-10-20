<script setup>
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const goBack = () => {
  router.go(-1);
};

const steps = [
  t("user.guide.desc_1"),
  t("user.guide.desc_2"),
  t("user.guide.desc_3"),
  t("user.guide.desc_4"),
  t("user.guide.desc_5"),
  t("user.guide.desc_6"),
  t("user.guide.desc_7"),
  t("user.guide.desc_8")
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
          <h5 class="fw-semibold mb-1 text-white">{{ t("user.guide.title") }}</h5>
          <p class="sub">{{ t("user.guide.subtitle") }}</p>
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
            <div class="secure-title">{{ t("user.guide.label_1") }}</div>
            <div class="secure-text">{{ t("user.guide.label_2") }}</div>
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
  color: var(--blue1);
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
  font-size: 0.9rem;
  font-weight: 700;
  color: #1055c9;
}

.secure-text {
  font-size: 0.8rem;
  line-height: 1.35;
  color: var(--blue1);
}
</style>
