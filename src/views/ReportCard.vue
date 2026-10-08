<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAccount } from "../stores/account";
import { useToast } from "../composables/useToast";

const router = useRouter();
const { user, signOut, deactivateAccount } = useAccount();
const { show } = useToast();

const loggingOut = ref(false);
const deactivating = ref(false);
const confirming = ref(false); // shows the "are you sure?" panel

const busy = computed(() => loggingOut.value || deactivating.value);

// 0712345678 -> 0712 345 678
const phone = computed(() =>
  (user.value?.phone || "").replace(/^(\d{4})(\d{3})(\d{3})$/, "$1 $2 $3"),
);

const status = computed(() => user.value?.status || "unknown");

// The four info cards
const items = computed(() => [
  {
    key: "name",
    icon: "bi-person",
    label: "Account holder name",
    value: user.value?.name || "—",
  },
  {
    key: "phone",
    icon: "bi-phone",
    label: "Phone number",
    value: phone.value || "—",
  },
  {
    key: "cards",
    icon: "bi-credit-card",
    label: "Registered cards",
    value: user.value?.cardNo ? "1 card" : "No card",
    sub: user.value?.cardNo
      ? `•••• ${user.value.cardNo.slice(-4)} · ${
          user.value.physical ? "Physical" : "Virtual"
        }`
      : "",
  },
  {
    key: "status",
    icon: "bi-shield-check",
    label: "Account status",
    value: status.value.charAt(0).toUpperCase() + status.value.slice(1),
    tone: status.value === "active" ? "ok" : "bad",
  },
]);

async function logout() {
  if (busy.value) return;
  loggingOut.value = true;

  try {
    await signOut();
    show("You have been logged out");
    router.replace("/");
  } catch (e) {
    show(e.message || "Could not log out. Try again.");
  } finally {
    loggingOut.value = false;
  }
}

async function deactivate() {
  if (busy.value) return;
  deactivating.value = true;

  try {
    await deactivateAccount();
    show("Your account has been deactivated");
    router.replace("/");
  } catch (e) {
    show(e.message || "Could not deactivate the account. Try again.");
    confirming.value = false;
  } finally {
    deactivating.value = false;
  }
}
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
          <h5 class="fw-semibold mb-1 text-white">Account Information</h5>
          <p class="small fw-semibold">
            View and manage your account details
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
              <i class="bi" :class="item.icon"></i>
            </span>

            <div class="info-body">
              <span class="info-label">{{ item.label }}</span>
              <span
                class="info-value"
                :class="{
                  'tone-ok': item.tone === 'ok',
                  'tone-bad': item.tone === 'bad',
                }"
              >
                {{ item.value }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <button
          type="button"
          :disabled="busy"
          class="btn btn-primary btn-md w-100 rounded-3 py-2 fw-semibold mt-2"
          @click="logout"
        >
          <span
            v-if="loggingOut"
            class="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
          ></span>
          <i v-else class="bi bi-box-arrow-right ms-2"></i>
          Logout
        </button>

        <!-- Deactivate: button first, then a confirmation step -->
        <button
          v-if="!confirming"
          type="button"
          :disabled="busy"
          class="btn btn-outline-danger btn-md w-100 rounded-3 py-2 fw-semibold mt-1"
          @click="confirming = true"
        >
          <i class="bi bi-person-slash ms-2"></i>
          Deactivate Account
        </button>

        <div v-else class="confirm-box rounded-3 mt-2 p-3">
          <p class="small mb-3">
            <i class="bi bi-exclamation-triangle-fill text-danger me-1"></i>
            <strong>Deactivate your account?</strong> Your card will stop
            working and you will be signed out.
          </p>

          <div class="d-flex gap-2">
            <button
              type="button"
              class="btn btn-light btn-md flex-fill rounded-3 fw-semibold"
              :disabled="deactivating"
              @click="confirming = false"
            >
              Cancel
            </button>

            <button
              type="button"
              class="btn btn-danger btn-md flex-fill rounded-3 fw-semibold"
              :disabled="busy"
              @click="deactivate"
            >
              <span
                v-if="deactivating"
                class="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              ></span>
              Yes, deactivate
            </button>
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
  /* background: #f8f9fa; */
  /* border: 1px solid #e9ecef; */
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
  /* background: #f8f9fa; */
  border: 1px solid #ddd;
  border-left: 0;
  border-radius: 0 0.5rem 0.5rem 0;
}

.info-label {
  font-size: 0.72rem;
  color: #555;
  letter-spacing: 0.02em;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-sub {
  font-size: 0.75rem;
  color: #6c757d;
}

.status-dot {
  font-size: 0.5rem;
  vertical-align: middle;
  margin-right: 0.25rem;
}

.tone-ok {
  color: #198754;
}

.tone-bad {
  color: #dc3545;
}

.confirm-box {
  background: #fff5f5;
  border: 1px solid #f5c2c7;
}
</style>
