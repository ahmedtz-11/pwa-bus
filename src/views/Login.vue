<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { useAccount } from "../stores/account";
import { useToast } from "../composables/useToast";
import OTPModal from "./modals/OTPModal.vue";

const router = useRouter();
const { signIn } = useAccount();
const { show } = useToast();

const showOtp = ref(false);
const verifying = ref(false);
const otpError = ref("");
const sending = ref(false);

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

// replace with your real API call
async function requestOtp(phoneNumber) {
  await new Promise((r) => setTimeout(r, 600));
  return true;
}

// Step 1: phone is valid -> send OTP -> open modal
const submit = handleSubmit(async (vals) => {
  sending.value = true;
  otpError.value = "";

  try {
    await requestOtp(vals.phone.replace(/\s+/g, ""));
    showOtp.value = true;
  } catch (e) {
    show(e.message || "Could not send the code. Try again.");
  } finally {
    sending.value = false;
  }
});

// Step 2: user entered the code in the modal
async function onVerify(code) {
  verifying.value = true;
  otpError.value = "";

  try {
    // TODO: verify the code with your API. signIn now receives the OTP
    // where it used to receive the password.
    await signIn(values.phone.replace(/\s+/g, ""), code);

    showOtp.value = false;
    show("Welcome back!");
    router.replace("/home");
  } catch (e) {
    otpError.value = e.message || "Invalid code. Try again.";
  } finally {
    verifying.value = false;
  }
}

async function onResend() {
  otpError.value = "";
  try {
    await requestOtp(values.phone.replace(/\s+/g, ""));
    show("A new code has been sent");
  } catch (e) {
    otpError.value = e.message || "Could not resend the code.";
  }
}
</script>

<template>
  <main class="auth-page min-vh-100 d-flex flex-column">
    <!-- Image section -->
    <section class="hero position-relative">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>

      <div class="position-relative z-2 h-100 p-4">
        <!-- Top bar: back button (left) + logo (center) -->
        <div
          class="top-bar position-relative d-flex align-items-center justify-content-center"
        >
          <!-- <RouterLink
            to="/"
            class="back-link position-absolute start-0 text-blue2 text-decoration-none fw-medium"
          >
            <i class="bi bi-arrow-left me-2"></i>
            Back
          </RouterLink> -->

          <img src="/imgs/zanbus_logo.png" alt="Bus" class="logo" />
        </div>
      </div>
    </section>

    <!-- Form section -->
    <section class="form-section bg-white flex-grow-1 px-4 py-4">
      <!-- Decorative overlay image anchored to the bottom -->
      <div class="form-overlay" aria-hidden="true"></div>

      <div class="form-container position-relative mx-auto">
        <div class="mb-3 text-center">
          <h3 class="fw-bold mb-1 text-blue2">Welcome back</h3>
          <p class="text-secondary mb-0">Sign in to continue your journey</p>
        </div>

        <form @submit.prevent="submit" novalidate>
          <!-- Phone -->
          <div class="mb-3">
            <label class="form-label fw-semibold" for="phone">
              Phone number
            </label>

            <div
              class="input-group input-group-lg field"
              :class="{ 'is-invalid-group': errors.phone }"
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
            <!-- <div v-if="errors.phone" class="field-error">
              <i class="bi bi-exclamation-circle me-1"></i>{{ errors.phone }}
            </div> -->
          </div>

          <!-- Button -->
          <button
            type="submit"
            :disabled="sending"
            class="btn btn-blue btn-lg w-100 rounded-3 py-2 fw-semibold mt-2"
          >
            <span
              v-if="sending"
              class="spinner-border spinner-border-sm me-2"
              aria-hidden="true"
            ></span>
            {{ sending ? "Sending code..." : "Send code" }}
            <i v-if="!sending" class="bi bi-arrow-right ms-2"></i>
          </button>
        </form>

        <!-- Register -->
        <div class="text-center mt-4">
          <span class="text-secondary small">Don't have an account?</span>
          <RouterLink
            to="/auth/register"
            class="text-green fw-semibold text-decoration-none small ms-1"
          >
            Register
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- OTP modal -->
    <OTPModal
      v-model="showOtp"
      :phone="values.phone || ''"
      :loading="verifying"
      :error="otpError"
      @verify="onVerify"
      @resend="onResend"
    />
  </main>
</template>

<style scoped>
.auth-page {
  background: #fff;
  overflow: hidden;
}

.hero {
  height: 50vh;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url("/imgs/bus_bg2.png");
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
}

.top-bar {
  min-height: 50px;
}

.logo {
  width: 145px;
  height: 45px;
}

/* ------- Form section ------- */
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
</style>