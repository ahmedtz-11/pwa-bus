import { computed, shallowRef } from "vue";

const isBrowser = typeof window !== "undefined";

function isStandalone() {
  if (!isBrowser) return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true // older iOS Safari
  );
}

// shallowRef: the browser's event must not be wrapped in a Vue proxy,
// otherwise calling prompt() fails with "Illegal invocation"
const deferredPrompt = shallowRef(null);
const installed = shallowRef(isStandalone());

if (isBrowser) {
  // Fired by Chromium browsers (Chrome, Edge, Samsung Internet, Opera)
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // stop the mini-infobar, we show our own button
    deferredPrompt.value = e;
  });

  window.addEventListener("appinstalled", () => {
    installed.value = true;
    deferredPrompt.value = null;
  });
}

function detectPlatform() {
  if (!isBrowser) return "generic";
  const ua = navigator.userAgent;

  // In-app browsers (Instagram, Facebook, TikTok...) can't install anything
  if (/FBAN|FBAV|Instagram|Snapchat|TikTok|Line\/|; wv\)/i.test(ua))
    return "inapp";

  const isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isIOS) return "ios";

  if (/firefox/i.test(ua))
    return /android/i.test(ua) ? "firefox-android" : "firefox-desktop";

  if (
    /safari/i.test(ua) &&
    !/chrome|chromium|crios|edg|opr|samsungbrowser/i.test(ua)
  )
    return "safari-mac";

  return "generic";
}

export function useInstall() {
  const canPrompt = computed(() => !!deferredPrompt.value);

  // "accepted" | "dismissed" | "manual" (no native prompt, show instructions)
  async function install() {
    const evt = deferredPrompt.value;
    if (!evt) return "manual";

    evt.prompt();
    const { outcome } = await evt.userChoice;
    deferredPrompt.value = null; // a prompt can only be used once
    return outcome;
  }

  return {
    installed, // true when already running as an installed app
    canPrompt, // true when the one-tap native prompt is available
    platform: detectPlatform(),
    install,
  };
}
