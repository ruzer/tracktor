<template>
  <nav class="breadcrumb-nav" aria-label="Breadcrumb navigation">
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item">
        <a href="/" class="breadcrumb-link home-link">
          <svg class="home-icon" viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span class="sr-only">Home</span>
        </a>
      </li>
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        class="breadcrumb-item"
      >
        <span class="breadcrumb-separator" aria-hidden="true">/</span>
        <a
          v-if="crumb.link && index < breadcrumbs.length - 1"
          :href="crumb.link"
          class="breadcrumb-link"
        >
          {{ crumb.text }}
        </a>
        <span
          v-else
          class="breadcrumb-current"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
        >
          {{ crumb.text }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useData, useRoute } from "vitepress";

const { page, theme } = useData();
const route = useRoute();

const breadcrumbs = computed(() => {
  const path = route.path;
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [];
  }

  const crumbs = [];
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Convert segment to readable text
    let text = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    // Special handling for common segments
    const segmentMappings = {
      "user-guide": "User Guide",
      "developer-guide": "Developer Guide",
      "getting-started": "Getting Started",
      api: "API Reference",
      troubleshooting: "Help & Support",
    };

    if (segmentMappings[segment]) {
      text = segmentMappings[segment];
    }

    // For the last segment, use the page title if available
    if (index === segments.length - 1 && page.value.title) {
      text = page.value.title;
    }

    crumbs.push({
      text,
      link: index < segments.length - 1 ? currentPath : null,
    });
  });

  return crumbs;
});
</script>

<style scoped>
.breadcrumb-nav {
  margin-bottom: 1.5rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.breadcrumb-link {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.breadcrumb-link:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.home-link {
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.home-link:hover {
  background-color: var(--vp-c-default-soft);
}

.home-icon {
  flex-shrink: 0;
}

.breadcrumb-separator {
  color: var(--vp-c-text-3);
  margin: 0 0.25rem;
}

.breadcrumb-current {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .breadcrumb-nav {
    margin-bottom: 1rem;
    padding: 0.5rem 0;
  }

  .breadcrumb-list {
    font-size: 0.8125rem;
  }

  .breadcrumb-item {
    max-width: 100%;
  }

  .breadcrumb-link,
  .breadcrumb-current {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 150px;
  }
}
</style>
