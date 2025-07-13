import { getLogger } from "./storage";

export const logger = {
  info: (msg: unknown) => getLogger()?.info(msg),
  warn: (msg: unknown) => getLogger()?.warn(msg),
  error: (msg: unknown) => getLogger()?.error(msg),
  flush: () => getLogger()?.flush(),
};
