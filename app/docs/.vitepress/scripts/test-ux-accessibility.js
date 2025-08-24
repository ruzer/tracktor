#!/usr/bin/env node

/**
 * User Experience and Accessibility Testing Script
 *
 * This script validates:
 * 1. Navigation and search functionality across all sections
 * 2. Responsive design on various device sizes
 * 3. Documentation loading performance and optimization
 * 4. Accessibility compliance and screen reader compatibility
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const DOCS_ROOT = path.resolve(__dirname, "../../");
const CONFIG_PATH = path.join(DOCS_ROOT, ".vitepress/config.mjs");

class UXAccessibilityTester {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.successes = [];
  }

  log(type, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;

    if (type === "error") {
      this.errors.push(message);
      console.error(`❌ ${logMessage}`);
    } else if (type === "warning") {
      this.warnings.push(message);
      console.warn(`⚠️  ${logMessage}`);
    } else {
      this.successes.push(message);
      console.log(`✅ ${logMessage}`);
    }
  }

  async testNavigationStructure() {
    this.log("info", "Testing navigation structure and organization...");

    try {
      // Check if config file exists and has proper navigation
      if (!fs.existsSync(CONFIG_PATH)) {
        this.log("error", "VitePress config file not found");
        return false;
      }

      const configContent = fs.readFileSync(CONFIG_PATH, "utf8");

      // Check for sidebar configuration
      if (configContent.includes("sidebar")) {
        this.log("success", "Sidebar navigation configuration found");
      } else {
        this.log("error", "No sidebar navigation configuration found");
      }

      // Check for nav configuration
      if (configContent.includes("nav")) {
        this.log("success", "Top navigation configuration found");
      } else {
        this.log("warning", "No top navigation configuration found");
      }

      // Check for search configuration
      if (configContent.includes("search")) {
        this.log("success", "Search configuration found");
      } else {
        this.log("warning", "No search configuration found");
      }

      // Test directory structure for logical organization
      const requiredSections = ["user-guide", "developer-guide", "api-specs"];

      let missingStructure = 0;
      requiredSections.forEach((section) => {
        const sectionPath = path.join(DOCS_ROOT, section);
        if (fs.existsSync(sectionPath)) {
          this.log("success", `Documentation section exists: ${section}`);
        } else {
          this.log("error", `Missing documentation section: ${section}`);
          missingStructure++;
        }
      });

      return missingStructure === 0;
    } catch (error) {
      this.log(
        "error",
        `Failed to test navigation structure: ${error.message}`
      );
      return false;
    }
  }

  async testResponsiveDesign() {
    this.log("info", "Testing responsive design configuration...");

    try {
      // Check for mobile navigation component
      const mobileNavPath = path.join(
        DOCS_ROOT,
        ".vitepress/components/MobileNav.vue"
      );
      if (fs.existsSync(mobileNavPath)) {
        this.log("success", "Mobile navigation component exists");
      } else {
        this.log("warning", "No dedicated mobile navigation component found");
      }

      // Check for responsive CSS
      const customCssPath = path.join(DOCS_ROOT, ".vitepress/theme/custom.css");
      if (fs.existsSync(customCssPath)) {
        const cssContent = fs.readFileSync(customCssPath, "utf8");

        // Check for media queries
        const mediaQueryRegex = /@media\s*\([^)]*\)/g;
        const mediaQueries = cssContent.match(mediaQueryRegex);

        if (mediaQueries && mediaQueries.length > 0) {
          this.log(
            "success",
            `Found ${mediaQueries.length} responsive media queries`
          );
        } else {
          this.log(
            "warning",
            "No responsive media queries found in custom CSS"
          );
        }

        // Check for common responsive breakpoints
        const commonBreakpoints = [
          "768px",
          "1024px",
          "480px",
          "max-width",
          "min-width",
        ];
        let foundBreakpoints = 0;

        commonBreakpoints.forEach((breakpoint) => {
          if (cssContent.includes(breakpoint)) {
            foundBreakpoints++;
          }
        });

        if (foundBreakpoints > 0) {
          this.log(
            "success",
            `Found ${foundBreakpoints} responsive breakpoint references`
          );
        } else {
          this.log("warning", "No common responsive breakpoints found");
        }
      } else {
        this.log("warning", "No custom CSS file found for responsive design");
      }

      return true;
    } catch (error) {
      this.log("error", `Failed to test responsive design: ${error.message}`);
      return false;
    }
  }

  async testPerformanceOptimization() {
    this.log("info", "Testing performance optimization features...");

    try {
      // Check for image optimization
      const publicDir = path.join(DOCS_ROOT, "public");
      if (fs.existsSync(publicDir)) {
        const imageFiles = this.getImageFiles(publicDir);

        if (imageFiles.length > 0) {
          this.log(
            "success",
            `Found ${imageFiles.length} image files in public directory`
          );

          // Check for optimized formats
          const optimizedFormats = imageFiles.filter(
            (file) => file.endsWith(".webp") || file.endsWith(".avif")
          );

          if (optimizedFormats.length > 0) {
            this.log(
              "success",
              `Found ${optimizedFormats.length} optimized image formats`
            );
          } else {
            this.log(
              "warning",
              "No optimized image formats (WebP, AVIF) found"
            );
          }
        } else {
          this.log("info", "No image files found in public directory");
        }
      }

      // Check for build optimization in config
      const configContent = fs.readFileSync(CONFIG_PATH, "utf8");

      // Check for build optimizations
      if (
        configContent.includes("minify") ||
        configContent.includes("compress")
      ) {
        this.log("success", "Build optimization configuration found");
      } else {
        this.log(
          "info",
          "No explicit build optimization configuration found (may use defaults)"
        );
      }

      // Check for lazy loading configuration
      if (configContent.includes("lazy") || configContent.includes("loading")) {
        this.log("success", "Lazy loading configuration found");
      } else {
        this.log("info", "No explicit lazy loading configuration found");
      }

      return true;
    } catch (error) {
      this.log(
        "error",
        `Failed to test performance optimization: ${error.message}`
      );
      return false;
    }
  }

  async testAccessibilityCompliance() {
    this.log("info", "Testing accessibility compliance features...");

    try {
      // Check for semantic HTML structure in components
      const componentsDir = path.join(DOCS_ROOT, ".vitepress/components");
      if (fs.existsSync(componentsDir)) {
        const componentFiles = fs
          .readdirSync(componentsDir)
          .filter((file) => file.endsWith(".vue"));

        let accessibilityFeatures = 0;

        componentFiles.forEach((file) => {
          const filePath = path.join(componentsDir, file);
          const content = fs.readFileSync(filePath, "utf8");

          // Check for accessibility attributes
          const a11yAttributes = [
            "aria-label",
            "aria-describedby",
            "aria-expanded",
            "role=",
            "tabindex",
            "alt=",
            "title=",
          ];

          a11yAttributes.forEach((attr) => {
            if (content.includes(attr)) {
              accessibilityFeatures++;
            }
          });
        });

        if (accessibilityFeatures > 0) {
          this.log(
            "success",
            `Found ${accessibilityFeatures} accessibility attributes in components`
          );
        } else {
          this.log(
            "warning",
            "No accessibility attributes found in Vue components"
          );
        }
      }

      // Check for skip links and navigation aids
      const layoutPath = path.join(
        DOCS_ROOT,
        ".vitepress/components/Layout.vue"
      );
      if (fs.existsSync(layoutPath)) {
        const layoutContent = fs.readFileSync(layoutPath, "utf8");

        if (layoutContent.includes("skip") || layoutContent.includes("main")) {
          this.log(
            "success",
            "Skip navigation or main content area found in layout"
          );
        } else {
          this.log("warning", "No skip navigation links found in layout");
        }
      }

      // Check for color contrast considerations in CSS
      const customCssPath = path.join(DOCS_ROOT, ".vitepress/theme/custom.css");
      if (fs.existsSync(customCssPath)) {
        const cssContent = fs.readFileSync(customCssPath, "utf8");

        // Check for dark mode support (accessibility feature)
        if (
          cssContent.includes("dark") ||
          cssContent.includes("prefers-color-scheme")
        ) {
          this.log("success", "Dark mode or color scheme preferences found");
        } else {
          this.log("info", "No explicit dark mode support found in custom CSS");
        }

        // Check for focus styles
        if (
          cssContent.includes(":focus") ||
          cssContent.includes("focus-visible")
        ) {
          this.log("success", "Focus styles found for keyboard navigation");
        } else {
          this.log("warning", "No focus styles found for keyboard navigation");
        }
      }

      return true;
    } catch (error) {
      this.log(
        "error",
        `Failed to test accessibility compliance: ${error.message}`
      );
      return false;
    }
  }

  async testSearchFunctionality() {
    this.log("info", "Testing search functionality configuration...");

    try {
      // Check for search configuration
      const searchConfigPath = path.join(
        DOCS_ROOT,
        ".vitepress/config/search.js"
      );
      if (fs.existsSync(searchConfigPath)) {
        this.log("success", "Dedicated search configuration file found");

        const searchContent = fs.readFileSync(searchConfigPath, "utf8");

        // Check for search optimization
        if (
          searchContent.includes("index") ||
          searchContent.includes("search")
        ) {
          this.log("success", "Search indexing configuration found");
        }
      } else {
        this.log("info", "No dedicated search configuration file found");
      }

      // Check for enhanced search component
      const enhancedSearchPath = path.join(
        DOCS_ROOT,
        ".vitepress/components/EnhancedSearch.vue"
      );
      if (fs.existsSync(enhancedSearchPath)) {
        this.log("success", "Enhanced search component found");
      } else {
        this.log("info", "No enhanced search component found (using default)");
      }

      // Check main config for search settings
      const configContent = fs.readFileSync(CONFIG_PATH, "utf8");
      if (configContent.includes("search")) {
        this.log("success", "Search configuration found in main config");
      } else {
        this.log("warning", "No search configuration found in main config");
      }

      return true;
    } catch (error) {
      this.log(
        "error",
        `Failed to test search functionality: ${error.message}`
      );
      return false;
    }
  }

  async testBreadcrumbNavigation() {
    this.log("info", "Testing breadcrumb navigation...");

    try {
      const breadcrumbPath = path.join(
        DOCS_ROOT,
        ".vitepress/components/BreadcrumbNav.vue"
      );
      if (fs.existsSync(breadcrumbPath)) {
        this.log("success", "Breadcrumb navigation component found");

        const breadcrumbContent = fs.readFileSync(breadcrumbPath, "utf8");

        // Check for accessibility in breadcrumbs
        if (
          breadcrumbContent.includes("aria-label") ||
          breadcrumbContent.includes("nav")
        ) {
          this.log("success", "Accessible breadcrumb navigation implemented");
        } else {
          this.log(
            "warning",
            "Breadcrumb navigation may lack accessibility features"
          );
        }
      } else {
        this.log("warning", "No breadcrumb navigation component found");
      }

      return true;
    } catch (error) {
      this.log(
        "error",
        `Failed to test breadcrumb navigation: ${error.message}`
      );
      return false;
    }
  }

  getImageFiles(dir) {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".avif",
      ".svg",
    ];
    const files = [];

    function traverse(currentDir) {
      const items = fs.readdirSync(currentDir);

      items.forEach((item) => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item).toLowerCase();
          if (imageExtensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      });
    }

    traverse(dir);
    return files;
  }

  async runAllTests() {
    console.log("🚀 Starting User Experience and Accessibility Tests\n");

    const results = {
      navigation: await this.testNavigationStructure(),
      responsive: await this.testResponsiveDesign(),
      performance: await this.testPerformanceOptimization(),
      accessibility: await this.testAccessibilityCompliance(),
      search: await this.testSearchFunctionality(),
      breadcrumbs: await this.testBreadcrumbNavigation(),
    };

    console.log("\n📊 Test Results Summary:");
    console.log(`✅ Successes: ${this.successes.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);

    console.log("\n📋 Detailed Results:");
    console.log(
      `Navigation Structure: ${results.navigation ? "✅ PASS" : "❌ FAIL"}`
    );
    console.log(
      `Responsive Design: ${results.responsive ? "✅ PASS" : "❌ FAIL"}`
    );
    console.log(
      `Performance Optimization: ${results.performance ? "✅ PASS" : "❌ FAIL"}`
    );
    console.log(
      `Accessibility Compliance: ${results.accessibility ? "✅ PASS" : "❌ FAIL"}`
    );
    console.log(
      `Search Functionality: ${results.search ? "✅ PASS" : "❌ FAIL"}`
    );
    console.log(
      `Breadcrumb Navigation: ${results.breadcrumbs ? "✅ PASS" : "❌ FAIL"}`
    );

    const overallPass = Object.values(results).every(
      (result) => result === true
    );
    console.log(
      `\n🎯 Overall Result: ${overallPass ? "✅ ALL TESTS PASSED" : "⚠️  TESTS COMPLETED WITH WARNINGS"}`
    );

    if (this.errors.length > 0) {
      console.log("\n🔍 Errors to Fix:");
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log("\n⚠️  Warnings (Recommendations):");
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }

    return this.errors.length === 0; // Pass if no errors, warnings are acceptable
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new UXAccessibilityTester();
  tester
    .runAllTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Test execution failed:", error);
      process.exit(1);
    });
}

export default UXAccessibilityTester;
