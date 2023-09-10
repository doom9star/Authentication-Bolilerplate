type TFormat = "INFO" | "ERROR" | "WARNING";

export function log(type: TFormat, message: string): void {
  if (type === "ERROR") console.log("[ERROR] \x1b[31m%s\x1b[0m", message);
  else if (type === "WARNING") console.log("[WARN] \x1b[33m%s\x1b[0m", message);
  else console.log("[INFO] \x1b[36m%s\x1b[0m", message);
}
