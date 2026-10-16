<script setup>
import { computed, reactive, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAccount } from "../stores/account";
import { useToast } from "../composables/useToast";
import BottomNav from "../components/BottomNav.vue";
import SheetModal from "../components/SheetModal.vue";

const { t, locale } = useI18n();
const router = useRouter();
const { signOut } = useAccount();
const { show } = useToast();

const SUPPORT_PHONE = "+255 700 000 000";
const SUPPORT_EMAIL = "support@zanbus.co.tz";
const APP_VERSION = "1.0.0";

const THEMES = ["dark", "light"];

// Language names are shown in their own language on purpose
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "sw", label: "Kiswahili" },
];

// ------ Saved settings ------
const STORAGE_KEY = "busgo_settings";
const defaults = {
  notifications: true,
  biometric: false,
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

// The active i18n locale is the single source of truth for the language
const languageLabel = computed(
  () => LANGUAGES.find((l) => l.value === locale.value)?.label,
);

const themeLabel = computed(() => t(`user.settings.preferences.${settings.theme}`));

// ------ Modals ------
const modal = ref(null); // "language" | "theme" | "contact" | "about" | "logout"
const loggingOut = ref(false);

const open = (name) => (modal.value = name);
const close = () => (modal.value = null);

// ------ Setting categories ------
// type: "link" (opens a page) | "toggle" (on/off) | "modal" (opens a sheet)
const sections = computed(() => [
  {
    key: "transactions",
    title: t("user.settings.transactions.title"),
    items: [
      {
        key: "history",
        icon: "bi-clock-history",
        title: t("user.settings.transactions.label_1"),
        subtitle: t("user.settings.transactions.holder_1"),
        type: "link",
        to: "/transactions",
      },
    ],
  },
  {
    key: "preferences",
    title: t("user.settings.preferences.title"),
    items: [
      {
        key: "language",
        icon: "bi-translate",
        title: t("user.settings.preferences.label_1"),
        subtitle: languageLabel.value,
        type: "modal",
        modal: "language",
      },
      {
        key: "notifications",
        icon: "bi-bell",
        title: t("user.settings.preferences.label_2"),
        subtitle: t("user.settings.preferences.holder_2"),
        type: "toggle",
      },
      {
        key: "biometric",
        icon: "bi-fingerprint",
        title: t("user.settings.preferences.label_3"),
        subtitle: t("user.settings.preferences.holder_3"),
        type: "toggle",
      },
      {
        key: "theme",
        icon: "bi-palette",
        title: t("user.settings.preferences.label_4"),
        subtitle: themeLabel.value,
        type: "modal",
        modal: "theme",
      },
    ],
  },
  {
    key: "help",
    title: t("user.settings.support.title"),
    items: [
      {
        key: "faq",
        icon: "bi-question-circle",
        title: t("user.settings.support.label_1"),
        subtitle: t("user.settings.support.holder_1"),
        type: "link",
        to: "/faq",
      },
      {
        key: "contact",
        icon: "bi-headset",
        title: t("user.settings.support.label_2"),
        subtitle: t("user.settings.support.holder_2"),
        type: "modal",
        modal: "contact",
      },
      {
        key: "guide",
        icon: "bi-book-half",
        title: t("user.settings.support.label_3"),
        subtitle: t("user.settings.support.holder_3"),
        type: "link",
        to: "/guide",
      },
    ],
  },
  {
    key: "account",
    title: t("user.settings.account.title"),
    items: [
      {
        key: "account",
        icon: "bi-person-circle",
        title: t("user.settings.account.label_1"),
        subtitle: t("user.settings.account.holder_1"),
        type: "link",
        to: "/account",
      },
      {
        key: "logout",
        icon: "bi-box-arrow-right",
        title: t("user.settings.account.label_2"),
        subtitle: t("user.settings.account.holder_2"),
        type: "modal",
        modal: "logout",
        danger: true,
      },
    ],
  },
  {
    key: "about",
    title: t("user.settings.about.title"),
    items: [
      {
        key: "about",
        icon: "bi-info-circle",
        title: t("user.settings.items.about.title"),
        subtitle: t("user.settings.items.about.subtitle", {
          version: APP_VERSION,
        }),
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
  show(
    t(checked ? "user.settings.toast.on" : "user.settings.toast.off", {
      name: item.title,
    }),
  );
}

// Switch the whole app language and remember it
function pickLanguage(value) {
  if (!LANGUAGES.some((l) => l.value === value)) return;

  locale.value = value; // every t() in the app updates instantly
  try {
    localStorage.setItem("language", value); // read by main.js on next start
    sessionStorage.removeItem("language"); // so an old value can't override it
  } catch {}
  document.documentElement.lang = value;

  close();
  show(
    t("user.settings.toast.languageChanged", {
      language: LANGUAGES.find((l) => l.value === value)?.label,
    }),
  );
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
    show(t("user.settings.toast.loggedOut"));
    router.replace("/");
  } catch (e) {
    show(e.message || t("user.settings.toast.logoutFailed"));
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

        <RouterLink
          to="/notification"
          class="profile-btn"
          aria-label="Notifications"
        >
          <i class="bi bi-bell"></i>
        </RouterLink>
      </header>

      <div class="mb-3">
        <h5 class="fw-bold mb-1">{{ t("user.settings.title") }}</h5>
        <p class="page-sub fw-bold mb-0">
          {{ t("user.settings.subtitle") }}
        </p>
      </div>

      <!-- Categories -->
      <section v-for="section in sections" :key="section.key" class="mb-4">
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
      :title="t('user.settings.preferences.label_1')"
      :subtitle="t('user.settings.preferences.holder_1')"
      @update:model-value="close"
    >
      <div class="choice-list">
        <button
          v-for="l in LANGUAGES"
          :key="l.value"
          type="button"
          class="choice"
          :class="{ active: locale === l.value }"
          @click="pickLanguage(l.value)"
        >
          {{ l.label }}
          <i v-if="locale === l.value" class="bi bi-check-circle-fill"></i>
        </button>
      </div>
    </SheetModal>

    <!-- Theme -->
    <SheetModal
      :model-value="modal === 'theme'"
      :title="t('user.settings.preferences.label_4')"
      :subtitle="t('user.settings.preferences.holder_4')"
      @update:model-value="close"
    >
      <div class="choice-list">
        <button
          v-for="th in THEMES"
          :key="th"
          type="button"
          class="choice"
          :class="{ active: settings.theme === th }"
          @click="pickTheme(th)"
        >
          {{ t(`user.settings.preferences.${th}`) }}
          <i v-if="settings.theme === th" class="bi bi-check-circle-fill"></i>
        </button>
      </div>
    </SheetModal>

    <!-- Contact support -->
    <SheetModal
      :model-value="modal === 'contact'"
      :title="t('user.settings.support.label_2')"
      :subtitle="t('user.settings.support.holder_2')"
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
            class="about-logo mb-2"
          />
          <p class="fw-semibold mb-1">
            ZanBus - Mwendo Fasta
          </p>
        </div>
        <p class="text-secondary small mb-0">
          {{ t("user.settings.about.desc_1") }}
        </p>
        <br />
        <p class="text-secondary small mb-0">
          {{ t("user.settings.about.desc_2") }}
        </p>
        <br />
        <p class="text-secondary fw-semibold small mb-3 text-center">
          <em>{{ t("user.settings.about.desc_3") }}</em>
        </p>
      </div>
    </SheetModal>

    <!-- Log out confirmation -->
    <SheetModal
      :model-value="modal === 'logout'"
      :title="t('user.settings.account.label_1')"
      :subtitle="t('user.settings.account.holder_1')"
      @update:model-value="close"
    >
      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-light btn-md flex-fill rounded-3 fw-semibold"
          :disabled="loggingOut"
          @click="close"
        >
          {{ t("user.settings.account.btn_2") }}
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
          {{ t("user.settings.account.btn_1") }}
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
  color: #666;
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
