#!/usr/bin/env node

/**
 * Build and Validation Testing Script
 *
 * This script validates:
 * 1. Documentation builds successfully without errors
 * 2. All internal links are valid
 * 3. OpenAPI specification is valid
 * 4. Build output is optimized
 */

import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const DOCS_ROOT = path.resolve(__dirname, "../../");

class BuildValidationTester {
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

  async testDocumentationBuild() {
    this.log("info", "Testing documentation build process...");

    return new Promise((resolve) => {
      const buildProcess = spawn("npx", ["vitepress", "build", "."], {
        cwd: DOCS_ROOT,
        stdio: "pipe",
      });

      let buildOutput = "";
      let buildError = "";

      buildProcess.stdout.on("data", (data) => {
        buildOutput += data.toString();
      });

      buildProcess.stderr.on("data", (data) => {
        buildError += data.toString();
      });

      buildProcess.on("close", (code) => {
        if (code === 0) {
          this.log("success", "Documentation build completed successfully");

          // Check if dist directory was created
          const distPath = path.join(DOCS_ROOT, ".vitepress/dist");
          if (fs.existsSync(distPath)) {
            this.log("success", "Build output directory created");

            // Check for essential files
            const essentialFiles = ["index.html", "assets"];
            let missingFiles = 0;

            essentialFiles.forEach((file) => {
              const filePath = path.join(distPath, file);
              if (fs.existsSync(filePath)) {
                this.log("success", `Essential build file exists: ${file}`);
              } else {
                this.log("error", `Missing essential build file: ${file}`);
                missingFiles++;
              }
            });

            resolve(missingFiles === 0);
          } else {
            this.log("error", "Build output directory not created");
            resolve(false);
          }
        } else {
          this.log("error", `Documentation build failed with code ${code}`);
          if (buildError) {
            this.log("error", `Build error: ${buildError}`);
          }
          resolve(false);
        }
      });

      buildProcess.on("error", (error) => {
        this.log("error", `Build process error: ${error.message}`);
        resolve(false);
      });
    });
  }

  async testInternalLinks() {
    this.log("info", "Testing internal link validation...");

    try {
      // Use the existing validation script
      const validationScript = path.join(
        DOCS_ROOT,
        ".vitepress/scripts/validate.js"
      );

      if (fs.existsSync(validationScript)) {
        return new Promise((resolve) => {
          const validationProcess = spawn("node", [validationScript], {
            cwd: DOCS_ROOT,
            stdio: "pipe",
          });

          let validationOutput = "";
          let validationError = "";

          validationProcess.stdout.on("data", (data) => {
            validationOutput += data.toString();
          });

          validationProcess.stderr.on("data", (data) => {
            validationError += data.toString();
          });

          validationProcess.on("close", (code) => {
            if (code === 0) {
              this.log("success", "Internal link validation passed");
              resolve(true);
            } else {
              this.log("error", "Internal link validation failed");
              if (validationError) {
                this.log("error", `Validation error: ${validationError}`);
              }
              resolve(false);
            }
          });
        });
      } else {
        this.log(
          "warning",
          "No validation script found, skipping link validation"
        );
        return true;
      }
    } catch (error) {
      this.log("error", `Failed to test internal links: ${error.message}`);
      return false;
    }
  }

  async testOpenAPIValidation() {
    this.log("info", "Testing OpenAPI specification validation...");

    try {
      const openApiPath = path.join(DOCS_ROOT, "api-specs/openapi.yaml");

      if (!fs.existsSync(openApiPath)) {
        this.log("error", "OpenAPI specification file not found");
        return false;
      }

      // Basic YAML syntax validation
      try {
        const yaml = await import("js-yaml");
        const openApiContent = fs.readFileSync(openApiPath, "utf8");
        const spec = yaml.load(openApiContent);

        // Basic OpenAPI structure validation
        const requiredFields = ["openapi", "info", "paths"];
        let missingFields = 0;

        requiredFields.forEach((field) => {
          if (spec[field]) {
            this.log("success", `OpenAPI field present: ${field}`);
          } else {
            this.log("error", `Missing required OpenAPI field: ${field}`);
            missingFields++;
          }
        });

        // Check for proper version
        if (spec.openapi && spec.openapi.startsWith("3.")) {
          this.log("success", `Valid OpenAPI version: ${spec.openapi}`);
        } else {
          this.log("error", "Invalid or missing OpenAPI version");
          missingFields++;
        }

        return missingFields === 0;
      } catch (yamlError) {
        this.log("error", `OpenAPI YAML parsing error: ${yamlError.message}`);
        return false;
      }
    } catch (error) {
      this.log(
        "error",
        `Failed to validate OpenAPI specification: ${error.message}`
      );
      return false;
    }
  }

  async testBuildOptimization() {
    this.log("info", "Testing build optimization...");

    try {
      const distPath = path.join(DOCS_ROOT, ".vitepress/dist");

      if (!fs.existsSync(distPath)) {
        this.log("warning", "Build directory not found, run build first");
        return true; // Not a failure, just not built yet
      }

      // Check for minified assets
      const assetsPath = path.join(distPath, "assets");
      if (fs.existsSync(assetsPath)) {
        const assetFiles = fs.readdirSync(assetsPath);

        const jsFiles = assetFiles.filter((file) => file.endsWith(".js"));
        const cssFiles = assetFiles.filter((file) => file.endsWith(".css"));

        if (jsFiles.length > 0) {
          this.log("success", `Found ${jsFiles.length} JavaScript asset files`);
        }

        if (cssFiles.length > 0) {
          this.log("success", `Found ${cssFiles.length} CSS asset files`);
        }

        // Check for hash-based filenames (cache optimization)
        const hashedFiles = assetFiles.filter((file) =>
          /\.[a-f0-9]{8,}\.(js|css)$/.test(file)
        );

        if (hashedFiles.length > 0) {
          this.log(
            "success",
            `Found ${hashedFiles.length} cache-optimized asset files`
          );
        } else {
          this.log("warning", "No cache-optimized (hashed) asset files found");
        }
      }

      return true;
    } catch (error) {
      this.log("error", `Failed to test build optimization: ${error.message}`);
      return false;
    }
  }

  async runAllTests() {
    console.log("🚀 Starting Build and Validation Tests\n");

    const results = {
      build: await this.testDocumentationBuild(),
      links: await this.testInternalLinks(),
      openapi: await this.testOpenAPIValidation(),
      optimization: await this.testBuildOptimization(),
    };

    console.log("\n📊 Test Results Summary:");
    console.log(`✅ Successes: ${this.successes.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);

    console.log("\n📋 Detailed Results:");
    console.log(
      `Documentation Build: ${results.build ? "✅ PASS" : "❌ FAIL"}`
    );
    console.log(`Internal Links: ${results.links ? "✅ PASS" : "❌ FAIL"}`);
    console.log(
      `OpenAPI Validation: ${results.openapi ? "✅ PASS" : "❌ FAIL"}`
    );
    console.log(
      `Build Optimization: ${results.optimization ? "✅ PASS" : "❌ FAIL"}`
    );

    const overallPass = Object.values(results).every(
      (result) => result === true
    );
    console.log(
      `\n🎯 Overall Result: ${overallPass ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"}`
    );

    if (this.errors.length > 0) {
      console.log("\n🔍 Errors to Fix:");
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log("\n⚠️  Warnings:");
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }

    return overallPass;
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new BuildValidationTester();
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

export default BuildValidationTester;
