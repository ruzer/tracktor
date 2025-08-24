# Debugging Guide

This guide provides comprehensive debugging strategies, tools, and techniques for troubleshooting issues in the Tracktor application across all layers of the stack.

## Debugging Philosophy

### Systematic Approach

1. **Reproduce**: Consistently reproduce the issue
2. **Isolate**: Narrow down the problem area
3. **Investigate**: Use appropriate debugging tools
4. **Hypothesize**: Form theories about the root cause
5. **Test**: Verify hypotheses with targeted changes
6. **Fix**: Implement and validate the solution

### Debugging Mindset

- **Start Simple**: Check obvious issues first (typos, missing files, etc.)
- **Use Logs**: Leverage existing logging before adding new debug code
- **Binary Search**: Divide and conquer to isolate issues
- **Rubber Duck**: Explain the problem to understand it better
- **Take Breaks**: Fresh perspective often reveals solutions

## Development Environment Setup

### VS Code Debugging Configuration

#### Backend Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/app/backend/index.ts",
      "runtimeArgs": ["--loader", "tsx/esm"],
      "env": {
        "NODE_ENV": "development",
        "LOG_LEVEL": "debug",
        "SHOW_SQL": "true"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"],
      "sourceMaps": true,
      "restart": true,
      "runtimeExecutable": "node"
    },
    {
      "name": "Debug Backend Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "cwd": "${workspaceFolder}/app/backend",
      "env": {
        "NODE_ENV": "test"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

#### Frontend Debugging

```json
{
  "name": "Debug Frontend",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/app/frontend/node_modules/@sveltejs/kit/src/exports/vite/dev/index.js",
  "args": ["--port", "5173", "--host", "0.0.0.0"],
  "cwd": "${workspaceFolder}/app/frontend",
  "env": {
    "NODE_ENV": "development"
  },
  "console": "integratedTerminal",
  "skipFiles": ["<node_internals>/**"]
}
```

### Browser Debugging Setup

#### Chrome DevTools

1. **Enable Source Maps**: Ensure source maps are generated
2. **Install Extensions**:
   - Svelte DevTools
   - Vue.js DevTools (for component inspection)
3. **Configure Network Tab**: Monitor API requests and responses
4. **Use Console**: Leverage console methods for debugging

#### Firefox Developer Tools

- Similar setup to Chrome
- Excellent CSS debugging capabilities
- Network monitoring and performance profiling

## Backend Debugging

### Node.js Debugging

#### Using Node Inspector

```bash
# Start backend with inspector
node --inspect --loader tsx/esm app/backend/index.ts

# Or with specific port
node --inspect=0.0.0.0:9229 --loader tsx/esm app/backend/index.ts

# Connect with Chrome DevTools
# Open chrome://inspect in Chrome browser
```

#### Debug with tsx

```bash
# Debug mode with tsx
DEBUG=* tsx --inspect app/backend/index.ts

# With specific debug namespace
DEBUG=tracktor:* tsx --inspect app/backend/index.ts
```

### Logging Strategies

#### Structured Logging

```typescript
// src/utils/logger.ts
import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: "tracktor-backend" },
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

export default logger;
```

#### Debug Logging in Services

```typescript
// src/services/vehicleService.ts
import logger from "../utils/logger.js";

export class VehicleService {
  static async getAllVehicles(): Promise<Vehicle[]> {
    logger.debug("VehicleService.getAllVehicles called");

    try {
      const vehicles = await Vehicle.findAll({
        include: ["insurance", "fuelLogs", "maintenanceLogs"],
      });

      logger.debug(`Found ${vehicles.length} vehicles`);
      return vehicles;
    } catch (error) {
      logger.error("Error fetching vehicles:", error);
      throw error;
    }
  }
}
```

#### Request/Response Logging

```typescript
// src/middleware/logging.ts
import logger from "../utils/logger.js";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  logger.info("Request started", {
    method: req.method,
    url: req.url,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Request completed", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
```

### Database Debugging

#### SQL Query Logging

```typescript
// Enable SQL logging in development
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DATABASE_PATH,
  logging: process.env.SHOW_SQL === "true" ? console.log : false,
  benchmark: true, // Show execution time
});
```

#### Database Connection Debugging

```typescript
// src/db/db.ts
import logger from "../utils/logger.js";

export async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established successfully");
  } catch (error) {
    logger.error("Unable to connect to database:", error);
    throw error;
  }
}
```

#### Query Performance Debugging

```typescript
// Monitor slow queries
sequelize.addHook("beforeQuery", (options) => {
  options.startTime = Date.now();
});

sequelize.addHook("afterQuery", (options) => {
  const duration = Date.now() - options.startTime;
  if (duration > 1000) {
    // Log queries taking more than 1 second
    logger.warn("Slow query detected", {
      sql: options.sql,
      duration: `${duration}ms`,
    });
  }
});
```

### API Debugging

#### Request/Response Debugging

```typescript
// src/middleware/debug.ts
export const debugMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "development") {
    console.log("=== REQUEST DEBUG ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("Query:", req.query);
    console.log("Params:", req.params);

    // Capture original send function
    const originalSend = res.send;
    res.send = function (data) {
      console.log("=== RESPONSE DEBUG ===");
      console.log("Status:", res.statusCode);
      console.log("Data:", data);
      console.log("========================");
      return originalSend.call(this, data);
    };
  }

  next();
};
```

#### Error Debugging

```typescript
// src/middleware/error-handler.ts
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log full error details in development
  if (process.env.NODE_ENV === "development") {
    console.error("=== ERROR DEBUG ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    console.error("Request:", {
      method: req.method,
      url: req.url,
      body: req.body,
      headers: req.headers,
    });
    console.error("==================");
  }

  // Log error with structured logging
  logger.error("Request error", {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    userAgent: req.get("User-Agent"),
  });

  // Send appropriate response
  if (error instanceof ServiceError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      },
    });
  } else {
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        ...(process.env.NODE_ENV === "development" && {
          originalError: error.message,
          stack: error.stack,
        }),
      },
    });
  }
};
```

## Frontend Debugging

### Browser DevTools

#### Console Debugging

```typescript
// src/lib/stores/vehicle.ts
import { writable } from "svelte/store";

export const vehicleStore = {
  vehicles: writable([]),

  async loadVehicles() {
    console.group("🚗 Loading vehicles");
    console.time("loadVehicles");

    try {
      console.log("Fetching vehicles from API...");
      const vehicles = await fetchVehicles();

      console.log("Vehicles loaded:", vehicles);
      this.vehicles.set(vehicles);

      console.log("Store updated");
    } catch (error) {
      console.error("Failed to load vehicles:", error);
      throw error;
    } finally {
      console.timeEnd("loadVehicles");
      console.groupEnd();
    }
  },
};
```

#### Network Debugging

```typescript
// src/lib/utils/api.ts
export async function fetchVehicles(): Promise<Vehicle[]> {
  const url = `${PUBLIC_API_BASE_URL}/api/vehicles`;
  const pin = localStorage.getItem("userPin");

  console.log("🌐 API Request:", {
    url,
    method: "GET",
    headers: {
      "X-User-PIN": pin ? "***" : "missing",
    },
  });

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-User-PIN": pin || "",
    },
  });

  console.log("🌐 API Response:", {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("🌐 API Error:", errorData);
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("🌐 API Data:", data);

  return data;
}
```

### Svelte Debugging

#### Component Debugging

```svelte
<!-- src/components/VehicleCard.svelte -->
<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';

  export let vehicle: Vehicle;

  // Debug component lifecycle
  onMount(() => {
    console.log('🔧 VehicleCard mounted:', vehicle);
  });

  afterUpdate(() => {
    console.log('🔧 VehicleCard updated:', vehicle);
  });

  // Debug reactive statements
  $: {
    console.log('🔧 Vehicle prop changed:', vehicle);
  }

  function handleClick() {
    console.log('🔧 Vehicle card clicked:', vehicle.id);
    // ... rest of handler
  }
</script>

<div class="vehicle-card" on:click={handleClick}>
  <!-- Component template -->
</div>
```

#### Store Debugging

```typescript
// src/lib/stores/debug.ts
import { writable } from "svelte/store";

// Debug store for development
export const debugStore = writable({
  apiCalls: [],
  errors: [],
  performance: {},
});

// Helper to track API calls
export function trackApiCall(method: string, url: string, duration: number) {
  if (process.env.NODE_ENV === "development") {
    debugStore.update((state) => ({
      ...state,
      apiCalls: [
        ...state.apiCalls,
        { method, url, duration, timestamp: Date.now() },
      ],
    }));
  }
}
```

#### Reactive Statement Debugging

```svelte
<script>
  let count = 0;
  let doubled;

  // Debug reactive statements
  $: {
    console.log('Count changed:', count);
    doubled = count * 2;
    console.log('Doubled calculated:', doubled);
  }

  // Debug derived values
  $: console.log('Reactive update - count:', count, 'doubled:', doubled);
</script>
```

### Performance Debugging

#### Bundle Analysis

```bash
# Analyze frontend bundle
npm run build --workspace=frontend
npx vite-bundle-analyzer app/frontend/build

# Check bundle size
npm run build:analyze --workspace=frontend
```

#### Runtime Performance

```typescript
// src/lib/utils/performance.ts
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  if (process.env.NODE_ENV === "development") {
    console.time(name);

    const result = fn();

    if (result instanceof Promise) {
      return result.finally(() => console.timeEnd(name));
    } else {
      console.timeEnd(name);
      return result;
    }
  }

  return fn();
}

// Usage
const vehicles = await measurePerformance("loadVehicles", () =>
  fetchVehicles()
);
```

## Database Debugging

### SQLite Debugging

#### Database Browser

```bash
# Install DB Browser for SQLite
# macOS
brew install --cask db-browser-for-sqlite

# Ubuntu/Debian
sudo apt install sqlitebrowser

# Windows - Download from https://sqlitebrowser.org/
```

#### Command Line Debugging

```bash
# Access database directly
sqlite3 app/backend/tracktor.db

# Useful SQLite commands
.tables                          # List all tables
.schema vehicles                 # Show table schema
.headers on                      # Show column headers
.mode column                     # Format output as columns

# Query examples
SELECT * FROM vehicles LIMIT 5;
SELECT COUNT(*) FROM fuel_logs;
EXPLAIN QUERY PLAN SELECT * FROM vehicles WHERE make = 'Toyota';

# Check database integrity
PRAGMA integrity_check;
PRAGMA foreign_key_check;
```

#### Migration Debugging

```typescript
// src/db/debug.ts
export async function debugMigration() {
  const queryInterface = sequelize.getQueryInterface();

  // Check current migration state
  const migrations = await queryInterface.sequelize.query(
    "SELECT * FROM SequelizeMeta ORDER BY name",
    { type: QueryTypes.SELECT }
  );

  console.log("Applied migrations:", migrations);

  // Check table structure
  const tables = await queryInterface.showAllTables();
  console.log("Current tables:", tables);

  for (const table of tables) {
    const columns = await queryInterface.describeTable(table);
    console.log(`Table ${table}:`, columns);
  }
}
```

## Common Debugging Scenarios

### Authentication Issues

#### Debug PIN Authentication

```typescript
// src/middleware/auth.ts
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pin = req.headers["x-user-pin"] as string;

  console.log("🔐 Auth Debug:", {
    hasPin: !!pin,
    pinLength: pin?.length,
    headers: Object.keys(req.headers),
    url: req.url,
  });

  if (!pin) {
    console.log("🔐 Auth failed: No PIN provided");
    return res.status(401).json({ error: "PIN required" });
  }

  try {
    const isValid = await validatePin(pin);
    console.log("🔐 PIN validation result:", isValid);

    if (!isValid) {
      console.log("🔐 Auth failed: Invalid PIN");
      return res.status(401).json({ error: "Invalid PIN" });
    }

    console.log("🔐 Auth successful");
    next();
  } catch (error) {
    console.error("🔐 Auth error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
};
```

### CORS Issues

#### Debug CORS Configuration

```typescript
// src/index.ts
const corsOptions = {
  origin: (origin, callback) => {
    console.log("🌐 CORS Debug:", {
      origin,
      allowedOrigins: env.CORS_ORIGINS,
      isAllowed: !origin || env.CORS_ORIGINS.includes(origin),
    });

    if (!origin || env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.log("🌐 CORS blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
```

### State Management Issues

#### Debug Store Updates

```typescript
// src/lib/stores/vehicle.ts
import { writable } from "svelte/store";

function createVehicleStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set: (vehicles) => {
      console.log("🏪 Store set:", vehicles);
      set(vehicles);
    },
    update: (fn) => {
      console.log("🏪 Store update called");
      update((current) => {
        console.log("🏪 Current state:", current);
        const newState = fn(current);
        console.log("🏪 New state:", newState);
        return newState;
      });
    },
  };
}
```

### API Communication Issues

#### Debug API Requests

```typescript
// src/lib/utils/api.ts
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${PUBLIC_API_BASE_URL}${endpoint}`;
  const pin = localStorage.getItem("userPin");

  const requestOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-User-PIN": pin || "",
      ...options.headers,
    },
  };

  console.group(`🌐 API ${options.method || "GET"} ${endpoint}`);
  console.log("URL:", url);
  console.log("Options:", requestOptions);

  try {
    const response = await fetch(url, requestOptions);

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Response data:", data);

    return data;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  } finally {
    console.groupEnd();
  }
}
```

## Production Debugging

### Error Monitoring

```typescript
// src/utils/errorReporting.ts
export function reportError(error: Error, context?: any) {
  if (process.env.NODE_ENV === "production") {
    // Send to error reporting service (e.g., Sentry)
    console.error("Production error:", {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.error("Development error:", error, context);
  }
}
```

### Health Checks

```typescript
// src/routes/health.ts
export const healthCheck = async (req: Request, res: Response) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: "unknown",
  };

  try {
    await sequelize.authenticate();
    health.database = "connected";
  } catch (error) {
    health.database = "disconnected";
    health.status = "error";
  }

  const statusCode = health.status === "ok" ? 200 : 503;
  res.status(statusCode).json(health);
};
```

## Debugging Tools and Extensions

### VS Code Extensions

- **Svelte for VS Code**: Svelte component debugging
- **TypeScript Importer**: Auto-import debugging
- **Error Lens**: Inline error display
- **Thunder Client**: API testing within VS Code
- **SQLite Viewer**: Database inspection

### Browser Extensions

- **Svelte DevTools**: Component state inspection
- **React DevTools**: For debugging React-like patterns
- **Redux DevTools**: State management debugging
- **Network Monitor**: Advanced network debugging

### Command Line Tools

```bash
# Network debugging
curl -v -H "X-User-PIN: 1234" http://localhost:3000/api/vehicles

# Database debugging
sqlite3 app/backend/tracktor.db ".dump" | head -50

# Process debugging
ps aux | grep node
lsof -i :3000

# Log monitoring
tail -f app/backend/logs/combined.log
```

This debugging guide provides comprehensive tools and techniques for troubleshooting issues across the entire Tracktor application stack. Use these strategies systematically to identify and resolve problems efficiently.
