<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import QrcodeVue from "qrcode.vue";
import { useAccount } from "../stores/account";
import BottomNav from "../components/BottomNav.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const { user } = useAccount();

const goBack = () => router.go(-1);
const tab = ref("qr"); // NFC is coming soon, so QR is the only active tab

// The value encoded in the QR code
const cardNo = computed(() => user.value?.cardNo || "");

const balance = computed(() =>
  Number(user.value?.balance ?? 0).toLocaleString("en-US"),
);
</script>

<template>
  <main class="home-page min-vh-100">
    <div class="home-container px-3 pt-4">
      <!-- Header -->
      <header class="d-flex align-items-center justify-content-between mb-2">
        <button
          type="button"
          class="profile-btn"
          aria-label="Back"
          @click="goBack"
        >
          <i class="bi bi-arrow-left"></i>
        </button>

        <img src="/imgs/zanbus_logo.png" alt="ZanBus" class="logo" />

        <RouterLink
          to="/notification"
          class="profile-btn"
          aria-label="Notifications"
        >
          <i class="bi bi-bell"></i>
        </RouterLink>
      </header>

      <!-- Intro -->
      <section class="rounded-4 p-3 d-flex align-items-center gap-3">
        <div class="min-w-0">
          <h6 class="fw-bold text-dark mb-1">{{ t("user.use_card.title") }}</h6>
          <p class="small mb-0">
            {{ t("user.use_card.subtitle") }}
          </p>
        </div>
        <img src="/imgs/bus_homepage.png" alt="Bus" class="bus" />
      </section>

      <!-- Pill tabs -->
      <div class="pill-tabs mb-2" role="tablist">
        <button
          type="button"
          role="tab"
          class="pill"
          :class="{ active: tab === 'qr' }"
          :aria-selected="tab === 'qr'"
          @click="tab = 'qr'"
        >
          <i class="bi bi-qr-code me-2"></i>{{ t("user.use_card.tab_1.label") }}
        </button>

        <button
          type="button"
          role="tab"
          class="pill"
          aria-selected="false"
          disabled
        >
          <i class="bi bi-broadcast me-2"></i>{{ t("user.use_card.tab_2") }}
        </button>
      </div>

      <!-- Travel banner -->
      <div class="travel-banner my-2">
        <!-- Centered part -->
        <div class="banner-main">
          <i class="bi bi-qr-code-scan travel-icon"></i>
          <h4 class="travel-title">{{ t("user.use_card.tab_1.title") }}</h4>
          <p class="small mb-0">
            {{ t("user.use_card.tab_1.subtitle") }}
          </p>

          <!-- QR code (encodes the card number) -->
          <div class="qr-code my-2">
            <QrcodeVue
              v-if="cardNo"
              :value="cardNo"
              :size="175"
              :margin="0"
              level="M"
              render-as="svg"
              background="#ffffff"
              foreground="#111111"
            />
            <i v-else class="bi bi-qr-code qr-empty"></i>
          </div>

          <p v-if="cardNo" class="small my-0">
            <i class="bi bi-check-circle"></i>
            {{ t("user.use_card.tab_1.label_1") }}
          </p>
          <p v-else class="small my-0">
            <i class="bi bi-exclamation-circle"></i> No card found on this
            account
          </p>
        </div>

        <!-- Footer row: Top Up on the left, balance on the right -->
        <div class="banner-footer">
          <div class="balance">
            <i class="bi bi-wallet icon"></i>
            <div class="balance-text">
              <span class="balance-label">{{
                t("user.use_card.tab_1.label_2")
              }}</span>
              <span class="balance-value">TZS {{ balance }}</span>
            </div>
          </div>

          <RouterLink to="/topup" class="btn btn-outline-light btn2">
            {{ t("user.topup.title") }}
          </RouterLink>
        </div>
      </div>

      <!-- Security banner -->
      <div class="secure-banner mb-3">
        <span class="secure-icon">
          <i class="bi bi-shield-lock-fill"></i>
        </span>
        <div>
          <div class="secure-title">{{ t("user.use_card.title_2") }}</div>
          <div class="secure-text">
            {{ t("user.use_card.subtitle_2") }}
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom navigation -->
    <BottomNav />
  </main>
</template>

<style scoped>
.small {
  font-size: 0.75rem !important;
  color: #888 !important;
  font-weight: 600;
}

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

.logo {
  height: 35px;
  width: 115px;
}

.profile-btn {
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 14px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: #444;
  text-decoration: none;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
  transition: transform 0.25s ease;
}

.profile-btn:active {
  transform: scale(0.9);
}

.bus {
  flex: 0 0 auto;
  width: 95px;
  height: auto;
}

.min-w-0 {
  min-width: 0;
}

/* ------- Pill tabs ------- */
.pill-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.3rem;
  padding: 0.25rem;
  background: #eee;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.pill {
  border: 0;
  padding: 0.25rem;
  border-radius: 6px;
  background: transparent;
  color: #444;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  transition:
    background-color 0.25s ease,
    color 0.25s ease;
}

.pill.active {
  background: #01284e;
  color: #fff;
}

.pill:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* ------- Travel banner ------- */
.travel-banner {
  padding: 0.65rem 1rem;
  background: #01284e;
  border: 1px solid rgb(207, 223, 253);
  border-radius: 1.5rem;
  box-shadow: 0 4px 10px rgba(var(--blue-rgb, 13, 110, 253), 0.2);
}

/* everything above the line is centered */
.banner-main {
  text-align: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

.travel-icon {
  width: 38px;
  height: 38px;
  margin: 0.25rem auto 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #eee;
  font-size: 1.25rem;
  border-radius: 50%;
  background: linear-gradient(to right, #27c099, var(--blue2));
}

.travel-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

/* white box, QR centered inside it */
.qr-code {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  margin-inline: auto;
  background: #fff;
  border-radius: 0.75rem;
}

.qr-empty {
  font-size: 6rem;
  color: #bbb;
}

.banner-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
  text-align: left;
}

.btn2 {
  padding: 0.4rem !important;
  width: 35% !important;
  font-weight: 700;
  color: #27c099;
  border-radius: 12px !important;
  background: transparent !important;
  border: 1px solid #27c099 !important;
}

.balance {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.icon {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #27c099;
  font-size: 1.2rem;
  border-radius: 25%;
  background: rgba(255, 255, 255, 0.1);
}

.balance-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.balance-label {
  font-size: 0.7rem;
  color: #aab4c0;
}

.balance-value {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

/* ------- Security banner ------- */
.secure-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem;
  background: #f0f4fc;
  border: 1px solid rgb(207, 223, 253);
  border-radius: 0.75rem;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
}

.secure-icon {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--blue1);
  font-size: 1.3rem;
}

.secure-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--blue1);
}

.secure-text {
  font-size: 0.75rem;
  line-height: 1.35;
  color: #1055c9;
}
</style>
