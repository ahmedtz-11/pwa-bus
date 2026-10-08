<script setup>
import { computed, reactive, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAccount } from "../stores/account";
import { useToast } from "../composables/useToast";
import BottomNav from "../components/BottomNav.vue";
import SheetModal from "../components/SheetModal.vue";

const router = useRouter();
const { signOut } = useAccount();
const { show } = useToast();

// TODO: replace with your real support details / app version
const SUPPORT_PHONE = "+255 700 000 000";
const SUPPORT_EMAIL = "support@zanbus.co.tz";
const APP_VERSION = "1.0.0";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "sw", label: "Kiswahili" },
];

const THEMES = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

// ---------- Saved settings (localStorage) ----------
const STORAGE_KEY = "busgo_settings";
const defaults = {
  notifications: true,
  biometric: false,
  language: "en",
  theme: "light",
};

function load() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return { ...defaults };
  }
}

const settings = reactive(load());

watch(
  settings,
  () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  },
  { deep: true },
);

const languageLabel = computed(
  () => LANGUAGES.find((l) => l.value === settings.language)?.label,
);

const themeLabel = computed(
  () => THEMES.find((t) => t.value === settings.theme)?.label,
);

// ---------- Modals ----------
const modal = ref(null); // "language" | "theme" | "contact" | "about" | "logout"
const loggingOut = ref(false);

const open = (name) => (modal.value = name);
const close = () => (modal.value = null);

// ---------- Setting categories ----------
// type: "link" (opens a page) | "toggle" (on/off) | "modal" (opens a sheet)
const sections = computed(() => [
  {
    title: "Transactions",
    items: [
      {
        key: "history",
        icon: "bi-clock-history",
        title: "Transaction history",
        subtitle: "View all your card trasactions",
        type: "link",
        to: "/transactions",
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        key: "language",
        icon: "bi-translate",
        title: "Language",
        subtitle: languageLabel.value,
        type: "modal",
        modal: "language",
      },
      {
        key: "notifications",
        icon: "bi-bell",
        title: "Notifications",
        subtitle: "Manage your notification preferences",
        type: "toggle",
      },
      {
        key: "biometric",
        icon: "bi-fingerprint",
        title: "Biometric login",
        subtitle: "Use Face ID or fingerprint for faster login",
        type: "toggle",
      },
      {
        key: "theme",
        icon: "bi-palette",
        title: "App Theme",
        subtitle: themeLabel.value,
        type: "modal",
        modal: "theme",
      },
    ],
  },
  {
    title: "Help & Support",
    items: [
      {
        key: "faq",
        icon: "bi-question-circle",
        title: "FAQs",
        subtitle: "Answers to common questions",
        type: "link",
        to: "/faq",
      },
      {
        key: "contact",
        icon: "bi-headset",
        title: "Help Center",
        subtitle: "Call or email our team",
        type: "modal",
        modal: "contact",
      },
      {
        key: "report",
        icon: "bi-book-half",
        title: "User Guide",
        subtitle: "A complete guide to using ZanBus",
        type: "link",
        to: "/guide",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        key: "account",
        icon: "bi-person-circle",
        title: "Account Information",
        subtitle: "View your account details",
        type: "link",
        to: "/account",
      },
      {
        key: "logout",
        icon: "bi-box-arrow-right",
        title: "Log out",
        subtitle: "Sign out of this device",
        type: "modal",
        modal: "logout",
        danger: true,
      },
    ],
  },
  {
    title: "About",
    items: [
      {
        key: "about",
        icon: "bi-info-circle",
        title: "About ZanBus",
        subtitle: `Version ${APP_VERSION}`,
        type: "modal",
        modal: "about",
      },
    ],
  },
]);

// ---------- Row helpers ----------
const tagFor = (item) =>
  item.type === "link"
    ? RouterLink
    : item.type === "toggle"
      ? "label"
      : "button";

const attrsFor = (item) => {
  if (item.type === "link") return { to: item.to };
  if (item.type === "modal")
    return { type: "button", onClick: () => open(item.modal) };
  return {};
};

function onToggle(item, checked) {
  settings[item.key] = checked;
  show(`${item.title} ${checked ? "on" : "off"}`);
}

function pickLanguage(value) {
  settings.language = value;
  close();
}

function pickTheme(value) {
  settings.theme = value;
  close();
}

async function logout() {
  if (loggingOut.value) return;
  loggingOut.value = true;

  try {
    await signOut();
    close();
    show("You have been logged out");
    router.replace("/");
  } catch (e) {
    show(e.message || "Could not log out. Try again.");
  } finally {
    loggingOut.value = false;
  }
}
</script>

<template>
  <main class="home-page min-vh-100">
    <div class="home-container px-3 pt-4">
      <!-- Header -->
      <header class="d-flex align-items-center justify-content-between mb-2">
        <img src="/imgs/zanbus_logo.png" alt="ZanBus" class="logo" />

        <button class="profile-btn" type="button" aria-label="Notifications">
          <i class="bi bi-bell"></i>
        </button>
      </header>

      <div class="mb-3">
        <h5 class="fw-bold mb-1">Settings</h5>
        <p class="page-sub fw-bold mb-0">Manage your preferences and account</p>
      </div>

      <!-- Categories -->
      <section v-for="section in sections" :key="section.title" class="mb-4">
        <h6 class="section-title">{{ section.title }}</h6>

        <div class="section-card">
          <component
            :is="tagFor(item)"
            v-for="item in section.items"
            :key="item.key"
            v-bind="attrsFor(item)"
            class="row-item"
            :class="{ danger: item.danger }"
          >
            <span class="row-icon">
              <i class="bi" :class="item.icon"></i>
            </span>

            <span class="row-text">
              <span class="row-title">{{ item.title }}</span>
              <span class="row-sub">{{ item.subtitle }}</span>
            </span>

            <!-- Toggle -->
            <template v-if="item.type === 'toggle'">
              <input
                type="checkbox"
                role="switch"
                class="switch-input"
                :checked="settings[item.key]"
                :aria-label="item.title"
                @change="onToggle(item, $event.target.checked)"
              />
              <span class="switch-track" aria-hidden="true"></span>
            </template>

            <!-- Link / modal -->
            <i v-else class="bi bi-chevron-right row-chevron"></i>
          </component>
        </div>
      </section>
    </div>

    <!-- Language -->
    <SheetModal
      :model-value="modal === 'language'"
      title="Language"
      subtitle="Choose the app language"
      @update:model-value="close"
    >
      <div class="choice-list">
        <button
          v-for="l in LANGUAGES"
          :key="l.value"
          type="button"
          class="choice"
          :class="{ active: settings.language === l.value }"
          @click="pickLanguage(l.value)"
        >
          {{ l.label }}
          <i
            v-if="settings.language === l.value"
            class="bi bi-check-circle-fill"
          ></i>
        </button>
      </div>
    </SheetModal>

    <!-- Theme settings -->
    <SheetModal
      :model-value="modal === 'theme'"
      title="App Theme"
      subtitle="Used as your default amount when topping up"
      @update:model-value="close"
    >
      <div class="choice-list">
        <button
          v-for="t in THEMES"
          :key="t"
          type="button"
          class="choice"
          :class="{ active: settings.theme === t }"
          @click="pickTheme(t)"
        >
          {{ t.label }}
          <i v-if="settings.theme === t" class="bi bi-check-circle-fill"></i>
        </button>
      </div>
    </SheetModal>

    <!-- Contact support -->
    <SheetModal
      :model-value="modal === 'contact'"
      title="Contact support"
      subtitle="We are happy to help"
      @update:model-value="close"
    >
      <div class="choice-list">
        <a class="choice" :href="`tel:${SUPPORT_PHONE.replace(/\s+/g, '')}`">
          <span><i class="bi bi-telephone me-2"></i>{{ SUPPORT_PHONE }}</span>
          <i class="bi bi-chevron-right"></i>
        </a>
        <a class="choice" :href="`mailto:${SUPPORT_EMAIL}`">
          <span><i class="bi bi-envelope me-2"></i>{{ SUPPORT_EMAIL }}</span>
          <i class="bi bi-chevron-right"></i>
        </a>
      </div>
    </SheetModal>

    <!-- About -->
    <SheetModal :model-value="modal === 'about'" @update:model-value="close">
      <div class="pb-2">
        <div class="text-center">
          <img
            src="/imgs/zanbus_blue.png"
            alt="ZanBus"
            class="text-center about-logo mb-2"
          />
          <p class="fw-semibold mb-1">ZanBus - Mwendo Fasta</p>
        </div>
        <p class="text-secondary small mb-0">
          ZanBus is Zanzibar's modern public bus service, making everyday travel
          simple, reliable and convenient.
        </p>
        <br />
        <p class="text-secondary small mb-0">
          The ZanBus app gives passengers an easier way to travel - manage
          physical or virtual travel cards, check balances, top up, pay for
          journeys using QR, view transactions and manage their travel account.
        </p>
        <br />
        <p class="text-secondary fw-semibold small mb-3 text-center">
          <em>One card. One app. Easier journeys across Zanzibar.</em>
        </p>
        <!-- <p class="text-secondary small mt-3 mb-0">Powered by Rahisi</p> -->
      </div>
    </SheetModal>

    <!-- Log out confirmation -->
    <SheetModal
      :model-value="modal === 'logout'"
      title="Log out?"
      subtitle="You will need an OTP to sign in again."
      @update:model-value="close"
    >
      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-light btn-md flex-fill rounded-3 fw-semibold"
          :disabled="loggingOut"
          @click="close"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-danger btn-md flex-fill rounded-3 fw-semibold"
          :disabled="loggingOut"
          @click="logout"
        >
          <span
            v-if="loggingOut"
            class="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
          ></span>
          Log out
        </button>
      </div>
    </SheetModal>

    <!-- Bottom navigation -->
    <BottomNav />
  </main>
</template>

<style scoped>
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

/* ---------- Header ---------- */
.page-sub {
  font-size: 0.75rem;
  color: #777;
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
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
  transition: transform 0.25s ease;
}

.profile-btn:active {
  transform: scale(0.9);
}

/* ---------- Category card ---------- */
.section-title {
  margin: 0 0 0.5rem 0.25rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #777;
}

.section-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* ---------- Row ---------- */
.row-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  padding: 0.8rem 1rem;
  border: 0;
  background: transparent;
  text-align: left;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.2s ease;
}

.row-item + .row-item {
  border-top: 1px solid #f0f0f0;
}

.row-item:active {
  background: #f7f7f5;
}

.row-item:focus-visible {
  outline: 2px solid var(--blue, #0d6efd);
  outline-offset: -2px;
}

.row-icon {
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  font-size: 1.15rem;
  color: var(--blue2, #0d6efd);
  background: #eaf1ff;
}

.row-text {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.row-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
}

.row-sub {
  font-size: 0.75rem;
  color: #777;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-chevron {
  flex: 0 0 auto;
  color: #bbb;
}

.row-item.danger .row-icon {
  color: #dc3545;
  background: #fff0f0;
}

.row-item.danger .row-title {
  color: #dc3545;
}

/* ---------- Toggle switch ---------- */
.switch-input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.switch-track {
  flex: 0 0 auto;
  position: relative;
  width: 46px;
  height: 26px;
  border-radius: 999px;
  background: #d5d9de;
  transition: background-color 0.25s ease;
}

.switch-track::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s ease;
}

.switch-input:checked + .switch-track {
  background: var(--blue, #0d6efd);
}

.switch-input:checked + .switch-track::after {
  transform: translateX(20px);
}

.switch-input:focus-visible + .switch-track {
  box-shadow: 0 0 0 0.2rem rgba(var(--blue-rgb, 13, 110, 253), 0.25);
}

/* ---------- Modal content ---------- */
.choice-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.choice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
  background: #f8f9fa;
  color: #222;
  font-weight: 600;
  text-align: left;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.choice.active {
  border-color: var(--blue, #0d6efd);
  background: #fff;
  color: var(--blue, #0d6efd);
}

.about-logo {
  height: 40px;
  width: auto;
}
</style>
