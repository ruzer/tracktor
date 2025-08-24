<template>
  <div class="enhanced-search">
    <!-- Search input with enhanced styling -->
    <div class="search-input-wrapper">
      <div class="search-icon">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path
            fill="currentColor"
            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
          />
        </svg>
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search documentation..."
        class="search-input"
        @input="handleSearch"
        @focus="showResults = true"
        @blur="handleBlur"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="clear-button"
        aria-label="Clear search"
      >
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path
            fill="currentColor"
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          />
        </svg>
      </button>
    </div>

    <!-- Search results -->
    <div
      v-if="showResults && (searchResults.length > 0 || searchQuery)"
      class="search-results"
    >
      <div v-if="searchResults.length === 0 && searchQuery" class="no-results">
        <p>No results found for "{{ searchQuery }}"</p>
        <div class="search-suggestions">
          <p>Try:</p>
          <ul>
            <li>Checking your spelling</li>
            <li>Using different keywords</li>
            <li>Using more general terms</li>
          </ul>
        </div>
      </div>

      <div v-else class="results-container">
        <div class="results-header">
          <span class="results-count"
            >{{ searchResults.length }} result{{
              searchResults.length !== 1 ? "s" : ""
            }}</span
          >
        </div>

        <!-- Categorized results -->
        <div
          v-for="category in categorizedResults"
          :key="category.name"
          class="result-category"
        >
          <h3 class="category-title">{{ category.name }}</h3>
          <div class="category-results">
            <a
              v-for="result in category.results"
              :key="result.id"
              :href="result.id"
              class="result-item"
              @click="handleResultClick"
            >
              <div class="result-title">{{ result.title }}</div>
              <div class="result-excerpt" v-html="result.excerpt"></div>
              <div class="result-path">{{ formatPath(result.id) }}</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vitepress";

const router = useRouter();

const searchQuery = ref("");
const searchResults = ref([]);
const showResults = ref(false);
const searchIndex = ref(null);

// Mock search function - in real implementation, this would use VitePress's search
const performSearch = async (query) => {
  if (!query.trim()) {
    searchResults.value = [];
    return;
  }

  // Simulate search results - replace with actual VitePress search integration
  const mockResults = [
    {
      id: "/user-guide/features/vehicle-management",
      title: "Vehicle Management",
      excerpt:
        "Learn how to add, edit, and manage your vehicles in Tracktor...",
      category: "User Guide",
    },
    {
      id: "/developer-guide/api/vehicles",
      title: "Vehicles API",
      excerpt: "API endpoints for managing vehicle data...",
      category: "API Reference",
    },
    {
      id: "/user-guide/getting-started/installation",
      title: "Installation",
      excerpt: "Step-by-step guide to install Tracktor...",
      category: "Getting Started",
    },
  ].filter(
    (result) =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.excerpt.toLowerCase().includes(query.toLowerCase())
  );

  searchResults.value = mockResults;
};

const categorizedResults = computed(() => {
  const categories = {};

  searchResults.value.forEach((result) => {
    const category = result.category || "Other";
    if (!categories[category]) {
      categories[category] = {
        name: category,
        results: [],
      };
    }
    categories[category].results.push(result);
  });

  return Object.values(categories);
});

const handleSearch = () => {
  performSearch(searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = "";
  searchResults.value = [];
  showResults.value = false;
};

const handleBlur = () => {
  // Delay hiding results to allow for clicks
  setTimeout(() => {
    showResults.value = false;
  }, 200);
};

const handleResultClick = () => {
  showResults.value = false;
  searchQuery.value = "";
};

const formatPath = (path) => {
  return path
    .replace(/^\//, "")
    .replace(/\//g, " › ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

// Watch for query changes
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    showResults.value = true;
    performSearch(newQuery);
  } else {
    searchResults.value = [];
    showResults.value = false;
  }
});
</script>

<style scoped>
.enhanced-search {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--vp-c-text-3);
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.clear-button {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--vp-c-text-3);
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-button:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-default-soft);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 4px;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: var(--vp-c-text-2);
}

.search-suggestions {
  margin-top: 12px;
  text-align: left;
}

.search-suggestions ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.search-suggestions li {
  margin: 4px 0;
}

.results-container {
  padding: 12px 0;
}

.results-header {
  padding: 8px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 12px;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-category {
  margin-bottom: 16px;
}

.category-title {
  padding: 8px 16px;
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-default-soft);
}

.category-results {
  padding: 4px 0;
}

.result-item {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
  border-left: 3px solid transparent;
}

.result-item:hover {
  background-color: var(--vp-c-default-soft);
  border-left-color: var(--vp-c-brand-1);
}

.result-title {
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.result-excerpt {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.4;
  margin-bottom: 4px;
}

.result-path {
  font-size: 11px;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .enhanced-search {
    max-width: none;
  }

  .search-results {
    max-height: 300px;
  }

  .result-item {
    padding: 10px 12px;
  }
}
</style>
