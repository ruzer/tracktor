import { Umzug, SequelizeStorage } from "umzug";
import bcrypt from "bcrypt";
import { Auth, Config, FuelLog, Insurance, MaintenanceLog, PollutionCertificate, Vehicle } from "../models/index.js";
import { db } from "./db.js";

const umzug = new Umzug({
  migrations: { glob: 'migrations/*.ts' },
  context: db.getQueryInterface(),
  storage: new SequelizeStorage({
    tableName: "migrations",
    sequelize: db
  }),
  logger: console,
});

// export the type helper exposed by umzug, which will have the `context` argument typed correctly
type Migration = typeof umzug._types.migration;

const performDbMigrations = async () => {
  await db.sync({ alter: true })
  return umzug.up({});
}

const seedData = async () => {
  const demoMode = process.env.DEMO_MODE === 'true'

  if (demoMode) {
    await db.dropAllSchemas({});
    await insertDummyData();
  } else {
    await setupPinAndConfigs();
  }

}

const setupPinAndConfigs = async () => {
  const pin = process.env.AUTH_PIN
  if (pin) await generatePin(pin);
  await generateConfigs();
}

const insertDummyData = async () => {
  try {
    await db.sync({ force: true });
    console.log("Database synchronized!");

    await generatePin('123456');
    await generateConfigs();
    const { vehicle1, vehicle2 } = await generateVehicles();
    await generateInsurances(vehicle1, vehicle2);
    await generateMaintenenceLogs(vehicle1, vehicle2);
    await generatePuccData(vehicle1, vehicle2);
    await generateFuelLogData(vehicle1, vehicle2);
    console.log("Dummy data populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

async function generateFuelLogData(vehicle1: Vehicle, vehicle2: Vehicle) {
  const vehicle1FuelLogs: any = [
    {
      vehicleId: vehicle1.id,
      date: "2024-01-15",
      odometer: 15500,
      fuelAmount: 35,
      cost: 50,
      notes: "Full tank",
    },
    {
      vehicleId: vehicle1.id,
      date: "2024-02-15",
      odometer: 16000,
      fuelAmount: 32,
      cost: 48,
    },
  ];
  let currentDate1 = new Date("2024-04-15");
  let currentOdometer1 = 17000;
  for (let i = 0; i < 50; i++) {
    currentDate1.setDate(currentDate1.getDate() + 7);
    currentOdometer1 += Math.floor(Math.random() * 301) + 200;
    const fuelAmount = Math.random() * 11 + 30;
    const cost = Math.random() * 16 + 50;
    vehicle1FuelLogs.push({
      vehicleId: vehicle1.id,
      date: currentDate1.toISOString().split("T")[0],
      odometer: currentOdometer1,
      fuelAmount: parseFloat(fuelAmount.toFixed(2)),
      cost: parseFloat(cost.toFixed(2)),
    });
  }

  const vehicle2FuelLogs: any = [
    {
      vehicleId: vehicle2.id,
      date: "2024-01-20",
      odometer: 25600,
      fuelAmount: 40,
      cost: 60,
    },
    {
      vehicleId: vehicle2.id,
      date: "2024-02-20",
      odometer: 26200,
      fuelAmount: 38,
      cost: 55,
      notes: "Filled at Shell",
    },
  ];
  let currentDate2 = new Date("2024-04-20");
  let currentOdometer2 = 27400;
  for (let i = 0; i < 50; i++) {
    currentDate2.setDate(currentDate2.getDate() + 7);
    currentOdometer2 += Math.floor(Math.random() * 301) + 200;
    const fuelAmount = Math.random() * 11 + 30;
    const cost = Math.random() * 16 + 50;
    vehicle2FuelLogs.push({
      vehicleId: vehicle2.id,
      date: currentDate2.toISOString().split("T")[0],
      odometer: currentOdometer2,
      fuelAmount: parseFloat(fuelAmount.toFixed(2)),
      cost: parseFloat(cost.toFixed(2)),
    });
  }

  await FuelLog.bulkCreate(vehicle1FuelLogs);
  await FuelLog.bulkCreate(vehicle2FuelLogs);

  console.log("Fuel logs created.");
}

async function generatePuccData(vehicle1: Vehicle, vehicle2: Vehicle) {
  await PollutionCertificate.bulkCreate([
    {
      vehicleId: vehicle1.id,
      certificateNumber: "PUCC12345",
      issueDate: "2023-01-01",
      expiryDate: "2024-01-01",
      testingCenter: "Green Drive",
    },
    {
      vehicleId: vehicle2.id,
      certificateNumber: "PUCC54321",
      issueDate: "2023-01-01",
      expiryDate: "2024-01-01",
      testingCenter: "Eco Test",
    },
  ]);

  console.log("Pollution certificates created.");
}

async function generateMaintenenceLogs(vehicle1: Vehicle, vehicle2: Vehicle) {
  await MaintenanceLog.bulkCreate([
    {
      vehicleId: vehicle1.id,
      date: "2023-06-01",
      odometer: 18000,
      service: "Oil Change",
      cost: 50,
    },
    {
      vehicleId: vehicle2.id,
      date: "2023-07-01",
      odometer: 28000,
      service: "Tire Rotation",
      cost: 30,
    },
  ]);

  console.log("Maintenance logs created.");
}

async function generateInsurances(vehicle1: Vehicle, vehicle2: Vehicle) {
  await Insurance.bulkCreate([
    {
      vehicleId: vehicle1.id,
      provider: "Allstate",
      policyNumber: "123456789",
      startDate: "2023-01-01",
      endDate: "2024-01-01",
      cost: 1200,
    },
    {
      vehicleId: vehicle2.id,
      provider: "Geico",
      policyNumber: "987654321",
      startDate: "2023-01-01",
      endDate: "2024-01-01",
      cost: 1500,
    },
  ]);

  console.log("Insurance data created.");
}

async function generateVehicles() {
  const vehicle1 = await Vehicle.create({
    make: "Honda",
    model: "Civic",
    year: 2022,
    licensePlate: "TS-07-JA-1997",
    vin: "1HGFC1F7XNA000001",
    color: "Black",
    odometer: 15000,
  });

  const vehicle2 = await Vehicle.create({
    make: "Toyota",
    model: "Corolla",
    year: 2021,
    licensePlate: "AP-28-DX-2000",
    vin: "1NXBU4EE4AZ000002",
    color: "White",
    odometer: 25000,
  });

  console.log("Vehicles created.");
  return { vehicle1, vehicle2 };
}

async function generateConfigs() {
  const configData = [
    {
      key: "dateFormat",
      value: "MM/dd/yyyy",
      description: "Format for displaying dates",
    },
    {
      key: "currency",
      value: "USD",
      description: "Default currency for financial transactions",
    },
    {
      key: "unitOfMeasure",
      value: "metric",
      description: "Unit of measure for distance and volume",
    },
  ];
  await Config.bulkCreate(configData, {
    ignoreDuplicates: true
  });
  console.log("Configuration data created.");
}

async function generatePin(pin: string) {
  console.log("Setting up Pin");
  const hash = await bcrypt.hash(pin, 10);
  await Auth.upsert({ id: 1, hash });
  console.log(`User created with PIN: ${pin}`);
}

export { Migration, performDbMigrations, seedData, db }