// Replace these functions with real API calls
import { reactive, computed } from "vue";
import { sampleUser, USE_SAMPLE_USER } from "../sampleUser";

const KEY = "busgo_account";
const SESSION = "busgo_session";

// ---- Demo OTP settings ----
const DEMO_OTP = "1234";
const OTP_TTL_MS = 5 * 60 * 1000; // OTP valid for 5 minutes
const OTP_MAX_ATTEMPTS = 3;

const read = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k));
  } catch {
    return null;
  }
};

const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

// Use the saved account, or fall back to the sample user (src/data/sampleUser.js)
const seed = () =>
  USE_SAMPLE_USER ? JSON.parse(JSON.stringify(sampleUser)) : null;

const state = reactive({
  acct: read(KEY) ?? seed(),
  session: !!read(SESSION),
});

// Save the demo account so it behaves like a registered one
if (state.acct && !read(KEY)) write(KEY, state.acct);

// Pending OTP lives in memory only (never persisted)
let pendingOtp = null; // { phone, code, expires, attempts }

const rnd16 = () =>
  Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("");

// "0712 345 678", "+255712345678" and "255712345678" all become "0712345678",
// so the number matches no matter how it was typed at register or login.
const normalizePhone = (p = "") => {
  const v = String(p).replace(/[\s-]+/g, "");
  return v.replace(/^\+?255/, "0");
};

const persist = () => write(KEY, state.acct);

const log = (label, amt = 0) => {
  if (!state.acct) return;
  if (!Array.isArray(state.acct.tx)) state.acct.tx = [];
  state.acct.tx.unshift({
    id: Date.now(),
    label,
    amt,
    date: new Date().toLocaleString(),
  });
  persist();
};

export function useAccount() {
  const user = computed(() => (state.session ? state.acct : null));
  const hasAccount = computed(() => !!state.acct);

  // Register: name + phone only (no password). `card` is optional.
  function signUp({ name = "", phone = "", card } = {}) {
    const cleanName = name.trim();
    const cleanPhone = normalizePhone(phone);

    if (card !== undefined && !/^\d{16}$/.test(card))
      throw new Error("Card number must be 16 digits.");
    if (cleanName.length < 2 || cleanPhone.length < 7)
      throw new Error("Enter your name and a valid phone number.");
    if (state.acct && state.acct.phone === cleanPhone)
      throw new Error("An account with this number already exists.");

    state.acct = {
      name: cleanName,
      phone: cleanPhone,
      cardNo: card ?? rnd16(),
      physical: card !== undefined,
      status: "active",
      balance: 0,
      tx: [],
    };
    log(card !== undefined ? "Physical card linked" : "Virtual card issued");
    state.session = true;
    write(SESSION, true);
  }

  // Login step 1: check the account exists and "send" an OTP.
  async function requestOtp(phone) {
    const p = normalizePhone(phone);

    if (!state.acct || state.acct.phone !== p)
      throw new Error("No account found for this number. Please register.");

    pendingOtp = {
      phone: p,
      code: DEMO_OTP,
      expires: Date.now() + OTP_TTL_MS,
      attempts: 0,
    };

    console.info(`[demo] OTP for ${p}: ${DEMO_OTP}`);
    return true;
  }

  // Login step 2: verify the OTP and start the session.
  // Replace the checks with a real API verification.
  async function signIn(phone, code) {
    const p = normalizePhone(phone);

    if (!state.acct || state.acct.phone !== p)
      throw new Error("No account found for this number.");
    if (!pendingOtp || pendingOtp.phone !== p)
      throw new Error("Request a new code and try again.");
    if (Date.now() > pendingOtp.expires) {
      pendingOtp = null;
      throw new Error("This code has expired. Request a new one.");
    }
    if (pendingOtp.attempts >= OTP_MAX_ATTEMPTS) {
      pendingOtp = null;
      throw new Error("Too many attempts. Request a new code.");
    }

    pendingOtp.attempts += 1;
    if (String(code) !== pendingOtp.code)
      throw new Error("Incorrect code. Check it and try again.");

    pendingOtp = null;
    state.session = true;
    write(SESSION, true);
  }

  function signOut() {
    state.session = false;
    write(SESSION, false);
  }

  return {
    user,
    hasAccount,
    signUp,
    requestOtp,
    signIn,
    signOut,
  };
}
