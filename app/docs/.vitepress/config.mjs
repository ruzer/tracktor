import { preBuildValidation } from "./hooks/buildValidation.js";
import { searchConfig } from "./config/search.js";

export default {
  title: "Tracktor",
  description: "Comprehensive vehicle management and tracking documentation",
  base: "/",
  ignoreDeadLinks: false, // We now have proper link validation
  head: [
    ["meta", { name: "theme-color", content: "#3c82f6" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
  ],
  themeConfig: {
    logo: {
      light: "/logo-light.svg",
      dark: "/logo-dark.svg",
    },
    siteTitle: "Tracktor Docs",
    lastUpdated: true,
    editLink: {
      pattern:
        "https://github.com/javedh-dev/tracktor/edit/main/app/docs/:path",
      text: "Edit this page on GitHub",
    },
    search: searchConfig,
    nav: [
      { text: "Home", link: "/" },
      {
        text: "User Guide",
        link: "/user-guide/",
        activeMatch: "/user-guide/",
      },
      {
        text: "Developer Guide",
        link: "/developer-guide/",
        activeMatch: "/developer-guide/",
      },
      {
        text: "API Docs",
        link: "/developer-guide/api/",
        activeMatch: "/developer-guide/api/",
      },
      { text: "Demo", link: "https://tracktor-demo.bytedge.in" },
      { text: "GitHub", link: "https://github.com/javedh-dev/tracktor" },
    ],
    sidebar: {
      "/user-guide/": [
        {
          text: "Getting Started",
          collapsed: false,
          items: [
            { text: "Overview", link: "/user-guide/" },
            {
              text: "Installation",
              link: "/user-guide/getting-started/installation",
            },
            {
              text: "First Setup",
              link: "/user-guide/getting-started/first-setup",
            },
            {
              text: "Basic Navigation",
              link: "/user-guide/getting-started/basic-navigation",
            },
          ],
        },
        {
          text: "Features",
          collapsed: false,
          items: [
            {
              text: "Vehicle Management",
              link: "/user-guide/features/vehicle-management",
            },
            {
              text: "Fuel Tracking",
              link: "/user-guide/features/fuel-tracking",
            },
            {
              text: "Maintenance Logs",
              link: "/user-guide/features/maintenance-logs",
            },
            {
              text: "Insurance Management",
              link: "/user-guide/features/insurance-management",
            },
            {
              text: "Pollution Certificates",
              link: "/user-guide/features/pollution-certificates",
            },
          ],
        },
        {
          text: "Tutorials",
          collapsed: true,
          items: [
            {
              text: "Adding Your First Vehicle",
              link: "/user-guide/tutorials/adding-first-vehicle",
            },
            {
              text: "Tracking Fuel Efficiency",
              link: "/user-guide/tutorials/tracking-fuel-efficiency",
            },
            {
              text: "Maintenance Scheduling",
              link: "/user-guide/tutorials/maintenance-scheduling",
            },
          ],
        },
        {
          text: "Help & Support",
          collapsed: true,
          items: [
            {
              text: "Common Issues",
              link: "/user-guide/troubleshooting/common-issues",
            },
            { text: "FAQ", link: "/user-guide/troubleshooting/faq" },
          ],
        },
      ],
      "/developer-guide/": [
        {
          text: "Overview",
          collapsed: false,
          items: [{ text: "Developer Guide", link: "/developer-guide/" }],
        },
        {
          text: "Architecture",
          collapsed: false,
          items: [
            {
              text: "System Overview",
              link: "/developer-guide/architecture/overview",
            },
            {
              text: "Frontend Architecture",
              link: "/developer-guide/architecture/frontend-architecture",
            },
            {
              text: "Backend Architecture",
              link: "/developer-guide/architecture/backend-architecture",
            },
            {
              text: "Database Schema",
              link: "/developer-guide/architecture/database-schema",
            },
          ],
        },
        {
          text: "API Reference",
          collapsed: false,
          items: [
            { text: "API Overview", link: "/developer-guide/api/" },
            {
              text: "Interactive API Explorer",
              link: "/developer-guide/api/swagger-ui",
            },
            {
              text: "Authentication",
              link: "/developer-guide/api/authentication",
            },
            { text: "Vehicles API", link: "/developer-guide/api/vehicles" },
            { text: "Fuel Logs API", link: "/developer-guide/api/fuel-logs" },
            {
              text: "Maintenance API",
              link: "/developer-guide/api/maintenance-logs",
            },
            { text: "Insurance API", link: "/developer-guide/api/insurance" },
            { text: "PUCC API", link: "/developer-guide/api/pucc" },
          ],
        },
        {
          text: "Development",
          collapsed: true,
          items: [
            {
              text: "Environment Setup",
              link: "/developer-guide/development/setup",
            },
            {
              text: "Coding Standards",
              link: "/developer-guide/development/coding-standards",
            },
            { text: "Testing", link: "/developer-guide/development/testing" },
            {
              text: "Debugging",
              link: "/developer-guide/development/debugging",
            },
          ],
        },
        {
          text: "Deployment",
          collapsed: true,
          items: [
            {
              text: "Docker Deployment",
              link: "/developer-guide/deployment/docker",
            },
            {
              text: "Manual Deployment",
              link: "/developer-guide/deployment/manual-deployment",
            },
            {
              text: "Environment Variables",
              link: "/developer-guide/deployment/environment-variables",
            },
            {
              text: "Production Considerations",
              link: "/developer-guide/deployment/production-considerations",
            },
          ],
        },
        {
          text: "Contributing",
          collapsed: true,
          items: [
            {
              text: "Guidelines",
              link: "/developer-guide/contributing/guidelines",
            },
            {
              text: "Pull Requests",
              link: "/developer-guide/contributing/pull-requests",
            },
            {
              text: "Documentation Updates",
              link: "/developer-guide/contributing/documentation-updates",
            },
          ],
        },
      ],
      "/": [
        {
          text: "Quick Start",
          items: [
            { text: "Introduction", link: "/introduction" },
            { text: "User Guide", link: "/user-guide/" },
            { text: "Developer Guide", link: "/developer-guide/" },
          ],
        },
        {
          text: "Legacy Documentation",
          collapsed: true,
          items: [
            { text: "Deployment", link: "/deployment" },
            { text: "Contributing", link: "/contributing" },
          ],
        },
        {
          text: "Legacy API Docs",
          collapsed: true,
          items: [
            { text: "Authentication", link: "/api/authentication" },
            { text: "Vehicles", link: "/api/vehicles" },
            { text: "Fuel Log", link: "/api/fuel-log" },
            { text: "Maintenance Log", link: "/api/maintenance-log" },
            { text: "PUCC", link: "/api/pucc" },
            { text: "Insurance", link: "/api/insurance" },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/javedh-dev/tracktor" },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024 Tracktor",
    },
  },
  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
    lineNumbers: false,
  },
  vite: {
    assetsInclude: ["**/*.yaml", "**/*.yml"],
    server: {
      fs: {
        allow: [".."],
      },
    },
  },

  // Build hooks for validation
  buildEnd: async (siteConfig) => {
    // Run post-build validation if needed
    console.log("✅ Build completed successfully");
  },

  // Transform hooks for additional processing
  transformHead: (context) => {
    // Add validation metadata to head if needed
    return [];
  },
};
