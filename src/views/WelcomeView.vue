<script setup>
import { useI18n } from "vue-i18n";
import InstallButton from "../components/InstallButton.vue";

const { t } = useI18n();
</script>

<template>
  <main class="landing min-vh-100 d-flex flex-column">
    <!-- Background -->
    <div class="landing-bg"></div>
    <div class="overlay"></div>

    <!-- Content -->
    <section
      class="content position-relative text-white px-4 pb-4 d-flex flex-column flex-grow-1"
    >
      <InstallButton />
      <!-- Top block: logo + heading (sits higher, centered in the free space) -->
      <div
        class="hero flex-grow-1 d-flex flex-column justify-content-center align-items-center"
      >
        <!-- Logo -->
        <img src="/imgs/zanbus_logo.png" alt="Bus" class="mb-2 logo" />

        <!-- Heading -->
        <div>
          <!-- <span
            class="badge rounded-pill bg-white bg-opacity-10 border border-white border-opacity-25 px-3 py-2 mb-3"
          >
            <i class="bi bi-bus-front-fill me-2"></i>
            Your ride, your way
          </span> -->

          <h1 class="display-4 fw-bold lh-1 mb-3 text-center text-blue2">
            {{ t("home.welcome.label_1") }} <br /><span class="text-green"
              >{{ t("home.welcome.label_2") }}
            </span>
            Zanzibar
          </h1>

          <p class="text-lead text-white mb-0 text-center">
            {{ t("home.welcome.label_4") }}
          </p>

          <!-- <InstallButton /> -->
        </div>
      </div>

      <!-- Bottom block: actions -->
      <div>
        <div class="d-grid gap-3">
          <RouterLink
            to="/auth/login"
            class="btn btn-blue btn-lg rounded-4 fw-semibold py-3 shadow"
          >
            <i class="bi bi-credit-card me-2"></i>
            {{ t("home.welcome.btn_1") }}
          </RouterLink>

          <RouterLink
            to="/auth/register"
            class="btn btn-white btn-lg rounded-4 fw-semibold py-3"
          >
            {{ t("home.welcome.btn_2") }},
            <span class="text-green"> {{ t("home.welcome.register") }}</span>
          </RouterLink>
        </div>

        <!-- Bottom indicator -->
        <div class="text-center mt-4">
          <span class="small text-white-50"
            >{{ t("home.welcome.powered_by") }} Rahisi</span
          >
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.landing {
  position: relative;
  overflow: hidden;
}

.landing-bg {
  position: absolute;
  inset: 0;
  background-image: url("/imgs/bus_bg.png");
  background-size: cover;
  background-position: center;
  transform: scale(1.03);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.01) 0%,
    rgba(0, 0, 0, 0.1) 43%,
    rgba(0, 0, 0, 0.85) 100%
  );
}

.content {
  z-index: 2;
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
}

.hero {
  padding-bottom: 3rem;
}

.logo {
  width: 145px;
  height: 45px;
}

.btn {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.btn:active {
  transform: scale(0.98);
}

.badge {
  backdrop-filter: blur(10px);
}
</style>
