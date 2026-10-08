<script setup>
import { computed, ref } from "vue";
import { useForm } from "vee-validate";
import { useAccount } from "../stores/account";
import { useToast } from "../composables/useToast";

const { user } = useAccount();
const { show } = useToast();

const MIN_AMOUNT = 1000;
const MAX_AMOUNT = 1000000;
const QUICK_AMOUNTS = [1000, 5000, 10000];

const tab = ref("mine"); // "mine" | "other"
const paying = ref(false);

// Cards that belong to the logged-in user (one for now, ready for more)
const cards = computed(() =>
  user.value?.cardNo
    ? [
        {
          value: user.value.cardNo,
          label: `•••• ${user.value.cardNo.slice(-6)
          }`,
        },
      ]
    : [],
);

const defaultCard = computed(() => cards.value[0]?.value || "");

// Validation rules (return true when valid, or an error message)
const validationSchema = {
  card(value) {
    const v = (value || "").replace(/\s+/g, "");
    if (!v) {
      return tab.value === "mine" ? "Select a card" : "Card number is required";
    }
    if (!/^\d{16}$/.test(v)) return "Card number must be 16 digits";
    return true;
  },
  amount(value) {
    const v = String(value || "").trim();
    if (!v) return "Enter an amount";
    if (!/^\d+$/.test(v)) return "Amount must be a whole number";
    const n = Number(v);
    if (n < MIN_AMOUNT) return `Minimum top up is TZS ${fmt(MIN_AMOUNT)}`;
    if (n > MAX_AMOUNT) return `Maximum top up is TZS ${fmt(MAX_AMOUNT)}`;
    return true;
  },
};

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema,
  initialValues: { card: defaultCard.value, amount: "" },
});

// once a field has an error, re-validate while typing
const config = (state) => ({
  validateOnModelUpdate: state.errors.length > 0,
});

const [card, cardAttrs] = defineField("card", config);
const [amount, amountAttrs] = defineField("amount", config);

const fmt = (n) => Number(n).toLocaleString("en-US");

// 4829175036481920 -> 4829 1750 3648 1920 (typing mode only)
const formattedCard = computed(() =>
  (card.value || "").replace(/(\d{4})(?=\d)/g, "$1 "),
);

const amountHint = computed(() =>
  /^\d+$/.test(amount.value || "") ? `TZS ${fmt(amount.value)}` : "",
);

function setTab(next) {
  if (tab.value === next) return;
  tab.value = next;
  // fresh card field + clear errors, keep the amount
  resetForm({
    values: {
      card: next === "mine" ? defaultCard.value : "",
      amount: amount.value || "",
    },
  });
}

function onCardInput(e) {
  card.value = e.target.value.replace(/\D/g, "").slice(0, 16);
  e.target.value = formattedCard.value;
}

function onAmountInput(e) {
  amount.value = e.target.value.replace(/\D/g, "").slice(0, 7);
  e.target.value = amount.value;
}

function pickAmount(n) {
  amount.value = String(n);
}

// TODO: replace with your real payment API call
async function startPayment(payload) {
  await new Promise((r) => setTimeout(r, 800));
  return payload;
}

const submit = handleSubmit(async (vals) => {
  paying.value = true;

  try {
    await startPayment({
      cardNo: vals.card.replace(/\s+/g, ""),
      amount: Number(vals.amount),
      own: tab.value === "mine",
    });
    show("Redirecting to payment...");
  } catch (e) {
    show(e.message || "Could not start the payment. Try again.");
  } finally {
    paying.value = false;
  }
});
</script>

<template>
  <main class="auth-page min-vh-100 d-flex flex-column">
    <!-- Image section -->
    <section class="hero position-relative">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>

      <div class="position-relative z-2 h-100 p-3">
        <!-- Top bar: back button (left) + logo (center) -->
        <div
          class="top-bar position-relative d-flex align-items-center justify-content-center"
        >
          <RouterLink
            to="/home"
            class="back-link position-absolute start-0 text-white text-decoration-none fw-bold"
            aria-label="Back"
          >
            <i class="bi bi-arrow-left"></i>
          </RouterLink>

          <img src="/imgs/zanbus_white.png" alt="Bus" class="logo" />
        </div>

        <div class="text-center mt-3">
          <h5 class="fw-semibold mb-1 text-white">Top Up</h5>
          <p class="hero-sub fw-semibold">Simplify your journeys</p>
        </div>
      </div>
    </section>

    <!-- Form section -->
    <section class="form-section bg-white flex-grow-1 px-4 py-4">
      <!-- Decorative overlay image anchored to the bottom -->
      <div class="form-overlay" aria-hidden="true"></div>

      <div class="form-container position-relative mx-auto">
        <!-- Pill tabs -->
        <div class="pill-tabs mb-4" role="tablist">
          <button
            type="button"
            role="tab"
            class="pill"
            :class="{ active: tab === 'mine' }"
            :aria-selected="tab === 'mine'"
            @click="setTab('mine')"
          >
            <i class="bi bi-credit-card-2-front me-2"></i>My cards
          </button>

          <button
            type="button"
            role="tab"
            class="pill"
            :class="{ active: tab === 'other' }"
            :aria-selected="tab === 'other'"
            @click="setTab('other')"
          >
            <i class="bi bi-send me-2"></i>Other card
          </button>
        </div>

        <form @submit.prevent="submit" novalidate>
          <!-- Card: dropdown (my card) -->
          <div class="mb-3">
            <label class="form-label fw-semibold" for="card">
              {{ tab === "mine" ? "Select card" : "Card number" }}
            </label>

            <div
              v-if="tab === 'mine'"
              class="input-group input-group-lg field"
              :class="{ 'is-invalid-group': errors.card }"
            >
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-credit-card"></i>
              </span>
              <select
                id="card"
                v-model="card"
                v-bind="cardAttrs"
                class="form-select bg-light border-start-0"
              >
                <option value="" disabled>
                  {{ cards.length ? "Select a card" : "No cards available" }}
                </option>
                <option v-for="c in cards" :key="c.value" :value="c.value">
                  {{ c.label }}
                </option>
              </select>
            </div>

            <!-- Card: typing (another card) -->
            <div
              v-else
              class="input-group input-group-lg field"
              :class="{ 'is-invalid-group': errors.card }"
            >
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-credit-card"></i>
              </span>
              <input
                id="card"
                :value="formattedCard"
                v-bind="cardAttrs"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                maxlength="19"
                class="form-control bg-light border-start-0"
                placeholder="0000 0000 0000 0000"
                @input="onCardInput"
              />
            </div>

            <div v-if="errors.card" class="field-error">
              <i class="bi bi-exclamation-circle me-1"></i>{{ errors.card }}
            </div>
          </div>

          <!-- Amount -->
          <div class="mb-2">
            <label class="form-label fw-semibold" for="amount">Amount</label>

            <div
              class="input-group input-group-lg field"
              :class="{ 'is-invalid-group': errors.amount }"
            >
              <span class="input-group-text bg-light border-end-0 fw-semibold">
                TZS
              </span>
              <input
                id="amount"
                :value="amount"
                v-bind="amountAttrs"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                class="form-control bg-light border-start-0"
                placeholder="0"
                @input="onAmountInput"
              />
            </div>

            <div v-if="errors.amount" class="field-error">
              <i class="bi bi-exclamation-circle me-1"></i>{{ errors.amount }}
            </div>
            <div v-else-if="amountHint" class="amount-hint">
              {{ amountHint }}
            </div>
          </div>

          <!-- Quick amounts -->
          <div class="quick-amounts mb-4">
            <button
              v-for="n in QUICK_AMOUNTS"
              :key="n"
              type="button"
              class="chip"
              :class="{ active: Number(amount) === n }"
              @click="pickAmount(n)"
            >
              {{ fmt(n) }}
            </button>
          </div>

          <!-- Security banner -->
          <div class="secure-banner mb-3">
            <span class="secure-icon">
              <i class="bi bi-shield-lock-fill"></i>
            </span>
            <div>
              <div class="secure-title">Safe & Secure</div>
              <div class="secure-text">
                Your payment is protected with secure encryption.
              </div>
            </div>
          </div>

          <!-- Button -->
          <button
            type="submit"
            :disabled="paying"
            class="btn btn-primary btn-md w-100 rounded-3 py-2 fw-semibold"
          >
            <span
              v-if="paying"
              class="spinner-border spinner-border-sm me-2"
              aria-hidden="true"
            ></span>
            <i v-else class="bi bi-arrow-up-right-circle-fill ms-2"></i>
            Proceed to Payment
          </button>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  background: #fff;
  overflow: hidden;
}

.hero-sub {
  font-size: 0.7rem;
  color: #aaa;
  margin-bottom: 0;
}

.hero {
  height: 28vh;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url("/imgs/topup_bg.png");
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.01);
}

.top-bar {
  min-height: 50px;
}

.logo {
  width: 135px;
  height: 40px;
}

/* ------- Form section ------- */
.form-section {
  border-radius: 30px 30px 0 0;
  margin-top: -40px;
  position: relative;
  z-index: 3;
  overflow: hidden;
}

.form-overlay {
  position: absolute;
  inset: auto 0 0 0;
  height: 55%;
  background-image: url("/imgs/card_buildings2.png");
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: contain;
  opacity: 0.7;
  pointer-events: none;
  z-index: 0;
}

.form-container {
  max-width: 520px;
  z-index: 1;
}

/* ------- Pill tabs ------- */
.pill-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.25rem;
  padding: 0.3rem;
  background: #eee;
  border: 1px solid #ddd;
  border-radius: 25px;
}

.pill {
  border: 0;
  padding: 0.4rem;
  border-radius: 28px;
  background: transparent;
  color: #444;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease;
}

.pill.active {
  /* background: var(--blue2); */
  background: #0d6efd;
  color: #fff;
  /* box-shadow: 0 4px 12px rgba(var(--blue-rgb, 13, 110, 253), 0.3); */
}

/* ------- Inputs ------- */
.form-control,
.form-select,
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

.form-control:focus,
.form-select:focus {
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
.field:focus-within .form-select,
.field:focus-within .input-group-text {
  border-color: var(--blue);
  background-color: #fff !important;
}

.field:focus-within .input-group-text {
  color: var(--blue);
}

/* Error state */
.field.is-invalid-group .form-control,
.field.is-invalid-group .form-select,
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

.amount-hint {
  color: #6c757d;
  font-size: 0.8rem;
  margin-top: 0.35rem;
}

/* ------- Quick amounts ------- */
.quick-amounts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
}

.chip {
  padding: 0.55rem 0;
  border: 1px solid #dee2e6;
  border-radius: 0.6rem;
  background: #fff;
  color: #333;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.chip:active {
  transform: scale(0.97);
}

.chip.active {
  background: #e6effd;
  border-color: var(--blue2);
  color: var(--blue2);
}

/* ------- Security banner ------- */
.secure-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  background: #f0f4fc;
  /* border: 1px solid #cfead7; */
  border-radius: 0.75rem;
}

.secure-icon {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1055c9;
  font-size: 1.3rem;
}

.secure-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1055c9;
}

.secure-text {
  font-size: 0.75rem;
  line-height: 1.35;
  color: var(--blue1);
}
</style>
