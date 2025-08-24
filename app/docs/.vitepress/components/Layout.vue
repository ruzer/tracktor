<template>
  <Layout>
    <template #doc-before>
      <!-- Skip to content link for accessibility -->
      <a href="#VPContent" class="skip-to-content">Skip to main content</a>

      <!-- Breadcrumb navigation -->
      <div class="breadcrumb-container">
        <BreadcrumbNav />
      </div>
    </template>

    <template #nav-bar-content-after>
      <!-- Mobile navigation button -->
      <MobileNav />
    </template>

    <template #doc-after>
      <!-- Additional content after document -->
      <div class="doc-footer-meta">
        <div class="last-updated" v-if="page.lastUpdated">
          <span class="meta-label">Last updated:</span>
          <time :datetime="new Date(page.lastUpdated).toISOString()">
            {{ formatDate(page.lastUpdated) }}
          </time>
        </div>

        <div class="edit-link" v-if="editLink">
          <a :href="editLink" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
            Edit this page
          </a>
        </div>
      </div>
    </template>
  </Layout>
</template>

<script setup>
import { computed } from "vue";
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";

const Layout = DefaultTheme.Layout;
const { page, theme } = useData();

const editLink = computed(() => {
  const { editLink } = theme.value;
  if (!editLink) return null;

  const { pattern, text } = editLink;
  const url = pattern.replace(":path", page.value.relativePath);
  return url;
});

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--vp-c-brand-1);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  font-size: 14px;
  font-weight: 500;
}

.skip-to-content:focus {
  top: 6px;
}

.breadcrumb-container {
  margin-bottom: 1.5rem;
}

.doc-footer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.meta-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.edit-link a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.edit-link a:hover {
  color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .doc-footer-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
