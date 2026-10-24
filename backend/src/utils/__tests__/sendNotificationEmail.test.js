jest.mock("../../models/User");
jest.mock("../../config/mailer");
jest.mock("../notificationLink");

const User = require("../../models/User");
const { sendEmail } = require("../../config/mailer");
const { resolveNotificationLink } = require("../notificationLink");
const sendNotificationEmail = require("../sendNotificationEmail");

const mockUser = (doc) => User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(doc) });

beforeEach(() => {
  jest.clearAllMocks();
  resolveNotificationLink.mockResolvedValue("http://app/w/1");
  sendEmail.mockResolvedValue({ sent: true });
});

const payload = { userId: "u1", type: "task_assigned", message: "Ana assigned you a task" };

describe("sendNotificationEmail", () => {
  test("sends to the user's address when preferences allow it", async () => {
    mockUser({ name: "Sam", email: "sam@x.com" });
    expect(await sendNotificationEmail(payload)).toBe("sent");
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "sam@x.com", subject: "You were assigned a task" })
    );
  });

  test("does not send when that type is switched off", async () => {
    mockUser({ email: "sam@x.com", notificationPreferences: { email: { task_assigned: false } } });
    expect(await sendNotificationEmail(payload)).toBe("disabled_by_preference");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  test("does not send when the master switch is off", async () => {
    mockUser({ email: "sam@x.com", notificationPreferences: { emailEnabled: false } });
    expect(await sendNotificationEmail(payload)).toBe("disabled_by_preference");
  });

  test("respects the noisy-by-default opt-out for comments", async () => {
    mockUser({ email: "sam@x.com" });
    expect(await sendNotificationEmail({ ...payload, type: "comment_added" })).toBe("disabled_by_preference");
  });

  test("reports skipped (not failed) when SMTP isn't configured", async () => {
    mockUser({ email: "sam@x.com" });
    sendEmail.mockResolvedValue({ sent: false, skipped: "not_configured" });
    expect(await sendNotificationEmail(payload)).toBe("skipped_not_configured");
  });

  test("swallows delivery errors instead of throwing", async () => {
    mockUser({ email: "sam@x.com" });
    sendEmail.mockRejectedValue(new Error("SMTP down"));
    await expect(sendNotificationEmail(payload)).resolves.toBe("failed");
  });

  test("handles a missing user", async () => {
    mockUser(null);
    expect(await sendNotificationEmail(payload)).toBe("no_recipient");
  });
});