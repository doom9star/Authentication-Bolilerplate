import { Router } from "express";

import AuthRouter from "./auth";

const router = Router();

router.use("/auth", AuthRouter);

router.get("/", async (req, res) => {
  res.send(`Hi I'm ${req.path}, welcome to ASTROWORLD API.`);
});

export default router;
