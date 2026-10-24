jest.mock("../../models/User");
jest.mock("../../config/mailer");

const User = require("../../models/User");
const mailer = require("../../config/mailer");
const { updateNotificationPreferences, getNotificationPreferences, sendTestEmail } = require("../userController");

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
// The project's asyncHandler doesn't return its promise, so wait for the
// handler to either respond or forward an error to next().
const run = (handler, req) =>
  new Promise((resolve, reject) => {
    const res = makeRes();
    res.json.mockImplementation(() => {
      resolve(res);
      return res;
    });
    handler(req, res, (err) => reject(err || new Error("next() called without responding")));
  });
const userDoc = (stored) => ({
  toObject: () => ({ notificationPreferences: stored }),
  save: jest.fn().mockResolvedValue(),
});

beforeEach(() => {
  jest.clearAllMocks();
  mailer.isMailerConfigured.mockReturnValue(true);
});

describe("GET preferences", () => {
  test("returns resolved defaults plus whether email is configured", async () => {
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(userDoc(undefined)) });
    const res = await run(getNotificationPreferences, { user: { _id: "u1" } });
    const body = res.json.mock.calls[0][0];
    expect(body.preferences.emailEnabled).toBe(true);
    expect(body.preferences.email.comment_added).toBe(false);
    expect(body.emailConfigured).toBe(true);
  });
});

describe("PATCH preferences", () => {
  test("400s on an unknown notification type without touching the DB", async () => {
    const res = await run(updateNotificationPreferences, { user: { _id: "u1" }, body: { email: { nope: true } } });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(User.findById).not.toHaveBeenCalled();
  });

  test("saves a valid change and returns the merged result", async () => {
    const doc = userDoc({ email: { overdue: false } });
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(doc) });
    const res = await run(updateNotificationPreferences, {
      user: { _id: "u1" },
      body: { email: { comment_added: true } },
    });
    expect(doc.save).toHaveBeenCalled();
    expect(doc.notificationPreferences.email).toEqual({ overdue: false, comment_added: true });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("POST test-email", () => {
  const req = () => ({ user: { _id: `u${Math.random()}`, email: "sam@x.com", name: "Sam" } });

  test("503s with setup guidance when SMTP isn't configured", async () => {
    mailer.isMailerConfigured.mockReturnValue(false);
    const res = await run(sendTestEmail, req());
    expect(res.status).toHaveBeenCalledWith(503);
    expect(mailer.sendEmail).not.toHaveBeenCalled();
  });

  test("sends to the signed-in user's own address", async () => {
    mailer.sendEmail.mockResolvedValue({ sent: true });
    const res = await run(sendTestEmail, req());
    expect(mailer.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "sam@x.com" }));
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("rate-limits repeat requests from the same user", async () => {
    mailer.sendEmail.mockResolvedValue({ sent: true });
    const r = req();
    await run(sendTestEmail, r);
    const second = await run(sendTestEmail, r);
    expect(second.status).toHaveBeenCalledWith(429);
  });

  test("surfaces the real SMTP error to the user who asked, and lifts the cooldown", async () => {
    mailer.sendEmail.mockRejectedValueOnce(new Error("Invalid login"));
    const r = req();
    const failed = await run(sendTestEmail, r);
    expect(failed.status).toHaveBeenCalledWith(502);
    expect(failed.json.mock.calls[0][0].message).toContain("Invalid login");

    mailer.sendEmail.mockResolvedValue({ sent: true });
    const retry = await run(sendTestEmail, r);
    expect(retry.status).toHaveBeenCalledWith(200);
  });
});