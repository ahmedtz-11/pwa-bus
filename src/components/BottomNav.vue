```vue
<script setup>
const tabs = [
  {
    to: "/home",
    label: "Home",
    icon: "bi-house",
    activeIcon: "bi-house-fill",
  },
  {
    to: "/topup",
    label: "Transactions",
    icon: "bi-receipt",
    activeIcon: "bi-receipt-cutoff",
  },
  {
    to: "/card",
    label: "Settings",
    icon: "bi-gear",
    activeIcon: "bi-gear-fill",
  },
];
</script>

<template>
  <nav class="bottom-nav">
    <div class="nav-container">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="nav-item"
        active-class="active"
      >
        <div class="icon-wrapper">
          <i :class="['bi', tab.icon, 'icon-default']"></i>
          <i :class="['bi', tab.activeIcon, 'icon-active']"></i>
        </div>

        <span class="label">{{ tab.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  z-index: 1000;
  padding: 0.75rem;
  pointer-events: none;
}

.nav-container {
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 6px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 25px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.05);
  pointer-events: auto;
}

.nav-item {
  position: relative;
  min-width: 90px;
  padding: 0.5rem 0.65rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #666;
  text-decoration: none;
  border-radius: 17px;
  transition:
    color 0.3s ease,
    transform 0.3s ease,
    background-color 0.3s ease;
}

.icon-wrapper {
  position: relative;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper i {
  position: absolute;
  font-size: 1.25rem;
  transition:
    opacity 0.3s ease,
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.icon-default {
  opacity: 1;
  transform: scale(1);
}

.icon-active {
  opacity: 0;
  transform: scale(0.5) rotate(-15deg);
}

.label {
  font-size: 0.75rem;
  font-weight: 700;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

/* Active state */
.nav-item.active {
  color: #1055c9;
  background: #cbddfd;
}

.nav-item.active .icon-default {
  opacity: 0;
  transform: scale(0.5) rotate(15deg);
}

.nav-item.active .icon-active {
  opacity: 1;
  transform: scale(1) rotate(0);
}

.nav-item.active .label {
  transform: translateY(0);
}

/* Press animation */
.nav-item:active {
  transform: scale(0.92);
}

@keyframes indicator {
  from {
    opacity: 0;
    transform: scale(0);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>