import dotenv from "dotenv";
import express from "express";
import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import User from "./entities/User";
import MainRouter from "./routes";
import { createClient } from "redis";
import { TAuthRequest } from "./lib/types";

const main = async () => {
  dotenv.config({ path: path.join(__dirname, "../.env") });

  await new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "test",
    entities: [User],
    synchronize: false,
    logging: false,
  }).initialize();

  const app = express();

  const redclient = createClient();
  await redclient.connect();

  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use((req: TAuthRequest, _, next) => {
    req.redclient = redclient;
    next();
  });
  app.use("/", MainRouter);

  app.listen(process.env.PORT, () => {
    console.log(`\nServer running on http://localhost:${process.env.PORT}`);
  });
};

main();
