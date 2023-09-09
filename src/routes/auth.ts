import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../entities/User";
import {
  ACTIVATE_PASSWORD_PREFIX,
  APP_PREFIX,
  COOKIE_NAME,
  FORGOT_PASSWORD_PREFIX,
} from "../lib/constants";
import { TAuthRequest } from "../lib/types";
import getResponse from "../lib/utils/getResponse";
import getToken from "../lib/utils/getToken";
import isAuth from "../middlewares/isAuth";
import isNotAuth from "../middlewares/isNotAuth";
import { v4 } from "uuid";
import { log } from "../lib/utils/logging";

const router = Router();

router.get("/", isAuth, async (req: TAuthRequest, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user?.id } });
    return res.json(getResponse(200, user));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.post("/activate/:tid", isAuth, async (req: TAuthRequest, res) => {
  try {
    const { tid } = req.params;
    const uid = req.redclient.get(
      `${APP_PREFIX}${ACTIVATE_PASSWORD_PREFIX}${tid}`
    );

    const user = await User.findOne({ where: { id: uid } });
    if (!user) return res.json(getResponse(404));

    if (user.activated)
      return res.json(getResponse(400, "Account already activated!"));

    user.activated = true;
    await user.save();

    req.redclient.del(`${APP_PREFIX}${ACTIVATE_PASSWORD_PREFIX}${tid}`);

    return res.json(getResponse(200));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.post("/register", isNotAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password }).save();

    res.cookie(`${APP_PREFIX}${COOKIE_NAME}`, getToken({ id: user.id }));
    return res.json(getResponse(200, user));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.post("/login", isNotAuth, async (req, res) => {
  try {
    const { nameOrEmail, password } = req.body;
    const user = await User.findOne({
      where: { [nameOrEmail.includes("@") ? "email" : "name"]: nameOrEmail },
    });

    if (!user) return res.json(getResponse(404));
    if (!(await user.checkPassword(password)))
      return res.json(getResponse(401, "Wrong credentials!"));

    res.cookie(`${APP_PREFIX}${COOKIE_NAME}`, getToken({ id: user.id }));
    return res.json(getResponse(200, user));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.delete("/logout", isAuth, async (_, res) => {
  try {
    res.clearCookie(`${APP_PREFIX}${COOKIE_NAME}`);
    return res.json(getResponse(200));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.post("/forgot-password", isAuth, async (req: TAuthRequest, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.json(getResponse(404));
    if (!user.activated)
      return res.json(getResponse(400, "Account must be activated!"));

    const tid = v4();
    req.redclient.set(`${APP_PREFIX}${FORGOT_PASSWORD_PREFIX}${tid}`, user.id);

    return res.json(getResponse(200));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

router.post("/reset-password/:tid", isAuth, async (req: TAuthRequest, res) => {
  try {
    const { tid } = req.params;

    const uid = await req.redclient.get(
      `${APP_PREFIX}${FORGOT_PASSWORD_PREFIX}${tid}`
    );
    const { password } = req.body;

    const user = await User.findOne({ where: { id: uid } });
    if (!user) return res.json(getResponse(404));

    user.password = await bcrypt.hash(password, 12);
    user.save();

    req.redclient.del(`${APP_PREFIX}${FORGOT_PASSWORD_PREFIX}${tid}`);

    return res.json(getResponse(200));
  } catch (error: any) {
    log("ERROR", error.message);
    return res.json(getResponse(500, error.message));
  }
});

export default router;
