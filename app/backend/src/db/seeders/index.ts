import bcrypt from "bcrypt";
import {
  authTable,
  fuelLogTable,
  insuranceTable,
  maintenanceLogTable,
  pollutionCertificateTable,
  ownershipTypeTable,
  vehicleTable,
} from "@db/schema/index.js";
import { db } from "@db/index.js";
import { faker } from "@faker-js/faker";
import { configDotenv } from "dotenv";

configDotenv();

export const seedData = async () => {
  const pinEnv = process.env.AUTH_PIN;
  const enforceEnv = process.env.FORCE_DEMO_SEED_DATA;
  const demoMode = process.env.PUBLIC_DEMO_MODE;
  // Seed configurable catalogues first (idempotent)
  await seedOwnershipTypes();
  if (pinEnv && pinEnv.trim().length == 6) await seedAuthPin(pinEnv);
  if (demoMode == "true") await seedDemoData(enforceEnv == "true");
};

const seedAuthPin = async (pin: string) => {
  const hash = await bcrypt.hash(pin, 10);
  await db
    .insert(authTable)
    .values({ id: 1, hash })
    .onConflictDoNothing()
    .run();
  console.log("Authentication PIN configured");
};

const seedOwnershipTypes = async () => {
  try {
    const defaults = [
      { name: "Propio", active: true },
      { name: "Arrendado", active: true },
      { name: "Prestado", active: true },
      { name: "Comodato", active: true },
    ];
    await db.insert(ownershipTypeTable).values(defaults).onConflictDoNothing().run();
    console.log("Ownership types seeded (idempotent)");
  } catch (e) {
    console.error("Failed to seed ownership types:", e);
  }
};

const seedDemoData = async (enforce: boolean = false) => {
  if (!enforce) {
    const existingVehicles = await db.$count(vehicleTable);
    if (existingVehicles > 0) {
      console.log("Demo data already exists, skipping");
      return;
    }
  } else {
    console.log("Forcing demo data seed");
    await db.delete(pollutionCertificateTable);
    await db.delete(maintenanceLogTable);
    await db.delete(fuelLogTable);
    await db.delete(insuranceTable);
    await db.delete(vehicleTable);
  }

  const vehicles = await db
    .insert(vehicleTable)
    .values([
      {
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.number.int({ min: 2000, max: 2025 }),
        licensePlate: faker.vehicle.vrm(),
        vin: faker.vehicle.vin(),
        color: faker.color.rgb(),
        odometer: faker.number.int({ min: 100, max: 500000 }),
      },
      {
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.number.int({ min: 2000, max: 2025 }),
        licensePlate: faker.vehicle.vrm(),
        vin: faker.vehicle.vin(),
        color: faker.color.rgb(),
        odometer: faker.number.int({ min: 100, max: 500000 }),
      },
    ])
    .returning();

  vehicles.forEach(async (vehicle) => {
    await db
      .insert(insuranceTable)
      .values({
        vehicleId: vehicle.id,
        provider: faker.company.name(),
        policyNumber: faker.string.numeric({ length: { min: 12, max: 18 } }),
        startDate: faker.date.past({ years: 1 }).toDateString(),
        endDate: faker.date.future({ years: 1 }).toDateString(),
        cost: faker.number.int({ min: 1000, max: 5000 }),
      })
      .run();
  });

  vehicles.forEach(async (vehicle) => {
    await db
      .insert(maintenanceLogTable)
      .values({
        vehicleId: vehicle.id,
        date: faker.date.past({ years: 5 }).toDateString(),
        odometer: faker.number.int({ min: 100, max: 50000 }),
        serviceCenter: faker.company.name(),
        cost: faker.number.int({ min: 1000, max: 5000 }),
      })
      .run();
  });

  vehicles.forEach(async (vehicle) => {
    await db
      .insert(pollutionCertificateTable)
      .values({
        vehicleId: vehicle.id,
        certificateNumber: faker.string.alphanumeric({
          casing: "upper",
          length: 10,
        }),
        issueDate: faker.date.past({ years: 1 }).toDateString(),
        expiryDate: faker.date.future({ years: 1 }).toDateString(),
        testingCenter: faker.company.name(),
      })
      .run();
  });

  vehicles.forEach(async (vehicle) => {
    const fuelLogs = [];
    for (let i = 0; i < 25; i++) {
      fuelLogs.push({
        vehicleId: vehicle.id,
        date: faker.date.past({ years: 1 }).toDateString(),
        odometer: faker.number.int({
          min: vehicle.odometer!,
          max: vehicle.odometer! + 20000,
        }),
        fuelAmount: faker.number.float({ min: 1, max: 100 }),
        cost: faker.number.float({ min: 10, max: 10000 }),
        filled: faker.datatype.boolean({ probability: 0.9 }),
        missedLast: faker.datatype.boolean({ probability: 0.1 }),
      });
    }
    await db.insert(fuelLogTable).values(fuelLogs);
  });

  console.log("Demo data seeded successfully");
};
