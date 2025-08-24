/**
 * Documentation validation utilities for build-time checks
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsRoot = path.resolve(__dirname, "../..");

/**
 * Validation results structure
 */
class ValidationResult {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  addError(message, file = null, line = null) {
    this.errors.push({ message, file, line, type: "error" });
  }

  addWarning(message, file = null, line = null) {
    this.warnings.push({ message, file, line, type: "warning" });
  }

  addInfo(message, file = null, line = null) {
    this.info.push({ message, file, line, type: "info" });
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  hasWarnings() {
    return this.warnings.length > 0;
  }

  getReport() {
    const total = this.errors.length + this.warnings.length + this.info.length;
    return {
      total,
      errors: this.errors.length,
      warnings: this.warnings.length,
      info: this.info.length,
      issues: [...this.errors, ...this.warnings, ...this.info],
    };
  }
}

/**
 * Internal link validator
 */
export class LinkValidator {
  constructor() {
    this.markdownFiles = new Set();
    this.existingFiles = new Set();
    this.internalLinks = new Map();
  }

  async initialize() {
    // Find all markdown files
    const mdFiles = await glob("**/*.md", { cwd: docsRoot });
    mdFiles.forEach((file) => {
      this.markdownFiles.add(file);
      this.existingFiles.add(file);
    });

    // Find all other files that could be linked to
    const otherFiles = await glob(
      "**/*.{png,jpg,jpeg,gif,svg,pdf,yaml,yml,json}",
      { cwd: docsRoot }
    );
    otherFiles.forEach((file) => {
      this.existingFiles.add(file);
    });
  }

  async validateLinks() {
    const result = new ValidationResult();

    for (const file of this.markdownFiles) {
      await this.validateFileLinks(file, result);
    }

    return result;
  }

  async validateFileLinks(file, result) {
    const filePath = path.join(docsRoot, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    // Regex patterns for different link types
    const linkPatterns = [
      // Markdown links: [text](url)
      /\[([^\]]*)\]\(([^)]+)\)/g,
      // Reference links: [text][ref]
      /\[([^\]]*)\]\[([^\]]+)\]/g,
      // Direct links: <url>
      /<([^>]+)>/g,
    ];

    lines.forEach((line, lineIndex) => {
      linkPatterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const url = match[2] || match[1];
          this.validateSingleLink(url, file, lineIndex + 1, result);
        }
      });
    });
  }

  validateSingleLink(url, file, line, result) {
    // Skip external links, anchors, and special protocols
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("mailto:") ||
      url.startsWith("tel:") ||
      url.startsWith("#") ||
      url.includes("://")
    ) {
      return;
    }

    // Skip placeholder comments and HTML-like content
    if (
      url.startsWith("!--") ||
      url.includes("<!--") ||
      url.startsWith("<") ||
      url.includes("script") ||
      url.includes("div") ||
      url.includes("img src=") ||
      url.includes("button") ||
      url.includes("form") ||
      url.includes("/script") ||
      url.includes("/div") ||
      url.includes("/button") ||
      url.includes("/form") ||
      url.includes("FeatureStatus") ||
      url.includes("OASpec")
    ) {
      return;
    }

    // Handle relative links
    let targetPath = url;

    // Remove anchor fragments
    if (targetPath.includes("#")) {
      targetPath = targetPath.split("#")[0];
    }

    // Skip empty paths (anchor-only links)
    if (!targetPath) {
      return;
    }

    // Resolve relative path
    const currentDir = path.dirname(file);
    const resolvedPath = path.normalize(path.join(currentDir, targetPath));

    // Remove leading slash and normalize
    const normalizedPath = resolvedPath.replace(/^\/+/, "");

    // Check if file exists
    if (!this.existingFiles.has(normalizedPath)) {
      // Try with .md extension if not present
      if (!normalizedPath.endsWith(".md") && !normalizedPath.includes(".")) {
        const withMd = normalizedPath + ".md";
        if (this.existingFiles.has(withMd)) {
          return; // File exists with .md extension
        }
      }

      result.addError(
        `Broken internal link: "${url}" -> "${normalizedPath}"`,
        file,
        line
      );
    }
  }
}

/**
 * Image reference validator
 */
export class ImageValidator {
  constructor() {
    this.imageFiles = new Set();
    this.markdownFiles = new Set();
  }

  async initialize() {
    // Find all image files
    const imageFiles = await glob("**/*.{png,jpg,jpeg,gif,svg,webp}", {
      cwd: docsRoot,
    });
    imageFiles.forEach((file) => {
      this.imageFiles.add(file);
    });

    // Find all markdown files
    const mdFiles = await glob("**/*.md", { cwd: docsRoot });
    mdFiles.forEach((file) => {
      this.markdownFiles.add(file);
    });
  }

  async validateImages() {
    const result = new ValidationResult();

    for (const file of this.markdownFiles) {
      await this.validateFileImages(file, result);
    }

    // Check for unused images
    await this.checkUnusedImages(result);

    return result;
  }

  async validateFileImages(file, result) {
    const filePath = path.join(docsRoot, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    // Regex patterns for image references
    const imagePatterns = [
      // Markdown images: ![alt](src)
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      // HTML img tags: <img src="...">
      /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
    ];

    lines.forEach((line, lineIndex) => {
      imagePatterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const imageSrc = match[2] || match[1];
          this.validateSingleImage(imageSrc, file, lineIndex + 1, result);
        }
      });
    });
  }

  validateSingleImage(imageSrc, file, line, result) {
    // Skip external images and data URLs
    if (
      imageSrc.startsWith("http://") ||
      imageSrc.startsWith("https://") ||
      imageSrc.startsWith("data:") ||
      imageSrc.includes("://")
    ) {
      return;
    }

    // Handle relative paths
    let imagePath = imageSrc;

    // Remove query parameters
    if (imagePath.includes("?")) {
      imagePath = imagePath.split("?")[0];
    }

    // Resolve relative path
    const currentDir = path.dirname(file);
    let resolvedPath;

    if (imagePath.startsWith("/")) {
      // Absolute path from docs root
      resolvedPath = imagePath.substring(1);
    } else {
      // Relative path
      resolvedPath = path.normalize(path.join(currentDir, imagePath));
    }

    // Normalize path
    const normalizedPath = resolvedPath.replace(/^\/+/, "");

    // Check if image exists
    if (!this.imageFiles.has(normalizedPath)) {
      result.addError(
        `Missing image: "${imageSrc}" -> "${normalizedPath}"`,
        file,
        line
      );
    }
  }

  async checkUnusedImages(result) {
    const usedImages = new Set();

    // Collect all referenced images
    for (const file of this.markdownFiles) {
      const filePath = path.join(docsRoot, file);
      const content = fs.readFileSync(filePath, "utf-8");

      const imagePatterns = [
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
      ];

      imagePatterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const imageSrc = match[2] || match[1];

          if (
            !imageSrc.startsWith("http://") &&
            !imageSrc.startsWith("https://") &&
            !imageSrc.startsWith("data:") &&
            !imageSrc.includes("://")
          ) {
            let imagePath = imageSrc;
            if (imagePath.includes("?")) {
              imagePath = imagePath.split("?")[0];
            }

            const currentDir = path.dirname(file);
            let resolvedPath;

            if (imagePath.startsWith("/")) {
              resolvedPath = imagePath.substring(1);
            } else {
              resolvedPath = path.normalize(path.join(currentDir, imagePath));
            }

            const normalizedPath = resolvedPath.replace(/^\/+/, "");
            usedImages.add(normalizedPath);
          }
        }
      });
    }

    // Find unused images
    for (const imageFile of this.imageFiles) {
      if (!usedImages.has(imageFile)) {
        result.addWarning(`Unused image file: ${imageFile}`);
      }
    }
  }
}

/**
 * OpenAPI specification validator
 */
export class OpenAPIValidator {
  async validateSpec() {
    const result = new ValidationResult();
    const specPath = path.join(docsRoot, "api-specs/openapi.yaml");

    if (!fs.existsSync(specPath)) {
      result.addError(
        "OpenAPI specification file not found: api-specs/openapi.yaml"
      );
      return result;
    }

    try {
      // Basic YAML syntax validation
      const content = fs.readFileSync(specPath, "utf-8");

      // Check for basic OpenAPI structure
      if (!content.includes("openapi:")) {
        result.addError(
          'OpenAPI specification missing required "openapi" field'
        );
      }

      if (!content.includes("info:")) {
        result.addError('OpenAPI specification missing required "info" field');
      }

      if (!content.includes("paths:")) {
        result.addError('OpenAPI specification missing required "paths" field');
      }

      // Check for common issues
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        // Check for tabs (should use spaces)
        if (line.includes("\t")) {
          result.addWarning(
            "OpenAPI spec contains tabs, should use spaces",
            "api-specs/openapi.yaml",
            index + 1
          );
        }

        // Check for trailing whitespace
        if (line.endsWith(" ") || line.endsWith("\t")) {
          result.addWarning(
            "Line has trailing whitespace",
            "api-specs/openapi.yaml",
            index + 1
          );
        }
      });

      result.addInfo("OpenAPI specification basic validation completed");
    } catch (error) {
      result.addError(
        `OpenAPI specification validation failed: ${error.message}`
      );
    }

    return result;
  }
}

/**
 * Content freshness validator
 */
export class FreshnessValidator {
  constructor() {
    this.staleThresholdDays = 90; // Consider content stale after 90 days
  }

  async validateFreshness() {
    const result = new ValidationResult();
    const markdownFiles = await glob("**/*.md", { cwd: docsRoot });

    for (const file of markdownFiles) {
      await this.validateFileFreshness(file, result);
    }

    return result;
  }

  async validateFileFreshness(file, result) {
    const filePath = path.join(docsRoot, file);
    const stats = fs.statSync(filePath);
    const lastModified = stats.mtime;
    const now = new Date();
    const daysSinceModified = Math.floor(
      (now - lastModified) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceModified > this.staleThresholdDays) {
      result.addWarning(
        `Content may be stale (${daysSinceModified} days since last update)`,
        file
      );
    }

    // Check for placeholder content that might need updates
    const content = fs.readFileSync(filePath, "utf-8");

    // Look for common placeholder patterns
    const placeholderPatterns = [
      /TODO:/gi,
      /FIXME:/gi,
      /\[placeholder\]/gi,
      /\[update needed\]/gi,
      /\[screenshot needed\]/gi,
    ];

    const lines = content.split("\n");
    lines.forEach((line, lineIndex) => {
      placeholderPatterns.forEach((pattern) => {
        if (pattern.test(line)) {
          result.addWarning(
            `Placeholder content found: ${line.trim()}`,
            file,
            lineIndex + 1
          );
        }
      });
    });
  }
}

/**
 * Main validation orchestrator
 */
export class DocumentationValidator {
  constructor() {
    this.linkValidator = new LinkValidator();
    this.imageValidator = new ImageValidator();
    this.openAPIValidator = new OpenAPIValidator();
    this.freshnessValidator = new FreshnessValidator();
  }

  async runAllValidations() {
    console.log("🔍 Starting documentation validation...\n");

    const results = {
      links: new ValidationResult(),
      images: new ValidationResult(),
      openapi: new ValidationResult(),
      freshness: new ValidationResult(),
    };

    try {
      // Initialize validators
      await this.linkValidator.initialize();
      await this.imageValidator.initialize();

      // Run validations
      console.log("📋 Validating internal links...");
      results.links = await this.linkValidator.validateLinks();

      console.log("🖼️  Validating image references...");
      results.images = await this.imageValidator.validateImages();

      console.log("📄 Validating OpenAPI specification...");
      results.openapi = await this.openAPIValidator.validateSpec();

      console.log("⏰ Checking content freshness...");
      results.freshness = await this.freshnessValidator.validateFreshness();
    } catch (error) {
      console.error("❌ Validation failed:", error);
      throw error;
    }

    return results;
  }

  generateReport(results) {
    const report = {
      summary: {
        totalErrors: 0,
        totalWarnings: 0,
        totalInfo: 0,
      },
      details: {},
    };

    Object.entries(results).forEach(([category, result]) => {
      const categoryReport = result.getReport();
      report.details[category] = categoryReport;
      report.summary.totalErrors += categoryReport.errors;
      report.summary.totalWarnings += categoryReport.warnings;
      report.summary.totalInfo += categoryReport.info;
    });

    return report;
  }

  printReport(report) {
    console.log("\n📊 Validation Report");
    console.log("===================");

    const { summary } = report;
    console.log(
      `Total Issues: ${summary.totalErrors + summary.totalWarnings + summary.totalInfo}`
    );
    console.log(`❌ Errors: ${summary.totalErrors}`);
    console.log(`⚠️  Warnings: ${summary.totalWarnings}`);
    console.log(`ℹ️  Info: ${summary.totalInfo}\n`);

    Object.entries(report.details).forEach(([category, details]) => {
      if (details.total > 0) {
        console.log(`\n${category.toUpperCase()} (${details.total} issues):`);
        console.log("─".repeat(40));

        details.issues.forEach((issue) => {
          const icon =
            issue.type === "error"
              ? "❌"
              : issue.type === "warning"
                ? "⚠️"
                : "ℹ️";
          const location = issue.file
            ? `${issue.file}${issue.line ? `:${issue.line}` : ""}`
            : "";
          console.log(`${icon} ${issue.message}`);
          if (location) {
            console.log(`   📍 ${location}`);
          }
        });
      }
    });

    if (summary.totalErrors === 0 && summary.totalWarnings === 0) {
      console.log("\n✅ All validations passed!");
    } else if (summary.totalErrors === 0) {
      console.log("\n✅ No errors found, but there are warnings to review.");
    } else {
      console.log("\n❌ Validation failed with errors that need to be fixed.");
    }

    return summary.totalErrors === 0;
  }
}

export default DocumentationValidator;
