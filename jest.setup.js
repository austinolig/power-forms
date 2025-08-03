import "@testing-library/jest-dom";

// Mock setImmediate for Node.js compatibility
global.setImmediate =
  global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args));

// Mock Next.js Request for API testing
global.Request =
  global.Request ||
  class Request {
    constructor(url, options = {}) {
      this.url = url;
      this.method = options.method || "GET";
      this.headers = new Map(Object.entries(options.headers || {}));
      this.body = options.body || null;
    }

    async json() {
      return JSON.parse(this.body);
    }
  };

// Mock Next.js Response for API testing
global.Response =
  global.Response ||
  class Response {
    constructor(body, options = {}) {
      this.body = body;
      this.status = options.status || 200;
      this.statusText = options.statusText || "OK";
      this.headers = new Map(Object.entries(options.headers || {}));
    }

    async json() {
      return JSON.parse(this.body);
    }

    static json(data, options = {}) {
      return new Response(JSON.stringify(data), {
        ...options,
        headers: {
          "content-type": "application/json",
          ...options.headers,
        },
      });
    }
  };
