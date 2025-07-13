# 🚀 Context Logger: Feature Roadmap

This document outlines the planned features and enhancements for the `context-logger` package to make it robust, production-ready, and developer-friendly.

---

## ✅ Priority Features (Next Steps)

### 1. 🔗 Direct Integration with External Logging Tools

**Goal:** Allow users to configure `context-logger` to forward logs to services like:

- Loki / Grafana
- Logtail
- AWS CloudWatch
- Sentry / Datadog (error tracking)

**Approach:**

- Provide `.configure()` method for setting external log destinations.
- Support HTTP endpoint and token-based authentication.

---

### 2. 🛡️ Token & Sensitive Data Hygiene

**Goal:** Ensure logs in production do not leak sensitive headers, tokens, or credentials.

**Approach:**

- Allow user-defined sanitization rules in `.config()` (e.g., redact `authorization`, `cookie`, etc.).
- Add production safeguards to mask or exclude secure headers automatically.

---

## ✅ Recently Implemented

### ❌ Error-specific Log Persistence

**Implemented:**

- Logs from requests that encounter an error (`statusCode >= 400` or `logger.error(...)` called) are now stored in a dedicated error log file (e.g., `/logs/errors/YYYY-MM-DD-error.log`).
- A `--- End of Request ---` separator is added for better parsing.

### ⏱️ Request Execution Time Logging

**Implemented:**

- Each request now logs execution duration in milliseconds.
- Output appears in both console and file log.

### 📄 Log Block Separation for File Storage

**Implemented:**

- `--- End of Request ---` added at the end of each request in both console and file output.

### 📦 Optional Logging of Request Body and Response

**Implemented:**

- Config option to log `req.body` for POST, PUT, and PATCH methods.
- Config option to log response body when response ends.

---

## 💡 Additional Features

### 5. 🔁 Log Rotation & Storage Limits

**Goal:** Avoid large log files; maintain log file health.

- Use daily rotation
- Max file size or count of entries

### 6. 🧪 Built-in Testing Utilities

**Goal:** Provide utilities to assert and inspect log output during tests.

- `getBufferedLogs()`
- `resetLogger()` for test isolation

### 7. ⚙️ Configurable Log Levels by Environment

**Goal:** Change verbosity based on NODE_ENV or .env

- Development: debug, info, warn, error
- Production: info, warn, error
- Add `logger.setLevel()` dynamically

### 8. 🧰 Framework Support

**Goal:** Make `context-logger` work with:

- Fastify
- Hapi
- Koa

### 9. 💬 Developer DX Layer

**Goal:** Improve usability and reduce boilerplate

- Provide wrapper like `log.info("msg")` without manually importing in each file
- Config-based global logger proxy

### 10. 📂 Metadata Extensibility

**Goal:** Allow users to attach custom fields like `userId`, `tenant`, etc.

- Add `logger.attach({ userId: 123 })`
- Include attached metadata in all subsequent logs

### 11. 📦 CLI for Log Analysis (Stretch Goal)

**Goal:** Command-line tool to read, filter, and search logs easily.

### 12. 🔍 Improved Object Logging & Real-time Output

**Goal:** Log objects in a readable format and improve development visibility.

**Approach:**

- Use `util.inspect()` to log objects in development
- Still buffer for file output, but print each line in real-time

---

## 🛠 Config Example (Coming Soon)

```ts
import { configureLogger } from "context-logger";

configureLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  redact: ["authorization", "cookie"],
  external: {
    type: "loki",
    url: "https://loki.mycompany.com",
    token: process.env.LOG_TOKEN,
  },
});
```

---

This roadmap is a living document and will evolve as usage grows. Contributions and ideas are welcome!
