/**
 * Placeholder Registry and Tracking System
 *
 * This module provides functionality to track and manage manual update placeholders
 * throughout the documentation system.
 */

export class PlaceholderRegistry {
  constructor() {
    this.placeholders = new Map();
    this.lastUpdated = new Date();
  }

  /**
   * Register a new placeholder
   * @param {string} id - Unique identifier for the placeholder
   * @param {Object} config - Placeholder configuration
   */
  register(id, config) {
    const placeholder = {
      id,
      type: config.type,
      location: config.location,
      message: config.message,
      priority: config.priority || "medium",
      instructions: config.instructions || "",
      createdAt: new Date(),
      lastReviewed: config.lastReviewed || null,
      status: config.status || "pending",
      assignee: config.assignee || null,
      ...config,
    };

    this.placeholders.set(id, placeholder);
    return placeholder;
  }

  /**
   * Update an existing placeholder
   * @param {string} id - Placeholder ID
   * @param {Object} updates - Updates to apply
   */
  update(id, updates) {
    const placeholder = this.placeholders.get(id);
    if (!placeholder) {
      throw new Error(`Placeholder with ID "${id}" not found`);
    }

    const updated = {
      ...placeholder,
      ...updates,
      updatedAt: new Date(),
    };

    this.placeholders.set(id, updated);
    return updated;
  }

  /**
   * Mark a placeholder as completed
   * @param {string} id - Placeholder ID
   * @param {string} completedBy - Who completed the update
   */
  markCompleted(id, completedBy = null) {
    return this.update(id, {
      status: "completed",
      completedAt: new Date(),
      completedBy,
    });
  }

  /**
   * Get all placeholders
   * @param {Object} filters - Optional filters
   * @returns {Array} Array of placeholders
   */
  getAll(filters = {}) {
    let results = Array.from(this.placeholders.values());

    if (filters.type) {
      results = results.filter((p) => p.type === filters.type);
    }

    if (filters.priority) {
      results = results.filter((p) => p.priority === filters.priority);
    }

    if (filters.status) {
      results = results.filter((p) => p.status === filters.status);
    }

    if (filters.location) {
      results = results.filter((p) => p.location.includes(filters.location));
    }

    return results;
  }

  /**
   * Get placeholders by priority
   * @param {string} priority - Priority level
   * @returns {Array} Filtered placeholders
   */
  getByPriority(priority) {
    return this.getAll({ priority });
  }

  /**
   * Get pending placeholders
   * @returns {Array} Pending placeholders
   */
  getPending() {
    return this.getAll({ status: "pending" });
  }

  /**
   * Get overdue placeholders (older than specified days)
   * @param {number} days - Number of days to consider overdue
   * @returns {Array} Overdue placeholders
   */
  getOverdue(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.getPending().filter((p) => p.createdAt < cutoffDate);
  }

  /**
   * Generate a summary report
   * @returns {Object} Summary statistics
   */
  getSummary() {
    const all = this.getAll();
    const pending = this.getPending();
    const overdue = this.getOverdue();

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
      overdue: overdue.length,
      byType,
      byPriority,
      lastUpdated: this.lastUpdated,
    };
  }

  /**
   * Export placeholders to JSON
   * @returns {string} JSON representation
   */
  export() {
    return JSON.stringify(
      {
        placeholders: Array.from(this.placeholders.entries()),
        lastUpdated: this.lastUpdated,
        summary: this.getSummary(),
      },
      null,
      2
    );
  }

  /**
   * Import placeholders from JSON
   * @param {string} jsonData - JSON data to import
   */
  import(jsonData) {
    const data = JSON.parse(jsonData);
    this.placeholders = new Map(data.placeholders);
    this.lastUpdated = new Date(data.lastUpdated);
  }

  /**
   * Validate placeholder configuration
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validation result
   */
  static validate(config) {
    const errors = [];
    const validTypes = [
      "screenshot",
      "api-example",
      "feature-description",
      "configuration",
    ];
    const validPriorities = ["high", "medium", "low"];
    const validStatuses = ["pending", "in-progress", "completed", "cancelled"];

    if (!config.type || !validTypes.includes(config.type)) {
      errors.push(`Invalid type. Must be one of: ${validTypes.join(", ")}`);
    }

    if (!config.location || typeof config.location !== "string") {
      errors.push("Location is required and must be a string");
    }

    if (!config.message || typeof config.message !== "string") {
      errors.push("Message is required and must be a string");
    }

    if (config.priority && !validPriorities.includes(config.priority)) {
      errors.push(
        `Invalid priority. Must be one of: ${validPriorities.join(", ")}`
      );
    }

    if (config.status && !validStatuses.includes(config.status)) {
      errors.push(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Global registry instance
export const placeholderRegistry = new PlaceholderRegistry();

// Helper functions for common operations
export const registerPlaceholder = (id, config) => {
  const validation = PlaceholderRegistry.validate(config);
  if (!validation.valid) {
    throw new Error(
      `Invalid placeholder configuration: ${validation.errors.join(", ")}`
    );
  }
  return placeholderRegistry.register(id, config);
};

export const updatePlaceholder = (id, updates) =>
  placeholderRegistry.update(id, updates);
export const completePlaceholder = (id, completedBy) =>
  placeholderRegistry.markCompleted(id, completedBy);
export const getPendingPlaceholders = () => placeholderRegistry.getPending();
export const getPlaceholderSummary = () => placeholderRegistry.getSummary();
