import express from "express";
import cors from "cors";

import { logger } from "./utils.js";
import { config } from "./config.js";
import fs from "fs";

const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  fs.readFile("./db.json", (error, file) => {
    if (error) {
      logger.info({
        message: `Unable to read DB file`,
      });
    }
    const db = JSON.parse(file);
    res.send({ db, status: "OK" });
  });
});

app.use(express.json());
const port = config.port;

logger.info("Starting server");
app.listen(port, () => {
  logger.info({
    message: `Listening on port ${port}`,
  });
});
