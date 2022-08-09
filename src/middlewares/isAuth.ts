import { NextFunction, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

import { COOKIE_NAME } from "../misc/constants";
import { TAuthRequest, TPayload } from "../misc/types";
import getResponse from "../utils/getResponse";

export default (req: TAuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies[COOKIE_NAME])
      throw new JsonWebTokenError("Token is missing!");
    const payload = jwt.verify(
      req.cookies[COOKIE_NAME],
      (process.env as any).JWT_PRIVATE_KEY
    ) as TPayload;
    req.user = payload;
    next();
  } catch (error) {
    console.error(error);
    return res.json(getResponse("ERROR", "User is not authenticated!"));
  }
};
