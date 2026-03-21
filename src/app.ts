// This file is important for the application to run.
// It initializes the server and sets up the necessary middleware and routes.
import express from "express";
import { AppDataSource } from "./db/data-source.js";
import webhookRoutes from "./modules/webhook/routes.js";
const app = express();
app.use(express.json());
app.use(webhookRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });