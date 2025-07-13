import kleur from "kleur";
import fs from "fs";
import path from "path";
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

export class RequestLogger {
  private logs: string[] = [];
  private logFilePath: string;
  private startTime: number = Date.now();
  private hasError: boolean = false;

  constructor(
    private requestId: string,
    private req: ExpressRequest | IncomingMessage
  ) {
    // Store logs to `logs/YYYY-MM-DD.log`
    const date = new Date().toISOString().slice(0, 10);
    const logsDir = path.resolve("logs");

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }

    this.logFilePath = path.join(logsDir, `${date}.log`);
  }

  private getRequestInfo(): {
    method: string;
    path: string;
    ip: string;
    sourceService: string;
  } {
    const method = (this.req as any)?.method ?? "UNKNOWN";
    const path = (this.req as any)?.originalUrl ?? "/";
    const sourceService =
      (this.req as any)?.headers?.["x-source-service"] ?? "";
    const ip =
      (this.req as any)?.headers?.["x-forwarded-for"] ??
      (this.req as any)?.socket?.remoteAddress ??
      "-";

    return { method, path, ip, sourceService };
  }

  private write(level: LogLevel, msg: string) {
    const time = new Date().toISOString();
    // const icon = icons[level];
    const color = colors[level];

    const { method, path, ip, sourceService } = this.getRequestInfo();
    if (level === "error") {
      this.hasError = true;
    }

    const headerInfo = `${method} ${path} ${
      sourceService ? `source=${sourceService}` : ""
    } ip=${ip}`;

    const prefix = `[${time}] [${level.toUpperCase()}] [${this.requestId}]`;

    const consoleFormatted = `${color(prefix)} ${color(
      headerInfo
    )}\n  ${kleur.white(msg)}`;
    const fileFormatted = `${prefix} ${headerInfo}\n  ${msg}`;

    // Print to console immediately
    console.log(consoleFormatted);
    // Store for flushing
    this.logs.push(fileFormatted);
  }

  info(msg: string) {
    this.write("info", msg);
  }

  warn(msg: string) {
    this.write("warn", msg);
  }

  error(msg: string) {
    this.write("error", msg);
  }

  flush() {
    if (this.logs.length === 0) return;
    const duration = Date.now() - this.startTime;

    const { method, path: reqPath, ip, sourceService } = this.getRequestInfo();
    const summaryLine = `[${new Date().toISOString()}] [SUMMARY] [${
      this.requestId
    }] ${method} ${reqPath} ${
      sourceService ? `source=${sourceService}` : ""
    } ip=${ip}`;
    const consoleSummary = gray(
      `${summaryLine} - Request completed in ${duration}ms`
    );
    const fileSummary = `${summaryLine} - Request completed in ${duration}ms`;

    this.logs.push(fileSummary);
    this.logs.push(gray("--- End of Request ---"));

    console.log(consoleSummary);
    console.log(gray("--- End of Request ---"));

    const output = this.logs.join("\n") + "\n";

    // 1. Always write to main log
    fs.appendFileSync(this.logFilePath, output, { encoding: "utf8" });

    // 2. If error, also write to error log file
    if (this.hasError) {
      const date = new Date().toISOString().slice(0, 10);
      const errorLogDir = path.resolve("logs", "errors");

      if (!fs.existsSync(errorLogDir)) {
        fs.mkdirSync(errorLogDir, { recursive: true });
      }

      const errorLogPath = path.join(errorLogDir, `${date}-error.log`);
      fs.appendFileSync(errorLogPath, output, { encoding: "utf8" });
    }

    this.logs = [];
  }
}
