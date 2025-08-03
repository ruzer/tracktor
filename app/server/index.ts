import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

import sequelize from "./src/config/database.js";
import pinRoutes from "./src/routes/pinRoutes.js";
import vehicleRoutes from "./src/routes/vehicleRoutes.js";
import configRoutes from "./src/routes/configRoutes.js";
import { config } from "dotenv";

config({ quiet: true });

const app = express();
const PORT = Number(process.env.APP_PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use the route files
app.use("/api", pinRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/config", configRoutes);

if (process.env.NODE_ENV === 'production') {
  // @ts-ignore
  const { handler } = await import('../client/build/handler.js');
  app.use(handler);
} else {
  // In dev, redirect to SvelteKit dev server
  app.use('/', (req, res) => {
    res.redirect(`http://localhost:5173${req.originalUrl}`);
  });
}

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
