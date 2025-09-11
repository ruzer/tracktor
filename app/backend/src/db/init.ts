import { db } from "@db/index.js";
import { seedData } from "@db/seeders/index.js";

export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log("🔄 Initializing database...");
    
    // Verificar conexión a la base de datos
    await db.$client.execute("SELECT 1");
    console.log("✅ Database connection established");
    
    // Ejecutar seeding de datos
    await seedData();
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    throw error;
  }
};