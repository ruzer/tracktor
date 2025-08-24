<template>
  <div class="placeholder-manager">
    <div class="manager-header">
      <h3>Documentation Placeholders</h3>
      <div class="manager-actions">
        <button @click="refreshPlaceholders" class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
            />
          </svg>
          Refresh
        </button>
        <button @click="exportPlaceholders" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
            />
          </svg>
          Export
        </button>
      </div>
    </div>

    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-value">{{ summary.total }}</div>
        <div class="card-label">Total</div>
      </div>
      <div class="summary-card pending">
        <div class="card-value">{{ summary.pending }}</div>
        <div class="card-label">Pending</div>
      </div>
      <div class="summary-card completed">
        <div class="card-value">{{ summary.completed }}</div>
        <div class="card-label">Completed</div>
      </div>
    </div>

    <div class="filters">
      <select v-model="selectedType" class="filter-select">
        <option value="">All Types</option>
        <option value="screenshot">Screenshots</option>
        <option value="api-example">API Examples</option>
        <option value="feature-description">Feature Descriptions</option>
        <option value="configuration">Configuration</option>
      </select>

      <select v-model="selectedPriority" class="filter-select">
        <option value="">All Priorities</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>

      <select v-model="selectedStatus" class="filter-select">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <div class="placeholder-list">
      <div
        v-for="placeholder in filteredPlaceholders"
        :key="placeholder.id"
        class="placeholder-item"
        :class="[
          `priority-${placeholder.priority}`,
          `status-${placeholder.status}`,
        ]"
      >
        <div class="placeholder-header">
          <div class="placeholder-info">
            <span class="placeholder-type">{{ placeholder.type }}</span>
            <span
              class="placeholder-priority"
              :class="`priority-${placeholder.priority}`"
            >
              {{ placeholder.priority }}
            </span>
            <span
              class="placeholder-status"
              :class="`status-${placeholder.status}`"
            >
              {{ placeholder.status }}
            </span>
          </div>
          <div class="placeholder-actions">
            <button
              v-if="placeholder.status === 'pending'"
              @click="markInProgress(placeholder.id)"
              class="btn btn-sm btn-secondary"
            >
              Start
            </button>
            <button
              v-if="placeholder.status !== 'completed'"
              @click="markCompleted(placeholder.id)"
              class="btn btn-sm btn-success"
            >
              Complete
            </button>
          </div>
        </div>

        <div class="placeholder-content">
          <p class="placeholder-message">{{ placeholder.message }}</p>
          <div class="placeholder-meta">
            <span v-if="placeholder.location"
              >📍 {{ placeholder.location }}</span
            >
            <span v-if="placeholder.assignee"
              >👤 {{ placeholder.assignee }}</span
            >
            <span>📅 {{ formatDate(placeholder.createdAt) }}</span>
          </div>
          <div v-if="placeholder.instructions" class="placeholder-instructions">
            <strong>Instructions:</strong> {{ placeholder.instructions }}
          </div>
        </div>
      </div>

      <div v-if="filteredPlaceholders.length === 0" class="empty-state">
        <p>No placeholders found matching the current filters.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { usePlaceholders } from "../composables/usePlaceholders.js";

const {
  placeholders,
  summary,
  loadPlaceholders,
  updatePlaceholder,
  completePlaceholder,
  exportPlaceholders: exportData,
} = usePlaceholders();

// Filters
const selectedType = ref("");
const selectedPriority = ref("");
const selectedStatus = ref("");

// Computed
const filteredPlaceholders = computed(() => {
  let filtered = placeholders.value;

  if (selectedType.value) {
    filtered = filtered.filter((p) => p.type === selectedType.value);
  }

  if (selectedPriority.value) {
    filtered = filtered.filter((p) => p.priority === selectedPriority.value);
  }

  if (selectedStatus.value) {
    filtered = filtered.filter((p) => p.status === selectedStatus.value);
  }

  return filtered.sort((a, b) => {
    // Sort by priority (high -> medium -> low), then by creation date
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];

    if (priorityDiff !== 0) return priorityDiff;

    return new Date(b.createdAt) - new Date(a.createdAt);
  });
});

// Methods
const refreshPlaceholders = async () => {
  await loadPlaceholders();
};

const markInProgress = async (id) => {
  await updatePlaceholder(id, { status: "in-progress" });
};

const markCompleted = async (id) => {
  await completePlaceholder(id, "Documentation Manager");
};

const exportPlaceholders = () => {
  const data = exportData();
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `placeholders-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};
</script>

<style scoped>
.placeholder-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.manager-header h3 {
  margin: 0;
  color: var(--vp-c-text-1);
}

.manager-actions {
  display: flex;
  gap: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.btn-primary {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.btn-primary:hover {
  background: var(--vp-c-brand-dark);
}

.btn-success {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-success:hover {
  background: #059669;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.summary-card {
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-align: center;
  background: var(--vp-c-bg-soft);
}

.summary-card.pending {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.summary-card.completed {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.card-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  margin-top: 4px;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.placeholder-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.placeholder-item {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
}

.placeholder-item.priority-high {
  border-left: 4px solid #ef4444;
}

.placeholder-item.priority-medium {
  border-left: 4px solid #f59e0b;
}

.placeholder-item.priority-low {
  border-left: 4px solid #6b7280;
}

.placeholder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.placeholder-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.placeholder-type {
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-transform: capitalize;
}

.placeholder-priority,
.placeholder-status {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.placeholder-priority.priority-high {
  background: #ef4444;
  color: white;
}

.placeholder-priority.priority-medium {
  background: #f59e0b;
  color: white;
}

.placeholder-priority.priority-low {
  background: #6b7280;
  color: white;
}

.placeholder-status.status-pending {
  background: #f59e0b;
  color: white;
}

.placeholder-status.status-in-progress {
  background: #3b82f6;
  color: white;
}

.placeholder-status.status-completed {
  background: #10b981;
  color: white;
}

.placeholder-actions {
  display: flex;
  gap: 8px;
}

.placeholder-content {
  color: var(--vp-c-text-2);
}

.placeholder-message {
  margin: 0 0 8px 0;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.placeholder-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.placeholder-instructions {
  font-size: 14px;
  font-style: italic;
  padding: 8px;
  background: var(--vp-c-bg);
  border-radius: 4px;
  border-left: 3px solid var(--vp-c-brand);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .manager-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .manager-actions {
    justify-content: center;
  }

  .filters {
    flex-direction: column;
  }

  .placeholder-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .placeholder-info {
    justify-content: center;
  }

  .placeholder-actions {
    justify-content: center;
  }

  .placeholder-meta {
    justify-content: center;
  }
}
</style>
