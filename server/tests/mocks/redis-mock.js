import { vi } from "vitest";

class MockRedis {

    constructor(url, options) {
        this.url = url;
        this.options = options;
    }

    on(event, callback) {
        if (event === "connect") {
            process.nextTick(() => callback());
        }
        return this;
    }

    get = vi.fn();
    set = vi.fn();
    quit = vi.fn().mockResolvedValue(true);
    disconnect = vi.fn().mockResolvedValue(true);
}

const redisMockInstance = new MockRedis("redis://127.0.0.1:6379", {});

export default redisMockInstance;