import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";
import App from "./App.vue";
import router from "./router";
import "../src/assets/base.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

const supportedLocales = ["en", "sw"];
const savedLocale =
  localStorage.getItem("language") ||
  sessionStorage.getItem("language") ||
  "en";
const locale = supportedLocales.includes(savedLocale) ? savedLocale : "en";

const i18n = createI18n({
  legacy: false,
  allowComposition: true,
  locale: locale,
  fallbackLocale: "en",
  messages
});

createApp(App).use(router).use(i18n).mount("#app");
