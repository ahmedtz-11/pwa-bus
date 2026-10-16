<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { useAccount } from "../stores/account";
import { useToast } from "../composables/useToast";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const { user } = useAccount();
const { show } = useToast();

const paying = ref(false);
const goBack = () => router.go(-1);

// Validation
const validationSchema = {
  phone(value) {
    const v = (value || "").replace(/\s+/g, "");
    if (!v) return "Phone number is required";
    // 0712345678, 255712345678 or +255712345678
    if (!/^(0|\+?255)[67]\d{8}$/.test(v)) {
      return "Enter a valid phone number, e.g. 0712 345 678";
    }
    return true;
  },
};

const { defineField, handleSubmit, errors, values } = useForm({
  validationSchema,
});

// once a field has an error, re-validate while typing
const [phone, phoneAttrs] = defineField("phone", (state) => ({
  validateOnModelUpdate: state.errors.length > 0,
}));

const fmt = (n) => Number(n).toLocaleString("en-US");

// TODO: replace with your real payment API call
async function startPayment(payload) {
  await new Promise((r) => setTimeout(r, 800));
  return payload;
}

const submit = handleSubmit(async (vals) => {
  paying.value = true;

  try {
    await startPayment({
      phone: vals.phone.replace(/\s+/g, ""),
    });
    show("Redirecting to payment...");
  } catch (e) {
    show(e.message || "Could not start the payment. Try again.");
  } finally {
    paying.value = false;
  }
});
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
          <h5 class="fw-semibold mb-1 text-white">
            {{ t("user.topup.title") }}
          </h5>
          <p class="hero-sub fw-semibold">{{ t("user.topup.subtitle2") }}</p>
        </div>
      </div>
    </section>

    <!-- Form section -->
    <section class="form-section bg-white flex-grow-1 px-4 py-4">
      <!-- Overlay image to the bottom -->
      <div class="form-overlay" aria-hidden="true"></div>

      <div class="form-container position-relative mx-auto">
        <div class="yas-banner my-2">
          <img src="/imgs/mixByYas.png" alt="Bus" class="yas-logo" />
        </div>

        <h5 class="small fw-semibold mt-3 ms-1">Payment Details</h5>
        <div class="travel-banner my-2">
          <!-- Centered part -->
          <div class="banner-main">
            <h6 class="small">Card to top up</h6>
            <h6 class="small fw-semibold">6595 9482 4799 4517</h6>
          </div>
          <div class="banner-footer">
            <h6 class="small">Amount to pay</h6>
            <h6 class="small fw-semibold text-blue1">TZS 2,000</h6>
          </div>
        </div>

        <form @submit.prevent="submit" novalidate>
          <!-- Card: dropdown (my card) -->
          <div class="mb-3">
            <label class="form-label fw-semibold" for="card">
              YAS Phone Number
            </label>

            <div
              class="input-group input-group-lg field"
              :class="{ 'is-invalid-group': errors.card }"
            >
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-phone"></i>
              </span>
              <input
                id="phone"
                v-model="phone"
                v-bind="phoneAttrs"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                class="form-control bg-light border-start-0"
                placeholder="0712 345 678"
              />
            </div>
            <div v-if="errors.card" class="field-error">
              <i class="bi bi-exclamation-circle me-1"></i>{{ errors.card }}
            </div>
          </div>

          <!-- Security banner -->
          <div class="secure-banner mb-3">
            <span class="secure-icon">
              <i class="bi bi-info-circle"></i>
            </span>
            <div>
              <!-- <div class="secure-title">{{ t("user.topup.title_2") }}</div> -->
              <div class="secure-text">
                Enter the YAS number that should receive the payment prompt,
                then approve the request on your phone.
              </div>
            </div>
          </div>

          <!-- Button -->
          <button
            type="submit"
            :disabled="paying"
            class="btn btn-primary btn-md w-100 rounded-3 py-2 fw-semibold"
          >
            <span
              v-if="paying"
              class="spinner-border spinner-border-sm me-2"
              aria-hidden="true"
            ></span>
            <!-- {{ t("user.topup.btn_1") }} -->
            Pay TZS 2,000
          </button>
        </form>
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
  font-size: 0.75rem;
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

/* ------- Form section ------- */
.yas-banner {
  padding: 0.6rem 1rem;
  background: #fcd10b;
  border-radius: 1.1rem;
  text-align: center;
}

.yas-logo {
  width: 185px;
  height: 80px;
}

.travel-banner {
  padding: 0.65rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 1rem;
}

.banner-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
}

.banner-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
  text-align: left;
}

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
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

.form-container {
  max-width: 520px;
  z-index: 1;
}

/* ------- Inputs ------- */
.form-control,
.input-group-text {
  border-color: #e9ecef;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.input-group-text {
  color: #6c757d;
}

.form-control:focus {
  box-shadow: none;
}

/* Focus: input AND icon get the same border color + glow */
.field {
  border-radius: 0.5rem;
  transition: box-shadow 0.2s ease;
}

.field:focus-within {
  box-shadow: 0 0 0 0.2rem rgba(var(--blue-rgb, 13, 110, 253), 0.15);
}

.field:focus-within .form-control,
.field:focus-within .input-group-text {
  border-color: var(--blue);
  background-color: #fff !important;
}

.field:focus-within .input-group-text {
  color: var(--blue);
}

/* Error state */
.field.is-invalid-group .form-control,
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

/* ------- Security banner ------- */
.secure-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  background: #fdf7da;
  /* border: 1px solid #cfead7; */
  border-radius: 0.75rem;
}

.secure-icon {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9a710;
  font-size: 1.3rem;
}

.secure-text {
  font-size: 0.75rem;
  line-height: 1.35;
  color: #a18a24;
}
</style>