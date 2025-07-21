import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

import sequelize from "./src/config/database.js";
import pinRoutes from "./src/routes/pinRoutes.js";
import vehicleRoutes from "./src/routes/vehicleRoutes.js";
import fuelLogRoutes from "./src/routes/fuelLogRoutes.js";
import insuranceRoutes from "./src/routes/insuranceRoutes.js";
import maintenanceLogRoutes from "./src/routes/maintenanceLogRoutes.js";
import pollutionCertificateRoutes from "./src/routes/pollutionCertificateRoutes.js";
import { config } from "dotenv";

config({ quiet: true });

const app = express();
const PORT = Number(process.env.APP_PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

// Serve static files from the SvelteKit build output
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../client/build")));

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use the route files
app.use("/api", pinRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/vehicles", fuelLogRoutes);
app.use("/api/vehicles", insuranceRoutes);
app.use("/api/vehicles", maintenanceLogRoutes);
app.use("/api/vehicles", pollutionCertificateRoutes);

// Synchronize Sequelize models with the database
sequelize
    .sync()
    .then(() => {
        console.log("Database & tables created!");
        // Start the server after database synchronization
        app.listen(PORT, HOST, () => {
            console.log(`Server running @ http://${HOST}:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error syncing database:", err);
    });
