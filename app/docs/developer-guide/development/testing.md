# Testing Guide

This guide covers testing strategies, tools, and best practices for the Tracktor application. The testing approach emphasizes reliability, maintainability, and comprehensive coverage across all application layers.

## Testing Philosophy

### Testing Pyramid

The Tracktor testing strategy follows the testing pyramid approach:

```
    /\
   /  \     E2E Tests (Few)
  /____\    - Full user workflows
 /      \   - Critical path testing
/________\  Integration Tests (Some)
           - API endpoint testing
           - Database integration
           - Component integration

Unit Tests (Many)
- Pure functions
- Component logic
- Service methods
- Utility functions
```

### Testing Principles

1. **Fast Feedback**: Unit tests provide immediate feedback during development
2. **Reliable**: Tests should be deterministic and not flaky
3. **Maintainable**: Tests should be easy to understand and update
4. **Comprehensive**: Cover critical paths and edge cases
5. **Isolated**: Tests should not depend on external services or state

## Testing Stack

### Frontend Testing

- **Vitest**: Fast unit test runner with Vite integration
- **Svelte Testing Library**: Component testing utilities
- **jsdom**: DOM environment for component tests
- **MSW**: Mock Service Worker for API mocking

### Backend Testing

- **Vitest**: Unit and integration test runner
- **Supertest**: HTTP assertion library for API testing
- **SQLite Memory**: In-memory database for test isolation
- **Test Containers**: Database testing with real SQLite instances

### End-to-End Testing

- **Playwright**: Cross-browser E2E testing
- **Test Data**: Automated test data setup and teardown

## Project Structure

```
app/
├── backend/
│   ├── src/
│   │   ├── __tests__/          # Backend tests
│   │   │   ├── unit/           # Unit tests
│   │   │   ├── integration/    # Integration tests
│   │   │   └── fixtures/       # Test data and helpers
│   │   └── ...
│   └── vitest.config.ts        # Backend test configuration
├── frontend/
│   ├── src/
│   │   ├── __tests__/          # Frontend tests
│   │   │   ├── unit/           # Component unit tests
│   │   │   ├── integration/    # Integration tests
│   │   │   └── fixtures/       # Test data and mocks
│   │   └── ...
│   └── vitest.config.ts        # Frontend test configuration
└── tests/
    ├── e2e/                    # End-to-end tests
    │   ├── specs/              # Test specifications
    │   ├── fixtures/           # Test data
    │   └── helpers/            # Test utilities
    └── playwright.config.ts    # E2E test configuration
```

## Unit Testing

### Backend Unit Tests

#### Service Layer Testing

```typescript
// src/__tests__/unit/services/vehicleService.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { VehicleService } from "../../../services/vehicleService.js";
import { Vehicle } from "../../../models/Vehicle.js";

// Mock the model
vi.mock("../../../models/Vehicle.js");

describe("VehicleService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllVehicles", () => {
    it("should return all vehicles with associations", async () => {
      // Arrange
      const mockVehicles = [
        { id: "1", make: "Toyota", model: "Camry" },
        { id: "2", make: "Honda", model: "Civic" },
      ];

      vi.mocked(Vehicle.findAll).mockResolvedValue(mockVehicles);

      // Act
      const result = await VehicleService.getAllVehicles();

      // Assert
      expect(Vehicle.findAll).toHaveBeenCalledWith({
        include: [
          "insurance",
          "fuelLogs",
          "maintenanceLogs",
          "pollutionCertificate",
        ],
      });
      expect(result).toEqual(mockVehicles);
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      vi.mocked(Vehicle.findAll).mockRejectedValue(dbError);

      // Act & Assert
      await expect(VehicleService.getAllVehicles()).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("createVehicle", () => {
    it("should create vehicle with valid data", async () => {
      // Arrange
      const vehicleData = {
        make: "Toyota",
        model: "Camry",
        year: 2023,
        licensePlate: "ABC123",
      };

      const mockCreatedVehicle = { id: "1", ...vehicleData };
      vi.mocked(Vehicle.create).mockResolvedValue(mockCreatedVehicle);

      // Act
      const result = await VehicleService.createVehicle(vehicleData);

      // Assert
      expect(Vehicle.create).toHaveBeenCalledWith(vehicleData);
      expect(result).toEqual(mockCreatedVehicle);
    });

    it("should validate required fields", async () => {
      // Arrange
      const invalidData = { make: "Toyota" }; // Missing required fields

      // Act & Assert
      await expect(VehicleService.createVehicle(invalidData)).rejects.toThrow(
        "Validation error"
      );
    });
  });
});
```

#### Model Testing

```typescript
// src/__tests__/unit/models/vehicle.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { sequelize } from "../../../db/db.js";
import { Vehicle } from "../../../models/Vehicle.js";

describe("Vehicle Model", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create vehicle with valid data", async () => {
    // Arrange
    const vehicleData = {
      make: "Toyota",
      model: "Camry",
      year: 2023,
      licensePlate: "ABC123",
    };

    // Act
    const vehicle = await Vehicle.create(vehicleData);

    // Assert
    expect(vehicle.id).toBeDefined();
    expect(vehicle.make).toBe("Toyota");
    expect(vehicle.model).toBe("Camry");
    expect(vehicle.year).toBe(2023);
    expect(vehicle.licensePlate).toBe("ABC123");
  });

  it("should enforce unique license plate constraint", async () => {
    // Arrange
    const vehicleData = {
      make: "Toyota",
      model: "Camry",
      year: 2023,
      licensePlate: "ABC123",
    };

    await Vehicle.create(vehicleData);

    // Act & Assert
    await expect(Vehicle.create(vehicleData)).rejects.toThrow(
      "license_plate must be unique"
    );
  });

  it("should validate year range", async () => {
    // Arrange
    const invalidVehicleData = {
      make: "Toyota",
      model: "Camry",
      year: 1800, // Invalid year
      licensePlate: "ABC123",
    };

    // Act & Assert
    await expect(Vehicle.create(invalidVehicleData)).rejects.toThrow(
      "Year must be between 1900 and current year"
    );
  });
});
```

### Frontend Unit Tests

#### Component Testing

```typescript
// src/__tests__/unit/components/VehicleCard.test.ts
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import VehicleCard from "../../../components/common/VehicleCard.svelte";

describe("VehicleCard", () => {
  const mockVehicle = {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    licensePlate: "ABC123",
    color: "Blue",
    odometer: 15000,
  };

  it("should render vehicle information correctly", () => {
    // Act
    render(VehicleCard, { props: { vehicle: mockVehicle } });

    // Assert
    expect(screen.getByText("Toyota Camry")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("ABC123")).toBeInTheDocument();
    expect(screen.getByText("Blue")).toBeInTheDocument();
    expect(screen.getByText("15,000 miles")).toBeInTheDocument();
  });

  it("should handle missing optional fields", () => {
    // Arrange
    const vehicleWithoutOptionals = {
      id: "1",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      licensePlate: "ABC123",
    };

    // Act
    render(VehicleCard, { props: { vehicle: vehicleWithoutOptionals } });

    // Assert
    expect(screen.getByText("Toyota Camry")).toBeInTheDocument();
    expect(screen.queryByText("Blue")).not.toBeInTheDocument();
    expect(screen.queryByText("miles")).not.toBeInTheDocument();
  });

  it("should emit select event when clicked", async () => {
    // Arrange
    const { component } = render(VehicleCard, {
      props: { vehicle: mockVehicle },
    });
    let selectedVehicle = null;

    component.$on("select", (event) => {
      selectedVehicle = event.detail;
    });

    // Act
    await screen.getByRole("button").click();

    // Assert
    expect(selectedVehicle).toEqual(mockVehicle);
  });
});
```

#### Store Testing

```typescript
// src/__tests__/unit/stores/vehicle.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { get } from "svelte/store";
import { vehicleStore } from "../../../lib/stores/vehicle.js";
import * as api from "../../../lib/utils/api.js";

// Mock API functions
vi.mock("../../../lib/utils/api.js");

describe("Vehicle Store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vehicleStore.reset();
  });

  it("should load vehicles successfully", async () => {
    // Arrange
    const mockVehicles = [
      { id: "1", make: "Toyota", model: "Camry" },
      { id: "2", make: "Honda", model: "Civic" },
    ];

    vi.mocked(api.fetchVehicles).mockResolvedValue(mockVehicles);

    // Act
    await vehicleStore.loadVehicles();

    // Assert
    expect(get(vehicleStore.vehicles)).toEqual(mockVehicles);
    expect(get(vehicleStore.isLoading)).toBe(false);
    expect(get(vehicleStore.error)).toBe(null);
  });

  it("should handle loading errors", async () => {
    // Arrange
    const error = new Error("Network error");
    vi.mocked(api.fetchVehicles).mockRejectedValue(error);

    // Act
    await vehicleStore.loadVehicles();

    // Assert
    expect(get(vehicleStore.vehicles)).toEqual([]);
    expect(get(vehicleStore.isLoading)).toBe(false);
    expect(get(vehicleStore.error)).toBe("Network error");
  });

  it("should set loading state during API calls", async () => {
    // Arrange
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(api.fetchVehicles).mockReturnValue(promise);

    // Act
    const loadPromise = vehicleStore.loadVehicles();

    // Assert - loading state
    expect(get(vehicleStore.isLoading)).toBe(true);

    // Complete the promise
    resolvePromise([]);
    await loadPromise;

    // Assert - completed state
    expect(get(vehicleStore.isLoading)).toBe(false);
  });
});
```

## Integration Testing

### API Integration Tests

```typescript
// src/__tests__/integration/api/vehicles.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../../../index.js";
import { sequelize } from "../../../db/db.js";
import { Vehicle } from "../../../models/Vehicle.js";

describe("Vehicle API Integration", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe("GET /api/vehicles", () => {
    it("should return empty array when no vehicles exist", async () => {
      // Act
      const response = await request(app)
        .get("/api/vehicles")
        .set("X-User-PIN", "test-pin");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all vehicles with associations", async () => {
      // Arrange
      const vehicle = await Vehicle.create({
        make: "Toyota",
        model: "Camry",
        year: 2023,
        licensePlate: "ABC123",
      });

      // Act
      const response = await request(app)
        .get("/api/vehicles")
        .set("X-User-PIN", "test-pin");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: vehicle.id,
        make: "Toyota",
        model: "Camry",
        year: 2023,
        licensePlate: "ABC123",
      });
    });

    it("should require authentication", async () => {
      // Act
      const response = await request(app).get("/api/vehicles");

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.error).toBe("PIN required");
    });
  });

  describe("POST /api/vehicles", () => {
    it("should create vehicle with valid data", async () => {
      // Arrange
      const vehicleData = {
        make: "Toyota",
        model: "Camry",
        year: 2023,
        licensePlate: "ABC123",
      };

      // Act
      const response = await request(app)
        .post("/api/vehicles")
        .set("X-User-PIN", "test-pin")
        .send(vehicleData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(vehicleData);
      expect(response.body.id).toBeDefined();
    });

    it("should validate required fields", async () => {
      // Arrange
      const invalidData = { make: "Toyota" }; // Missing required fields

      // Act
      const response = await request(app)
        .post("/api/vehicles")
        .set("X-User-PIN", "test-pin")
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Validation error");
    });

    it("should enforce unique license plate", async () => {
      // Arrange
      const vehicleData = {
        make: "Toyota",
        model: "Camry",
        year: 2023,
        licensePlate: "ABC123",
      };

      await Vehicle.create(vehicleData);

      // Act
      const response = await request(app)
        .post("/api/vehicles")
        .set("X-User-PIN", "test-pin")
        .send(vehicleData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error).toContain("license_plate must be unique");
    });
  });
});
```

### Database Integration Tests

```typescript
// src/__tests__/integration/database/migrations.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Umzug } from "umzug";
import { sequelize } from "../../../db/db.js";
import { migrator } from "../../../db/index.js";

describe("Database Migrations", () => {
  beforeEach(async () => {
    // Start with clean database
    await sequelize.drop();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should run all migrations successfully", async () => {
    // Act
    await migrator.up();

    // Assert
    const tables = await sequelize.getQueryInterface().showAllTables();
    expect(tables).toContain("vehicles");
    expect(tables).toContain("fuel_logs");
    expect(tables).toContain("maintenance_logs");
    expect(tables).toContain("insurances");
    expect(tables).toContain("pollution_certificates");
    expect(tables).toContain("auth");
    expect(tables).toContain("config");
  });

  it("should rollback migrations successfully", async () => {
    // Arrange
    await migrator.up();

    // Act
    await migrator.down({ to: 0 });

    // Assert
    const tables = await sequelize.getQueryInterface().showAllTables();
    expect(tables).toHaveLength(0);
  });

  it("should maintain referential integrity", async () => {
    // Arrange
    await migrator.up();

    // Act & Assert - Test foreign key constraints
    const queryInterface = sequelize.getQueryInterface();
    const vehicleTableInfo = await queryInterface.describeTable("vehicles");
    const fuelLogTableInfo = await queryInterface.describeTable("fuel_logs");

    expect(vehicleTableInfo.id).toBeDefined();
    expect(fuelLogTableInfo.vehicle_id).toBeDefined();

    // Test constraint enforcement would require actual data insertion
  });
});
```

## End-to-End Testing

### E2E Test Setup

```typescript
// tests/playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// tests/e2e/vehicle-management.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Vehicle Management", () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login and navigate to dashboard
    await page.goto("/login");
    await page.fill('[data-testid="pin-input"]', "1234");
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL("/dashboard");
  });

  test("should create a new vehicle", async ({ page }) => {
    // Navigate to vehicle tab
    await page.click('[data-testid="vehicles-tab"]');

    // Open create vehicle modal
    await page.click('[data-testid="add-vehicle-button"]');

    // Fill vehicle form
    await page.fill('[data-testid="make-input"]', "Toyota");
    await page.fill('[data-testid="model-input"]', "Camry");
    await page.fill('[data-testid="year-input"]', "2023");
    await page.fill('[data-testid="license-plate-input"]', "ABC123");

    // Submit form
    await page.click('[data-testid="save-vehicle-button"]');

    // Verify vehicle appears in list
    await expect(page.locator('[data-testid="vehicle-card"]')).toContainText(
      "Toyota Camry"
    );
    await expect(page.locator('[data-testid="vehicle-card"]')).toContainText(
      "ABC123"
    );
  });

  test("should edit existing vehicle", async ({ page }) => {
    // Assume vehicle exists from previous test or setup
    await page.click('[data-testid="vehicles-tab"]');

    // Click edit button on first vehicle
    await page.click(
      '[data-testid="vehicle-card"]:first-child [data-testid="edit-button"]'
    );

    // Update vehicle information
    await page.fill('[data-testid="color-input"]', "Blue");
    await page.fill('[data-testid="odometer-input"]', "15000");

    // Save changes
    await page.click('[data-testid="save-vehicle-button"]');

    // Verify changes are reflected
    await expect(page.locator('[data-testid="vehicle-card"]')).toContainText(
      "Blue"
    );
    await expect(page.locator('[data-testid="vehicle-card"]')).toContainText(
      "15,000"
    );
  });

  test("should delete vehicle with confirmation", async ({ page }) => {
    await page.click('[data-testid="vehicles-tab"]');

    // Click delete button
    await page.click(
      '[data-testid="vehicle-card"]:first-child [data-testid="delete-button"]'
    );

    // Confirm deletion
    await expect(
      page.locator('[data-testid="delete-confirmation"]')
    ).toBeVisible();
    await page.click('[data-testid="confirm-delete-button"]');

    // Verify vehicle is removed
    await expect(page.locator('[data-testid="vehicle-card"]')).toHaveCount(0);
  });
});
```

## Test Configuration

### Vitest Configuration (Backend)

```typescript
// app/backend/vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/__tests__/", "dist/", "**/*.d.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@controllers": path.resolve(__dirname, "./src/controllers"),
      "@db": path.resolve(__dirname, "./src/db"),
      "@middleware": path.resolve(__dirname, "./src/middleware"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@services": path.resolve(__dirname, "./src/services"),
    },
  },
});
```

### Vitest Configuration (Frontend)

```typescript
// app/frontend/vitest.config.ts
import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/__tests__/",
        ".svelte-kit/",
        "build/",
        "**/*.d.ts",
      ],
    },
  },
});
```

## Running Tests

### Command Reference

```bash
# Run all tests
npm test

# Run tests in specific workspace
npm test --workspace=backend
npm test --workspace=frontend

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run specific test file
npm test -- vehicle.test.ts

# Run tests matching pattern
npm test -- --grep "Vehicle"
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Best Practices

### Test Writing Guidelines

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive Names**: Test names should describe the scenario
3. **Single Responsibility**: One assertion per test when possible
4. **Test Data**: Use factories or fixtures for consistent test data
5. **Cleanup**: Ensure tests don't affect each other

### Mocking Strategy

- **External Dependencies**: Mock API calls, database connections
- **Time-Dependent Code**: Mock dates and timers
- **File System**: Mock file operations
- **Network Requests**: Use MSW for HTTP mocking

### Performance Testing

- **Load Testing**: Test API endpoints under load
- **Memory Leaks**: Monitor memory usage in long-running tests
- **Database Performance**: Test query performance with realistic data

This testing guide provides a comprehensive foundation for maintaining high code quality and reliability in the Tracktor application.
