<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();

const goBack = () => router.go(-1);
// Edit the questions and answers here
const items = [
  {
    question: t("user.faq.q1"),
    answer: t("user.faq.a1"),
  },
  {
    question: t("user.faq.q2"),
    answer: t("user.faq.a2"),
  },
  {
    question: t("user.faq.q3"),
    answer: t("user.faq.a3"),
  },
  {
    question: t("user.faq.q4"),
    answer: t("user.faq.a4"),
  },
  {
    question: t("user.faq.q5"),
    answer: t("user.faq.a5"),
  },
  {
    question: t("user.faq.q6"),
    answer: t("user.faq.a6"),
  },
  {
    question: t("user.faq.q7"),
    answer: t("user.faq.a7"),
  },
  {
    question: t("user.faq.q8"),
    answer: t("user.faq.a8"),
  },
];

const openIndex = ref(0); // first question open; null = all closed
const toggle = (i) => (openIndex.value = openIndex.value === i ? null : i);
</script>

<template>
  <main class="auth-page min-vh-100 d-flex flex-column">
    <!-- Image section -->
    <section class="hero position-relative">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>

      <div class="position-relative z-2 h-100 p-3">
        <div
          class="top-bar position-relative d-flex align-items-center justify-content-center"
        >
          <button
            type="button"
            class="back-link position-absolute start-0 text-white text-decoration-none fw-bold border-0 bg-transparent"
            aria-label="Back"
            @click="goBack"
          >
            <i class="bi bi-arrow-left"></i>
          </button>

          <img src="/imgs/zanbus_white.png" alt="Bus" class="logo" />
        </div>

        <div class="text-center mt-3">
          <h5 class="fw-semibold mb-1 text-white">{{ t("user.faq.title") }}</h5>
          <p class="sub">
            {{ t("user.faq.subtitle") }}
          </p>
        </div>
      </div>
    </section>

    <!-- Details section -->
    <section class="form-section bg-white flex-grow-1 px-4 py-4">
      <!-- Decorative overlay image anchored to the bottom -->
      <div class="form-overlay" aria-hidden="true"></div>

      <div class="form-container position-relative mx-auto">
        <!-- Accordion -->
        <div class="info-list mb-3">
          <div
            v-for="(item, i) in items"
            :key="i"
            class="info-card"
            :class="{ open: openIndex === i }"
          >
            <h2 class="faq-heading">
              <button
                :id="`faq-btn-${i}`"
                type="button"
                class="faq-trigger"
                :aria-expanded="openIndex === i"
                :aria-controls="`faq-panel-${i}`"
                @click="toggle(i)"
              >
                <span class="faq-question">{{ item.question }}</span>
                <i class="bi bi-chevron-down faq-icon" aria-hidden="true"></i>
              </button>
            </h2>

            <div
              :id="`faq-panel-${i}`"
              class="faq-panel"
              role="region"
              :aria-labelledby="`faq-btn-${i}`"
            >
              <div class="faq-panel-inner">
                <p class="faq-answer">{{ item.answer }}</p>
              </div>
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

/* ------- Accordion cards ------- */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.6rem;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.03);
  transition: border-color 0.2s ease;
}

.info-card.open {
  border-color: var(--blue2, #1055c9);
}

.faq-heading {
  margin: 0;
  font-size: inherit;
}

.faq-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.8rem 0.9rem;
  border: 0;
  background: transparent;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
}

.faq-trigger:focus-visible {
  outline: 2px solid var(--blue2, #1055c9);
  outline-offset: -2px;
  border-radius: 0.5rem;
}

.faq-question {
  font-size: 0.9rem;
  font-weight: 600;
  color: #222;
  letter-spacing: 0.01em;
}

/* blue accordion icon, rotates when open */
.faq-icon {
  flex: 0 0 auto;
  font-size: 1rem;
  color: var(--blue2, #1055c9);
  transition: transform 0.3s ease;
}

.info-card.open .faq-icon {
  transform: rotate(180deg);
}

/* smooth open / close without knowing the height */
.faq-panel {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  transition:
    grid-template-rows 0.3s ease,
    visibility 0.3s;
}

.info-card.open .faq-panel {
  grid-template-rows: 1fr;
  visibility: visible;
}

.faq-panel-inner {
  min-height: 0;
  overflow: hidden;
}

.faq-answer {
  margin: 0;
  padding: 0 0.9rem 0.9rem;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #555;
}

@media (prefers-reduced-motion: reduce) {
  .faq-panel,
  .faq-icon {
    transition: none;
  }
}
</style>
