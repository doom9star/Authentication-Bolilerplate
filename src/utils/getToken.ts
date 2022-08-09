import jwt from "jsonwebtoken";
import { WEEK } from "../misc/constants";

import { TPayload } from "../misc/types";

export default (payload: TPayload) => {
  const token = jwt.sign(payload, (process.env as any).JWT_PRIVATE_KEY, {
    algorithm: "HS256",
    expiresIn: WEEK,
  });
  return token;
};
