# Context Logger

A lightweight, extensible request logger for Node.js/Express applications. Tracks requests from start to end, providing structured logs, error tracking, and integration-ready output for observability platforms.

## Features

- Per-request logging with unique request IDs
- Logs request metadata (method, path, IP, source service)
- Colorful, readable console output
- Writes logs to daily log files and error logs
- Easy to use as Express middleware or standalone

## Installation

```bash
npm install request-context-logger
```

## Usage

### Express Middleware Example

```typescript
import express from "express";
import { requestLoggerMiddleware, logger } from "request-context-logger";
import { fetchDataFromService } from "./utils/fetchData.js";

const app = express();
const port = 3000;

app.use(express.json()); // To support req.body logging (if needed)
app.use(requestLoggerMiddleware);
logger.info("Logger initialized");

app.get("/", (req, res) => {
  logger.info("Root route hit");

  logger.info({
    message: "Logging an object example",
    user: { id: 123, name: "Alice" },
    env: process.env.NODE_ENV,
  });

  res.send("Hello from logger-test-app!");
});

app.get("/test", (req, res) => {
  logger.warn("Test route triggered!");

  const warningData = {
    warning: "Potential memory spike",
    memoryUsage: process.memoryUsage(),
  };

  logger.warn(warningData);

  res.json({ message: "Test success" });
});

app.get("/external", async (req, res) => {
  logger.info("Calling external service...");

  try {
    const data = await fetchDataFromService();

    logger.info("Received response from external service");
    res.json(data);
  } catch (err) {
    logger.error("Failed to call external service");
    logger.error(err); // Also test logging errors
    res.status(500).json({ error: "Service failed" });
  }
});

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});

logger.flush(); // Ensure all logs are flushed or written to the files before exiting
```

### Usage in Utility/Service Files

```typescript
import { logger } from "request-context-logger";

export async function fetchDataFromService() {
  logger.warn("Inside fetchDataFromService");

  // Simulate external API call
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const json = await response.json();
  logger.info(json);

  logger.error("Finished fetchDataFromService");
  return json;
}
```

### Configuration

- **Log file location:** Logs are stored in `logs/YYYY-MM-DD.log` and errors in `logs/YYYY-MM-DD-error.log`.
- **Request metadata:** Includes method, path, IP, and optional `x-source-service` header.
- **Environment:** Uses `NODE_ENV` for environment tagging.

## API

### `logger` (Singleton)

- `logger.info(msg: unknown)` – Log info message
- `logger.warn(msg: unknown)` – Log warning
- `logger.error(msg: unknown)` – Log error (also triggers error log file)
- `logger.flush()` – Write all logs to file and clear buffer

### `requestLoggerMiddleware`

- Express middleware for automatic per-request logging and context tracking.

## License

MIT

---

**Made with ❤️ by Dhyey Shah**
