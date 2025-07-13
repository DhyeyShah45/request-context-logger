import { AsyncLocalStorage } from "async_hooks";
import { RequestLogger } from "./logger";

type Store = { logger: RequestLogger };

const storage = new AsyncLocalStorage<Store>();

export function initContext(logger: RequestLogger, callback: () => void) {
  storage.run({ logger }, callback);
}

export function getLogger(): RequestLogger | null {
  return storage.getStore()?.logger ?? null;
}
