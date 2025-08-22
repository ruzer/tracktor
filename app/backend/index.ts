import express from "express";
import cors from "cors";
import pinRoutes from "@routes/pinRoutes.js";
import vehicleRoutes from "@routes/vehicleRoutes.js";
import configRoutes from "@routes/configRoutes.js";
import { initializeDatabase } from "@db/init.js";
import { errorHandler } from "@middleware/error-handler.js";

const app = express();
const PORT = Number(process.env.APP_PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

app.use("/api", pinRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/config", configRoutes);

if (process.env.NODE_ENV === "production") {
  // @ts-ignore
  const { handler } = await import("@frontend/build/handler.js");
  app.use(handler);
} else {
  // In dev, redirect to SvelteKit dev server
  app.use("/", (req, res) => {
    res.redirect(`http://localhost:5173${req.originalUrl}`);
  });
}

app.use(errorHandler);

initializeDatabase()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log("─".repeat(75));
      console.log(`🚀 Server running at http://${HOST}:${PORT}`);
      console.log("─".repeat(75));
    });
  })
  .catch((err) => {
    console.error("❌ Failed to initialize database:", err);
    process.exit(1);
  });
