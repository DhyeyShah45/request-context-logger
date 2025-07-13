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

## 💡 Additional Features

### 3. 🔁 Log Rotation & Storage Limits

**Goal:** Avoid large log files; maintain log file health.

- Use daily rotation
- Max file size or count of entries

### 4. 🧪 Built-in Testing Utilities

**Goal:** Provide utilities to assert and inspect log output during tests.

- `getBufferedLogs()`
- `resetLogger()` for test isolation

### 5. ⚙️ Configurable Log Levels by Environment

**Goal:** Change verbosity based on NODE_ENV or .env

- Development: debug, info, warn, error
- Production: info, warn, error
- Add `logger.setLevel()` dynamically

### 6. 🧰 Framework Support

**Goal:** Make `context-logger` work with:

- Fastify
- Hapi
- Koa

### 7. 💬 Developer DX Layer

**Goal:** Improve usability and reduce boilerplate

- Provide wrapper like `log.info("msg")` without manually importing in each file
- Config-based global logger proxy

### 8. 📂 Metadata Extensibility

**Goal:** Allow users to attach custom fields like `userId`, `tenant`, etc.

- Add `logger.attach({ userId: 123 })`
- Include attached metadata in all subsequent logs

### 9. 📦 CLI for Log Analysis (Stretch Goal)

**Goal:** Command-line tool to read, filter, and search logs easily.

### 10. 📦 Optional Logging of Request Body and Response

**Goal:** Improve debug capability by optionally logging request payload and response body.

**Approach:**

- If method is POST, PUT, or PATCH, allow showing `req.body`.
- At end of response, show returned payload if enabled by user config.

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
