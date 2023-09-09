import { Request } from "express";

export type TPayload = { id: string };
export type TAuthRequest = Request & { redclient?: any; user?: TPayload };
