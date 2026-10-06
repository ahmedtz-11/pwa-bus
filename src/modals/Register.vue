<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { useAccount } from "../../stores/account";
import { useToast } from "../../composables/useToast";

const router = useRouter();
const { signUp } = useAccount();
const { show } = useToast();

const err = ref("");

// Validation rules (return true when valid, or an error message)
const validationSchema = {
  name(value) {
    const v = (value || "").trim();
    if (!v) return "Full name is required";
    if (v.length < 3) return "Name must be at least 3 characters";
    if (!/^[\p{L}\s'.-]+$/u.test(v)) return "Name contains invalid characters";
    return true;
  },
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

const { defineField, handleSubmit, errors, isSubmitting } = useForm({
  validationSchema,
});

// Validate on blur first; once a field has an error, re-validate while typing
const config = (state) => ({
  validateOnModelUpdate: state.errors.length > 0,
});

const [name, nameAttrs] = defineField("name", config);
const [phone, phoneAttrs] = defineField("phone", config);

const submit = handleSubmit((values) => {
  err.value = "";

  try {
    signUp({
      name: values.name.trim(),
      phone: values.phone.replace(/\s+/g, ""),
    });

    show("Account created successfully!");
    router.replace("/home");
  } catch (e) {
    err.value = e.message;
  }
});
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
          <h3 class="fw-bold mb-1 text-blue2">Create an account</h3>
          <p class="text-secondary mb-0">Get a card to start your journey</p>
        </div>

        <form @submit.prevent="submit" novalidate>
          <!-- Name -->
          <div class="mb-3">
            <label class="form-label fw-semibold" for="name">Full name</label>

            <div
              class="input-group input-group-lg field"
              :class="{ 'is-invalid-group': errors.name }"
            >
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-person"></i>
              </span>
              <input
                id="name"
                v-model="name"
                v-bind="nameAttrs"
                type="text"
                autocomplete="name"
                class="form-control bg-light border-start-0"
                placeholder="Your full name"
              />
            </div>
            <!-- <div v-if="errors.name" class="field-error">
              <i class="bi bi-exclamation-circle me-1"></i>{{ errors.name }}
            </div> -->
          </div>

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

          <!-- Server / signUp error -->
          <div v-if="err" class="alert alert-danger rounded-3 py-2 small">
            <i class="bi bi-exclamation-circle me-2"></i>
            {{ err }}
          </div>

          <!-- Button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn btn-blue btn-lg w-100 rounded-3 py-2 fw-semibold mt-2"
          >
            Create account
            <i class="bi bi-arrow-right ms-2"></i>
          </button>
        </form>

        <!-- Login -->
        <div class="text-center mt-4">
          <span class="text-secondary small">Already have an account?</span>
          <RouterLink
            to="/auth/login"
            class="text-green fw-semibold text-decoration-none small ms-1"
          >
            Sign in
          </RouterLink>
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
  width: 230px;
  height: 135px;
}

/* ---------- Form section ---------- */
.form-section {
  border-radius: 30px 30px 0 0;
  margin-top: -40px;
  position: relative;
  z-index: 3;
  overflow: hidden; /* clips the overlay to the rounded corners */
}

/* Overlay image that starts at the bottom of the section */
.form-overlay {
  position: absolute;
  inset: auto 0 0 0; /* left/right/bottom = 0 */
  height: 70%;
  background-image: url("/imgs/card_buildings2.png"); /* <- your image */
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: contain; /* use "cover" to fill the width */
  opacity: 0.7;
  pointer-events: none;
  z-index: 0;
}

.form-container {
  max-width: 520px;
  z-index: 1; /* above the overlay */
}

/* ---------- Inputs ---------- */
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
  background-color: #fff !important; /* overrides .bg-light */
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
