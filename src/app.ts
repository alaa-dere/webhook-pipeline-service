// This file is important for the application to run.
// It initializes the server and sets up the necessary middleware and routes.
import express from "express";
import { AppDataSource } from "./db/data-source.js";
import webhookRoutes from "./modules/webhook/routes.js";
import pipelineRoutes from "./modules/pipeline/routes.js";
import jobsRoutes from "./modules/jobs/routes.js";
import deliveryRoutes from "./modules/delivery/routes.js";
import subscriberRoutes from "./modules/subscriber/routes.js";


const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(webhookRoutes);
app.use(pipelineRoutes);
app.use(jobsRoutes);
app.use(deliveryRoutes);
app.use(subscriberRoutes);

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
