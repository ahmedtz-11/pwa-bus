<script setup>
import { computed, reactive, ref } from "vue";
import { useAccount } from "../stores/account";
import BottomNav from "../components/BottomNav.vue";
import SheetModal from "../components/SheetModal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { user } = useAccount();

const transactions = [
  {
    id: 1,
    icon: "bi-bus-front",
    title: "Ride Payment",
    time: "2026-10-08, 08:31",
    route: "Point A - Point B",
    type: "out",
    status: "paid",
    amount: 700,
  },
  {
    id: 2,
    icon: "bi-bus-front",
    title: "Ride Payment",
    time: "2026-10-07, 05:30",
    route: "Point B - Point A",
    type: "out",
    status: "paid",
    amount: 700,
  },
  {
    id: 3,
    icon: "bi-arrow-down-left",
    title: "Topup",
    time: "2026-10-07, 05:20",
    type: "in",
    status: "Successful",
    amount: 7000,
  },
];

const fmt = (n) => Number(n).toLocaleString("en-US");
const groupNo = (no = "") => no.replace(/(\d{4})(?=\d)/g, "$1 ");

// ---------- Cards ----------
const cards = computed(() =>
  user.value?.cardNo
    ? [
        {
          no: user.value.cardNo,
          physical: !!user.value.physical,
        },
      ]
    : [],
);

const selectedNo = ref("");
const selectedCard = computed(
  () => cards.value.find((c) => c.no === selectedNo.value) || cards.value[0],
);

function pickCard(no) {
  selectedNo.value = no;
  close();
}

// ---------- Modals ----------
const modal = ref(null); // "card" | "filter"
const open = (name) => (modal.value = name);
const close = () => (modal.value = null);

// ---------- Filters ----------
const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "ride", label: "Ride" },
  { value: "topup", label: "Topup" },
];
const PERIOD_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 days" },
];

const filters = reactive({ type: "all", period: "all" });
const draft = reactive({ type: "all", period: "all" });

const activeFilters = computed(
  () => (filters.type !== "all") + (filters.period !== "all"),
);

function openFilter() {
  Object.assign(draft, filters);
  open("filter");
}

function applyFilters() {
  Object.assign(filters, draft);
  close();
}

function resetDraft() {
  draft.type = "all";
  draft.period = "all";
}

function clearFilters() {
  filters.type = "all";
  filters.period = "all";
}

const DAYS = { today: 1, week: 7, month: 30 };

const filtered = computed(() => {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return transactions.filter((t) => {
    if (filters.type === "ride" && t.type !== "out") return false;
    if (filters.type === "topup" && t.type !== "in") return false;

    if (filters.period !== "all") {
      const from = startToday.getTime() - (DAYS[filters.period] - 1) * 864e5;
      const when = new Date(t.time.replace(", ", "T")).getTime();
      if (when < from) return false;
    }
    return true;
  });
});

// ---------- Status ----------
const statusTone = (s = "") =>
  /success/i.test(s) ? "ok" : /paid/i.test(s) ? "warn" : "bad";

const statusLabel = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);
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
          type="button"
          aria-label="Notifications"
        >
          <i class="bi bi-bell"></i>
        </RouterLink>
      </header>

      <div class="mb-3">
        <h5 class="fw-bold mb-1">{{ t("user.transactions.title") }}</h5>
        <p class="page-sub fw-bold mb-0">
          {{ t("user.transactions.subtitle") }}
        </p>
      </div>

      <!-- Current card (tap to change) -->
      <button
        type="button"
        class="secure-banner mb-3"
        aria-haspopup="dialog"
        @click="open('card')"
      >
        <span class="secure-icon">
          <i class="bi bi-credit-card"></i>
        </span>
        <span class="secure-info">
          <span class="secure-title">{{ t("user.transactions.label_1") }}</span>
          <span class="secure-text fw-semibold">
            {{ selectedCard ? groupNo(selectedCard.no) : "No card" }}
          </span>
        </span>
        <i class="bi bi-chevron-down secure-chevron"></i>
      </button>

      <!-- Latest transactions -->
      <section class="mb-4">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <h6 class="section-title mb-0">
            {{ t("user.transactions.label_2") }}
          </h6>
          <button
            type="button"
            class="filter-btn"
            aria-label="Filter transactions"
            @click="openFilter"
          >
            <i class="bi bi-filter fs-5"></i>
            <span v-if="activeFilters" class="filter-count">
              {{ activeFilters }}
            </span>
          </button>
        </div>

        <div class="section-card">
          <div v-for="t in filtered" :key="t.id" class="row-item">
            <!-- Left: icon + details -->
            <span class="row-icon" :class="t.type === 'in' ? 'green' : 'blue'">
              <i class="bi" :class="t.icon"></i>
            </span>

            <span class="row-text">
              <span class="row-title">{{ t.title }}</span>
              <span class="row-sub">{{ t.time }}</span>
              <span v-if="t.route" class="row-route">
                {{ t.route }}
              </span>
            </span>

            <!-- Right: amount + status -->
            <span class="row-end">
              <span class="amount" :class="t.type">
                {{ t.type === "in" ? "+" : "-" }}TZS {{ fmt(t.amount) }}
              </span>
              <span class="status" :class="statusTone(t.status)">
                {{ statusLabel(t.status) }}
              </span>
            </span>
          </div>

          <!-- Empty state -->
          <div v-if="!filtered.length" class="empty">
            <i class="bi bi-receipt"></i>
            <p class="mb-2">No transactions match your filters.</p>
            <button
              v-if="activeFilters"
              type="button"
              class="btn btn-link btn-sm p-0 fw-semibold text-decoration-none"
              @click="clearFilters"
            >
              Clear filters
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Select card -->
    <SheetModal
      :model-value="modal === 'card'"
      title="Select card"
      subtitle="Choose the card to view its activity"
      @update:model-value="close"
    >
      <div class="choice-list">
        <button
          v-for="c in cards"
          :key="c.no"
          type="button"
          class="card-choice"
          :class="{ active: selectedCard && selectedCard.no === c.no }"
          @click="pickCard(c.no)"
        >
          <span class="card-choice-icon">
            <i class="bi bi-credit-card"></i>
          </span>
          <span class="card-choice-text">
            <span class="card-choice-no">{{ groupNo(c.no) }}</span>
            <span class="card-choice-type">
              {{ c.physical ? "Physical card" : "Virtual card" }}
            </span>
          </span>
          <i
            v-if="selectedCard && selectedCard.no === c.no"
            class="bi bi-check-circle-fill card-choice-check"
          ></i>
        </button>

        <p v-if="!cards.length" class="text-secondary text-center mb-0">
          No cards registered yet.
        </p>
      </div>
    </SheetModal>

    <!-- Filter -->
    <SheetModal
      :model-value="modal === 'filter'"
      :title="t('user.transactions.label_3')"
      @update:model-value="close"
    >
      <p class="filter-label">Type</p>
      <div class="chip-row mb-3">
        <button
          v-for="o in TYPE_OPTIONS"
          :key="o.value"
          type="button"
          class="chip"
          :class="{ active: draft.type === o.value }"
          @click="draft.type = o.value"
        >
          {{ o.label }}
        </button>
      </div>

      <p class="filter-label">Period</p>
      <div class="chip-row mb-4">
        <button
          v-for="o in PERIOD_OPTIONS"
          :key="o.value"
          type="button"
          class="chip"
          :class="{ active: draft.period === o.value }"
          @click="draft.period = o.value"
        >
          {{ o.label }}
        </button>
      </div>

      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-light btn-md flex-fill rounded-3 fw-semibold"
          @click="resetDraft"
        >
          {{ t("user.transactions.btn_1") }}
        </button>
        <button
          type="button"
          class="btn btn-primary btn-md flex-fill rounded-3 fw-semibold"
          @click="applyFilters"
        >
          {{ t("user.transactions.btn_2") }}
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

/* ---------- Current card banner ---------- */
.secure-banner {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  width: 100%;
  padding: 1rem;
  border: 0;
  text-align: left;
  background: #01284e;
  border-radius: 0.75rem;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.2s ease;
}

.secure-banner:active {
  transform: scale(0.99);
}

.secure-banner:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.secure-icon {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--green);
  background: #e6fce2;
  font-size: 1.3rem;
  border-radius: 0.5rem;
}

.secure-info {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.secure-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #bbb;
}

.secure-text {
  font-size: 0.9rem;
  line-height: 1.35;
  color: #fff;
}

.secure-chevron {
  flex: 0 0 auto;
  margin-left: auto;
  font-size: 1.2rem;
  color: #eee;
}

/* ---------- Section header + filter ---------- */
.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #222;
}

.filter-btn {
  position: relative;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 10px;
  background: #fff;
  color: var(--blue1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;
}

.filter-btn:active {
  transform: scale(0.92);
}

.filter-count {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--blue1);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
}

/* ---------- Transaction list ---------- */
.section-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.row-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.8rem 1rem;
}

.row-item + .row-item {
  border-top: 1px solid #f0f0f0;
}

.row-icon {
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 1.15rem;
}

.row-icon.blue {
  color: var(--blue2);
  background: #e6eefd;
}

.row-icon.green {
  color: var(--green);
  background: #e6fce2;
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

.row-route,
.row-sub {
  font-size: 0.75rem;
  color: #777;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-route {
  color: #555;
}

.row-end {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
  text-align: right;
}

.amount {
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.amount.out {
  color: var(--blue2);
}

.amount.in {
  color: var(--green);
}

.status {
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 600;
}

.status.ok {
  color: var(--green);
  background: #edffea;
}

.status.warn {
  color: var(--blue2);
  background: #e6eefd;
}

.status.bad {
  color: #b02a37;
  background: #fde8ea;
}

.empty {
  padding: 2rem 1rem;
  text-align: center;
  color: #777;
  font-size: 0.85rem;
}

.empty i {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  color: #bbb;
}

/* ---------- Card picker (modal) ---------- */
.choice-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.card-choice {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
  background: #f8f9fa;
  text-align: left;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.card-choice.active {
  border-color: var(--blue1);
  background: #fff;
}

.card-choice-icon {
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 1.15rem;
  color: var(--blue2);
  background: #e6eefd;
}

.card-choice-text {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.card-choice-no {
  font-weight: 700;
  color: #222;
  font-variant-numeric: tabular-nums;
}

.card-choice-type {
  font-size: 0.75rem;
  color: #777;
}

.card-choice-check {
  color: var(--blue2);
  font-size: 1.2rem;
}

/* ---------- Filter (modal) ---------- */
.filter-label {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #555;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  padding: 0.3rem;
  border: 1px solid #dee2e6;
  border-radius: 999px;
  background: #fff;
  color: #333;
  font-size: 0.85rem;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.chip.active {
  background: var(--blue2);
  border-color: var(--blue2);
  color: #fff;
}
</style>
