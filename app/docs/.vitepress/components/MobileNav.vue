<template>
  <div class="mobile-nav-wrapper">
    <!-- Mobile menu button -->
    <button
      class="mobile-menu-button"
      :class="{ 'is-open': isMenuOpen }"
      @click="toggleMenu"
      :aria-expanded="isMenuOpen"
      aria-controls="mobile-menu"
      aria-label="Toggle navigation menu"
    >
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>

    <!-- Mobile menu overlay -->
    <div
      v-if="isMenuOpen"
      class="mobile-menu-overlay"
      @click="closeMenu"
      aria-hidden="true"
    ></div>

    <!-- Mobile menu -->
    <nav
      id="mobile-menu"
      class="mobile-menu"
      :class="{ 'is-open': isMenuOpen }"
      :aria-hidden="!isMenuOpen"
    >
      <div class="mobile-menu-header">
        <div class="mobile-menu-title">
          <img
            :src="theme.logo?.light || '/logo-light.svg'"
            alt="Tracktor"
            class="mobile-logo"
          />
          <span>Tracktor Docs</span>
        </div>
        <button
          class="mobile-menu-close"
          @click="closeMenu"
          aria-label="Close navigation menu"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>

      <div class="mobile-menu-content">
        <!-- Main navigation -->
        <div class="mobile-nav-section">
          <h3 class="mobile-nav-heading">Main Navigation</h3>
          <ul class="mobile-nav-list">
            <li><a href="/" @click="closeMenu">Home</a></li>
            <li><a href="/user-guide/" @click="closeMenu">User Guide</a></li>
            <li>
              <a href="/developer-guide/" @click="closeMenu">Developer Guide</a>
            </li>
            <li>
              <a href="/developer-guide/api/" @click="closeMenu">API Docs</a>
            </li>
          </ul>
        </div>

        <!-- Current section navigation -->
        <div v-if="currentSectionNav" class="mobile-nav-section">
          <h3 class="mobile-nav-heading">{{ currentSectionTitle }}</h3>
          <ul class="mobile-nav-list">
            <li v-for="item in currentSectionNav" :key="item.link">
              <a
                :href="item.link"
                @click="closeMenu"
                :class="{ 'is-active': isCurrentPage(item.link) }"
              >
                {{ item.text }}
              </a>
              <ul v-if="item.items" class="mobile-nav-sublist">
                <li v-for="subItem in item.items" :key="subItem.link">
                  <a
                    :href="subItem.link"
                    @click="closeMenu"
                    :class="{ 'is-active': isCurrentPage(subItem.link) }"
                  >
                    {{ subItem.text }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <!-- Quick links -->
        <div class="mobile-nav-section">
          <h3 class="mobile-nav-heading">Quick Links</h3>
          <ul class="mobile-nav-list">
            <li>
              <a
                href="https://tracktor-demo.bytedge.in"
                target="_blank"
                rel="noopener"
                >Demo</a
              >
            </li>
            <li>
              <a
                href="https://github.com/javedh-dev/tracktor"
                target="_blank"
                rel="noopener"
                >GitHub</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useData, useRoute } from "vitepress";

const { theme } = useData();
const route = useRoute();

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// Close menu when route changes
watch(
  () => route.path,
  () => {
    closeMenu();
  }
);

// Determine current section navigation
const currentSectionNav = computed(() => {
  const path = route.path;

  if (path.startsWith("/user-guide/")) {
    return theme.value.sidebar?.["/user-guide/"];
  } else if (path.startsWith("/developer-guide/")) {
    return theme.value.sidebar?.["/developer-guide/"];
  }

  return null;
});

const currentSectionTitle = computed(() => {
  const path = route.path;

  if (path.startsWith("/user-guide/")) {
    return "User Guide";
  } else if (path.startsWith("/developer-guide/")) {
    return "Developer Guide";
  }

  return "Navigation";
});

const isCurrentPage = (link) => {
  return route.path === link || route.path === link + "/";
};

// Prevent body scroll when menu is open
watch(isMenuOpen, (isOpen) => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }
});
</script>

<style scoped>
.mobile-nav-wrapper {
  display: none;
}

@media (max-width: 768px) {
  .mobile-nav-wrapper {
    display: block;
  }
}

.mobile-menu-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.mobile-menu-button:hover {
  background-color: var(--vp-c-default-soft);
}

.hamburger-line {
  display: block;
  width: 20px;
  height: 2px;
  background-color: var(--vp-c-text-1);
  margin: 2px 0;
  transition: all 0.3s ease;
  transform-origin: center;
}

.mobile-menu-button.is-open .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-button.is-open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-button.is-open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 300px;
  max-width: 85vw;
  height: 100vh;
  background-color: var(--vp-c-bg);
  border-left: 1px solid var(--vp-c-divider);
  z-index: 1000;
  transition: right 0.3s ease;
  overflow-y: auto;
}

.mobile-menu.is-open {
  right: 0;
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.mobile-menu-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.mobile-logo {
  width: 24px;
  height: 24px;
}

.mobile-menu-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}

.mobile-menu-close:hover {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.mobile-menu-content {
  padding: 1rem;
}

.mobile-nav-section {
  margin-bottom: 2rem;
}

.mobile-nav-heading {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.75rem 0;
}

.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobile-nav-list li {
  margin-bottom: 0.25rem;
}

.mobile-nav-list a {
  display: block;
  padding: 0.5rem 0.75rem;
  color: var(--vp-c-text-1);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.mobile-nav-list a:hover {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-brand-1);
}

.mobile-nav-list a.is-active {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.mobile-nav-sublist {
  margin-left: 1rem;
  margin-top: 0.25rem;
}

.mobile-nav-sublist a {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

/* Dark mode adjustments */
.dark .mobile-menu {
  background-color: var(--vp-c-bg-alt);
}

.dark .hamburger-line {
  background-color: var(--vp-c-text-1);
}
</style>
