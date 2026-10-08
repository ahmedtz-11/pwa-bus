<script setup>
import { onBeforeUnmount, watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const close = () => emit("update:modelValue", false);
const onEsc = (e) => e.key === "Escape" && close();

watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) window.addEventListener("keydown", onEsc);
    else window.removeEventListener("keydown", onEsc);
  },
);

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onEsc);
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="modelValue"
        class="sheet-backdrop"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @mousedown.self="close"
      >
        <div class="sheet bg-white px-4 pt-3">
          <div class="sheet-handle mx-auto mb-3"></div>

          <button
            type="button"
            class="btn-close sheet-close"
            aria-label="Close"
            @click="close"
          ></button>

          <div v-if="title" class="text-center mb-3">
            <h5 class="fw-bold text-blue2 mb-1">{{ title }}</h5>
            <p v-if="subtitle" class="text-secondary mb-0 sheet-sub">
              {{ subtitle }}
            </p>
          </div>

          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1080;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
}

.sheet {
  position: relative;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 28px 28px 0 0;
  padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
}

.sheet-handle {
  width: 40px;
  height: 4px;
  border-radius: 4px;
  background: #dee2e6;
}

.sheet-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
}

.sheet-sub {
  font-size: 0.85rem;
}

/* Open / close animation */
.sheet-enter-active,
.sheet-leave-active {
  transition: background-color 0.25s ease;
}

.sheet-enter-active .sheet,
.sheet-leave-active .sheet {
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.sheet-enter-from,
.sheet-leave-to {
  background: rgba(0, 0, 0, 0);
}

.sheet-enter-from .sheet,
.sheet-leave-to .sheet {
  transform: translateY(100%);
}

@media (min-width: 576px) {
  .sheet-backdrop {
    align-items: center;
  }

  .sheet {
    border-radius: 28px;
  }

  .sheet-handle {
    display: none;
  }

  .sheet-enter-from .sheet,
  .sheet-leave-to .sheet {
    transform: translateY(24px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sheet-enter-active .sheet,
  .sheet-leave-active .sheet {
    transition: none;
  }
}
</style>
