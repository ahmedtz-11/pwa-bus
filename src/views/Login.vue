<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAccount } from "../stores/account";
import { useToast } from "../composables/useToast";

const router = useRouter();
const { signIn } = useAccount();
const { show } = useToast();

const f = reactive({
  phone: "",
  pass: "",
});

const err = ref("");

function submit() {
  err.value = "";

  try {
    // Hardcoded login for now
    signIn(f.phone || "0712345678", f.pass || "123456");

    show("Welcome back!");
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
            Welcome<br />
            <span class="text-info">back.</span>
          </h3>

          <p class="text-white-50 mb-0">Your journey starts here.</p>
        </div>
      </div>
    </section>

    <!-- Form section -->
    <section class="form-section bg-white flex-grow-3 px-4 py-4">
      <div class="form-container mx-auto">
        <div class="mb-4">
          <h2 class="fw-bold mb-1">Sign in</h2>
          <p class="text-secondary mb-0">
            Access your bus account and manage your rides.
          </p>
        </div>

        <form @submit.prevent="submit">
          <!-- Phone -->
          <div class="mb-3">
            <label class="form-label fw-semibold"> Phone number </label>

            <div class="input-group input-group-lg">
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-phone"></i>
              </span>

              <input
                v-model="f.phone"
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
            class="btn btn-info btn-lg w-100 rounded-2 py-2 fw-semibold mt-2 shadow-sm"
          >
            Login
            <i class="bi bi-arrow-right ms-2"></i>
          </button>
        </form>

        <!-- Register -->
        <div class="text-center mt-4">
          <span class="text-secondary small"> Don't have an account?</span>

          <RouterLink
            to="/auth/register"
            class="text-success fw-semibold text-decoration-none small ms-1"
          >
            Register
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
  /* min-height: 360px; */
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

.hero h1 {
  font-size: 3rem;
  line-height: 0.95;
}

.form-section {
  border-radius: 28px 28px 0 0;
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
  border-color: #0dcaf0;
}

.input-group-text {
  color: #6c757d;
}
</style>