jest.mock("../../models/Notification");
jest.mock("../../socket/emit");
jest.mock("../sendNotificationEmail");

const Notification = require("../../models/Notification");
const { emitToUser } = require("../../socket/emit");
const sendNotificationEmail = require("../sendNotificationEmail");
const { createNotification, notifyMany } = require("../createNotification");

beforeEach(() => {
  jest.clearAllMocks();
  sendNotificationEmail.mockResolvedValue("sent");
});

describe("createNotification", () => {
  test("saves, pushes live, and triggers the email path", async () => {
    Notification.create.mockResolvedValue({ _id: "n1" });
    await createNotification({ user: "u1", type: "overdue", message: "m", relatedTask: "t1" });
    expect(emitToUser).toHaveBeenCalledWith("u1", "notification:new", { _id: "n1" });
    expect(sendNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1", type: "overdue", message: "m", relatedTask: "t1" })
    );
  });

  test("does not email (or push) when the notification itself failed to save", async () => {
    Notification.create.mockRejectedValue(new Error("db"));
    await expect(createNotification({ user: "u1", type: "overdue", message: "m" })).resolves.toBeUndefined();
    expect(sendNotificationEmail).not.toHaveBeenCalled();
    expect(emitToUser).not.toHaveBeenCalled();
  });

  test("notifyMany fans out to every user", async () => {
    Notification.create.mockResolvedValue({ _id: "n" });
    notifyMany(["a", "b", "c"], { type: "overdue", message: "m" });
    await new Promise((r) => setImmediate(r));
    expect(sendNotificationEmail).toHaveBeenCalledTimes(3);
  });
});