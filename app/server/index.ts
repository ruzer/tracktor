import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.ts";

import sequelize from "./src/config/database.ts";
import pinRoutes from "./src/routes/pinRoutes.ts";
import vehicleRoutes from "./src/routes/vehicleRoutes.ts";
import fuelLogRoutes from "./src/routes/fuelLogRoutes.ts";
import insuranceRoutes from "./src/routes/insuranceRoutes.ts";
import maintenanceLogRoutes from "./src/routes/maintenanceLogRoutes.ts";
import pollutionCertificateRoutes from "./src/routes/pollutionCertificateRoutes.ts";
import { config } from "dotenv";

config({ quiet: true });

const app = express();
const PORT = Number(process.env.APP_PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

// Serve static files from the SvelteKit build output
import path from "path";
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
