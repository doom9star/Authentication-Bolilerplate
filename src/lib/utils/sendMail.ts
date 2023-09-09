import { EmailOptions } from "../types";
import mailer from "nodemailer";
import { log } from "./logging";

export function sendMail(options: EmailOptions): void {
  const transporter = mailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });
  transporter.sendMail(options, (error: any) => {
    if (error) log("ERROR", error.message);
    else log("INFO", `Email sent to ${options.to}!`);
  });
}
