import express from "express";
import cors from "cors";
import pinRoutes from "./src/routes/pinRoutes.js";
import vehicleRoutes from "./src/routes/vehicleRoutes.js";
import configRoutes from "./src/routes/configRoutes.js";
import { performDbMigrations, seedData } from "./src/db/index.js";

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
  const { handler } = await import("../client/build/handler.js");
  app.use(handler);
} else {
  // In dev, redirect to SvelteKit dev server
  app.use("/", (req, res) => {
    res.redirect(`http://localhost:5173${req.originalUrl}`);
  });
}

performDbMigrations()
  .then(() => {
    console.log("DB Migration is Successfull!!!");
    seedData()
      .then(() => {
        console.log("Data Seeded Successfully!!!");
        app.listen(PORT, HOST, () => {
          console.log(
            "---------------------------------------------------------------------------",
          );
          console.log(`Server started -> http://${HOST}:${PORT}`);
        });
      })
      .catch((err) => {
        console.error("Error while seeding : ", err);
      });
  })
  .catch((err) => {
    console.error("Error while running db migrations : ", err);
  });
