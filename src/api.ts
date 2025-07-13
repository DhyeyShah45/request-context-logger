import { getLogger } from "./storage";

export const logger = {
  info: (msg: string) => getLogger()?.info(msg),
  warn: (msg: string) => getLogger()?.warn(msg),
  error: (msg: string) => getLogger()?.error(msg),
};

type Level = "info" | "warn" | "error";

export const log = new Proxy(
  {},
  {
    get(_, level: Level) {
      return (message: string) => {
        const logger = getLogger();
        logger?.[level](message);
      };
    },
  }
);
