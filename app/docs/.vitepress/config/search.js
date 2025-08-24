/**
 * Enhanced search configuration for VitePress
 */

export const searchConfig = {
  provider: "local",
  options: {
    locales: {
      root: {
        translations: {
          button: {
            buttonText: "Search Documentation",
            buttonAriaLabel: "Search Documentation",
          },
          modal: {
            displayDetails: "Display detailed list",
            resetButtonTitle: "Clear search query",
            backButtonTitle: "Close search",
            noResultsText: "No results found for",
            footer: {
              selectText: "to select",
              selectKeyAriaLabel: "enter",
              navigateText: "to navigate",
              navigateUpKeyAriaLabel: "up arrow",
              navigateDownKeyAriaLabel: "down arrow",
              closeText: "to close",
              closeKeyAriaLabel: "escape",
            },
          },
        },
      },
    },

    // Enhanced MiniSearch configuration
    miniSearch: {
      searchOptions: {
        // Enable fuzzy matching with tolerance
        fuzzy: 0.2,

        // Enable prefix matching
        prefix: true,

        // Boost certain fields for better relevance
        boost: {
          title: 4, // Page titles get highest boost
          text: 2, // Content text gets medium boost
          titles: 1, // Section headings get normal boost
        },

        // Combine results using OR logic
        combineWith: "OR",
      },

      // Index configuration
      options: {
        // Fields to index
        fields: ["title", "titles", "text"],

        // Fields to store for display
        storeFields: ["title", "titles"],

        // Search options
        searchOptions: {
          fuzzy: 0.2,
          prefix: true,
          boost: {
            title: 4,
            text: 2,
            titles: 1,
          },
        },
      },
    },

    // Files and patterns to exclude from search
    exclude: [
      // Template files
      "templates/**",

      // VitePress internal files
      "**/.vitepress/**",

      // Node modules
      "**/node_modules/**",

      // Build artifacts
      "**/dist/**",

      // Specific files that shouldn't be searchable
      "**/README.md",
      "**/.gitignore",
      "**/.env*",

      // Legacy or deprecated content
      "legacy/**",
      "deprecated/**",
    ],

    // Custom result processing
    _render(src, env, md) {
      // Custom rendering logic can be added here
      return md.render(src, env);
    },
  },
};

/**
 * Search result categories for better organization
 */
export const searchCategories = {
  "user-guide": {
    name: "User Guide",
    icon: "👤",
    priority: 1,
  },
  "developer-guide": {
    name: "Developer Guide",
    icon: "⚡",
    priority: 2,
  },
  api: {
    name: "API Reference",
    icon: "🔌",
    priority: 3,
  },
  tutorials: {
    name: "Tutorials",
    icon: "📚",
    priority: 4,
  },
  troubleshooting: {
    name: "Help & Support",
    icon: "🛠️",
    priority: 5,
  },
};

/**
 * Search keywords and synonyms for better matching
 */
export const searchSynonyms = {
  // Vehicle related terms
  car: ["vehicle", "automobile", "auto"],
  vehicle: ["car", "automobile", "auto"],
  automobile: ["car", "vehicle", "auto"],

  // Fuel related terms
  gas: ["fuel", "gasoline", "petrol"],
  fuel: ["gas", "gasoline", "petrol"],
  mileage: ["efficiency", "mpg", "consumption"],
  efficiency: ["mileage", "mpg", "consumption"],

  // Maintenance related terms
  service: ["maintenance", "repair", "servicing"],
  maintenance: ["service", "repair", "servicing"],
  repair: ["service", "maintenance", "fix"],

  // Insurance related terms
  insurance: ["policy", "coverage", "premium"],
  policy: ["insurance", "coverage"],
  coverage: ["insurance", "policy"],

  // Technical terms
  api: ["endpoint", "service", "interface"],
  endpoint: ["api", "service", "route"],
  database: ["db", "storage", "data"],

  // Common abbreviations
  db: ["database"],
  ui: ["interface", "user interface"],
  ux: ["user experience", "experience"],
  auth: ["authentication", "login"],
  config: ["configuration", "settings"],
  env: ["environment", "configuration"],
};

/**
 * Search boost configuration for different content types
 */
export const searchBoosts = {
  // Boost by file location
  "/user-guide/getting-started/": 2.0, // Getting started is important
  "/user-guide/features/": 1.5, // Feature docs are important
  "/developer-guide/api/": 1.8, // API docs are important for developers
  "/troubleshooting/": 1.3, // Help content is valuable

  // Boost by content type
  headings: {
    h1: 3.0,
    h2: 2.0,
    h3: 1.5,
    h4: 1.2,
  },

  // Boost by semantic meaning
  keywords: {
    "getting started": 2.0,
    installation: 1.8,
    setup: 1.8,
    configuration: 1.5,
    troubleshooting: 1.5,
    error: 1.3,
    problem: 1.3,
    solution: 1.3,
  },
};

export default searchConfig;
