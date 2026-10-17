<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useInstall } from "../composables/useInstall";
import SheetModal from "./SheetModal.vue";

const { t } = useI18n();
const { installed, platform, install } = useInstall();

const showHelp = ref(false);

// Manual steps for browsers that have no install prompt
const STEPS = {
  ios: [
    {
      icon: "bi-box-arrow-up",
      key: "ios1",
      text: "Tap the Share button in your browser.",
    },
    {
      icon: "bi-plus-square",
      key: "ios2",
      text: "Scroll down and tap “Add to Home Screen”.",
    },
    {
      icon: "bi-check2-circle",
      key: "ios3",
      text: "Tap “Add” in the top corner.",
    },
  ],
  "safari-mac": [
    {
      icon: "bi-menu-button-wide",
      key: "mac1",
      text: "In the menu bar, click File.",
    },
    { icon: "bi-plus-square", key: "mac2", text: "Choose “Add to Dock…”." },
    { icon: "bi-check2-circle", key: "mac3", text: "Click Add." },
  ],
  "firefox-android": [
    {
      icon: "bi-three-dots-vertical",
      key: "ffa1",
      text: "Tap the menu (⋮) in Firefox.",
    },
    { icon: "bi-download", key: "ffa2", text: "Tap “Install”." },
    {
      icon: "bi-check2-circle",
      key: "ffa3",
      text: "Confirm to add ZanBus to your home screen.",
    },
  ],
  "firefox-desktop": [
    {
      icon: "bi-browser-chrome",
      key: "ffd1",
      text: "Firefox on computers can’t install web apps.",
    },
    {
      icon: "bi-box-arrow-up-right",
      key: "ffd2",
      text: "Open this page in Chrome or Edge to install ZanBus.",
    },
  ],
  inapp: [
    { icon: "bi-three-dots", key: "app1", text: "Open the menu in this app." },
    {
      icon: "bi-box-arrow-up-right",
      key: "app2",
      text: "Choose “Open in browser” (Chrome or Safari), then install from there.",
    },
  ],
  generic: [
    {
      icon: "bi-three-dots-vertical",
      key: "gen1",
      text: "Open your browser menu.",
    },
    {
      icon: "bi-download",
      key: "gen2",
      text: "Tap “Install app” or “Add to Home screen”.",
    },
    {
      icon: "bi-check2-circle",
      key: "gen3",
      text: "Confirm to add ZanBus to your device.",
    },
  ],
};

const steps = computed(() =>
  (STEPS[platform] || STEPS.generic).map((s) => ({
    icon: s.icon,
    text: t(`install.steps.${s.key}`, s.text),
  })),
);

async function onClick() {
  const result = await install();
  if (result === "manual") showHelp.value = true;
}
</script>

<template>
  <!-- Hidden once the app is already installed -->
  <div v-if="!installed" class="text-end">
    <button
      type="button"
      class="btn btn-blue2 btn-md rounded-3 fw-semibold w-50 shadow-sm"
      @click="onClick"
    >
      <i class="bi bi-download me-2"></i>Install app
      <!-- {{ t("install.button", "Install the app") }} -->
    </button>

    <SheetModal
      v-model="showHelp"
      :title="t('install.title', 'Install ZanBus')"
      :subtitle="t('install.subtitle', 'Add it to your device in a few taps')"
    >
      <ol class="install-steps">
        <li v-for="(s, i) in steps" :key="i" class="install-step">
          <span class="install-icon"><i class="bi" :class="s.icon"></i></span>
          <span>{{ s.text }}</span>
        </li>
      </ol>
    </SheetModal>
  </div>
</template>

<style scoped>
.install-steps {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.install-step {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
  background: #f8f9fa;
  color: #222;
  font-size: 0.9rem;
  font-weight: 500;
}

.install-icon {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 1.1rem;
  color: var(--blue2);
  background: #e6eefd;
}
</style>
