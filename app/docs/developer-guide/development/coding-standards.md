# Coding Standards

This document outlines the coding standards, conventions, and best practices for the Tracktor project. Following these guidelines ensures code consistency, maintainability, and quality across the entire codebase.

## General Principles

### Code Quality Principles

1. **Readability**: Code should be self-documenting and easy to understand
2. **Consistency**: Follow established patterns and conventions
3. **Simplicity**: Prefer simple, clear solutions over complex ones
4. **Maintainability**: Write code that is easy to modify and extend
5. **Performance**: Consider performance implications without premature optimization
6. **Security**: Follow security best practices and validate all inputs

### Development Philosophy

- **TypeScript First**: All new code should be written in TypeScript
- **Test-Driven Development**: Write tests for new functionality
- **Progressive Enhancement**: Build features that work without JavaScript when possible
- **Accessibility**: Ensure all UI components are accessible
- **Mobile-First**: Design and develop with mobile devices as the primary target

## TypeScript Standards

### Type Safety

```typescript
// ✅ Good: Explicit types for function parameters and return values
function calculateFuelEfficiency(distance: number, fuelUsed: number): number {
  if (fuelUsed === 0) {
    throw new Error("Fuel used cannot be zero");
  }
  return distance / fuelUsed;
}

// ❌ Bad: Implicit any types
function calculateFuelEfficiency(distance, fuelUsed) {
  return distance / fuelUsed;
}
```

### Interface Definitions

```typescript
// ✅ Good: Clear, descriptive interfaces
interface Vehicle {
  readonly id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  odometer?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Good: Separate creation interface
interface VehicleCreationAttributes {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  odometer?: number;
}

// ❌ Bad: Vague or incomplete interfaces
interface VehicleData {
  [key: string]: any;
}
```

### Utility Types

```typescript
// ✅ Good: Use utility types for type transformations
type VehicleUpdate = Partial<
  Pick<Vehicle, "make" | "model" | "color" | "odometer">
>;
type VehicleResponse = Omit<Vehicle, "createdAt" | "updatedAt">;

// ✅ Good: Union types for specific values
type VehicleStatus = "active" | "inactive" | "maintenance";
type FuelType = "gasoline" | "diesel" | "electric" | "hybrid";
```

### Error Handling

```typescript
// ✅ Good: Custom error classes with proper typing
export class VehicleNotFoundError extends Error {
  constructor(vehicleId: string) {
    super(`Vehicle with ID ${vehicleId} not found`);
    this.name = "VehicleNotFoundError";
  }
}

// ✅ Good: Result type pattern for error handling
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function getVehicle(
  id: string
): Promise<Result<Vehicle, VehicleNotFoundError>> {
  try {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return { success: false, error: new VehicleNotFoundError(id) };
    }
    return { success: true, data: vehicle };
  } catch (error) {
    return { success: false, error: error as VehicleNotFoundError };
  }
}
```

## Backend Standards (Node.js/Express)

### Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # HTTP request handlers
├── db/             # Database configuration and migrations
├── exceptions/     # Custom error classes
├── middleware/     # Express middleware
├── models/         # Sequelize model definitions
├── routes/         # Express route definitions
├── services/       # Business logic layer
└── utils/          # Utility functions
```

### Controller Patterns

```typescript
// ✅ Good: Clean controller with proper error handling
export class VehicleController {
  static async getAllVehicles(req: Request, res: Response): Promise<void> {
    try {
      const vehicles = await VehicleService.getAllVehicles();
      res.json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      throw new ServiceError("Failed to fetch vehicles", 500);
    }
  }

  static async createVehicle(req: Request, res: Response): Promise<void> {
    try {
      const vehicleData = VehicleController.validateVehicleData(req.body);
      const vehicle = await VehicleService.createVehicle(vehicleData);

      res.status(201).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ServiceError(error.message, 400);
      }
      throw error;
    }
  }

  private static validateVehicleData(data: any): VehicleCreationAttributes {
    // Validation logic here
    return data as VehicleCreationAttributes;
  }
}
```

### Service Layer Patterns

```typescript
// ✅ Good: Service layer with business logic
export class VehicleService {
  static async getAllVehicles(): Promise<Vehicle[]> {
    return await Vehicle.findAll({
      include: [
        { association: "fuelLogs", limit: 5, order: [["date", "DESC"]] },
        { association: "maintenanceLogs", limit: 5, order: [["date", "DESC"]] },
        "insurance",
        "pollutionCertificate",
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  static async createVehicle(
    data: VehicleCreationAttributes
  ): Promise<Vehicle> {
    // Validate business rules
    await VehicleService.validateUniqueConstraints(data);

    return await sequelize.transaction(async (transaction) => {
      const vehicle = await Vehicle.create(data, { transaction });

      // Additional business logic here
      await VehicleService.initializeVehicleDefaults(vehicle, transaction);

      return vehicle;
    });
  }

  private static async validateUniqueConstraints(
    data: VehicleCreationAttributes
  ): Promise<void> {
    const existingVehicle = await Vehicle.findOne({
      where: { licensePlate: data.licensePlate },
    });

    if (existingVehicle) {
      throw new ValidationError("License plate already exists");
    }
  }
}
```

### Database Patterns

```typescript
// ✅ Good: Model definition with proper associations
export default class Vehicle extends Model<
  VehicleAttributes,
  VehicleCreationAttributes
> {
  public id!: string;
  public make!: string;
  public model!: string;
  public year!: number;
  public licensePlate!: string;
  public vin?: string;
  public color?: string;
  public odometer?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly fuelLogs?: FuelLog[];
  public readonly maintenanceLogs?: MaintenanceLog[];
  public readonly insurance?: Insurance[];
  public readonly pollutionCertificate?: PollutionCertificate[];

  // Instance methods
  public async getLatestFuelLog(): Promise<FuelLog | null> {
    return await FuelLog.findOne({
      where: { vehicleId: this.id },
      order: [["date", "DESC"]],
    });
  }

  public calculateFuelEfficiency(): number {
    // Business logic for fuel efficiency calculation
    return 0; // Placeholder
  }
}
```

### API Response Patterns

```typescript
// ✅ Good: Consistent API response structure
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// ✅ Good: Response helper functions
export class ResponseHelper {
  static success<T>(data: T, meta?: any): ApiResponse<T> {
    return {
      success: true,
      data,
      ...(meta && { meta }),
    };
  }

  static error(
    code: string,
    message: string,
    details?: any
  ): ApiResponse<never> {
    return {
      success: false,
      error: { code, message, details },
    };
  }
}
```

## Frontend Standards (SvelteKit)

### Component Structure

```svelte
<!-- ✅ Good: Well-structured Svelte component -->
<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import type { Vehicle } from '$lib/types/vehicle.js';
  import Button from '$components/common/Button.svelte';

  // Props
  export let vehicle: Vehicle;
  export let editable: boolean = false;

  // Local state
  let isEditing = false;
  let editedVehicle: Partial<Vehicle> = {};

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    save: Vehicle;
    cancel: void;
    delete: string;
  }>();

  // Reactive statements
  $: hasChanges = Object.keys(editedVehicle).length > 0;
  $: displayName = `${vehicle.make} ${vehicle.model}`;

  // Lifecycle
  onMount(() => {
    console.log('VehicleCard mounted for vehicle:', vehicle.id);
  });

  // Event handlers
  function handleEdit() {
    isEditing = true;
    editedVehicle = { ...vehicle };
  }

  function handleSave() {
    if (hasChanges) {
      dispatch('save', { ...vehicle, ...editedVehicle });
    }
    isEditing = false;
    editedVehicle = {};
  }

  function handleCancel() {
    isEditing = false;
    editedVehicle = {};
    dispatch('cancel');
  }
</script>

<div class="vehicle-card" data-testid="vehicle-card">
  <h3 class="vehicle-title">{displayName}</h3>

  {#if isEditing}
    <!-- Edit mode template -->
    <form on:submit|preventDefault={handleSave}>
      <!-- Form fields -->
    </form>
  {:else}
    <!-- Display mode template -->
    <div class="vehicle-info">
      <!-- Vehicle information -->
    </div>
  {/if}
</div>

<style>
  .vehicle-card {
    @apply bg-white shadow-md rounded-lg p-6 border border-gray-200;
    @apply hover:shadow-lg transition-shadow duration-200;
  }

  .vehicle-title {
    @apply text-xl font-semibold text-gray-900 mb-4;
  }

  .vehicle-info {
    @apply space-y-2;
  }
</style>
```

### Store Patterns

```typescript
// ✅ Good: Well-structured store with TypeScript
import { writable, derived, type Writable } from "svelte/store";
import type { Vehicle } from "$lib/types/vehicle.js";
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "$lib/api/vehicles.js";

interface VehicleStoreState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  isLoading: boolean;
  error: string | null;
}

function createVehicleStore() {
  const initialState: VehicleStoreState = {
    vehicles: [],
    selectedVehicle: null,
    isLoading: false,
    error: null,
  };

  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,

    // Actions
    async loadVehicles() {
      update((state) => ({ ...state, isLoading: true, error: null }));

      try {
        const vehicles = await fetchVehicles();
        update((state) => ({ ...state, vehicles, isLoading: false }));
      } catch (error) {
        update((state) => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    },

    async createVehicle(vehicleData: VehicleCreationData) {
      update((state) => ({ ...state, isLoading: true, error: null }));

      try {
        const newVehicle = await createVehicle(vehicleData);
        update((state) => ({
          ...state,
          vehicles: [...state.vehicles, newVehicle],
          isLoading: false,
        }));
        return newVehicle;
      } catch (error) {
        update((state) => ({
          ...state,
          isLoading: false,
          error:
            error instanceof Error ? error.message : "Failed to create vehicle",
        }));
        throw error;
      }
    },

    selectVehicle(vehicle: Vehicle | null) {
      update((state) => ({ ...state, selectedVehicle: vehicle }));
    },

    reset() {
      set(initialState);
    },
  };
}

export const vehicleStore = createVehicleStore();

// Derived stores
export const vehicleCount = derived(
  vehicleStore,
  ($store) => $store.vehicles.length
);

export const hasVehicles = derived(
  vehicleStore,
  ($store) => $store.vehicles.length > 0
);
```

### Styling Standards

```scss
// ✅ Good: Tailwind CSS with component classes
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
  @apply focus:ring-blue-500;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-900 hover:bg-gray-300;
  @apply focus:ring-gray-500;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
  @apply focus:ring-red-500;
}

// ✅ Good: Responsive design patterns
.container {
  @apply mx-auto px-4;
  @apply sm:px-6 lg:px-8;
  @apply max-w-7xl;
}

.grid-responsive {
  @apply grid gap-4;
  @apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}
```

## Code Formatting

### ESLint Configuration

The project uses ESLint with TypeScript support:

```javascript
// eslint.config.js
export default [
  {
    files: ["**/*.{js,ts,svelte}"],
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "off",

      // General rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
    },
  },
];
```

### Prettier Configuration

```json
{
  "useTabs": true,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 100,
  "plugins": ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  "overrides": [
    {
      "files": "*.svelte",
      "options": {
        "parser": "svelte"
      }
    }
  ]
}
```

### Formatting Commands

```bash
# Format all code
npm run format

# Lint all code
npm run lint

# Fix linting issues
npm run lint -- --fix

# Check types
npm run check
```

## Naming Conventions

### Files and Directories

```
// ✅ Good: Clear, descriptive names
src/
├── components/
│   ├── common/
│   │   ├── Button.svelte
│   │   ├── FormField.svelte
│   │   └── ModalContainer.svelte
│   ├── forms/
│   │   ├── VehicleForm.svelte
│   │   └── FuelLogForm.svelte
│   └── lists/
│       ├── VehicleList.svelte
│       └── FuelLogList.svelte
├── lib/
│   ├── stores/
│   │   ├── vehicle.ts
│   │   └── fuelLog.ts
│   ├── utils/
│   │   ├── api.ts
│   │   ├── formatting.ts
│   │   └── validation.ts
│   └── types/
│       ├── vehicle.ts
│       └── fuelLog.ts
```

### Variables and Functions

```typescript
// ✅ Good: Descriptive camelCase names
const vehicleCount = vehicles.length;
const isVehicleSelected = selectedVehicle !== null;
const hasMaintenanceRecords = maintenanceLogs.length > 0;

function calculateFuelEfficiency(distance: number, fuelUsed: number): number {
  return distance / fuelUsed;
}

async function fetchVehicleById(vehicleId: string): Promise<Vehicle> {
  // Implementation
}

// ✅ Good: Boolean variables with is/has/can prefix
const isLoading = false;
const hasError = error !== null;
const canEdit = user.permissions.includes("edit");
```

### Constants

```typescript
// ✅ Good: SCREAMING_SNAKE_CASE for constants
const MAX_FUEL_CAPACITY = 100;
const DEFAULT_PAGINATION_LIMIT = 20;
const API_ENDPOINTS = {
  VEHICLES: "/api/vehicles",
  FUEL_LOGS: "/api/fuel-logs",
  MAINTENANCE: "/api/maintenance",
} as const;

// ✅ Good: Enum naming
enum VehicleStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
}
```

### CSS Classes

```css
/* ✅ Good: BEM-like naming for custom classes */
.vehicle-card {
}
.vehicle-card__header {
}
.vehicle-card__title {
}
.vehicle-card__actions {
}
.vehicle-card--selected {
}
.vehicle-card--loading {
}

/* ✅ Good: Utility classes with Tailwind */
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
.form-input {
  @apply border border-gray-300 rounded-md px-3 py-2;
}
```

## Documentation Standards

### Code Comments

````typescript
/**
 * Calculates the fuel efficiency for a vehicle based on distance and fuel consumption.
 *
 * @param distance - Distance traveled in kilometers
 * @param fuelUsed - Amount of fuel consumed in liters
 * @returns Fuel efficiency in kilometers per liter
 * @throws {Error} When fuelUsed is zero or negative
 *
 * @example
 * ```typescript
 * const efficiency = calculateFuelEfficiency(100, 8.5);
 * console.log(efficiency); // 11.76 km/l
 * ```
 */
function calculateFuelEfficiency(distance: number, fuelUsed: number): number {
  if (fuelUsed <= 0) {
    throw new Error("Fuel used must be greater than zero");
  }

  return distance / fuelUsed;
}

// ✅ Good: Inline comments for complex logic
function processVehicleData(rawData: any[]): Vehicle[] {
  return rawData
    .filter((item) => item.status === "active") // Only include active vehicles
    .map((item) => ({
      // Transform raw API data to Vehicle interface
      id: item.vehicle_id,
      make: item.manufacturer,
      model: item.model_name,
      year: parseInt(item.year_manufactured, 10),
      licensePlate: item.license_number.toUpperCase(),
    }))
    .sort((a, b) => a.make.localeCompare(b.make)); // Sort alphabetically by make
}
````

### README Documentation

````markdown
# Component Name

Brief description of what this component does.

## Props

| Prop       | Type      | Default | Description                       |
| ---------- | --------- | ------- | --------------------------------- |
| `vehicle`  | `Vehicle` | -       | Vehicle data to display           |
| `editable` | `boolean` | `false` | Whether the component is editable |

## Events

| Event    | Payload   | Description                   |
| -------- | --------- | ----------------------------- |
| `save`   | `Vehicle` | Fired when vehicle is saved   |
| `delete` | `string`  | Fired when vehicle is deleted |

## Usage

```svelte
<VehicleCard
  {vehicle}
  editable={true}
  on:save={handleSave}
  on:delete={handleDelete}
/>
```
````

````

## Testing Standards

### Test Structure
```typescript
// ✅ Good: Well-structured test with clear sections
describe('VehicleService', () => {
  describe('getAllVehicles', () => {
    it('should return all vehicles with associations', async () => {
      // Arrange
      const mockVehicles = [
        { id: '1', make: 'Toyota', model: 'Camry' },
        { id: '2', make: 'Honda', model: 'Civic' }
      ];

      vi.mocked(Vehicle.findAll).mockResolvedValue(mockVehicles);

      // Act
      const result = await VehicleService.getAllVehicles();

      // Assert
      expect(Vehicle.findAll).toHaveBeenCalledWith({
        include: ['insurance', 'fuelLogs', 'maintenanceLogs', 'pollutionCertificate']
      });
      expect(result).toEqual(mockVehicles);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      vi.mocked(Vehicle.findAll).mockRejectedValue(dbError);

      // Act & Assert
      await expect(VehicleService.getAllVehicles()).rejects.toThrow(
        'Database connection failed'
      );
    });
  });
});
````

### Test Naming

```typescript
// ✅ Good: Descriptive test names
describe("when user is authenticated", () => {
  it("should allow access to protected routes", () => {});
  it("should display user-specific data", () => {});
});

describe("when vehicle data is invalid", () => {
  it("should throw validation error for missing make", () => {});
  it("should throw validation error for invalid year", () => {});
});

// ✅ Good: Test data factories
function createMockVehicle(overrides: Partial<Vehicle> = {}): Vehicle {
  return {
    id: "test-id",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    licensePlate: "ABC123",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
```

## Performance Standards

### Database Queries

```typescript
// ✅ Good: Efficient queries with proper includes
const vehicles = await Vehicle.findAll({
  include: [
    {
      association: "fuelLogs",
      limit: 5,
      order: [["date", "DESC"]],
      attributes: ["id", "date", "fuelAmount", "cost"],
    },
  ],
  attributes: ["id", "make", "model", "year", "licensePlate"],
  order: [["createdAt", "DESC"]],
});

// ❌ Bad: N+1 query problem
const vehicles = await Vehicle.findAll();
for (const vehicle of vehicles) {
  vehicle.fuelLogs = await FuelLog.findAll({
    where: { vehicleId: vehicle.id },
  });
}
```

### Frontend Performance

```typescript
// ✅ Good: Memoized expensive calculations
import { derived } from 'svelte/store';

export const fuelEfficiencyStats = derived(
  [vehicles, fuelLogs],
  ([$vehicles, $fuelLogs]) => {
    // Expensive calculation only runs when dependencies change
    return calculateFuelEfficiencyStats($vehicles, $fuelLogs);
  }
);

// ✅ Good: Lazy loading for large lists
{#each visibleVehicles as vehicle (vehicle.id)}
  <VehicleCard {vehicle} />
{/each}

{#if hasMoreVehicles}
  <button on:click={loadMoreVehicles}>Load More</button>
{/if}
```

## Security Standards

### Input Validation

```typescript
// ✅ Good: Comprehensive input validation
import Joi from "joi";

const vehicleSchema = Joi.object({
  make: Joi.string().required().min(1).max(50).trim(),
  model: Joi.string().required().min(1).max(50).trim(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
  licensePlate: Joi.string()
    .required()
    .pattern(/^[A-Z0-9-]+$/),
  vin: Joi.string()
    .optional()
    .length(17)
    .pattern(/^[A-HJ-NPR-Z0-9]+$/),
  color: Joi.string().optional().max(30).trim(),
  odometer: Joi.number().integer().min(0).optional(),
});

export function validateVehicleData(data: any): VehicleCreationAttributes {
  const { error, value } = vehicleSchema.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationError(error.details.map((d) => d.message).join(", "));
  }

  return value;
}
```

### Authentication

```typescript
// ✅ Good: Secure authentication middleware
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pin = req.headers["x-user-pin"] as string;

  if (!pin) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const isValid = await bcrypt.compare(pin, storedHashedPin);

    if (!isValid) {
      // Log failed authentication attempt
      logger.warn("Failed authentication attempt", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        timestamp: new Date().toISOString(),
      });

      return res.status(401).json({ error: "Invalid credentials" });
    }

    next();
  } catch (error) {
    logger.error("Authentication error", error);
    res.status(500).json({ error: "Authentication service unavailable" });
  }
};
```

These coding standards provide a comprehensive foundation for maintaining high-quality, consistent code across the Tracktor project. All contributors should familiarize themselves with these guidelines and apply them consistently in their work.
