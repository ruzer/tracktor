<template>
  <div class="placeholder-block" :class="typeClass">
    <div class="placeholder-header">
      <svg
        class="icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        />
      </svg>
      <span>Manual Update Required</span>
      <span class="priority-badge" :class="priorityClass">{{ priority }}</span>
    </div>
    <div class="placeholder-content">
      <p><strong>Type:</strong> {{ type }}</p>
      <p><strong>Instructions:</strong> {{ message }}</p>
      <p v-if="assignee"><strong>Assignee:</strong> {{ assignee }}</p>
      <p v-if="location"><strong>Location:</strong> {{ location }}</p>
      <div class="update-instructions" v-if="instructions || $slots.default">
        <div v-if="instructions" class="instructions-text">
          {{ instructions }}
        </div>
        <div v-if="$slots.default" class="slot-content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { usePlaceholders } from "../composables/usePlaceholders.js";

const props = defineProps({
  id: {
    type: String,
    default: () =>
      `placeholder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  },
  type: {
    type: String,
    required: true,
    validator: (value) =>
      [
        "screenshot",
        "api-example",
        "feature-description",
        "configuration",
      ].includes(value),
  },
  message: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    default: "medium",
    validator: (value) => ["high", "medium", "low"].includes(value),
  },
  location: {
    type: String,
    default: "",
  },
  instructions: {
    type: String,
    default: "",
  },
  assignee: {
    type: String,
    default: null,
  },
  autoRegister: {
    type: Boolean,
    default: true,
  },
});

const { registerPlaceholder } = usePlaceholders();

const typeClass = computed(() => {
  return `placeholder-${props.type}`;
});

const priorityClass = computed(() => {
  return `priority-${props.priority}`;
});

// Auto-register placeholder if enabled
onMounted(() => {
  if (props.autoRegister) {
    try {
      registerPlaceholder(props.id, {
        type: props.type,
        message: props.message,
        priority: props.priority,
        location: props.location || window.location.pathname,
        instructions: props.instructions,
        assignee: props.assignee,
      });
    } catch (error) {
      // Placeholder might already exist, which is fine
      console.debug(
        `Placeholder ${props.id} already registered or registration failed:`,
        error.message
      );
    }
  }
});
</script>

<style scoped>
.placeholder-block {
  background: var(--vp-c-warning-soft);
  border: 1px solid var(--vp-c-warning-2);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.placeholder-screenshot {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-soft);
}

.placeholder-api-example {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.placeholder-configuration {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.placeholder-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--vp-c-warning-1);
  margin-bottom: 8px;
}

.icon {
  flex-shrink: 0;
}

.priority-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: auto;
}

.priority-high {
  background: #ef4444;
  color: white;
}

.priority-medium {
  background: #f59e0b;
  color: white;
}

.priority-low {
  background: #6b7280;
  color: white;
}

.placeholder-content {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.placeholder-content p {
  margin: 0 0 8px 0;
}

.placeholder-content p:last-child {
  margin-bottom: 0;
}

.update-instructions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  font-style: italic;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .placeholder-block {
    padding: 12px;
  }

  .placeholder-header {
    flex-wrap: wrap;
  }

  .priority-badge {
    margin-left: 0;
  }
}
</style>
