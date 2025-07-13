import { AsyncLocalStorage } from "async_hooks";
import { RequestLogger } from "./logger";

// Used for non-request scoped logs (like app startup)
const globalLogger = new RequestLogger("global");

type Store = { logger: RequestLogger };

const storage = new AsyncLocalStorage<Store>();

export function initContext(logger: RequestLogger, callback: () => void) {
  storage.run({ logger }, callback);
}

export function getLogger(): RequestLogger {
  const store = storage.getStore();
  if (!store || !store.logger) {
    return globalLogger; // fallback for startup logs
  }
  return store.logger;
}

// Optional: expose global fallback (rarely needed)
export const fallbackLogger = globalLogger;
