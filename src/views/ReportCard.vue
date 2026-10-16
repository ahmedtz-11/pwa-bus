<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { useAccount } from "../stores/account";
import { useToast } from "../composables/useToast";
import BottomNav from "../components/BottomNav.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const { user, reportCardLost } = useAccount();
const { show } = useToast();

// Go back, or home if the page was opened directly
const goBack = () =>
  window.history.length > 1 ? router.back() : router.replace("/home");

// Only physical cards can be reported as lost
const cards = computed(() =>
  user.value?.cardNo && user.value.physical
    ? [
        {
          value: user.value.cardNo,
          label: `•••• ${user.value.cardNo.slice(-6)}`,
        },
      ]
    : [],
);

const defaultCard = computed(() => cards.value[0]?.value || "");
const alreadyBlocked = computed(() => user.value?.status === "blocked");

// Validation rules (return true when valid, or an error message)
const validationSchema = {
  card(value) {
    const v = (value || "").replace(/\s+/g, "");
    if (!v) return "Select the card you want to report";
    if (!/^\d{16}$/.test(v)) return "Card number must be 16 digits";
    return true;
  },
  confirm(value) {
    return value === true || "Please confirm to continue";
  },
};

const { defineField, handleSubmit, errors, isSubmitting } = useForm({
  validationSchema,
  initialValues: { card: defaultCard.value, confirm: false },
});

// once a field has an error, re-validate while typing
const config = (state) => ({
  validateOnModelUpdate: state.errors.length > 0,
});

const [card, cardAttrs] = defineField("card", config);
const [confirm, confirmAttrs] = defineField("confirm", config);

const canSubmit = computed(
  () => cards.value.length > 0 && !alreadyBlocked.value && !isSubmitting.value,
);

const submit = handleSubmit(async (vals) => {
  try {
    await reportCardLost(vals.card);
    show("Card reported as lost and blocked");
    router.replace("/home");
  } catch (e) {
    show(e.message || "Could not report the card. Try again.");
  }
});
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
          <h6 class="fw-bold text-dark mb-1">{{ t("user.report.title") }}</h6>
          <p class="small mb-0">
            {{ t("user.report.subtitle") }}
          </p>
        </div>
        <i class="bi bi-exclamation-triangle warning-icon"></i>
      </section>

      <form novalidate @submit.prevent="submit">
        <!-- Step 1 -->
        <div class="white-banner mb-2">
          <span class="white-icon">
            <i class="bi bi-1-circle-fill"></i>
          </span>
          <div class="flex-grow-1 min-w-0">
            <h6 class="fw-bold text-dark mb-1">{{ t("user.report.label_1") }}</h6>
            <div class="small text-muted mb-2">
              {{ t("user.report.holder_1") }}
            </div>

            <div v-if="alreadyBlocked" class="notice mb-2">
              <i class="bi bi-slash-circle me-1"></i>
              Your card is already blocked.
            </div>

            <div class="mb-1">
              <div
                class="input-group input-group-lg field"
                :class="{ 'is-invalid-group': errors.card }"
              >
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-credit-card"></i>
                </span>
                <select
                  id="card"
                  v-model="card"
                  v-bind="cardAttrs"
                  class="form-select bg-light border-start-0"
                  :disabled="!cards.length || alreadyBlocked"
                >
                  <option value="" disabled>
                    {{
                      cards.length
                        ? "Select a card"
                        : "No physical cards available"
                    }}
                  </option>
                  <option v-for="c in cards" :key="c.value" :value="c.value">
                    {{ c.label }}
                  </option>
                </select>
              </div>

              <div v-if="errors.card" class="field-error">
                <i class="bi bi-exclamation-circle me-1"></i>{{ errors.card }}
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="white-banner mb-2">
          <span class="white-icon">
            <i class="bi bi-2-circle-fill"></i>
          </span>
          <div class="flex-grow-1 min-w-0">
            <h6 class="fw-bold text-dark mb-1">{{ t("user.report.label_2") }}</h6>
            <div class="small text-muted mb-2">
              {{ t("user.report.holder_2") }}
            </div>

            <div class="secure-banner">
              <span class="secure-icon">
                <i class="bi bi-shield-shaded"></i>
              </span>
              <div>
                <h6 class="fw-bold text-danger mb-1">
                  {{ t("user.report.warning_title") }}
                </h6>
                <div class="small text-muted">
                  {{ t("user.report.warning_subtitle") }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="white-banner mb-3">
          <span class="white-icon">
            <i class="bi bi-3-circle-fill"></i>
          </span>
          <div class="flex-grow-1 min-w-0">
            <h6 class="fw-bold text-dark mb-1">{{ t("user.report.label_3") }}</h6>
            <div class="small text-muted">
              {{ t("user.report.holder_3") }}
            </div>

            <div class="form-check confirm-check mt-2">
              <input
                id="confirm"
                v-model="confirm"
                v-bind="confirmAttrs"
                type="checkbox"
                class="form-check-input"
                :class="{ 'is-invalid': errors.confirm }"
                :disabled="!cards.length || alreadyBlocked"
              />
              <!-- :disabled="!cards.length || alreadyBlocked" -->
              <label class="form-check-label small" for="confirm">
                {{ t("user.report.confirm") }}
              </label>
            </div>

            <div v-if="errors.confirm" class="field-error">
              <i class="bi bi-exclamation-circle me-1"></i>{{ errors.confirm }}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <button
          type="submit"
          :disabled="!canSubmit"
          class="btn btn-primary btn-md w-100 rounded-3 py-2 fw-semibold mt-2"
        >
          <span
            v-if="isSubmitting"
            class="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
          ></span>
          <i v-else class="bi bi-exclamation-triangle-fill ms-2"></i>
          {{ t("user.report.btn_1") }}
        </button>

        <button
          type="button"
          :disabled="isSubmitting"
          class="btn btn-outline-primary btn-md w-100 rounded-3 py-2 fw-semibold mt-1"
          @click="goBack"
        >
          {{ t("user.report.btn_2") }}
        </button>
      </form>
    </div>

    <!-- Bottom navigation -->
    <BottomNav />
  </main>
</template>

<style scoped>
.small {
  font-size: 0.8rem !important;
  color: #555 !important;
  font-weight: 500;
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

.min-w-0 {
  min-width: 0;
}

.warning-icon {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  margin: 0.25rem auto 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ee2222;
  font-size: 1.25rem;
  border-radius: 50%;
  background: #ffd9d9;
}

/* ------- Step rows ------- */
.white-banner {
  display: flex;
  gap: 0.4rem;
  padding: 0.5rem;
}

.white-icon {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1055c9;
  font-size: 1.3rem;
}

.notice {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: #fff3cd;
  color: #664d03;
  font-size: 0.8rem;
  font-weight: 600;
}

/* ------- Info banner ------- */
.secure-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem;
  background: #fae6e6;
  border: 1px solid #fdbdbd;
  border-radius: 0.75rem;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
}

.secure-banner h6 {
  font-size: 0.8rem !important;
}

.secure-icon {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ee2222;
  font-size: 1.3rem;
}

/* ------- Confirm checkbox ------- */
.confirm-check{
  display: flex;
  gap: 0.4rem;
  background: #e2eafc;
  padding: 0.6rem;
  border: 1px solid #bcd4fc;
  border-radius: 0.75rem;
  color: #1055c9 !important;
}

.confirm-check .form-check-input {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #1055c9;
}

.confirm-check .form-check-input:checked {
  background-color: var(--blue, #0d6efd);
  border-color: var(--blue, #0d6efd);
}

.confirm-check .form-check-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(var(--blue-rgb, 13, 110, 253), 0.15);
  border-color: var(--blue, #0d6efd);
}

/* ------- Inputs ------- */
.form-select {
  border-color: #e9ecef;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.input-group-text {
  color: var(--blue1);
  border-color: #e9ecef;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.form-select:focus {
  box-shadow: none;
}

.field {
  border-radius: 0.5rem;
  transition: box-shadow 0.2s ease;
}

.field:focus-within {
  box-shadow: 0 0 0 0.2rem rgba(var(--blue-rgb, 13, 110, 253), 0.15);
}

.field:focus-within .form-select,
.field:focus-within .input-group-text {
  border-color: var(--blue);
  background-color: #fff !important;
}

.field:focus-within .input-group-text {
  color: var(--blue);
}

/* Error state */
.field.is-invalid-group .form-select,
.field.is-invalid-group .input-group-text {
  border-color: #dc3545;
}

.field.is-invalid-group .input-group-text {
  color: #dc3545;
}

.field.is-invalid-group:focus-within {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.15);
}

.field-error {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.35rem;
}
</style>
