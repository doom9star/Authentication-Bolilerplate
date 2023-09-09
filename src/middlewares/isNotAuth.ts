import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { COOKIE_NAME } from "../lib/constants";
import getResponse from "../lib/utils/getResponse";
import { log } from "../lib/utils/logging";

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies[COOKIE_NAME])
      throw new JsonWebTokenError("Token is missing!");
    jwt.verify(req.cookies[COOKIE_NAME], (process.env as any).JWT_PRIVATE_KEY);
    return res.json(getResponse(400));
  } catch (error: any) {
    log("ERROR", error.message);
    next();
  }
};
