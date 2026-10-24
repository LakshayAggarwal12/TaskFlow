const { extractSocketToken } = require("../auth");

describe("extractSocketToken", () => {
  test("prefers the explicit auth.token payload", () => {
    const handshake = { auth: { token: "abc123" }, headers: {} };
    expect(extractSocketToken(handshake)).toBe("abc123");
  });

  test("falls back to the 'token' cookie when auth.token is absent", () => {
    const handshake = { auth: {}, headers: { cookie: "other=1; token=cookieToken; another=2" } };
    expect(extractSocketToken(handshake)).toBe("cookieToken");
  });

  test("URL-decodes the cookie value", () => {
    const handshake = { auth: {}, headers: { cookie: "token=abc%2Fdef" } };
    expect(extractSocketToken(handshake)).toBe("abc/def");
  });

  test("returns null when neither is present", () => {
    expect(extractSocketToken({ auth: {}, headers: {} })).toBeNull();
  });

  test("handles a completely empty handshake gracefully", () => {
    expect(extractSocketToken({})).toBeNull();
    expect(extractSocketToken(undefined)).toBeNull();
  });
});