#!/usr/bin/env node

/**
 * Documentation validation script
 * Runs various validation checks on the documentation
 */

import { DocumentationValidator } from "../utils/validation.js";

async function main() {
  const args = process.argv.slice(2);
  const validator = new DocumentationValidator();

  try {
    let results;

    // Check for specific validation flags
    if (args.includes("--links")) {
      console.log("🔗 Running link validation only...\n");
      await validator.linkValidator.initialize();
      const linkResults = await validator.linkValidator.validateLinks();
      results = { links: linkResults };
    } else if (args.includes("--images")) {
      console.log("🖼️ Running image validation only...\n");
      await validator.imageValidator.initialize();
      const imageResults = await validator.imageValidator.validateImages();
      results = { images: imageResults };
    } else if (args.includes("--openapi")) {
      console.log("📄 Running OpenAPI validation only...\n");
      const openAPIResults = await validator.openAPIValidator.validateSpec();
      results = { openapi: openAPIResults };
    } else if (args.includes("--freshness")) {
      console.log("⏰ Running freshness validation only...\n");
      const freshnessResults =
        await validator.freshnessValidator.validateFreshness();
      results = { freshness: freshnessResults };
    } else {
      // Run all validations
      results = await validator.runAllValidations();
    }

    // Generate and print report
    const report = validator.generateReport(results);
    const success = validator.printReport(report);

    // Exit with appropriate code
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error("❌ Validation script failed:", error);
    process.exit(1);
  }
}

// Handle CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
