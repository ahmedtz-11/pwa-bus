<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  phone: { type: String, default: "" },
  length: { type: Number, default: 4 },
  loading: { type: Boolean, default: false },
  error: { type: String, default: "" },
  resendSeconds: { type: Number, default: 30 },
});

const emit = defineEmits(["update:modelValue", "verify", "resend"]);

const digits = ref(Array(props.length).fill(""));
const inputs = ref([]);
const seconds = ref(0);
let timer = null;

const code = computed(() => digits.value.join(""));
const complete = computed(() => code.value.length === props.length);

const maskedPhone = computed(() => {
  const p = props.phone.replace(/\s+/g, "");
  return p.length > 6 ? `${p.slice(0, 3)} ••• ${p.slice(-2)}` : p;
});

function startTimer() {
  clearInterval(timer);
  seconds.value = props.resendSeconds;
  timer = setInterval(() => {
    seconds.value -= 1;
    if (seconds.value <= 0) clearInterval(timer);
  }, 1000);
}

function reset() {
  digits.value = Array(props.length).fill("");
}

function close() {
  if (props.loading) return;
  emit("update:modelValue", false);
}

function focusAt(i) {
  const el = inputs.value[Math.max(0, Math.min(i, props.length - 1))];
  el?.focus();
  el?.select();
}

// Fill digits from a given index (handles typing, autofill and paste)
function fillFrom(index, raw) {
  const chars = raw.replace(/\D/g, "").split("");
  if (!chars.length) {
    digits.value[index] = "";
    return;
  }
  let i = index;
  for (const ch of chars) {
    if (i >= props.length) break;
    digits.value[i++] = ch;
  }
  focusAt(i);
}

function onInput(i, e) {
  fillFrom(i, e.target.value);
  // keep the DOM in sync if the typed value was rejected
  e.target.value = digits.value[i];
}

function onKeydown(i, e) {
  if (e.key === "Backspace" && !digits.value[i]) {
    e.preventDefault();
    if (i > 0) {
      digits.value[i - 1] = "";
      focusAt(i - 1);
    }
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    focusAt(i - 1);
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    focusAt(i + 1);
  } else if (e.key === "Enter" && complete.value) {
    submit();
  }
}

function onPaste(i, e) {
  e.preventDefault();
  fillFrom(i, e.clipboardData.getData("text"));
}

function submit() {
  if (!complete.value || props.loading) return;
  emit("verify", code.value);
}

function resend() {
  if (seconds.value > 0 || props.loading) return;
  reset();
  startTimer();
  emit("resend");
  nextTick(() => focusAt(0));
}

function onEsc(e) {
  if (e.key === "Escape") close();
}

watch(
  () => props.modelValue,
  async (open) => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      reset();
      startTimer();
      window.addEventListener("keydown", onEsc);
      await nextTick();
      focusAt(0);
    } else {
      clearInterval(timer);
      window.removeEventListener("keydown", onEsc);
    }
  },
);

// Clear the boxes when the parent reports a wrong code
watch(
  () => props.error,
  (msg) => {
    if (msg) {
      reset();
      nextTick(() => focusAt(0));
    }
  },
);

onBeforeUnmount(() => {
  clearInterval(timer);
  window.removeEventListener("keydown", onEsc);
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <Transition name="otp">
      <div
        v-if="modelValue"
        class="otp-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="otp-title"
        @mousedown.self="close"
      >
        <div class="otp-sheet bg-white px-4 pt-3 pb-4">
          <div class="otp-handle mx-auto mb-3"></div>

          <button
            type="button"
            class="btn-close otp-close"
            aria-label="Close"
            :disabled="loading"
            @click="close"
          ></button>

          <div class="text-center mb-4">
            <div class="otp-icon mx-auto mb-3">
              <i class="bi bi-shield-lock text-blue2"></i>
            </div>
            <h6 id="otp-title" class="fw-bold text-blue2 mb-1">ENTER OTP</h6>
            <p class="text-secondary fw-semibold small mb-0">
              Enter the {{ length }}-digit code sent to your device
              <!-- <span class="fw-semibold text-dark">{{ maskedPhone }}</span> -->
            </p>
          </div>

          <!-- Code boxes -->
          <div
            class="otp-row d-flex justify-content-center gap-2 mb-3"
            :class="{ 'has-error': error }"
          >
            <input
              v-for="(_, i) in length"
              :key="i"
              :ref="(el) => (inputs[i] = el)"
              :value="digits[i]"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="4"
              class="otp-box form-control text-center fw-bold"
              :aria-label="`Digit ${i + 1}`"
              :disabled="loading"
              @input="onInput(i, $event)"
              @keydown="onKeydown(i, $event)"
              @paste="onPaste(i, $event)"
              @focus="$event.target.select()"
            />
          </div>

          <div v-if="error" class="otp-error text-center mb-3">
            <i class="bi bi-exclamation-circle me-1"></i>{{ error }}
          </div>

          <button
            type="button"
            class="btn btn-blue btn-lg w-100 rounded-3 py-2 fw-semibold"
            :disabled="!complete || loading"
            @click="submit"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
              aria-hidden="true"
            ></span>
            {{ loading ? "Verifying..." : "Verify OTP" }}
          </button>

          <div class="text-center mt-3 small">
            <span class="text-secondary">Didn't get the code?</span>
            <button
              v-if="seconds <= 0"
              type="button"
              class="btn btn-link btn-sm p-0 ms-1 fw-semibold text-green text-decoration-none align-baseline"
              @click="resend"
            >
              Resend OTP
            </button>
            <span v-else class="text-secondary ms-1">
              Resend in <span class="text-blue2 fw-semibold">{{ seconds }}s</span>
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.otp-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1080;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
}

.otp-sheet {
  position: relative;
  width: 100%;
  max-width: 520px;
  border-radius: 28px 28px 0 0;
  padding-bottom: max(1.5rem, env(safe-area-inset-bottom)) !important;
}

.otp-handle {
  width: 40px;
  height: 4px;
  border-radius: 4px;
  background: #dee2e6;
}

.otp-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
}

.otp-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: var(--blue);
  background: rgba(var(--blue-rgb, 13, 110, 253), 0.1);
}

.otp-box {
  width: 48px;
  height: 56px;
  padding: 0;
  font-size: 1.4rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.otp-box:focus {
  background: #fff;
  border-color: var(--blue);
  box-shadow: 0 0 0 0.2rem rgba(var(--blue-rgb, 13, 110, 253), 0.15);
}

.otp-row.has-error .otp-box {
  border-color: #dc3545;
}

.otp-error {
  color: #dc3545;
  font-size: 0.85rem;
}

/* Open / close animation */
.otp-enter-active,
.otp-leave-active {
  transition: background-color 0.25s ease;
}

.otp-enter-active .otp-sheet,
.otp-leave-active .otp-sheet {
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.otp-enter-from,
.otp-leave-to {
  background: rgba(0, 0, 0, 0);
}

.otp-enter-from .otp-sheet,
.otp-leave-to .otp-sheet {
  transform: translateY(100%);
}

@media (min-width: 576px) {
  .otp-backdrop {
    align-items: center;
  }

  .otp-sheet {
    border-radius: 28px;
  }

  .otp-handle {
    display: none;
  }

  .otp-enter-from .otp-sheet,
  .otp-leave-to .otp-sheet {
    transform: translateY(24px);
  }
}

@media (max-width: 360px) {
  .otp-box {
    width: 42px;
    height: 50px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .otp-enter-active .otp-sheet,
  .otp-leave-active .otp-sheet {
    transition: none;
  }
}
</style>
