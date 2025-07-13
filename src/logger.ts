import kleur from "kleur";
import fs from "fs";
import path from "path";
import util from "util";
import type { Request as ExpressRequest } from "express";
import type { IncomingMessage } from "http";

type LogLevel = "info" | "warn" | "error";

const { green, yellow, red, gray, white } = kleur;

// const icons: Record<LogLevel, string> = {
//   info: "ℹ️",
//   warn: "⚠️",
//   error: "❌",
// };

const colors: Record<LogLevel, (msg: string) => string> = {
  info: green,
  warn: yellow,
  error: red,
};

function getRequestInfo(req?: ExpressRequest | IncomingMessage): {
  method: string;
  path: string;
  ip: string;
  sourceService: string;
  meta: string;
} {
  const method = (req as any)?.method ?? "UNKNOWN";
  const path = (req as any)?.originalUrl ?? "/";
  const sourceService = (req as any)?.headers?.["x-source-service"] ?? "";
  const ip =
    (req as any)?.headers?.["x-forwarded-for"] ??
    (req as any)?.socket?.remoteAddress ??
    "-";
  const meta = `${method} ${path} ${
    sourceService ? `source=${sourceService}` : ""
  } ip=${ip}`;

  return { method, path, ip, sourceService, meta };
}

export class RequestLogger {
  private logs: string[] = [];
  private logFilePath: string;
  private errorLogFilePath: string;
  private startTime: number = Date.now();
  private hasError: boolean = false;
  private requestMeta: string;

  constructor(
    private requestId: string,
    private req?: ExpressRequest | IncomingMessage
  ) {
    // Store logs to `logs/YYYY-MM-DD.log`
    const date = new Date().toISOString().slice(0, 10);
    const logsDir = path.resolve("logs");

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }

    this.logFilePath = path.join(logsDir, `${date}.log`);
    this.errorLogFilePath = path.join(logsDir, `${date}-error.log`);

    this.requestMeta = getRequestInfo(this.req).meta;
  }

  private formatMessage(msg: unknown): string {
    // Use util.inspect for better dev output (colors/objects)
    if (typeof msg === "object") {
      return util.inspect(msg, { colors: false, depth: 5, compact: false });
    }
    return String(msg);
  }

  private write(level: LogLevel, msg: unknown) {
    const time = new Date().toISOString();
    // const icon = icons[level];
    const color = colors[level];

    if (level === "error") {
      this.hasError = true;
    }

    const prefix = `[${time}] [${level.toUpperCase()}] [${this.requestId}]`;
    const messageStr = this.formatMessage(msg);

    const consoleFormatted = `${color(prefix)} ${gray(
      this.requestMeta
    )}\n  ${white(messageStr)}`;
    const fileFormatted = `${prefix} ${this.requestMeta}\n  ${messageStr}`;

    // Print to console immediately
    console.log(consoleFormatted);
    // Store for flushing
    this.logs.push(fileFormatted);
  }

  info(msg: unknown) {
    this.write("info", msg);
  }

  warn(msg: unknown) {
    this.write("warn", msg);
  }

  error(msg: unknown) {
    this.write("error", msg);
  }

  flush() {
    if (this.logs.length === 0) return;

    const duration = Date.now() - this.startTime;
    const summary = `[${new Date().toISOString()}] [DONE] [${
      this.requestId
    }] Request completed in ${duration}ms`;
    const endMarker = "--- End of Request ---";

    console.log(gray(summary));
    console.log(gray(endMarker));

    this.logs.push(summary);
    this.logs.push(endMarker);

    const output = this.logs.join("\n") + "\n";

    // Write to primary log file
    fs.appendFileSync(this.logFilePath, output, { encoding: "utf8" });

    // If error occurred, also write to error file
    if (this.hasError) {
      fs.appendFileSync(this.errorLogFilePath, output, { encoding: "utf8" });
    }

    this.logs = [];
  }
}
