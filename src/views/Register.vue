<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAccount } from "../stores/account";
import { useToast } from "../composables/useToast";

const router = useRouter();
const { signUp } = useAccount();
const { show } = useToast();

const form = reactive({
  name: "",
  phone: ""
});

const err = ref("");

function submit() {
  err.value = "";

  try {
    // Hardcoded registration data for now
    signUp({
      name: form.name || "John Doe",
      phone: form.phone || "0712345678",
      pass: form.pass || "123456",
    });

    show("Account created successfully!");
    router.replace("/home");
  } catch (e) {
    err.value = e.message;
  }
}
</script>

<template>
  <main class="auth-page min-vh-100 d-flex flex-column">
    <!-- Image section -->
    <section class="hero position-relative">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>

      <div class="position-relative z-2 h-100 p-4 d-flex flex-column">
        <RouterLink to="/" class="text-white text-decoration-none fw-medium">
          <i class="bi bi-arrow-left me-2"></i>
          Back
        </RouterLink>

        <div class="mt-auto text-white">
          <div
            class="logo bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 d-flex align-items-center justify-content-center mb-3"
          >
            <img src="/icon.svg" alt="Bus" />
          </div>

          <h3 class="fw-bold mb-1">
            Start your<br />
            <span class="text-warning">journey.</span>
          </h3>

          <p class="text-white-50 mb-0">
            Create your account and get your virtual card.
          </p>
        </div>
      </div>
    </section>

    <!-- Form section -->
    <section class="form-section bg-white flex-grow-1 px-4 py-4">
      <div class="form-container mx-auto">
        <div class="mb-4">
          <h2 class="fw-bold mb-1">Create account</h2>

          <p class="text-secondary mb-0">
            We'll create a free virtual bus card for you.
          </p>
        </div>

        <form @submit.prevent="submit">
          <!-- Name -->
          <div class="mb-3">
            <label class="form-label fw-semibold"> Full name </label>

            <div class="input-group input-group-lg">
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-person"></i>
              </span>

              <input
                v-model="form.name"
                type="text"
                autocomplete="name"
                class="form-control bg-light border-start-0"
                placeholder="Your full name"
              />
            </div>
          </div>

          <!-- Phone -->
          <div class="mb-3">
            <label class="form-label fw-semibold"> Phone number </label>

            <div class="input-group input-group-lg">
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-phone"></i>
              </span>

              <input
                v-model="form.phone"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                class="form-control bg-light border-start-0"
                placeholder="0712 345 678"
              />
            </div>
          </div>
          <!-- Error -->
          <div v-if="err" class="alert alert-danger rounded-3 py-2 small">
            <i class="bi bi-exclamation-circle me-2"></i>
            {{ err }}
          </div>

          <!-- Button -->
          <button
            type="submit"
            class="btn btn-warning btn-lg w-100 rounded-2 py-2 fw-semibold mt-2"
          >
            Create account
            <i class="bi bi-arrow-right ms-2"></i>
          </button>
        </form>

        <!-- Login -->
        <div class="text-center mt-4">
          <span class="text-secondary small"> Already have an account? </span>

          <RouterLink
            to="/auth/login"
            class="text-success fw-semibold text-decoration-none small ms-1"
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
  height: 45vh;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url("/imgs/bus.jpg");
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.75)
  );
}

.logo {
  width: 56px;
  height: 56px;
  backdrop-filter: blur(10px);
}

.logo img {
  width: 34px;
  height: 34px;
  border-radius: 9px;
}

.form-section {
  border-radius: 25px 25px 0 0;
  margin-top: -45px;
  position: relative;
  z-index: 3;
}

.form-container {
  max-width: 520px;
}

.form-control,
.input-group-text {
  border-color: #e9ecef;
}

.form-control:focus {
  box-shadow: none;
  border-color: #ffc107;
}

.input-group-text {
  color: #6c757d;
}
</style>
