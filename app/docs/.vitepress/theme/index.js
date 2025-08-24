import DefaultTheme from "vitepress/theme";
import "./custom.css";

// Import vitepress-openapi theme
import { theme } from "vitepress-openapi/client";
import "vitepress-openapi/dist/style.css";

// Import custom components
import ApiEndpoint from "../components/ApiEndpoint.vue";
import PlaceholderBlock from "../components/PlaceholderBlock.vue";
import FeatureStatus from "../components/FeatureStatus.vue";
import PlaceholderManager from "../components/PlaceholderManager.vue";
import BreadcrumbNav from "../components/BreadcrumbNav.vue";
import MobileNav from "../components/MobileNav.vue";
import EnhancedSearch from "../components/EnhancedSearch.vue";
import Layout from "../components/Layout.vue";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    // Register vitepress-openapi theme
    theme.enhanceApp({ app, router, siteData });

    // Register custom components globally
    app.component("ApiEndpoint", ApiEndpoint);
    app.component("PlaceholderBlock", PlaceholderBlock);
    app.component("FeatureStatus", FeatureStatus);
    app.component("PlaceholderManager", PlaceholderManager);
    app.component("BreadcrumbNav", BreadcrumbNav);
    app.component("MobileNav", MobileNav);
    app.component("EnhancedSearch", EnhancedSearch);
  },
};
