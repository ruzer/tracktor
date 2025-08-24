#!/usr/bin/env node

/**
 * CLI utility for managing documentation placeholders
 *
 * Usage:
 *   node placeholderCli.js list [--type=TYPE] [--priority=PRIORITY] [--status=STATUS]
 *   node placeholderCli.js add --id=ID --type=TYPE --message=MESSAGE [--priority=PRIORITY] [--location=LOCATION]
 *   node placeholderCli.js update --id=ID [--status=STATUS] [--assignee=ASSIGNEE]
 *   node placeholderCli.js complete --id=ID [--completed-by=NAME]
 *   node placeholderCli.js export [--output=FILE]
 *   node placeholderCli.js import --file=FILE
 *   node placeholderCli.js summary
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PlaceholderRegistry } from "./placeholderRegistry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default storage file
const STORAGE_FILE = join(__dirname, "../data/placeholders.json");

class PlaceholderCLI {
  constructor() {
    this.registry = new PlaceholderRegistry();
    this.loadFromFile();
  }

  loadFromFile() {
    if (existsSync(STORAGE_FILE)) {
      try {
        const data = readFileSync(STORAGE_FILE, "utf8");
        this.registry.import(data);
      } catch (error) {
        console.warn(
          "Warning: Could not load existing placeholders:",
          error.message
        );
      }
    }
  }

  saveToFile() {
    try {
      const data = this.registry.export();
      writeFileSync(STORAGE_FILE, data, "utf8");
    } catch (error) {
      console.error("Error: Could not save placeholders:", error.message);
      process.exit(1);
    }
  }

  parseArgs() {
    const args = process.argv.slice(2);
    const command = args[0];
    const options = {};

    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("--")) {
        const [key, value] = arg.slice(2).split("=");
        options[key] = value || true;
      }
    }

    return { command, options };
  }

  list(options = {}) {
    const filters = {};
    if (options.type) filters.type = options.type;
    if (options.priority) filters.priority = options.priority;
    if (options.status) filters.status = options.status;

    const placeholders = this.registry.getAll(filters);

    if (placeholders.length === 0) {
      console.log("No placeholders found matching the criteria.");
      return;
    }

    console.log(`\nFound ${placeholders.length} placeholder(s):\n`);

    placeholders.forEach((p) => {
      console.log(`ID: ${p.id}`);
      console.log(`Type: ${p.type}`);
      console.log(`Priority: ${p.priority}`);
      console.log(`Status: ${p.status}`);
      console.log(`Message: ${p.message}`);
      if (p.location) console.log(`Location: ${p.location}`);
      if (p.assignee) console.log(`Assignee: ${p.assignee}`);
      console.log(`Created: ${new Date(p.createdAt).toLocaleDateString()}`);
      console.log("---");
    });
  }

  add(options) {
    const required = ["id", "type", "message"];
    const missing = required.filter((field) => !options[field]);

    if (missing.length > 0) {
      console.error(`Error: Missing required options: ${missing.join(", ")}`);
      process.exit(1);
    }

    try {
      const config = {
        type: options.type,
        message: options.message,
        priority: options.priority || "medium",
        location: options.location || "",
        instructions: options.instructions || "",
        assignee: options.assignee || null,
      };

      const placeholder = this.registry.register(options.id, config);
      this.saveToFile();

      console.log(`✓ Placeholder "${options.id}" added successfully`);
      console.log(`  Type: ${placeholder.type}`);
      console.log(`  Priority: ${placeholder.priority}`);
      console.log(`  Message: ${placeholder.message}`);
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  }

  update(options) {
    if (!options.id) {
      console.error("Error: --id is required");
      process.exit(1);
    }

    try {
      const updates = {};
      if (options.status) updates.status = options.status;
      if (options.assignee) updates.assignee = options.assignee;
      if (options.priority) updates.priority = options.priority;
      if (options.message) updates.message = options.message;

      const placeholder = this.registry.update(options.id, updates);
      this.saveToFile();

      console.log(`✓ Placeholder "${options.id}" updated successfully`);
      console.log(`  Status: ${placeholder.status}`);
      if (placeholder.assignee)
        console.log(`  Assignee: ${placeholder.assignee}`);
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  }

  complete(options) {
    if (!options.id) {
      console.error("Error: --id is required");
      process.exit(1);
    }

    try {
      const completedBy = options["completed-by"] || "CLI User";
      const placeholder = this.registry.markCompleted(options.id, completedBy);
      this.saveToFile();

      console.log(`✓ Placeholder "${options.id}" marked as completed`);
      console.log(`  Completed by: ${completedBy}`);
      console.log(
        `  Completed at: ${new Date(placeholder.completedAt).toLocaleString()}`
      );
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  }

  export(options) {
    const outputFile =
      options.output ||
      `placeholders-${new Date().toISOString().split("T")[0]}.json`;

    try {
      const data = this.registry.export();
      writeFileSync(outputFile, data, "utf8");
      console.log(`✓ Placeholders exported to ${outputFile}`);
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  }

  import(options) {
    if (!options.file) {
      console.error("Error: --file is required");
      process.exit(1);
    }

    if (!existsSync(options.file)) {
      console.error(`Error: File "${options.file}" not found`);
      process.exit(1);
    }

    try {
      const data = readFileSync(options.file, "utf8");
      this.registry.import(data);
      this.saveToFile();
      console.log(`✓ Placeholders imported from ${options.file}`);
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  }

  summary() {
    const summary = this.registry.getSummary();

    console.log("\n📊 Placeholder Summary\n");
    console.log(`Total: ${summary.total}`);
    console.log(`Pending: ${summary.pending}`);
    console.log(`Completed: ${summary.completed}`);
    console.log(`Overdue: ${summary.overdue || 0}`);

    if (Object.keys(summary.byType).length > 0) {
      console.log("\nBy Type:");
      Object.entries(summary.byType).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
    }

    if (Object.keys(summary.byPriority).length > 0) {
      console.log("\nBy Priority:");
      Object.entries(summary.byPriority).forEach(([priority, count]) => {
        console.log(`  ${priority}: ${count}`);
      });
    }

    console.log(
      `\nLast updated: ${new Date(summary.lastUpdated).toLocaleString()}\n`
    );
  }

  showHelp() {
    console.log(`
Documentation Placeholder CLI

Usage:
  node placeholderCli.js <command> [options]

Commands:
  list                    List placeholders with optional filters
  add                     Add a new placeholder
  update                  Update an existing placeholder
  complete                Mark a placeholder as completed
  export                  Export placeholders to JSON file
  import                  Import placeholders from JSON file
  summary                 Show placeholder statistics
  help                    Show this help message

Options:
  --id=ID                 Placeholder ID (required for add, update, complete)
  --type=TYPE             Placeholder type (screenshot, api-example, feature-description, configuration)
  --message=MESSAGE       Placeholder message (required for add)
  --priority=PRIORITY     Priority level (high, medium, low)
  --status=STATUS         Status (pending, in-progress, completed)
  --location=LOCATION     File or page location
  --assignee=ASSIGNEE     Person assigned to the placeholder
  --completed-by=NAME     Person who completed the placeholder
  --output=FILE           Output file for export
  --file=FILE             Input file for import

Examples:
  node placeholderCli.js list --type=screenshot --priority=high
  node placeholderCli.js add --id=screenshot-1 --type=screenshot --message="Add dashboard screenshot"
  node placeholderCli.js update --id=screenshot-1 --status=in-progress --assignee="John Doe"
  node placeholderCli.js complete --id=screenshot-1 --completed-by="Jane Smith"
  node placeholderCli.js export --output=backup.json
  node placeholderCli.js summary
`);
  }

  run() {
    const { command, options } = this.parseArgs();

    switch (command) {
      case "list":
        this.list(options);
        break;
      case "add":
        this.add(options);
        break;
      case "update":
        this.update(options);
        break;
      case "complete":
        this.complete(options);
        break;
      case "export":
        this.export(options);
        break;
      case "import":
        this.import(options);
        break;
      case "summary":
        this.summary();
        break;
      case "help":
      case "--help":
      case "-h":
        this.showHelp();
        break;
      default:
        console.error(`Unknown command: ${command}`);
        console.log('Use "help" to see available commands.');
        process.exit(1);
    }
  }
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new PlaceholderCLI();
  cli.run();
}

export { PlaceholderCLI };
