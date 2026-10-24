const { buildNotificationEmail, buildTestEmail, escapeHtml, SUBJECTS } = require("../emailTemplates");
const { NOTIFICATION_TYPES } = require("../notificationPrefs");

describe("buildNotificationEmail", () => {
  test("has a specific subject for every notification type", () => {
    for (const type of NOTIFICATION_TYPES) {
      expect(SUBJECTS[type]).toBeTruthy();
      expect(buildNotificationEmail({ type, message: "x" }).subject).toBe(SUBJECTS[type]);
    }
  });

  test("includes the message and the link in both text and html", () => {
    const { text, html } = buildNotificationEmail({
      type: "task_assigned",
      message: 'Ana assigned you "Fix login"',
      link: "http://localhost:5173/w/1/p/2/board/3?task=4",
      recipientName: "Sam",
    });
    expect(text).toContain("Hi Sam,");
    expect(text).toContain('Ana assigned you "Fix login"');
    expect(text).toContain("?task=4");
    expect(html).toContain("Fix login");
    expect(html).toContain('href="http://localhost:5173/w/1/p/2/board/3?task=4"');
  });

  test("escapes user-written content so a malicious task title can't inject HTML", () => {
    const { html } = buildNotificationEmail({
      type: "comment_added",
      message: 'x commented on "<script>alert(1)</script><img src=x onerror=1>"',
      recipientName: '<b>Eve</b>',
    });
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<b>Eve</b>");
    expect(html).toContain("&lt;script&gt;");
  });

  test("omits the button when there is no link", () => {
    expect(buildNotificationEmail({ type: "overdue", message: "m" }).html).not.toContain("Open in TaskFlow");
  });

  test("falls back to a generic subject for an unknown type", () => {
    expect(buildNotificationEmail({ type: "mystery", message: "m" }).subject).toBe("New notification");
  });
});

describe("buildTestEmail / escapeHtml", () => {
  test("test email is addressed and non-empty", () => {
    const mail = buildTestEmail({ recipientName: "Sam" });
    expect(mail.subject).toMatch(/test/i);
    expect(mail.text).toContain("Hi Sam");
  });

  test("escapeHtml handles all five characters", () => {
    expect(escapeHtml(`<>&"'`)).toBe("&lt;&gt;&amp;&quot;&#39;");
  });
});