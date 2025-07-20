import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

import sequelize from "./src/config/database.js";
import pinRoutes from "./src/routes/pinRoutes.js";
import vehicleRoutes from "./src/routes/vehicleRoutes.js";
import fuelLogRoutes from "./src/routes/fuelLogRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use the route files
app.use("/api", pinRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/vehicles", fuelLogRoutes); // Fuel logs are nested under vehicles

// Synchronize Sequelize models with the database
sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
    // Start the server after database synchronization
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
