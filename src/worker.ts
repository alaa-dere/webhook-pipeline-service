import { AppDataSource } from "./db/data-source.js";
import { startWorker } from "./workers/job.worker.js";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    startWorker();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
