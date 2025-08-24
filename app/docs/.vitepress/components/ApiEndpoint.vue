<template>
  <div class="api-endpoint">
    <div class="method-url">
      <span :class="methodClass">{{ method }}</span>
      <code class="endpoint-url">{{ endpoint }}</code>
    </div>
    <div class="description" v-if="description">
      {{ description }}
    </div>
    <div class="auth-info" v-if="auth">
      <strong>Authentication:</strong> {{ auth }}
    </div>
    <slot />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  method: {
    type: String,
    required: true,
    validator: (value) =>
      ["GET", "POST", "PUT", "DELETE", "PATCH"].includes(value),
  },
  endpoint: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  auth: {
    type: String,
    default: "",
  },
});

const methodClass = computed(() => {
  return `method-badge method-${props.method.toLowerCase()}`;
});
</script>

<style scoped>
.api-endpoint {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background: var(--vp-c-bg-soft);
}

.method-url {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.method-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  min-width: 60px;
  text-align: center;
}

.method-get {
  background: #10b981;
  color: white;
}

.method-post {
  background: #3b82f6;
  color: white;
}

.method-put {
  background: #f59e0b;
  color: white;
}

.method-delete {
  background: #ef4444;
  color: white;
}

.method-patch {
  background: #8b5cf6;
  color: white;
}

.endpoint-url {
  font-family: var(--vp-font-family-mono);
  background: var(--vp-c-bg-mute);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  flex: 1;
}

.description {
  margin-bottom: 8px;
  color: var(--vp-c-text-2);
}

.auth-info {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-top: 8px;
}

@media (max-width: 768px) {
  .method-url {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .endpoint-url {
    width: 100%;
  }
}
</style>
