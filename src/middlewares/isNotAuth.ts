import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

import { COOKIE_NAME } from "../misc/constants";
import getResponse from "../utils/getResponse";

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies[COOKIE_NAME])
      throw new JsonWebTokenError("Token is missing!");
    jwt.verify(req.cookies[COOKIE_NAME], (process.env as any).JWT_PRIVATE_KEY);
    return res.json(getResponse("ERROR", "User is already authenticated!"));
  } catch (error: any) {
    console.error(error.message);
    next();
  }
};
