export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export interface LoggerOptions {
  service?: string;
  environment?: string;
  defaultContext?: Record<string, unknown>;
}

export class Logger {
  private service: string;
  private environment: string;
  private context: Record<string, unknown>;
  private timers: Map<string, number> = new Map();

  constructor(options: LoggerOptions = {}) {
    this.service = options.service || "app";
    this.environment = options.environment || "development";
    this.context = options.defaultContext || {};
  }

  withContext(context: Record<string, unknown>): Logger {
    return new Logger({
      service: this.service,
      environment: this.environment,
      defaultContext: { ...this.context, ...context },
    });
  }

  private log(
    level: LogLevel,
    message: string,
    meta?: Record<string, unknown>,
    err?: unknown,
  ): void {
    const isProd = this.environment === "production";
    const timestamp = new Date().toISOString();
    const mergedContext = { ...this.context, ...meta };

    let errorObj: LogEntry["error"] | undefined;
    if (err instanceof Error) {
      errorObj = {
        name: err.name,
        message: err.message,
        stack: err.stack,
      };
    } else if (err && typeof err === "object") {
      errorObj = {
        name: "UnknownError",
        message: JSON.stringify(err),
      };
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp,
      ...(Object.keys(mergedContext).length > 0 ? { context: mergedContext } : {}),
      ...(errorObj ? { error: errorObj } : {}),
    };

    if (isProd) {
      // Structured JSON for Cloudflare Worker logs / Axiom / Logflare
      const output = JSON.stringify({
        service: this.service,
        ...entry,
      });
      if (level === "error") {
        console.error(output);
      } else if (level === "warn") {
        console.warn(output);
      } else {
        console.log(output);
      }
    } else {
      // Pretty printing in development
      const colors = {
        debug: "\x1b[36m", // Cyan
        info: "\x1b[32m", // Green
        warn: "\x1b[33m", // Yellow
        error: "\x1b[31m", // Red
        reset: "\x1b[0m",
        dim: "\x1b[2m",
      };

      const prefix = `${colors.dim}[${timestamp}]${colors.reset} ${colors[level]}[${level.toUpperCase()}]${colors.reset} [${this.service}]:`;
      const logFn =
        level === "error" ? console.error : level === "warn" ? console.warn : console.log;

      if (Object.keys(mergedContext).length > 0) {
        logFn(prefix, message, mergedContext);
      } else {
        logFn(prefix, message);
      }

      if (errorObj?.stack) {
        console.error(errorObj.stack);
      }
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log("warn", message, context);
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    this.log("error", message, context, error);
  }

  time(label: string): void {
    this.timers.set(label, performance.now());
  }

  timeEnd(label: string, context?: Record<string, unknown>): number {
    const startTime = this.timers.get(label);
    if (startTime === undefined) {
      this.warn(`Timer '${label}' does not exist`);
      return 0;
    }
    const durationMs = Math.round((performance.now() - startTime) * 100) / 100;
    this.timers.delete(label);
    this.info(`Timer '${label}': ${durationMs}ms`, { ...context, durationMs });
    return durationMs;
  }
}

export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options);
}

export const logger = createLogger();
