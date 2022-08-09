import { Router } from "express";

import User from "../entities/User";
import isAuth from "../middlewares/isAuth";
import isNotAuth from "../middlewares/isNotAuth";
import { COOKIE_NAME } from "../misc/constants";
import { TAuthRequest } from "../misc/types";
import getResponse from "../utils/getResponse";
import getToken from "../utils/getToken";

const router = Router();

router.get("/", isAuth, async (req: TAuthRequest, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user?.id } });
    return res.json(
      getResponse("SUCCESS", "Authenticated User returned!", user)
    );
  } catch (error: any) {
    console.error(error);
    return res.json(getResponse("ERROR", error.message));
  }
});

router.post("/register", isNotAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password }).save();

    res.cookie(COOKIE_NAME, getToken({ id: user.id }));
    return res.json(
      getResponse("SUCCESS", `User has registered successfully!`, user)
    );
  } catch (error: any) {
    console.error(error);
    return res.json(getResponse("ERROR", error.message));
  }
});

router.post("/login", isNotAuth, async (req, res) => {
  try {
    const { nameOrEmail, password } = req.body;
    const user = await User.findOne({
      where: { [nameOrEmail.includes("@") ? "email" : "name"]: nameOrEmail },
    });

    if (!user) return res.json(getResponse("ERROR", "User does not exist!"));
    if (!(await user.checkPassword(password)))
      return res.json(getResponse("ERROR", "Wrong credentials!"));

    res.cookie(COOKIE_NAME, getToken({ id: user.id }));
    return res.json(
      getResponse("SUCCESS", `User has logged in successfully!`, user)
    );
  } catch (error: any) {
    console.error(error);
    return res.json(getResponse("ERROR", error.message));
  }
});

router.delete("/logout", isAuth, async (_, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.json(getResponse("SUCCESS", "User logged out successfully!"));
});

export default router;
