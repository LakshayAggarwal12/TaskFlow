const Notification = require("../../models/Notification");
const {
  NOTIFICATION_TYPES,
  DEFAULT_EMAIL_PREFS,
  resolvePreferences,
  shouldEmail,
  sanitizePreferenceUpdate,
  mergePreferences,
} = require("../notificationPrefs");

describe("notification type coverage", () => {
  test("every type in the Notification model has an email default (and vice versa)", () => {
    const modelTypes = Notification.schema.path("type").enumValues;
    expect([...NOTIFICATION_TYPES].sort()).toEqual([...modelTypes].sort());
    expect(Object.keys(DEFAULT_EMAIL_PREFS).sort()).toEqual([...modelTypes].sort());
  });
});

describe("resolvePreferences", () => {
  test("a user with nothing stored gets the defaults", () => {
    expect(resolvePreferences(undefined)).toEqual({ emailEnabled: true, email: DEFAULT_EMAIL_PREFS });
  });

  test("stored toggles override defaults, untouched ones keep defaults", () => {
    const result = resolvePreferences({ email: { comment_added: true, task_assigned: false } });
    expect(result.email.comment_added).toBe(true);
    expect(result.email.task_assigned).toBe(false);
    expect(result.email.overdue).toBe(DEFAULT_EMAIL_PREFS.overdue);
  });

  test("ignores non-boolean or unknown stored values", () => {
    const result = resolvePreferences({ email: { task_assigned: "yes", bogus: true } });
    expect(result.email.task_assigned).toBe(DEFAULT_EMAIL_PREFS.task_assigned);
    expect(result.email.bogus).toBeUndefined();
  });
});

describe("shouldEmail", () => {
  test("respects per-type defaults", () => {
    expect(shouldEmail(undefined, "task_assigned")).toBe(true);
    expect(shouldEmail(undefined, "comment_added")).toBe(false);
  });

  test("the master switch overrides every per-type toggle", () => {
    expect(shouldEmail({ emailEnabled: false, email: { task_assigned: true } }, "task_assigned")).toBe(false);
  });

  test("an unknown type never emails", () => {
    expect(shouldEmail(undefined, "something_new")).toBe(false);
  });
});

describe("sanitizePreferenceUpdate", () => {
  test("accepts a valid master + per-type update", () => {
    const result = sanitizePreferenceUpdate({ emailEnabled: false, email: { comment_added: true } });
    expect(result).toEqual({ ok: true, value: { emailEnabled: false, email: { comment_added: true } } });
  });

  test.each([
    [null],
    ["str"],
    [[]],
    [{}],
    [{ emailEnabled: "yes" }],
    [{ email: "nope" }],
    [{ email: { not_a_type: true } }],
    [{ email: { task_assigned: "true" } }],
    [{ somethingElse: true }],
  ])("rejects invalid body %j", (body) => {
    expect(sanitizePreferenceUpdate(body).ok).toBe(false);
  });
});

describe("mergePreferences", () => {
  test("merges per-type changes onto what's stored without dropping other toggles", () => {
    const merged = mergePreferences({ emailEnabled: true, email: { overdue: false } }, { email: { comment_added: true } });
    expect(merged).toEqual({ emailEnabled: true, email: { overdue: false, comment_added: true } });
  });

  test("a master-only update leaves per-type toggles alone", () => {
    const merged = mergePreferences({ email: { overdue: false } }, { emailEnabled: false });
    expect(merged).toEqual({ emailEnabled: false, email: { overdue: false } });
  });
});