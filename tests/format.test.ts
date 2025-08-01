import { describe, it, expect } from "vitest";
import moment from "moment";

class DummyLogger {
  private formatMessage(...args: unknown[]): string {
    return args
      .map((msg) => {
        if (msg === null) return "null";
        if (msg === undefined) return "undefined";
        if (typeof msg === "symbol") return msg.toString();

        if (typeof msg === "object") {
          const ctor = msg.constructor?.name ?? "Object";
          const inspected = require("util").inspect(msg, {
            colors: false,
            depth: 5,
            compact: false,
          });
          return `[${ctor}] ${inspected}`;
        }

        return String(msg);
      })
      .join(" ");
  }

  log(...args: unknown[]): string {
    return this.formatMessage(...args);
  }
}

const logger = new DummyLogger();

describe("Logger formatMessage()", () => {
  it("should format plain objects", () => {
    const output = logger.log({ a: 1, b: [2, 3] });
    console.log(output);
    expect(output).toContain("[Object]");
  });

  it("should format moment objects", () => {
    const m = moment("2025-07-31");
    const output = logger.log(m);
    console.log(output);
    expect(output).toContain("[Moment]");
  });

  it("should format class instances", () => {
    class User {
      constructor(public name: string) {}
    }
    const user = new User("Alice");
    const output = logger.log(user);
    console.log(output);
    expect(output).toContain("[User]");
  });

  it("should format null/undefined/symbol", () => {
    expect(logger.log(null)).toBe("null");
    expect(logger.log(undefined)).toBe("undefined");
    expect(logger.log(Symbol("id"))).toBe("Symbol(id)");
  });

  it("should format strings/numbers", () => {
    expect(logger.log("hello")).toBe("hello");
    expect(logger.log(123)).toBe("123");
  });

  it("should be able to log multiple valuse passed as arguements", () => {
    const output = logger.log("test", { a: 1 }, 42, null);
    console.log(output);
    expect(output).toContain("test");
    // expect(output).toContain("[Object]");
    expect(output).toContain("42");
    expect(output).toContain("null");
  });
});
