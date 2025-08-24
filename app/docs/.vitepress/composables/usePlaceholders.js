/**
 * Vue Composable for Placeholder Management
 *
 * Provides reactive placeholder management functionality for Vue components
 */

import { ref, computed, onMounted } from "vue";
import { placeholderRegistry } from "../utils/placeholderRegistry.js";

export function usePlaceholders() {
  const placeholders = ref(new Map());
  const loading = ref(false);
  const error = ref(null);

  // Reactive computed properties
  const allPlaceholders = computed(() =>
    Array.from(placeholders.value.values())
  );

  const pendingPlaceholders = computed(() =>
    allPlaceholders.value.filter((p) => p.status === "pending")
  );

  const highPriorityPlaceholders = computed(() =>
    allPlaceholders.value.filter((p) => p.priority === "high")
  );

  const summary = computed(() => {
    const all = allPlaceholders.value;
    const pending = pendingPlaceholders.value;

    const byType = {};
    const byPriority = {};

    all.forEach((p) => {
      byType[p.type] = (byType[p.type] || 0) + 1;
      byPriority[p.priority] = (byPriority[p.priority] || 0) + 1;
    });

    return {
      total: all.length,
      pending: pending.length,
      completed: all.filter((p) => p.status === "completed").length,
      byType,
      byPriority,
    };
  });

  // Methods
  const loadPlaceholders = async () => {
    loading.value = true;
    error.value = null;

    try {
      // In a real implementation, this might load from a file or API
      placeholders.value = placeholderRegistry.placeholders;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const registerPlaceholder = async (id, config) => {
    try {
      const placeholder = placeholderRegistry.register(id, config);
      placeholders.value.set(id, placeholder);
      return placeholder;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const updatePlaceholder = async (id, updates) => {
    try {
      const placeholder = placeholderRegistry.update(id, updates);
      placeholders.value.set(id, placeholder);
      return placeholder;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const completePlaceholder = async (id, completedBy = null) => {
    try {
      const placeholder = placeholderRegistry.markCompleted(id, completedBy);
      placeholders.value.set(id, placeholder);
      return placeholder;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const deletePlaceholder = async (id) => {
    try {
      placeholderRegistry.placeholders.delete(id);
      placeholders.value.delete(id);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const getPlaceholdersByType = (type) => {
    return allPlaceholders.value.filter((p) => p.type === type);
  };

  const getPlaceholdersByLocation = (location) => {
    return allPlaceholders.value.filter((p) => p.location.includes(location));
  };

  const exportPlaceholders = () => {
    return placeholderRegistry.export();
  };

  const importPlaceholders = async (jsonData) => {
    try {
      placeholderRegistry.import(jsonData);
      await loadPlaceholders();
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // Auto-load on mount
  onMounted(() => {
    loadPlaceholders();
  });

  return {
    // State
    placeholders: allPlaceholders,
    pendingPlaceholders,
    highPriorityPlaceholders,
    summary,
    loading,
    error,

    // Methods
    loadPlaceholders,
    registerPlaceholder,
    updatePlaceholder,
    completePlaceholder,
    deletePlaceholder,
    getPlaceholdersByType,
    getPlaceholdersByLocation,
    exportPlaceholders,
    importPlaceholders,
  };
}

// Helper composable for individual placeholder management
export function usePlaceholder(id) {
  const { placeholders, updatePlaceholder, completePlaceholder } =
    usePlaceholders();

  const placeholder = computed(() =>
    placeholders.value.find((p) => p.id === id)
  );

  const isCompleted = computed(() => placeholder.value?.status === "completed");

  const isPending = computed(() => placeholder.value?.status === "pending");

  const isOverdue = computed(() => {
    if (!placeholder.value || placeholder.value.status !== "pending")
      return false;

    const daysSinceCreated = Math.floor(
      (new Date() - new Date(placeholder.value.createdAt)) /
        (1000 * 60 * 60 * 24)
    );

    return daysSinceCreated > 30; // Consider overdue after 30 days
  });

  return {
    placeholder,
    isCompleted,
    isPending,
    isOverdue,
    update: (updates) => updatePlaceholder(id, updates),
    complete: (completedBy) => completePlaceholder(id, completedBy),
  };
}
