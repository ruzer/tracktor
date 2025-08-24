<template>
  <span class="feature-status" :class="statusClass">
    <svg
      class="status-icon"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        v-if="status === 'available'"
        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      />
      <path
        v-else-if="status === 'beta'"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      />
      <path
        v-else-if="status === 'planned'"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
      />
      <path
        v-else
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
      />
    </svg>
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) =>
      ["available", "beta", "planned", "deprecated"].includes(value),
  },
  version: {
    type: String,
    default: "",
  },
});

const statusClass = computed(() => {
  return `status-${props.status}`;
});

const statusText = computed(() => {
  const statusMap = {
    available: "Available",
    beta: "Beta",
    planned: "Planned",
    deprecated: "Deprecated",
  };

  const text = statusMap[props.status] || "Unknown";
  return props.version ? `${text} (${props.version})` : text;
});
</script>

<style scoped>
.feature-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  vertical-align: middle;
}

.status-icon {
  flex-shrink: 0;
}

.status-available {
  background: #dcfce7;
  color: #166534;
}

.status-beta {
  background: #fef3c7;
  color: #92400e;
}

.status-planned {
  background: #e0e7ff;
  color: #3730a3;
}

.status-deprecated {
  background: #fee2e2;
  color: #991b1b;
}

.dark .status-available {
  background: #14532d;
  color: #bbf7d0;
}

.dark .status-beta {
  background: #451a03;
  color: #fcd34d;
}

.dark .status-planned {
  background: #312e81;
  color: #c7d2fe;
}

.dark .status-deprecated {
  background: #7f1d1d;
  color: #fecaca;
}
</style>
