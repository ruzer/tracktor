/**
 * Build-time validation hooks for VitePress
 */

import { DocumentationValidator } from "../utils/validation.js";

/**
 * Pre-build validation hook
 * Runs validation before the build starts
 */
export async function preBuildValidation() {
  console.log("\n🔍 Running pre-build validation...");

  const validator = new DocumentationValidator();

  try {
    const results = await validator.runAllValidations();
    const report = validator.generateReport(results);

    // Print report
    const success = validator.printReport(report);

    // Determine if build should continue
    const { totalErrors } = report.summary;

    if (totalErrors > 0) {
      console.log("\n❌ Build aborted due to validation errors.");
      console.log("Please fix the errors above before building.");
      process.exit(1);
    } else {
      console.log(
        "\n✅ Pre-build validation passed. Continuing with build...\n"
      );
    }

    return report;
  } catch (error) {
    console.error("❌ Pre-build validation failed:", error);
    process.exit(1);
  }
}

/**
 * Post-build validation hook
 * Runs additional checks after build completion
 */
export async function postBuildValidation(buildDir) {
  console.log("\n🔍 Running post-build validation...");

  // Check if build output exists
  const fs = await import("fs");
  const path = await import("path");

  if (!fs.existsSync(buildDir)) {
    console.error("❌ Build directory not found:", buildDir);
    return false;
  }

  // Check for essential files
  const essentialFiles = [
    "index.html",
    "assets",
    "user-guide",
    "developer-guide",
  ];

  const missingFiles = [];
  essentialFiles.forEach((file) => {
    const filePath = path.join(buildDir, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  });

  if (missingFiles.length > 0) {
    console.error("❌ Missing essential build files:", missingFiles);
    return false;
  }

  console.log("✅ Post-build validation passed.");
  return true;
}

/**
 * Validation configuration for different environments
 */
export const validationConfig = {
  development: {
    // More lenient in development
    failOnWarnings: false,
    skipFreshnessCheck: true,
    skipUnusedImages: true,
  },

  production: {
    // Strict in production
    failOnWarnings: false, // Still allow warnings but log them
    skipFreshnessCheck: false,
    skipUnusedImages: false,
  },

  ci: {
    // Very strict in CI
    failOnWarnings: true,
    skipFreshnessCheck: false,
    skipUnusedImages: false,
  },
};

/**
 * Get validation configuration based on environment
 */
export function getValidationConfig() {
  const env = process.env.NODE_ENV || "development";
  const ciEnv = process.env.CI || process.env.GITHUB_ACTIONS;

  if (ciEnv) {
    return validationConfig.ci;
  }

  return validationConfig[env] || validationConfig.development;
}
