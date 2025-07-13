import { describe, it, expect } from "vitest";
import { AsyncLocalStorage } from "async_hooks";

type Store = { userId: string };
const storage = new AsyncLocalStorage<Store>();

function setContext(userId: string, cb: () => void) {
  storage.run({ userId }, cb);
}

function getUserId(): string | undefined {
  return storage.getStore()?.userId;
}

describe("AsyncLocalStorage", () => {
  it("should persist context across async calls", async () => {
    await new Promise<void>((resolve) => {
      setContext("user-abc", async () => {
        expect(getUserId()).toBe("user-abc");
        await new Promise((r) => setTimeout(r, 10));
        expect(getUserId()).toBe("user-abc");
        resolve();
      });
    });
  });

  it("should isolate context between two runs", async () => {
    const results: string[] = [];

    await Promise.all([
      new Promise<void>((res) => {
        setContext("A", async () => {
          await new Promise((r) => setTimeout(r, 20));
          results.push(getUserId() ?? "");
          res();
        });
      }),
      new Promise<void>((res) => {
        setContext("B", async () => {
          await new Promise((r) => setTimeout(r, 10));
          results.push(getUserId() ?? "");
          res();
        });
      }),
    ]);

    expect(results).toContain("A");
    expect(results).toContain("B");
  });
});
